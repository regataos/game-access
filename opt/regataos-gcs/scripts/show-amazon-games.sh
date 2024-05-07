#!/bin/bash

# This script follows the Amazon Games login process, initiated by the user,
# and from now on starts using the nile command-line tool.

if test ! -e "/tmp/regataos-gcs/config/amazon-games/img"; then
	mkdir -p "/tmp/regataos-gcs/config/amazon-games/img"
fi

if test ! -e "/tmp/regataos-gcs/config/amazon-games/json"; then
	mkdir -p "/tmp/regataos-gcs/config/amazon-games/json"
fi

# Check if the file with the login id exists
if test -e "/tmp/regataos-gcs/login-amazon-games.txt"; then
    # Separate and save only the login id
    login_amazon_games=$(cat "/tmp/regataos-gcs/login-amazon-games.txt")

    # Use the saved id to login with the Amazon Games account with nile
    /opt/regataos-gcs/tools/nile/nile register $login_amazon_games

    # Create cache with game files
	/bin/bash /opt/regataos-gcs/scripts/search-amazon-games.sh

    # Verify successful login to Amazon Games
    if test -e "$HOME/.config/nile/user.json"; then
        if [[ $(grep -r user_id "$HOME/.config/nile/user.json") == *"user_id"* ]]; then
            echo "Show Amazon Games" > "/tmp/regataos-gcs/config/amazon-games/show-games.txt"
            ln -sf "$HOME/.config/nile/library.json" "/tmp/regataos-gcs/config/amazon-games/library.json"
        fi
    fi

    # Remove file with login id
    rm -f "/tmp/regataos-gcs/login-amazon-games.txt"
    rm -f "/tmp/regataos-gcs/amazon-login.json"
fi

# Check game json files and create image cache
/opt/regataos-gcs/scripts/search-amazon-games-img.sh start
