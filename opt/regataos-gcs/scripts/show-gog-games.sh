#!/bin/bash
# This script follows the GOG login process, initiated by the user,
# and from now on starts using the gogdl command-line tool.

# Create config directory
if test ! -e /tmp/regataos-gcs; then
	mkdir -p /tmp/regataos-gcs
	chmod 777 /tmp/regataos-gcs
fi

if test ! -e "/tmp/regataos-gcs/config"; then
	ln -sf "$HOME/.config/regataos-gcs" "/tmp/regataos-gcs/config"
fi

if test ! -e "/tmp/regataos-gcs/config/gog-games/img"; then
	mkdir -p "/tmp/regataos-gcs/config/gog-games/img"
fi

if test ! -e "/tmp/regataos-gcs/config/gog-games/json"; then
	mkdir -p "/tmp/regataos-gcs/config/gog-games/json"
fi

if test ! -e "/tmp/regataos-gcs/config/gog-games/metadata"; then
	mkdir -p "/tmp/regataos-gcs/config/gog-games/metadata"
fi

if test ! -e "/tmp/regataos-gcs/config/json/installed"; then
	mkdir -p "/tmp/regataos-gcs/config/json/installed"
fi

# Check if the file with the login id exists
if test -e "/tmp/regataos-gcs/gog-login-code.txt"; then
    # Separate and save only the login id
    login_id="$(cat /tmp/regataos-gcs/gog-login-code.txt)"

    # Use the saved id to login with the GOG account with gogdl
    /opt/regataos-gcs/tools/gogdl/gogdl_helper.py login --code "$login_id" > ~/teste.txt

    # Update cache with game metadata (individual JSONs per game)
    /opt/regataos-gcs/tools/gogdl/gogdl --auth-config-path ~/.config/gogdl/auth.json \
    library --path /tmp/regataos-gcs/config/gog-games/metadata/

    # Create cache with formatted game files
    /bin/bash /opt/regataos-gcs/scripts/search-gog-games.sh

    # Verify successful login to GOG
    if test -e "$HOME/.config/gogdl/auth.json"; then
        echo "Show GOG" > "/tmp/regataos-gcs/config/gog-games/show-games.txt"
    fi

    # Remove file with login id
    rm -f "/tmp/regataos-gcs/gog-login-code.txt"
fi

# Check game json files and create image cache
/opt/regataos-gcs/scripts/search-gog-games-img.sh start
