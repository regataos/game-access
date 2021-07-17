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

if test ! -e "/tmp/regataos-gcs/config/steam-games/json/installed"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games/json/installed"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games/json/steam-id"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games/json/steam-id"
fi

# Check if there are any Steam games installed
if [[ $(ls $HOME/.local/share/Steam/steamapps/ | grep acf) == *"acf"* ]]; then
	if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
		rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
	fi

else
	if test ! -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
		echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
		rm -f /tmp/regataos-gcs/config/steam-games/json/installed/*
		rm -f /tmp/regataos-gcs/config/steam-games/json/steam-id/*
	fi
fi

# Check if the game installation directory exists, looking for the game executable
function search_steam_games() {
#Create JSON file
cat > "/tmp/regataos-gcs/config/steam-games/json/installed/$game_appid.json" << STEAMGAMEJSON
[
	{
		"appid": "$game_appid",
		"name": "$game_name",
    }
]
STEAMGAMEJSON
}

# Run game processes only if necessary.
if test ! -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
	# Check if the Steam game is still installed
	for i in /tmp/regataos-gcs/config/steam-games/json/installed/*.json; do
		file_id=$(echo $i | cut -d"/" -f 6- | cut -d"." -f -1)

		if ! test -e "$HOME/.local/share/Steam/steamapps/$file_id.acf"; then
			rm -f "/tmp/regataos-gcs/config/steam-games/json/installed/$file_id.json"
		fi
	done

	# Get game information and check if they are installed
	for i in $HOME/.local/share/Steam/steamapps/*.acf; do
		game_appid="$(grep -R '"appid"' $i | awk '{print $2}' | sed 's/"\|,//g')"
		game_name="$(grep -R '"name"' $i | cut -d'"' -f 4- | cut -d'"' -f -1)"

		if [ ! -z $game_appid ];then
			if test ! -e "/tmp/regataos-gcs/config/steam-games/json/installed/$game_appid.json"; then
				search_steam_games
			fi
		fi
	done

	# View all available games in the user's Steam account
	if test -e "$HOME/.local/share/Steam/config/config.vdf"; then

		# Download the json file with game information
		echo "$(grep -r SteamID $HOME/.local/share/Steam/config/config.vdf | awk '{print $2}' | sed 's/"//g')" > "/tmp/regataos-gcs/config/steam-games/json/steam-id/all-steam-id.txt"

		while IFS= read -r steam_games || [[ -n "$steam_games" ]]; do
			if test ! -e "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json"; then
    			wget --no-check-certificate -O "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json" \
				"http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F06912D875764FDC65C1880539873AE0&steamid=$steam_games&format=json&include_appinfo=true"
			fi
		done < "/tmp/regataos-gcs/config/steam-games/json/steam-id/all-steam-id.txt"
	fi
fi
