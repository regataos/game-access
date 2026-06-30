#!/bin/bash

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

if test ! -e "/tmp/regataos-gcs/config/json/installed"; then
	mkdir -p "/tmp/regataos-gcs/config/json/installed"
fi

# GOG metadata directory (individual JSONs from gogdl library --path)
GOG_METADATA_DIR="/tmp/regataos-gcs/config/gog-games/metadata"

# Create JSON file
function create_json_file() {
	cat >"/tmp/regataos-gcs/config/gog-games/json/$gamename_lowercase-gog.json" <<GOGGAMEJSON
[
	{
		"gamename": "$game_title",
		"gamenickname": "$gamename_lowercase",
		"gameid": "$game_id",
		"gametype": "game",
		"game_folder": "$game_slug",
		"game_img1": "$game_img1",
		"game_img2": "$game_img2",
		"gamekeywords": "$game_title, $(echo $gamename_lowercase | sed 's/-/ /g'), gog",
		"launcher": "GOG Games",
		"launchernickname": "gog",
		"gamenative": "gcs"
	}
]
GOGGAMEJSON

	cat >"/opt/regataos-gcs/games-list/$gamename_lowercase-gog.json" <<GOGGAMEJSON
[
	{
		"gamename": "$game_title",
		"gamenickname": "$gamename_lowercase",
		"gameid": "$game_id",
		"gametype": "game",
		"game_folder": "$game_slug",
		"game_img1": "$game_img1",
		"game_img2": "$game_img2",
		"gamekeywords": "$game_title, $(echo $gamename_lowercase | sed 's/-/ /g'), gog",
		"launcher": "GOG Games",
		"launchernickname": "gog",
		"gamenative": "gcs"
	}
]
GOGGAMEJSON
}

# Download and resize game image
function download_game_image() {
	local img_url="$1"
	local img_path="$2"

	if [ -z "$img_url" ]; then
		return
	fi

	if test ! -e "$img_path"; then
		# Download image
		aria2c -d "$(dirname "$img_path")" -o "$(basename "$img_path")" "$img_url"

		# Reduce image size
		convert -resize 854 "$img_path" "$img_path"
	else
		# Check image size and, if necessary, redownload and reduce image size
		ImageSize=$(du -hs "$img_path" | awk '{print $1}' | sed 's/K\|M//' | cut -d',' -f -1)
		if [ $(echo $ImageSize) -eq "0" ]; then
			# Download image
			rm -f "$img_path"
			aria2c -d "$(dirname "$img_path")" -o "$(basename "$img_path")" "$img_url"

			# Reduce image size
			convert -resize 854 "$img_path" "$img_path"
		fi
	fi
}

# If necessary, create the cache with game files
for i in "$GOG_METADATA_DIR"/*.json; do
	# Skip if no json files found
	test -e "$i" || continue

	# Extract game data from gogdl JSON
	game_title="$(grep -m1 '"title"' "$i" | cut -d'"' -f4)"
	game_id="$(grep -m1 '"id"' "$i" | cut -d'"' -f4)"
	game_slug="$(grep -m1 '"slug"' "$i" | cut -d'"' -f4)"

	# Skip entries without title or id
	if [ -z "$game_title" ] || [ -z "$game_id" ]; then
		continue
	fi

	# Capture image URLs from gogdl metadata
	# game_img1: background or verticalCover (large image)
	game_img1="$(grep -m1 '"background"' "$i" | cut -d'"' -f4)"
	if [ -z "$game_img1" ]; then
		game_img1="$(grep -m1 '"verticalCover"' "$i" | cut -d'"' -f4)"
	fi
	if [ -z "$game_img1" ]; then
		game_img1="$(grep -m1 '"logo"' "$i" | cut -d'"' -f4)"
	fi

	# game_img2: logo (smaller image)
	game_img2="$(grep -m1 '"logo2x"\|"logo_2x"' "$i" | cut -d'"' -f4)"
	if [ -z "$game_img2" ]; then
		game_img2="$(grep -m1 '"logo"' "$i" | cut -d'"' -f4)"
	fi

	# Make the game name lowercase
	gamename_lowercase=$(echo "$game_title" | tr 'A-Z' 'a-z' | sed 's/[[:punct:]]\|: \|- \|(\|)\|, \|™\|+\|\.//g')
	gamename_lowercase=$(echo "$gamename_lowercase" | sed 's/[[:space:]]/-/g' | sed "s/'//g")

	# Determine image file extension
	image_type=$(echo "$game_img1" | grep -oP '\.\w+$' | sed 's/\.//')
	if [ -z "$image_type" ]; then
		image_type="jpg"
	fi

	# Download game image
	img_path="/tmp/regataos-gcs/config/gog-games/img/$gamename_lowercase.$image_type"
	download_game_image "$game_img1" "$img_path"

	# Update cache only if game data does not exist
	if test ! -e "/tmp/regataos-gcs/config/gog-games/json/$gamename_lowercase-gog.json" ||
		test ! -e "/opt/regataos-gcs/games-list/$gamename_lowercase-gog.json"; then
		create_json_file
	else
		# If the game data already exists in the cache, check if the game
		# is also available in the user account, otherwise clear cache
		if test ! -e "$GOG_METADATA_DIR/$game_slug.json"; then
			rm -f "/tmp/regataos-gcs/config/gog-games/json/$gamename_lowercase-gog.json"
			rm -f "/opt/regataos-gcs/games-list/$gamename_lowercase-gog.json"
			rm -f "/tmp/regataos-gcs/config/gog-games/img/$gamename_lowercase.$image_type"
		fi
	fi
done

# Check if a game is still in the installed or downloading list
for i in /tmp/regataos-gcs/config/gog-games/json/*-gog.json; do
	# Skip if no json files found
	test -e "$i" || continue

	game_id="$(grep -m1 '"gameid"' "$i" | awk '{print $2}' | sed 's/"\|,//g')"
	game_nickname="$(grep -m1 '"gamenickname"' "$i" | awk '{print $2}' | sed 's/"\|,//g')"

	# Check if the game is installed (gogdl uses a different path than legendary)
	if test -e "$HOME/.config/regataos-gcs/gog-games/installed.json"; then
		if [[ $(cat "$HOME/.config/regataos-gcs/gog-games/installed.json" | grep "$game_id") == *"$game_id"* ]]; then
			if test ! -e "/tmp/regataos-gcs/config/installed/$game_nickname-gog.json"; then
				cp -f "/tmp/regataos-gcs/config/gog-games/json/$game_nickname-gog.json" \
					"/tmp/regataos-gcs/config/installed/$game_nickname-gog.json"
			fi
		else
			rm -f "/tmp/regataos-gcs/config/installed/$game_nickname-gog.json"
		fi
	fi
done
