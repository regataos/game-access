#!/usr/bin/env python3
"""
Atualiza o arquivo games-blocks-online.js com o jogo grátis da semana na Epic Games Store.
Compatível com a interface do Regata OS Game Access.
"""

import json
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

TEMPLATE = """function showFreeGameHome() {{
    // Content of block 1
    let gameTile = "{game_title}";
    const gameImg = 'url("{game_img}")';
    const endPromotionPtBt = "{end_pt}";
    const endPromotionEnUS = "{end_en}";

    // Detect User Language
    const userLanguage = selectTranslation();

    // Game block description 1
    const gameBlockDesc1 = document.querySelector(".home-game1 .block-desc");

    if (userLanguage.includes("pt-br") || userLanguage.includes("pt-pt")) {{
        gameBlockDesc1.innerHTML = `Disponível de graça na Epic Games Store até ${{endPromotionPtBt}}.`;
    }} else if (userLanguage.includes("en-us")) {{
        gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${{endPromotionEnUS}}.`;
    }} else {{
        gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${{endPromotionEnUS}}.`;
    }}

    document.querySelector(".home-game1 .block-title").innerHTML = gameTile;
    document.querySelector(".home-game1 .home-game-img").style.backgroundImage = gameImg;
}}
showFreeGameHome();
"""

def fetch_active_free_game():
    req = urllib.request.Request(
        EPIC_API_URL,
        headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"}
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    now = datetime.now(timezone.utc)
    elements = payload.get("data", {}).get("Catalog", {}).get("searchStore", {}).get("elements", [])

    candidates = []

    for el in elements:
        title = el.get("title", "").strip()
        promotions = el.get("promotions") or {}
        promo_offers = promotions.get("promotionalOffers") or []

        for po in promo_offers:
            for offer in po.get("promotionalOffers", []):
                discount = offer.get("discountSetting", {}).get("discountPercentage")
                start = datetime.fromisoformat(offer["startDate"].replace("Z", "+00:00"))
                end = datetime.fromisoformat(offer["endDate"].replace("Z", "+00:00"))

                # Verifica se é gratuidade 100% e está no período vigente
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

                    candidates.append({
                        "title": title,
                        "img": img_url,
                        "end_pt": end_pt,
                        "end_en": end_en,
                        "end_datetime": end
                    })

    if not candidates:
        return None

    return candidates[0]

def main():
    output_path = sys.argv[1] if len(sys.argv) > 1 else "games-blocks-online.js"
    print(f"Buscando jogos gratuitos da Epic Games Store...")
    
    game = fetch_active_free_game()
    if not game:
        print("Erro: Nenhum jogo grátis ativo encontrado no momento.", file=sys.stderr)
        sys.exit(1)

    print(f"Jogo selecionado: {game['title']}")
    print(f"Imagem: {game['img']}")
    print(f"Término: {game['end_pt']} / {game['end_en']}")

    safe_title = game["title"].replace('"', '\\"')

    content = TEMPLATE.format(
        game_title=safe_title,
        game_img=game["img"],
        end_pt=game["end_pt"],
        end_en=game["end_en"]
    )

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Arquivo gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    main()
