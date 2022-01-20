#!/bin/bash

# This script follows the Epic Games Store login process, initiated by the user,
# and from now on starts using the legendary command-line tool.

# Check if the file with the login id exists
if test -e "/tmp/regataos-gcs/login-id.txt"; then
    # Separate and save only the login id
    login_id=$(cat /tmp/regataos-gcs/login-id.txt | sed 's/{\|}//g' | sed 's/"//g' | cut -d"," -f 2- | cut -d":" -f 3-)

    # Use the saved id to login with the Epic Games Store account with legendary
    /opt/regataos-gcs/tools/legendary/legendary auth --sid $login_id

    # Update cache with game information
    /opt/regataos-gcs/tools/legendary/legendary status

    # Create cache with game files
	/bin/bash /opt/regataos-gcs/scripts/search-epicstore-games.sh

    # Verify successful login to Epic Games Store
    if test -e "$HOME/.config/legendary/user.json"; then
        echo "Show EGS" > "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt"
    fi

    # Remove file with login id
    rm -f "/tmp/regataos-gcs/login-id.txt"
fi

# Check game json files and create image cache
/opt/regataos-gcs/scripts/search-epicstore-games-img.sh start
