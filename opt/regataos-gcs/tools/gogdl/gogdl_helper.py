#!/usr/bin/env python3
"""
gogdl-helper: Simplifies gogdl usage.

Automates:
  - Opening the browser for GOG login
  - Capturing the authorization code
  - Exchanging the code for tokens (access_token + refresh_token)
  - Automatically refreshing tokens
  - Listing the library with images

Usage:
  ./gogdl_helper.py login              Opens the browser and logs in
  ./gogdl_helper.py login --code XXXX  Uses an already obtained code
  ./gogdl_helper.py refresh            Manually refreshes the token
  ./gogdl_helper.py user               Shows user data
  ./gogdl_helper.py library            Lists games (single JSON to stdout)
  ./gogdl_helper.py library --path DIR Saves one JSON per game to directory
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
    print("Error: 'requests' not found. Install with: zypper install python313-requests", file=sys.stderr)
    sys.exit(1)


# --- GOG API Constants ---
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
                # Supports gogdl format (tokens inside client_id key)
                # and simple format (tokens at root)
                if CLIENT_ID in data:
                    return data[CLIENT_ID]
                return data
        return {}

    def _save_config(self):
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        # Save in gogdl-compatible format
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
        """Exchange the authorization code for tokens."""
        response = self.session.get(TOKEN_URL, params={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "authorization_code",
            "redirect_uri": REDIRECT_URI,
            "code": code,
        }, timeout=15)

        if not response.ok:
            print(f"Error exchanging code: {response.status_code}", file=sys.stderr)
            print(response.text, file=sys.stderr)
            return False

        self.tokens = response.json()
        self.tokens["loginTime"] = time.time()
        self._save_config()
        return True

    def refresh(self):
        """Refresh the access_token using the refresh_token."""
        refresh_token = self.tokens.get("refresh_token")
        if not refresh_token:
            print("Error: no refresh_token. Please login first.", file=sys.stderr)
            return False

        response = self.session.get(TOKEN_URL, params={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }, timeout=15)

        if not response.ok:
            print(f"Error refreshing token: {response.status_code}", file=sys.stderr)
            return False

        self.tokens = response.json()
        self.tokens["loginTime"] = time.time()
        self._save_config()
        return True

    def ensure_valid_token(self):
        """Ensure the token is valid, refreshing if necessary."""
        if not self.is_logged_in():
            print("Error: not logged in. Run: gogdl_helper.py login", file=sys.stderr)
            return False
        if self.is_expired():
            print("Token expired, refreshing...", file=sys.stderr)
            return self.refresh()
        return True

    def get_access_token(self):
        return self.tokens.get("access_token", "")


def extract_code(user_input):
    """
    Extract the authorization code.
    Accepts both the raw code and the full redirect URL.
    """
    user_input = user_input.strip()

    # If it looks like a URL, extract the "code" parameter
    if user_input.startswith("http"):
        parsed = urlparse(user_input)
        params = parse_qs(parsed.query)
        codes = params.get("code", [])
        if codes:
            return codes[0]
        print("Error: URL does not contain the 'code' parameter.", file=sys.stderr)
        return None

    # Otherwise, it is the code itself
    return user_input


def cmd_login(auth, args):
    if args.code:
        code = args.code
    else:
        print("Opening browser for GOG login...")
        print(f"\nIf it does not open automatically, visit:\n{AUTH_URL}\n")
        webbrowser.open(AUTH_URL)

        print("After logging in, paste the redirect URL (or just the code) here:")
        user_input = input("> ").strip()

        if not user_input:
            print("No code provided.", file=sys.stderr)
            return

        code = extract_code(user_input)
        if not code:
            return

    if auth.login(code):
        print("Login successful!")
        print(f"Tokens saved to: {auth.config_path}")
    else:
        print("Login failed.", file=sys.stderr)


def cmd_refresh(auth, args):
    if auth.refresh():
        print("Token refreshed successfully!")
    else:
        print("Failed to refresh token.", file=sys.stderr)


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
        print(f"Error: {response.status_code}", file=sys.stderr)


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
            print(f"Error on page {page}: {response.status_code}", file=sys.stderr)
            break

        data = response.json()
        total_pages = data.get("totalPages", 1)
        products = data.get("products", [])

        print(f"Page {page}/{total_pages} — {len(products)} game(s)", file=sys.stderr)

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
        print(f"\n{saved} file(s) saved to {output_dir}", file=sys.stderr)
    else:
        print(json.dumps({"games": all_games}, ensure_ascii=False, indent=2))


def build_game_entry(product, auth):
    game_id = str(product.get("id", ""))
    title = product.get("title", "")
    slug = product.get("slug", "")
    category = product.get("category", "")
    rating = product.get("rating")
    works_on = product.get("worksOn", {})

    # Images from the library listing
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

    # Richer images from gamesdb
    gamesdb_images = fetch_gamesdb_images(game_id, auth)
    if gamesdb_images:
        images.update(gamesdb_images)
    else:
        # Fallback: products API
        product_images = fetch_product_images(game_id, auth)
        if product_images:
            images.update(product_images)

    # game_img1: prefer _392.jpg from listing (medium tile)
    # game_img2: prefer .jpg from listing (full size)
    image_base = product.get("image", "")
    if image_base:
        base = image_base
        if base.startswith("//"):
            base = "https:" + base
        game_img1 = f"{base}_392.jpg"
        game_img2 = f"{base}.jpg"
    else:
        # Fallback to gamesdb or product API images
        game_img1 = images.get("verticalCover", images.get("background", images.get("logo", "")))
        game_img2 = images.get("background", images.get("logo", ""))

    return {
        "id": game_id,
        "title": title,
        "slug": slug,
        "category": category,
        "rating": rating,
        "worksOn": works_on,
        "game_img1": game_img1,
        "game_img2": game_img2,
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
                fmt = field["url_format"].replace("{ext}", "jpg")
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
        description="Helper to simplify gogdl usage"
    )
    parser.add_argument(
        "--config", "-c",
        default=DEFAULT_CONFIG,
        help=f"Path to tokens file (default: {DEFAULT_CONFIG})"
    )

    sub = parser.add_subparsers(dest="command")

    # login
    login_p = sub.add_parser("login", help="Log in to GOG")
    login_p.add_argument("--code", help="Authorization code (skips the browser)")

    # refresh
    sub.add_parser("refresh", help="Refresh the access token")

    # user
    sub.add_parser("user", help="Show logged-in user data")

    # library
    lib_p = sub.add_parser("library", help="List library games with images")
    lib_p.add_argument("--path", help="Directory to save individual JSON files per game")

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
