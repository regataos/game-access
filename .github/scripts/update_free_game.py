#!/usr/bin/env python3
"""
Atualiza o arquivo games-blocks-online.js com os jogos grátis da semana na Epic Games Store.
Suporta 1 ou 2 jogos simultâneos:
- Resumo do jogo vem em primeiro lugar.
- Frase de gratuidade com prazo ("Disponível de graça na Epic Games Store até...") logo abaixo.
- Aplicado para AMBOS os jogos quando houver dois jogos gratuitos.
- Fallback automático: Se houver apenas 1 jogo gratuito, restaura o Xonotic original no Bloco 2.
"""

import json
import re
import sys
import urllib.request
from datetime import datetime, timezone

EPIC_API_URL = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=pt-BR&country=BR&allowCountries=BR"

MONTHS_PT = {
    1: "janeiro", 2: "fevereiro", 3: "março", 4: "abril",
    5: "maio", 6: "junho", 7: "julho", 8: "agosto",
    9: "setembro", 10: "outubro", 11: "novembro", 12: "dezembro"
}

MONTHS_EN = {
    1: "january", 2: "february", 3: "march", 4: "april",
    5: "may", 6: "june", 7: "july", 8: "august",
    9: "september", 10: "october", 11: "november", 12: "december"
}

def clean_summary(text):
    if not text:
        return ""
    # Pega apenas a primeira frase/linha relevante
    first_part = text.strip().split("\n")[0].strip()
    # Limita tamanho para harmonizar perfeitamente no bloco
    if len(first_part) > 130:
        first_part = first_part[:127] + "..."
    return first_part

