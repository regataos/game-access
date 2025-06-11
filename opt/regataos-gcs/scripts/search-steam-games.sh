#!/bin/bash

# Create config directory.
if test ! -e "/tmp/regataos-gcs/config/steam-games.conf"; then
	echo "" > "/tmp/regataos-gcs/config/steam-games.conf"
fi

if test ! -e "/tmp/regataos-gcs/config/steam-games"; then
	mkdir -p "/tmp/regataos-gcs/config/steam-games"
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

if test ! -e "$HOME/.local/share/Steam/steam.sh"; then
	exit 0;
fi

# Check for games installed by the Steam client.
function search_installed_games() {
	library_folders="$HOME/.local/share/Steam/config/libraryfolders.vdf"
	if test -e "$library_folders"; then
		for directory in $(cat "$library_folders" | grep path | awk '{print $2}' | sed 's/"//g'); do
			steam_library="$directory/steamapps"
			check_acf_files="$(ls "$steam_library/" | grep acf)"

			if [[ $check_acf_files == *"acf"* ]]; then
				for file in $check_acf_files; do
					check_content="$(cat "$steam_library/$file" | grep '"name"' | cut -d'"' -f 4- | sed 's/"//g')"

					if [[ $check_content != *"Steamworks"* ]] && \
					[[ $check_content != *"Proton"* ]] && \
					[[ $check_content != *"Steam Linux Runtime"* ]]; then
						game_name=$(echo "$check_content" | tr 'A-Z' 'a-z' | sed 's/: \|- \|(\|)\|, \|™\|\.//g')
						game_name=$(echo $game_name | sed 's/-//g' | sed 's/ /-/g')

						if test -e "/tmp/regataos-gcs/config/installed/$game_name-steam.json" && \
						test ! -e "/tmp/regataos-gcs/config/steam-games/json/games/$game_name-steam.json"; then
							rm -f "/tmp/regataos-gcs/config/installed/$game_name-steam.json"
						else
							if test -e "/tmp/regataos-gcs/config/steam-games/json/games/$game_name-steam.json"; then
								cp -f "/tmp/regataos-gcs/config/steam-games/json/games/$game_name-steam.json" \
								"/tmp/regataos-gcs/config/installed/$game_name-steam.json"

								echo "show steam games" > "/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt"
								rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
							fi
						fi
					fi
				done
			fi
		done
	fi
}

# Download the json file with game information
config_file="$HOME/.local/share/Steam/config/config.vdf"
if test -e "$config_file"; then
	user_id_dir="/tmp/regataos-gcs/config/steam-games/json/steam-id"
	check_steam_id="$(grep -r SteamID "$config_file" | awk '{print $2}' | head -1 | tail -1 | sed 's/"//g')"
	user_games_link="http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F06912D875764FDC65C1880539873AE0&steamid=$check_steam_id&format=json&include_appinfo=true"

	if [ ! -z $check_steam_id ];then
		if test ! -e "$user_id_dir/$check_steam_id.json"; then
			rm -f "$user_id_dir/"*
			rm -f "/tmp/regataos-gcs/config/steam-games/json/games/"*
			rm -f "/opt/regataos-gcs/games-list/"*-steam.json

			wget --no-check-certificate -O "$user_id_dir/$check_steam_id.json" "$user_games_link"
		fi

		if [[ $(grep -r "appid" "$user_id_dir/$check_steam_id.json") == *"appid"* ]]; then
			if [[ $(ls "/tmp/regataos-gcs/config/steam-games/json/games/") == *"steam.json"* ]]; then
				echo "show steam games" > "/tmp/regataos-gcs/config/steam-games/show-menu-steam.txt"
			fi

			# Check for installed or downloaded games.
			search_installed_games

			check_installed_game_name="$(ls /tmp/regataos-gcs/config/installed/)"
			if [[ $check_installed_game_name == *"json"* ]]; then
				for file in $check_installed_game_name; do
					if [[ $(echo "/tmp/regataos-gcs/config/installed/$file") == *"steam.json"* ]]; then
						get_game_id="$(cat /tmp/regataos-gcs/config/installed/$file | grep '"gameid"' | head -1 | tail -1 | awk '{print $2}' | cut -d'"' -f -2 | cut -d'"' -f 2-)"
						check_game_id="$(grep -r "$get_game_id" $steam_library/*.acf)"
						if [ -z "$check_game_id" ]; then
							echo "Game with ID $get_game_id is not installed!"
							rm -f "/tmp/regataos-gcs/config/installed/$file"
						else
							echo "$check_game_id"
							echo "Game with ID $get_game_id is installed!"
						fi
					fi
				done
			fi

			if [[ $(ls "/tmp/regataos-gcs/config/installed/") == *"steam.json"* ]]; then
				echo "Show Steam installed!" > "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
			else
				rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
			fi

			echo "rearrange game blocks" > "/tmp/regataos-gcs/config/file-status.txt"

		else
			echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
			rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
			rm -f /tmp/regataos-gcs/config/installed/*-steam.json
			rm -f /opt/regataos-gcs/games-list/*-steam.json
			rm -f /tmp/regataos-gcs/config/steam-games/img/*
			rm -f /tmp/regataos-gcs/config/steam-games/json/games/*
		fi
	fi
fi
