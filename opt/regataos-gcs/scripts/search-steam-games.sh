#!/bin/bash

# This script searches the game's installation directory, when searching for its executable,
# and saves the information in the "installed-games.conf" file

# Create config directory
if test ! -e /tmp/regataos-gcs ; then
	mkdir -p /tmp/regataos-gcs
	chmod 777 /tmp/regataos-gcs
fi

if test ! -e "/tmp/regataos-gcs/config" ; then
	ln -sf "$HOME/.config/regataos-gcs" "/tmp/regataos-gcs/config"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games.conf" ; then
	echo "" > "/tmp/regataos-gcs/config/steam-games.conf"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games-json"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games-json"
fi

# Check if the game installation directory exists, looking for the game executable
function search_steam_games() {
cat > "/tmp/regataos-gcs/config/steam-games-json/$game_appid.json" << STEAMGAMEJSON
[
	{
		"appid": "$game_appid",
		"name": "$game_name",
		"image": "https://cdn.cloudflare.steamstatic.com/steam/apps/$game_appid/header.jpg"
    }
]
STEAMGAMEJSON
}

# Get game information and check if they are installed
for i in $HOME/.local/share/Steam/steamapps/*.acf; do
	game_appid="$(grep -R '"appid"' $i | awk '{print $2}' | sed 's/"\|,//g')"
	game_name="$(grep -R '"name"' $i | awk '{print $2}' | sed 's/"\|,//g')"

	if [ ! -z $game_appid ];then
		if test ! -e "/tmp/regataos-gcs/config/steam-games-json/$game_appid.json"; then
			search_steam_games
		fi
	fi
done
