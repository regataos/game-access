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
cat > "/tmp/regataos-gcs/config/epicstore-games/json/$gamename_lowercase-epicstore.json" << EPICGAMEJSON
[
	{
		"gamename": "$game_title",
		"gamenickname": "$gamename_lowercase",
		"gameid": "$game_name",
		"gametype": "game",
		"game_img1": "$game_img1",
		"game_img2": "$game_img2",
		"gamekeywords": "$game_title, $(echo $gamename_lowercase | sed 's/-/ /g'), epic games store",
		"launcher": "Epic Games Store",
		"launchernickname": "epicstore",
		"gamenative": "gcs"
    }
]
EPICGAMEJSON

cat > "/opt/regataos-gcs/games-list/$gamename_lowercase-epicstore.json" << EPICGAMEJSON
[
	{
		"gamename": "$game_title",
		"gamenickname": "$gamename_lowercase",
		"gameid": "$game_name",
		"gametype": "game",
		"game_img1": "$game_img1",
		"game_img2": "$game_img2",
		"gamekeywords": "$game_title, $(echo $gamename_lowercase | sed 's/-/ /g'), epic games store",
		"launcher": "Epic Games Store",
		"launchernickname": "epicstore",
		"gamenative": "gcs"
    }
]
EPICGAMEJSON
}

# If necessary, create the cache with game files
for i in $HOME/.config/legendary/metadata/*.json; do
	game_title="$(grep -R '"app_title"' $i | cut -d'"' -f 4- | cut -d'"' -f -1 | head -1 | tail -2 | sed 's,\\u00ae,,g' | sed 's,\\u2122,,g')"
	game_name="$(grep -R '"app_name"' $i | cut -d'"' -f 4- | cut -d'"' -f -1 | head -1 | tail -2)"
	categories="$(grep -R '"path": "games"' $i | cut -d'"' -f 4- | cut -d'"' -f -1 | head -1 | tail -2)"

	# Capture image1 url
	file_search1="$i"
	search1='"DieselGameBox"'
	line_search1=$(cat -n $file_search1 | grep -w $search1 | head -4 | tail -1 | awk '{print $1}')
	search_result1=$(qt=`wc -l $file_search1 | awk '{print $1}'`; sed -n ''$line_search1','$qt'p' $file_search1)
	game_img1=$(echo "$search_result1" | head -4 | grep url | cut -d'"' -f 4- | cut -d'"' -f -1)

	# Capture image2 url
	file_search2="$i"
	search2='"DieselGameBoxLogo"'
	line_search2=$(cat -n $file_search2 | grep -w $search2 | head -4 | tail -1 | awk '{print $1}')
	search_result2=$(qt=`wc -l $file_search2 | awk '{print $1}'`; sed -n ''$line_search2','$qt'p' $file_search2)
	game_img2=$(echo "$search_result2" | head -4 | grep url | cut -d'"' -f 4- | cut -d'"' -f -1)

	# Make the game name lowercase
	gamename_lowercase=$(echo "$game_title" | tr 'A-Z' 'a-z' | sed 's/: \|- \|(\|)\|, \|™//g')
	gamename_lowercase=$(echo $gamename_lowercase | sed 's/ /-/g')

	if [[ $(echo $categories) == *"games"* ]]; then
		# Download game image
		image_type=$(echo $game_img1 | cut -d'.' -f 4-)
		if [ -z $image_type ];then
			if test ! -e "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase"; then
				wget --no-check-certificate -O "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase" "$game_img1"
			fi

			game_img1="/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase"
			convert -resize 854 /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase

		else
			if test ! -e "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type"; then
				wget --no-check-certificate -O "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type" "$game_img1"
			fi

			game_img1="/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type"
			convert -resize 854 /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type
		fi

		# Download game logo
		if [ ! -z $game_img2 ];then
			image_type2=$(echo $game_img2 | cut -d'.' -f 4-)
			if [ -z $image_type2 ];then
				if test ! -e "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo"; then
					wget --no-check-certificate -O "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo" "$game_img2"
				fi

				game_img2="/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo"
				convert -resize 854 /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo

			else
				if test ! -e "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo.$image_type2"; then
					wget --no-check-certificate -O "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo.$image_type2" "$game_img2"
				fi

				game_img2="/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo.$image_type2"
				convert -resize 250 /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo.$image_type2 /tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo.$image_type2
			fi
		fi

		# Update cache only if game data does not exist
		if test ! -e "/tmp/regataos-gcs/config/epicstore-games/json/$gamename_lowercase-epicstore.json"; then
			create_json_file

		else
			# If the game data already exists in the cache, check if the game is also available in the user account,
			# otherwise clear cache
			if test ! -e "$HOME/.config/legendary/metadata/$game_name.json"; then
				rm -f "/tmp/regataos-gcs/config/epicstore-games/json/$gamename_lowercase-epicstore.json"
				rm -f "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo"
				rm -f "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase-logo.$image_type2"
				rm -f "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase"
				rm -f "/tmp/regataos-gcs/config/epicstore-games/img/$gamename_lowercase.$image_type"
			fi
		fi
	fi
done