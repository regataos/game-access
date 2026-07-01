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
cat > "/tmp/regataos-gcs/config/gog-games/json/$gamename_lowercase-gog.json" << GOGGAMEJSON
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
		"launcher": "GOG Galaxy",
		"launchernickname": "gog",
		"gamenative": "gcs"
	}
]
GOGGAMEJSON

cat > "/opt/regataos-gcs/games-list/$gamename_lowercase-gog.json" << GOGGAMEJSON
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
		"launcher": "GOG Galaxy",
		"launchernickname": "gog",
		"gamenative": "gcs"
	}
]
GOGGAMEJSON
}

# If necessary, create the cache with game files
for i in "$GOG_METADATA_DIR"/*.json; do
	# Skip if no json files found
	test -e "$i" || continue

	# Extract game data from gogdl JSON
	game_title="$(grep -m1 '"title"' "$i" | cut -d'"' -f4)"
	game_id="$(grep -m1 '"id"' "$i" | cut -d'"' -f4)"
	game_slug="$(grep -m1 '"slug"' "$i" | cut -d'"' -f4)"
	game_category="$(grep -m1 '"category"' "$i" | cut -d'"' -f4)"

	# Skip non-game entries (DLCs, movies, etc.)
	if [ -z "$game_title" ] || [ -z "$game_id" ]; then
		continue
	fi

	# Capture image URLs directly from gogdl metadata
	game_img1="$(grep -m1 '"game_img1"' "$i" | cut -d'"' -f4)"
	game_img2="$(grep -m1 '"game_img2"' "$i" | cut -d'"' -f4)"

	# Make the game name lowercase
	gamename_lowercase=$(echo "$game_title" | tr 'A-Z' 'a-z' | sed 's/[[:punct:]]\|: \|- \|(\|)\|, \|™\|+\|\.//g')
	gamename_lowercase=$(echo "$gamename_lowercase" | sed 's/[[:space:]]/-/g' | sed "s/'//g")

	# Update cache only if game data does not exist
	if test ! -e "/tmp/regataos-gcs/config/gog-games/json/$gamename_lowercase-gog.json" ||
		test ! -e "/opt/regataos-gcs/games-list/$gamename_lowercase-gog.json"; then
		create_json_file
	fi
done
