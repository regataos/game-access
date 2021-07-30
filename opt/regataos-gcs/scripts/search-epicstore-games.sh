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

if test ! -e "/tmp/regataos-gcs/config/epicstore-games/img"; then
	mkdir -p "/tmp/regataos-gcs/config/epicstore-games/img"
fi

if test ! -e "/tmp/regataos-gcs/config/epicstore-games/json"; then
	mkdir -p "/tmp/regataos-gcs/config/epicstore-games/json"
fi

if test ! -e "/tmp/regataos-gcs/config/json/installed"; then
	mkdir -p "/tmp/regataos-gcs/config/json/installed"
fi

# Create JSON file
function create_json_file() {
cat > "/tmp/regataos-gcs/config/epicstore-games/json/$gamename_lowercase-epicstore.json" << STEAMGAMEJSON
[
	{
		"gamename": "$game_title",
		"gamenickname": "$gamename_lowercase",
		"gameid": "$game_name",
		"gametype": "game",
		"gamekeywords": "$game_title, $(echo $gamename_lowercase | sed 's/-/ /g'), epic games store",
		"launcher": "Epic Games Store",
		"launchernickname": "epicstore",
		"gamenative": "gcs"
    }
]
STEAMGAMEJSON

cat > "/opt/regataos-gcs/games-list/$gamename_lowercase-epicstore.json" << STEAMGAMEJSON
[
	{
		"gamename": "$game_title",
		"gamenickname": "$gamename_lowercase",
		"gameid": "$game_name",
		"gametype": "game",
		"gamekeywords": "$game_title, $(echo $gamename_lowercase | sed 's/-/ /g'), epic games store",
		"launcher": "Epic Games Store",
		"launchernickname": "epicstore",
		"gamenative": "gcs"
    }
]
STEAMGAMEJSON
}

# If necessary, create the cache with game files
for i in $HOME/.config/legendary/metadata/*.json; do
	game_title="$(grep -R '"app_title"' $i | cut -d'"' -f 4- | cut -d'"' -f -1 | head -1 | tail -2 | sed 's,\\u00ae,,g' | sed 's,\\u2122,,g')"
	game_name="$(grep -R '"app_name"' $i | cut -d'"' -f 4- | cut -d'"' -f -1 | head -1 | tail -2)"
	game_img="$(grep -R '"url"' $i | cut -d'"' -f 4- | cut -d'"' -f -1 | tail -2 | head -1)"

	# Make the game name lowercase
	gamename_lowercase=$(echo "$game_title" | tr 'A-Z' 'a-z' | sed 's/: \|- \|(\|)\|, \|™//g')
	gamename_lowercase=$(echo $gamename_lowercase | sed 's/ /-/g')

	if test ! -e "/tmp/regataos-gcs/config/epicstore-games/json/$gamename_lowercase-epicstore.json"; then
		create_json_file
	fi

	# Download game image
	image_type=$(echo $game_img | cut -d'.' -f 4-)
	if test ! -e "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type"; then
		wget --no-check-certificate -O "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type" "$game_img"
	fi
done
