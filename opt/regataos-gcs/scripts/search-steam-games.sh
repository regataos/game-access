#!/bin/bash

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

# Start update steam cache
echo "Update steam cache" > "/tmp/regataos-gcs/config/steam-games/update-cache-steam.txt"

# Check if there are any Steam games installed
checkHomeFiles="$(ls $HOME/.local/share/Steam/steamapps/ | grep acf)"

if test -e "/tmp/regataos-gcs/config/external-games-folder.txt"; then
	if test -e "$HOME/.local/share/Steam/steam.sh"; then
		if [[ $(grep -r SteamID "$HOME/.local/share/Steam/config/config.vdf" | awk '{print $1}') == *"SteamID"* ]]; then
			external_steam_folder=$(find "$(cat /tmp/regataos-gcs/config/external-games-folder.txt)" -type f -iname appmanifest_*.acf | head -1 | tail -2 | sed 's/appmanifest//' | cut -d'_' -f -1 | sed 's/steamapps\//steamapps/')
			get_external_lib_dir="$(echo "$external_steam_folder" | sed 's|/steamapps||')"

			if [[ $(grep -r "$get_external_lib_dir" "$HOME/.local/share/Steam/config/libraryfolders.vdf") == *"$get_external_lib_dir"* ]]; then
				if test -e "$(echo "$external_steam_folder")"; then
                    checkFiles="$(ls "$external_steam_folder/" | grep acf)"

                    if [[ $checkFiles == *"acf"* ]]; then
                        for f in $checkFiles; do
                            checkContent=$(cat "$external_steam_folder/$f" | grep name | cut -d'"' -f 4- | sed 's/"//')

                            if [[ $checkContent != *"Steamworks"* ]] && \
                            [[ $checkContent != *"Proton"* ]] && \
                            [[ $checkContent != *"Steam Linux Runtime"* ]]
                            then
                                checkGame="game detected"
                                echo "File -> $f"
                                break
                            fi
                        done

                        if [[ $checkGame == *"game detected"* ]]; then
                            echo "Game detected!"

                            if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
                                echo "show installeds" > "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
                                echo "Steam installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
                                rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"

                            else
                                echo "show installeds" > "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
                                echo "Steam installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
                            fi

                        else
                            rm -f /tmp/regataos-gcs/config/installed/*-steam.json
                            rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
                        fi
					fi
				fi

			else
				if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
					rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
				fi
			fi

		else
			echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
			rm -f /tmp/regataos-gcs/config/installed/*-steam.json
			rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"

			if test ! -e /tmp/regataos-gcs/config/installed/*.json; then
				rm -f "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
			fi
		fi

	else
		echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
		rm -f /tmp/regataos-gcs/config/installed/*-steam.json
		rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"

		if test ! -e /tmp/regataos-gcs/config/installed/*.json; then
			rm -f "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
		fi
	fi

elif [[ $checkHomeFiles == *"acf"* ]]; then
    for f in $checkHomeFiles; do
        checkContent=$(cat $HOME/.local/share/Steam/steamapps/$f | grep name | cut -d'"' -f 4- | sed 's/"//')

        if [[ $checkContent != *"Steamworks"* ]] && \
        [[ $checkContent != *"Proton"* ]] && \
        [[ $checkContent != *"Steam Linux Runtime"* ]]
        then
            checkGame="game detected"
            echo "File -> $f"
            break
        fi
    done

    if [[ $checkGame == *"game detected"* ]]; then
        if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
            echo "show installeds" > "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
            echo "Steam installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
            rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"

        else
            echo "show installeds" > "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
            echo "Steam installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
        fi

    else
		rm -f /tmp/regataos-gcs/config/installed/*-steam.json
		rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
    fi

else
	# Download the json file with game information
	if [[ $(grep -r SteamID $HOME/.local/share/Steam/config/config.vdf | awk '{print $1}') == *"SteamID"* ]]; then
		echo "$(grep -r SteamID $HOME/.local/share/Steam/config/config.vdf | awk '{print $2}' | sed 's/"//g')" > "/tmp/regataos-gcs/config/steam-games/json/steam-id/all-steam-id.txt"
		steam_games=$(cat "/tmp/regataos-gcs/config/steam-games/json/steam-id/all-steam-id.txt" | head -1)

		if test ! -e "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json"; then
			wget --no-check-certificate -O "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json" \
			"http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F06912D875764FDC65C1880539873AE0&steamid=$steam_games&format=json&include_appinfo=true"
		fi

		# Verify that the JSON file has the information Game Access needs
		if [[ $(grep -r "appid" "/tmp/regataos-gcs/config/steam-games/json/steam-id/$steam_games.json") != *"appid"* ]]; then
			echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
			rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
			rm -f /tmp/regataos-gcs/config/installed/*-steam.json
			rm -f /opt/regataos-gcs/games-list/*-steam.json
			rm -f /tmp/regataos-gcs/config/steam-games/img/*
			rm -f /tmp/regataos-gcs/config/steam-games/json/games/*

			if test ! -e /tmp/regataos-gcs/config/installed/*.json; then
				rm -f "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
			fi

		else
			if test -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
				rm -f "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
			fi
		fi

	else
		echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
		rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
		rm -f /tmp/regataos-gcs/config/installed/*-steam.json
		rm -f /opt/regataos-gcs/games-list/*-steam.json
		rm -f /tmp/regataos-gcs/config/steam-games/img/*
		rm -f /tmp/regataos-gcs/config/steam-games/json/games/*

		if test ! -e /tmp/regataos-gcs/config/installed/*.json; then
			rm -f "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
		fi
	fi
fi

# Run game processes only if necessary.
if test ! -e "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt" ;then
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

	# Check if the Steam game is still installed
	for i in /tmp/regataos-gcs/config/installed/*-steam.json; do
		file_id=$(echo $i | cut -d"/" -f 6- | cut -d"." -f -1)

		if ! test -e "$HOME/.local/share/Steam/steamapps/$file_id.acf"; then
			rm -f "/tmp/regataos-gcs/config/installed/$file_id-steam.json"
		fi
	done

	# Get game information and check if they are installed
	for i in $HOME/.local/share/Steam/steamapps/*.acf; do
		game_name="$(grep -R '"name"' $i | cut -d'"' -f 4- | cut -d'"' -f -1)"
		game_appid="$(grep -R '"appid"' $i | awk '{print $2}' | sed 's/"\|,//g')"
		echo "Installed game name: $game_name, ID: $game_appid"

		#Make the game name lowercase
		gamename_lowercase=$(echo "$game_name" | tr 'A-Z' 'a-z' | sed 's/: \|- \|(\|)\|, \|™\|\.//g')
		gamename_lowercase=$(echo $gamename_lowercase | sed 's/ \|-//g')
		echo "$gamename_lowercase"

		if [ ! -z $game_appid ];then
			if test -e "/tmp/regataos-gcs/config/steam-games/json/games/$gamename_lowercase-steam.json"; then
				cp -f "/tmp/regataos-gcs/config/steam-games/json/games/$gamename_lowercase-steam.json" "/tmp/regataos-gcs/config/installed/$gamename_lowercase-steam.json"
			fi
		fi
	done

	if test -e "/tmp/regataos-gcs/config/external-games-folder.txt"; then
		external_steam_folder=$(find "$(cat /tmp/regataos-gcs/config/external-games-folder.txt)" -type f -iname appmanifest_*.acf | head -1 | tail -2 | sed 's/appmanifest//' | cut -d'_' -f -1 | sed 's/steamapps\//steamapps/')

		if test -e "$HOME/.local/share/Steam/config/libraryfolders.vdf"; then
			get_external_lib_dir="$(echo "$external_steam_folder" | sed 's|/steamapps||')"

			if [[ $(grep -r "$get_external_lib_dir" "$HOME/.local/share/Steam/config/libraryfolders.vdf") == *"$get_external_lib_dir"* ]]; then
				for i in "$(echo "$external_steam_folder")"/*acf; do
					game_name="$(grep -R '"name"' "$i" | cut -d'"' -f 4- | cut -d'"' -f -1)"
					game_appid="$(grep -R '"appid"' "$i" | awk '{print $2}' | sed 's/"\|,//g')"
					echo "Installed game name: $game_name, ID: $game_appid"

					#Make the game name lowercase
					gamename_lowercase=$(echo "$game_name" | tr 'A-Z' 'a-z' | sed 's/: \|- \|(\|)\|, \|™\|\.//g')
					gamename_lowercase=$(echo $gamename_lowercase | sed 's/ \|-//g')
					echo "$gamename_lowercase"

					if [ ! -z $game_appid ];then
						if test -e "/tmp/regataos-gcs/config/steam-games/json/games/$gamename_lowercase-steam.json"; then
							cp -f "/tmp/regataos-gcs/config/steam-games/json/games/$gamename_lowercase-steam.json" "/tmp/regataos-gcs/config/installed/$gamename_lowercase-steam.json"
						fi
					fi
				done
			fi
		fi
	fi
fi

# Check if a game is still in the installed or downloading list
for i in /tmp/regataos-gcs/config/installed/*-steam.json; do
	game_name="$(grep -R '"gamenickname"' $i | cut -d'"' -f 4- | cut -d'"' -f -1)"
	game_id="$(grep -R '"gameid"' $i | awk '{print $2}' | sed 's/"\|,//g')"

	if test ! -e "$HOME/.local/share/Steam/steamapps/appmanifest_$(echo $game_id).acf"; then
		if test -e "/tmp/regataos-gcs/config/external-games-folder.txt"; then
			external_steam_folder=$(find "$(echo $(cat /tmp/regataos-gcs/config/external-games-folder.txt))" -type f -iname "appmanifest_$(echo $game_id).acf")

			if test ! -e "$(echo "$external_steam_folder")"; then
				rm -f "/tmp/regataos-gcs/config/installed/$game_name-steam.json"
			fi

		else
			rm -f "/tmp/regataos-gcs/config/installed/$game_name-steam.json"
		fi
	fi
done

if [[ $(grep -r SteamID $HOME/.local/share/Steam/config/config.vdf | awk '{print $1}') != *"SteamID"* ]]; then
	echo "No Steam games" > "/tmp/regataos-gcs/config/steam-games/no-steam-games.txt"
	rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt"
	rm -f /tmp/regataos-gcs/config/installed/*-steam.json
	rm -f /opt/regataos-gcs/games-list/*-steam.json
	rm -f /tmp/regataos-gcs/config/steam-games/img/*
	rm -f /tmp/regataos-gcs/config/steam-games/json/games/*

    if [[ $(ls "/tmp/regataos-gcs/config/installed/") != *"json"* ]]; then
		rm -f "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
	fi
fi

# Check if there are JSON files of the games to display the Steam option in the menu
if [[ $(ls "/tmp/regataos-gcs/config/steam-games/json/games/") == *"steam.json"* ]]; then
	echo "show steam games" > "/tmp/regataos-gcs/config/steam-games/show-menu-steam.txt"
else
	rm -f "/tmp/regataos-gcs/config/steam-games/show-menu-steam.txt"
fi
