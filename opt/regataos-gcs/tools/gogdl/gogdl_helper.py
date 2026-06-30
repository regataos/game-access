#!/usr/bin/env python3
"""
gogdl-helper: Simplifica o uso do gogdl.

Automatiza:
  - Abrir o navegador para login na GOG
  - Capturar o código de autorização
  - Trocar o código por tokens (access_token + refresh_token)
  - Renovar tokens automaticamente
  - Listar a biblioteca com imagens

Uso:
  ./gogdl_helper.py login              Abre o navegador e faz login
  ./gogdl_helper.py login --code XXXX  Usa um código já obtido
  ./gogdl_helper.py refresh            Renova o token manualmente
  ./gogdl_helper.py user               Mostra dados do usuário
  ./gogdl_helper.py library            Lista jogos (JSON único no stdout)
  ./gogdl_helper.py library --path DIR Salva um JSON por jogo no diretório
"""

import argparse
import json
import os
import sys
import time
import webbrowser
from urllib.parse import urlparse, parse_qs

try:
    import requests
except ImportError:
    print("Erro: 'requests' não encontrado. Instale com: zypper install python313-requests", file=sys.stderr)
    sys.exit(1)


# --- Constantes da API GOG ---
CLIENT_ID = "46899977096215655"
CLIENT_SECRET = "9d85c43b1482497dbbce61f6e4aa173a433796eeae2ca8c5f6129f2dc4de46d9"
REDIRECT_URI = "https://embed.gog.com/on_login_success?origin=client"

AUTH_URL = (
    f"https://auth.gog.com/auth?client_id={CLIENT_ID}"
    f"&redirect_uri=https%3A%2F%2Fembed.gog.com%2Fon_login_success%3Forigin%3Dclient"
    f"&response_type=code&layout=galaxy"
)
TOKEN_URL = "https://auth.gog.com/token"
USERDATA_URL = "https://embed.gog.com/userData.json"
LIBRARY_URL = "https://embed.gog.com/account/getFilteredProducts"
GAMESDB_URL = "https://gamesdb.gog.com"
PRODUCTS_URL = "https://api.gog.com/products"

DEFAULT_CONFIG = os.path.expanduser("~/.config/gogdl/auth.json")


class GogAuth:
    def __init__(self, config_path):
        self.config_path = config_path
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "gogdl-helper/1.0"})
        self.tokens = self._load_config()

    def _load_config(self):
        if os.path.exists(self.config_path):
            with open(self.config_path, "r") as f:
                data = json.load(f)
                # Suporta formato do gogdl (tokens dentro de chave client_id)
                # e formato simples (tokens na raiz)
                if CLIENT_ID in data:
                    return data[CLIENT_ID]
                return data
        return {}

    def _save_config(self):
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        # Salva no formato compatível com gogdl
        data = {CLIENT_ID: self.tokens}
        with open(self.config_path, "w") as f:
            json.dump(data, f, indent=2)
        os.chmod(self.config_path, 0o600)

    def is_logged_in(self):
        return bool(self.tokens.get("access_token"))

    def is_expired(self):
        if not self.tokens:
            return True
        login_time = self.tokens.get("loginTime", 0)
        expires_in = self.tokens.get("expires_in", 0)
        return time.time() >= login_time + expires_in

    def login(self, code):
        """Troca o código de autorização por tokens."""
        response = self.session.get(TOKEN_URL, params={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "authorization_code",
            "redirect_uri": REDIRECT_URI,
            "code": code,
        }, timeout=15)

        if not response.ok:
            print(f"Erro ao trocar código: {response.status_code}", file=sys.stderr)
            print(response.text, file=sys.stderr)
            return False

        self.tokens = response.json()
        self.tokens["loginTime"] = time.time()
        self._save_config()
        return True

    def refresh(self):
        """Renova o access_token usando o refresh_token."""
        refresh_token = self.tokens.get("refresh_token")
        if not refresh_token:
            print("Erro: sem refresh_token. Faça login primeiro.", file=sys.stderr)
            return False

        response = self.session.get(TOKEN_URL, params={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }, timeout=15)

        if not response.ok:
            print(f"Erro ao renovar token: {response.status_code}", file=sys.stderr)
            return False

        self.tokens = response.json()
        self.tokens["loginTime"] = time.time()
        self._save_config()
        return True

    def ensure_valid_token(self):
        """Garante que o token é válido, renovando se necessário."""
        if not self.is_logged_in():
            print("Erro: não logado. Execute: gogdl_helper.py login", file=sys.stderr)
            return False
        if self.is_expired():
            print("Token expirado, renovando...", file=sys.stderr)
            return self.refresh()
        return True

    def get_access_token(self):
        return self.tokens.get("access_token", "")


def extract_code(user_input):
    """
    Extrai o código de autorização.
    Aceita tanto o código puro quanto a URL completa de redirect.
    """
    user_input = user_input.strip()

    # Se parece uma URL, extrair o parâmetro "code"
    if user_input.startswith("http"):
        parsed = urlparse(user_input)
        params = parse_qs(parsed.query)
        codes = params.get("code", [])
        if codes:
            return codes[0]
        print("Erro: URL não contém o parâmetro 'code'.", file=sys.stderr)
        return None

    # Caso contrário, é o código direto
    return user_input


def cmd_login(auth, args):
    if args.code:
        code = args.code
    else:
        print("Abrindo o navegador para login na GOG...")
        print(f"\nSe não abrir automaticamente, acesse:\n{AUTH_URL}\n")
        webbrowser.open(AUTH_URL)

        print("Após o login, cole aqui a URL de redirecionamento (ou apenas o código):")
        user_input = input("> ").strip()

        if not user_input:
            print("Nenhum código fornecido.", file=sys.stderr)
            return

        code = extract_code(user_input)
        if not code:
            return

    if auth.login(code):
        print(f"Login realizado com sucesso!")
        print(f"Tokens salvos em: {auth.config_path}")
    else:
        print("Falha no login.", file=sys.stderr)


