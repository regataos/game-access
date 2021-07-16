#!/bin/bash

# This script searches the game's installation directory, when searching for its executable,
# and saves the information in the "installed-games.conf" file

# Create config directory
if test ! -e /tmp/regataos-gcs; then
	mkdir -p /tmp/regataos-gcs
	chmod 777 /tmp/regataos-gcs
fi

if test ! -e "/tmp/regataos-gcs/config"; then
	ln -sf "$HOME/.config/regataos-gcs" "/tmp/regataos-gcs/config"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games.conf"; then
	echo "" > "/tmp/regataos-gcs/config/steam-games.conf"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games/json"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games/json"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games/img"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games/img"
fi

# Check if there are any Steam games installed
if [[ $(ls $HOME/.local/share/Steam/steamapps/ | grep acf) == *"acf"* ]]; then
	if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
		rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
	fi

else
	if test ! -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
		echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
		rm -f /tmp/regataos-gcs/config/steam-games/img/*
		rm -f /tmp/regataos-gcs/config/steam-games/json/*
	fi
fi

# Check if the game installation directory exists, looking for the game executable
function search_steam_games() {
#Create JSON file
cat > "/tmp/regataos-gcs/config/steam-games/json/$game_appid.json" << STEAMGAMEJSON
[
	{
		"appid": "$game_appid",
		"name": "$game_name",
		"launcher": "Steam",
		"image": "file:///tmp/regataos-gcs/config/steam-games/img/$game_appid.jpg"
    }
]
STEAMGAMEJSON

#Download game image
if test ! -e "/tmp/regataos-gcs/config/steam-games/img/$game_appid.jpg"; then
	wget --no-check-certificate -O "/tmp/regataos-gcs/config/steam-games/img/$game_appid.jpg" \
	"https://cdn.cloudflare.steamstatic.com/steam/apps/$game_appid/header.jpg"
fi
}

# Run game processes only if necessary.
if test ! -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
	# Check if the Steam game is still installed
	for i in /tmp/regataos-gcs/config/steam-games/json/*.json; do
		file_id=$(echo $i | cut -d"/" -f 6- | cut -d"." -f -1)

		if ! test -e "$HOME/.local/share/Steam/steamapps/$file_id.acf"; then
			rm -f "/tmp/regataos-gcs/config/steam-games/json/$file_id.json"
			rm -f "/tmp/regataos-gcs/config/steam-games/img/$game_appid.jpg"
		fi
	done

	# Get game information and check if they are installed
	for i in $HOME/.local/share/Steam/steamapps/*.acf; do
		game_appid="$(grep -R '"appid"' $i | awk '{print $2}' | sed 's/"\|,//g')"
		game_name="$(grep -R '"name"' $i | cut -d'"' -f 4- | cut -d'"' -f -1)"

		if [ ! -z $game_appid ];then
			if test ! -e "/tmp/regataos-gcs/config/steam-games/json/$game_appid.json"; then
				search_steam_games
			fi
		fi
	done
fi
