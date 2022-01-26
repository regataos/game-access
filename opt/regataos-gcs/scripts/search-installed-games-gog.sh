#!/bin/bash

# If necessary, create the application settings directory
if test ! -e "/tmp/regataos-gcs/config"; then
	ln -sf "$HOME/.config/regataos-gcs" "/tmp/regataos-gcs/config"
fi

if test ! -e "/tmp/regataos-gcs/config/gog-games/json"; then
    mkdir -p "/tmp/regataos-gcs/config/gog-games/json"
fi

if test ! -e "/tmp/regataos-gcs/config/gog-games/img"; then
    mkdir -p "/tmp/regataos-gcs/config/gog-games/img"
fi

# Search for installed games from GOG Galaxy
function search_for_games() {
    # Read the cached file data line by line with all game installation folders
    while IFS= read -r game_install_folder || [[ -n "$game_install_folder" ]]; do
        # Try to locate the game installation folder
        game_json_file=$(grep -ir "$game_install_folder" "/tmp/regataos-gcs/config/gog-games/json/" | sed 's/://g' | awk '{print $1}' | head -1)

        if test -e "$game_json_file"; then
            # Save the path to the games installation folder in the cache
            gamenickname=$(grep -R '"gamenickname":' $game_json_file | awk '{print $2}' | sed 's/"\|,//g')

            if test -e "$GAMES_INSTALL_DIR$game_install_folder/goglog.ini"; then
                if [[ $(echo "$game_json_file" | cut -d'/' -f 7-) == *"$(echo $gamenickname)"* ]]; then
                    echo "$gamenickname: $(echo '"')$GAMES_INSTALL_DIR$game_install_folder$(echo '"')"

                    if [[ $(echo $games_install_folders) != *"$(echo $gamenickname)"* ]]; then
                        echo "$gamenickname: $GAMES_INSTALL_DIR$game_install_folder" >> "/tmp/regataos-gcs/config/gog-games/games-folders2.txt"
                    fi

                    # Copy the games JSON file to the installed games directory
                    if test ! -e "/tmp/regataos-gcs/config/installed/$(echo $game_json_file | cut -d'/' -f 7-)"; then
                        cp -f "$game_json_file" "/tmp/regataos-gcs/config/installed/"
                    fi
                fi
            fi
        fi
    done < "/tmp/regataos-gcs/config/gog-games/games-folders1.txt"

    # If necessary, remove the game from the installed list
    while IFS= read -r game_install_folder || [[ -n "$game_install_folder" ]]; do
        # Try to locate the game installation folder
        gamenickname=$(echo "$game_install_folder" | cut -d':' -f -1)
        game_install_folder=$(echo "$game_install_folder" | cut -d':' -f 2- | sed 's/ //')

        if test ! -e "$game_install_folder"; then
            sed -i "/$gamenickname/d" "/tmp/regataos-gcs/config/gog-games/games-folders2.txt"
            sed -i '/^$/d' "/tmp/regataos-gcs/config/gog-games/games-folders2.txt"
            rm -f "/tmp/regataos-gcs/config/installed/$gamenickname-gog.json"
        fi
    done < "/tmp/regataos-gcs/config/gog-games/games-folders2.txt"
}

# Start searching for installed games
if test -e "$HOME/.local/share/wineprefixes/gog-compatibility-mode/drive_c/ProgramData/GOG.com/Galaxy/config.json"; then
    # Get the default installation directory for GOG Galaxy games
    GAMES_INSTALL_DIR=$(grep -r libraryPath $HOME/.local/share/wineprefixes/gog-compatibility-mode/drive_c/ProgramData/GOG.com/Galaxy/config.json | cut -d':' -f 3- | sed 's,\\\\\|"\,,/,g')
    GAMES_INSTALL_DIR="$HOME/.local/share/wineprefixes/gog-compatibility-mode/dosdevices/c:$GAMES_INSTALL_DIR"

    # Cache a list of all folders located within the game installation directory
    echo "$(ls "$GAMES_INSTALL_DIR" | sed "s/' '/\n/g")" > "/tmp/regataos-gcs/config/gog-games/games-folders1.txt"

    # If the game's installation folder is not found, remove the game's JSON file from the installed games directory
    if test -e "/tmp/regataos-gcs/config/gog-games/games-folders2.txt"; then
        games_install_folders=$(cat /tmp/regataos-gcs/config/gog-games/games-folders2.txt)
    fi

    # Check for game folders in default installation directory before running main function
    if test -s "/tmp/regataos-gcs/config/gog-games/games-folders1.txt"; then
        search_for_games
    fi

    if test -s "/tmp/regataos-gcs/config/gog-games/games-folders2.txt"; then
        echo "show installed games from gog galaxy" > "/tmp/regataos-gcs/config/installed/show-installed-games-gog.txt"
    else
        rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-gog.txt"
    fi
fi
