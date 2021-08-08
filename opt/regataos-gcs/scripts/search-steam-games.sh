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

if test ! -e "/tmp/regataos-gcs/config/steam-games/img"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games/img"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games/json/steam-id"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games/json/steam-id"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games/json/games"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games/json/games"
fi

# Check if there are any Steam games installed
if [[ $(ls $HOME/.local/share/Steam/steamapps/ | grep acf) == *"acf"* ]]; then
	if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
		rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
	fi

else
	# Download the json file with game information
	echo "$(grep -r SteamID $HOME/.local/share/Steam/config/config.vdf | awk '{print $2}' | sed 's/"//g')" > "/tmp/regataos-gcs/config/steam-games/json/steam-id/all-steam-id.txt"
	steam_games=$(cat "/tmp/regataos-gcs/config/steam-games/json/steam-id/all-steam-id.txt" | head -1)

	if test ! -e "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json"; then
    	wget --no-check-certificate -O "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json" \
		"http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F06912D875764FDC65C1880539873AE0&steamid=$steam_games&format=json&include_appinfo=true"
	fi

	# Verify that the JSON file has the information Game Access needs
	if [[ $(grep -r "appid" "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json") != *"appid"* ]]; then
		if test ! -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
			echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
			rm -f /tmp/regataos-gcs/config/installed/*-steam.json
			rm -f /tmp/regataos-gcs/config/steam-games/json/steam-id/*
			rm -f /opt/regataos-gcs/games-list/*-steam.json
			rm -f /tmp/regataos-gcs/config/steam-games/img/*
		fi

	else
		if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
			rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
		fi
	fi
fi

if [[ $(ls /tmp/regataos-gcs/config/steam-games/json/steam-id/ | grep json) != *"json"* ]]; then
	rm -f "/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt"
fi

# Check if the game installation directory exists, looking for the game executable
function search_steam_games() {
#Create JSON file
cat > "/tmp/regataos-gcs/config/installed/$gamename_lowercase-steam.json" << STEAMGAMEJSON
[
	{
		"gamename": "$game_name",
		"gameid": "$game_appid",
		"gamenickname": "$gamename_lowercase"
    }
]
STEAMGAMEJSON
}

# Run game processes only if necessary.
if test ! -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
	# Check if the Steam game is still installed
	for i in /tmp/regataos-gcs/config/installed/*-steam.json; do
		file_id=$(echo $i | cut -d"/" -f 6- | cut -d"." -f -1)

		if ! test -e "$HOME/.local/share/Steam/steamapps/$file_id.acf"; then
			rm -f "/tmp/regataos-gcs/config/installed/$file_id-steam.json"
		fi
	done

	# Get game information and check if they are installed
	for i in $HOME/.local/share/Steam/steamapps/*.acf; do
		game_appid="$(grep -R '"appid"' $i | awk '{print $2}' | sed 's/"\|,//g')"
		game_name="$(grep -R '"name"' $i | cut -d'"' -f 4- | cut -d'"' -f -1)"

		#Make the game name lowercase
		gamename_lowercase=$(echo "$game_name" | tr 'A-Z' 'a-z' | sed 's/: \|- \|(\|)\|, \|™//g')
		gamename_lowercase=$(echo $gamename_lowercase | sed 's/ /-/g')

		if [ ! -z $game_appid ];then
			if test ! -e "/opt/regataos-gcs/games-list/$gamename_lowercase-steam.json"; then
				search_steam_games
			else
				cp -f "/opt/regataos-gcs/games-list/$gamename_lowercase-steam.json" "/tmp/regataos-gcs/config/installed/$gamename_lowercase-steam.json"
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

			# Verify that the JSON file has the information Game Access needs
			if [[ $(grep -r "appid" "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json") == *"appid"* ]]; then
				echo "show steam games" > "/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt"
			fi

		else
			# Verify that the JSON file has the information Game Access needs
			if [[ $(grep -r "appid" "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json") == *"appid"* ]]; then
				echo "show steam games" > "/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt"
			fi
		fi
		done < "/tmp/regataos-gcs/config/steam-games/json/steam-id/all-steam-id.txt"
	fi
fi

# Check if a game is still in the installed or downloading list
for i in /tmp/regataos-gcs/config/installed/*-steam.json; do
	game_name="$(grep -R '"gamenickname"' $i | cut -d'"' -f 4- | cut -d'"' -f -1)"
	game_id="$(grep -R '"gameid"' $i | awk '{print $2}' | sed 's/"\|,//g')"

	if test ! -e "$HOME/.local/share/Steam/steamapps/appmanifest_$(echo $game_id).acf"; then
		rm -f "/tmp/regataos-gcs/config/installed/$game_name-steam.json"
	fi
done