def fetch_active_free_games():
    req = urllib.request.Request(
        EPIC_API_URL,
        headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"}
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    now = datetime.now(timezone.utc)
    elements = payload.get("data", {}).get("Catalog", {}).get("searchStore", {}).get("elements", [])

    active_games = []

    for el in elements:
        title = el.get("title", "").strip()
        description = clean_summary(el.get("description", ""))
        promotions = el.get("promotions") or {}
        promo_offers = promotions.get("promotionalOffers") or []

        for po in promo_offers:
            for offer in po.get("promotionalOffers", []):
                discount = offer.get("discountSetting", {}).get("discountPercentage")
                start = datetime.fromisoformat(offer["startDate"].replace("Z", "+00:00"))
                end = datetime.fromisoformat(offer["endDate"].replace("Z", "+00:00"))

                # Verifica se o jogo é 100% gratuito e está ativo no momento
                if discount == 0 and start <= now <= end:
                    images = el.get("keyImages", [])
                    img_url = ""
                    for img_type in ("OfferImageWide", "DieselStoreFrontWide", "VaultClosed", "Thumbnail"):
                        found = next((i["url"] for i in images if i.get("type") == img_type), None)
                        if found:
                            img_url = found
                            break
                    if not img_url and images:
                        img_url = images[0].get("url", "")

                    end_day = f"{end.day:02d}"
                    end_pt = f"{end_day} de {MONTHS_PT.get(end.month, '')}"
                    end_en = f"{MONTHS_EN.get(end.month, '')} {end_day}"

                    active_games.append({
                        "title": title,
                        "description": description,
                        "img": img_url,
                        "end_pt": end_pt,
                        "end_en": end_en
                    })

    # Remove possíveis duplicatas mantendo a ordem
    unique_games = []
    seen = set()
    for g in active_games:
        if g["title"] not in seen:
            seen.add(g["title"])
            unique_games.append(g)

    return unique_games

def generate_js(games):
    if not games:
        return ""

    g1 = games[0]
    g1_title = json.dumps(g1["title"])
    g1_img = json.dumps(g1["img"])
    g1_end_pt = json.dumps(g1["end_pt"])
    g1_end_en = json.dumps(g1["end_en"])
    g1_desc = json.dumps(g1["description"])

    has_g2 = len(games) > 1
    if has_g2:
        g2 = games[1]
        g2_title = json.dumps(g2["title"])
        g2_img = json.dumps(g2["img"])
        g2_end_pt = json.dumps(g2["end_pt"])
        g2_end_en = json.dumps(g2["end_en"])
        g2_desc = json.dumps(g2["description"])
    else:
        g2_title = g2_img = g2_end_pt = g2_end_en = g2_desc = "null"

    js_code = f"""function showFreeGameHome() {{
    const userLanguage = typeof selectTranslation === "function" ? selectTranslation() : "pt-br";
    const isPt = userLanguage.includes("pt-br") || userLanguage.includes("pt-pt");

    // Jogo 1 (Bloco 1)
    const game1 = {{
        title: {g1_title},
        img: {g1_img},
        end: isPt ? {g1_end_pt} : {g1_end_en},
        desc: {g1_desc}
    }};

    // Jogo 2 (Bloco 2) - Se houver 2 jogos grátis na Epic
    const hasGame2 = {str(has_g2).lower()};
    const game2 = hasGame2 ? {{
        title: {g2_title},
        img: {g2_img},
        end: isPt ? {g2_end_pt} : {g2_end_en},
        desc: {g2_desc}
    }} : null;

    function applyBlocks() {{
        // Bloco 1 (Jogo 1): Resumo primeiro, frase de gratuidade logo abaixo
        const blockTitle1 = document.querySelector(".home-game1 .block-title");
        const blockImg1 = document.querySelector(".home-game1 .home-game-img");
        const blockDesc1 = document.querySelector(".home-game1 .block-desc");

        if (blockTitle1) blockTitle1.innerHTML = game1.title;
        if (blockImg1) blockImg1.style.backgroundImage = 'url("' + game1.img + '")';
        if (blockDesc1) {{
            let promoText1 = isPt
                ? `${{game1.desc}}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Disponível de graça na Epic Games Store até ${{game1.end}}.</span>`
                : `${{game1.desc}}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Available for free at the Epic Games Store until ${{game1.end}}.</span>`;
            blockDesc1.innerHTML = promoText1;
        }}

        // Bloco 2: Segundo jogo grátis ou Fallback para Xonotic
        const block2 = document.querySelector(".home-game2");
        const blockTitle2 = document.querySelector(".home-game2 .block-title");
        const blockImg2 = document.querySelector(".home-game2 .home-game-img");
        const blockDesc2 = document.querySelector(".home-game2 .block-desc");

        if (hasGame2 && game2) {{
            if (blockTitle2) blockTitle2.innerHTML = game2.title;
            if (blockImg2) blockImg2.style.backgroundImage = 'url("' + game2.img + '")';
            if (blockDesc2) {{
                let promoText2 = isPt
                    ? `${{game2.desc}}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Disponível de graça na Epic Games Store até ${{game2.end}}.</span>`
                    : `${{game2.desc}}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Available for free at the Epic Games Store until ${{game2.end}}.</span>`;
                blockDesc2.innerHTML = promoText2;
            }}
            if (block2) {{
                block2.onclick = function() {{
                    block_function1();
                }};
            }}
        }} else {{
            // Caso haja apenas 1 jogo gratuito na Epic, garante a restauração do Xonotic padrão
            if (blockTitle2) blockTitle2.innerHTML = "Xonotic";
            if (blockImg2) blockImg2.style.backgroundImage = 'url("./../images/games-blocks/block2-xonotic.jpg")';
            if (blockDesc2) {{
                blockDesc2.innerHTML = isPt
                    ? "Divertido jogo de tiro em primeira pessoa estilo arena."
                    : "Fun and addictive arena-style first person shooter.";
            }}
            if (block2) {{
                block2.onclick = function() {{
                    if (typeof block_function2 === "function") {{
                        block_function2();
                    }}
                }};
            }}
        }}
    }}

    // Executa e reaplica com delay para garantir prioridade sobre traduções estáticas de pages-lang.js
    applyBlocks();
    setTimeout(applyBlocks, 200);
    setTimeout(applyBlocks, 800);
}}
showFreeGameHome();
"""
    return js_code

def main():
    output_path = sys.argv[1] if len(sys.argv) > 1 else "games-blocks-online.js"
    print("Buscando jogos gratuitos da Epic Games Store...")

    games = fetch_active_free_games()
    if not games:
        print("Erro: Nenhum jogo grátis ativo encontrado no momento.", file=sys.stderr)
        sys.exit(1)

    print(f"Total de jogos grátis ativos: {len(games)}")
    for i, g in enumerate(games, 1):
        print(f"Jogo {i}: {g['title']} (término: {g['end_pt']})")
        print(f"Resumo: {g['description']}")

    js_content = generate_js(games)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Arquivo gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    main()