def cmd_refresh(auth, args):
    if auth.refresh():
        print("Token renovado com sucesso!")
    else:
        print("Falha ao renovar token.", file=sys.stderr)


def cmd_user(auth, args):
    if not auth.ensure_valid_token():
        return

    response = auth.session.get(USERDATA_URL, headers={
        "Authorization": f"Bearer {auth.get_access_token()}"
    }, timeout=10)

    if response.ok:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    else:
        print(f"Erro: {response.status_code}", file=sys.stderr)


def cmd_library(auth, args):
    if not auth.ensure_valid_token():
        return

    output_dir = args.path
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    headers = {"Authorization": f"Bearer {auth.get_access_token()}"}
    page = 1
    all_games = []
    saved = 0

    while True:
        response = auth.session.get(LIBRARY_URL, headers=headers, params={
            "mediaType": 1,
            "page": page,
        }, timeout=15)

        if not response.ok:
            print(f"Erro na página {page}: {response.status_code}", file=sys.stderr)
            break

        data = response.json()
        total_pages = data.get("totalPages", 1)
        products = data.get("products", [])

        print(f"Página {page}/{total_pages} — {len(products)} jogo(s)", file=sys.stderr)

        for product in products:
            entry = build_game_entry(product, auth)

            if output_dir:
                slug = entry.get("slug") or str(entry.get("id", "unknown"))
                filepath = os.path.join(output_dir, f"{slug}.json")
                with open(filepath, "w", encoding="utf-8") as f:
                    json.dump(entry, f, ensure_ascii=False, indent=2)
                saved += 1
                print(f"  → {slug}.json", file=sys.stderr)
            else:
                all_games.append(entry)

        if page >= total_pages:
            break
        page += 1

    if output_dir:
        print(f"\n{saved} arquivo(s) salvos em {output_dir}", file=sys.stderr)
    else:
        print(json.dumps({"games": all_games}, ensure_ascii=False, indent=2))


def build_game_entry(product, auth):
    game_id = str(product.get("id", ""))
    title = product.get("title", "")
    slug = product.get("slug", "")
    category = product.get("category", "")
    rating = product.get("rating")
    works_on = product.get("worksOn", {})

    # Imagens da listagem
    image_hash = product.get("image", "")
    images = {}
    if image_hash:
        base = image_hash
        if base.startswith("//"):
            base = "https:" + base
        images.update({
            "logo": f"{base}.jpg",
            "logo2x": f"{base}_2x.jpg",
            "icon": f"{base}_196.jpg",
        })

    # Imagens do gamesdb (mais ricas)
    gamesdb_images = fetch_gamesdb_images(game_id, auth)
    if gamesdb_images:
        images.update(gamesdb_images)
    else:
        # Fallback: API de produtos
        product_images = fetch_product_images(game_id, auth)
        if product_images:
            images.update(product_images)

    return {
        "id": game_id,
        "title": title,
        "slug": slug,
        "category": category,
        "rating": rating,
        "worksOn": works_on,
        "images": images,
    }


def fetch_gamesdb_images(game_id, auth):
    try:
        response = auth.session.get(
            f"{GAMESDB_URL}/platforms/gog/external_releases/{game_id}",
            timeout=10
        )
        if not response.ok:
            return {}

        game_data = response.json().get("game", {})
        images = {}

        for key, out_key in [
            ("vertical_cover", "verticalCover"),
            ("background", "background"),
            ("logo", "logo"),
            ("icon", "icon"),
            ("square_icon", "squareIcon"),
        ]:
            field = game_data.get(key, {})
            if field and field.get("url_format"):
                fmt = field["url_format"]
                images[out_key] = fmt.replace("{formatter}", "")
                images[f"{out_key}_2x"] = fmt.replace("{formatter}", "_2x")

        return images
    except Exception:
        return {}


def fetch_product_images(game_id, auth):
    try:
        response = auth.session.get(
            f"{PRODUCTS_URL}/{game_id}",
            timeout=10
        )
        if not response.ok:
            return {}

        raw = response.json().get("images", {})
        images = {}
        for key in ("background", "logo", "logo2x"):
            val = raw.get(key, "")
            if val:
                images[key] = f"https:{val}" if val.startswith("//") else val
        return images
    except Exception:
        return {}


def main():
    parser = argparse.ArgumentParser(
        prog="gogdl_helper",
        description="Helper para simplificar o uso do gogdl"
    )
    parser.add_argument(
        "--config", "-c",
        default=DEFAULT_CONFIG,
        help=f"Caminho do arquivo de tokens (padrão: {DEFAULT_CONFIG})"
    )

    sub = parser.add_subparsers(dest="command")

    # login
    login_p = sub.add_parser("login", help="Fazer login na GOG")
    login_p.add_argument("--code", help="Código de autorização (pula o navegador)")

    # refresh
    sub.add_parser("refresh", help="Renovar o token de acesso")

    # user
    sub.add_parser("user", help="Mostrar dados do usuário logado")

    # library
    lib_p = sub.add_parser("library", help="Listar jogos da biblioteca com imagens")
    lib_p.add_argument("--path", help="Diretório para salvar JSONs individuais por jogo")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    auth = GogAuth(args.config)

    commands = {
        "login": cmd_login,
        "refresh": cmd_refresh,
        "user": cmd_user,
        "library": cmd_library,
    }

    commands[args.command](auth, args)


if __name__ == "__main__":
    main()
