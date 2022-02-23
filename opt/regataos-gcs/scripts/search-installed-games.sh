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

if test ! -e "/tmp/regataos-gcs/config/installed-games.conf" ; then
	echo "" > "/tmp/regataos-gcs/config/installed-games.conf"
fi

if test ! -e "/tmp/regataos-gcs/config/game-install-dir.conf" ; then
	echo "" > "/tmp/regataos-gcs/config/game-install-dir.conf"
fi

# Check if the game installation directory exists, looking for the game executable
function search_installed_games() {
	if test -e "/tmp/regataos-gcs/config/external-games-folder.txt"; then
		game_dir=$(find "$(cat /tmp/regataos-gcs/config/external-games-folder.txt)" "$HOME/Game Access" -type f -iname "$(echo "$game_executable" | sed 's/ //')")
	else
		game_dir=$(find "$HOME/Game Access" -type f -iname "$(echo "$game_executable" | sed 's/ //')")
	fi

	if [[ $(echo "$game_dir") != *"steamapps"* ]]; then
		if [[ $(echo "$game_dir" | tr 'A-Z' 'a-z') == *"$(echo "$game_executable" | tr 'A-Z' 'a-z' | sed 's/ //')"* ]]; then
			if [[ $(grep -wr "$(echo "$game_executable" | tr 'A-Z' 'a-z' | sed 's/ //')" "/tmp/regataos-gcs/config/game-install-dir.conf") != *"$game_dir"* ]]; then
				if [[ $(grep -r "$game_nickname" "/tmp/regataos-gcs/config/game-install-dir.conf") != *"$game_nickname"* ]]; then
					echo "$game_nickname: $game_dir"
					echo "$game_nickname=$game_dir" >> "/tmp/regataos-gcs/config/game-install-dir.conf"
					sed -i '/^$/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
					sed -i '/.egstore/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
					cp -f "/opt/regataos-gcs/games-list/$game_nickname.json" "/tmp/regataos-gcs/config/installed/$game_nickname.json"
				fi
			fi
		fi

	else
		echo "$game_nickname: game not installed or not found."
		game_dir_cache=$(grep -wr "$(echo "$game_executable" | sed 's/ //')" "/tmp/regataos-gcs/config/game-install-dir.conf")
		echo $game_dir_cache
		if [[ $game_dir_cache == *"$(echo "$game_executable" | sed 's/ //')"* ]]; then
			sed -i "/\($(echo "$game_executable" | sed 's/ //')\)/d" "/tmp/regataos-gcs/config/game-install-dir.conf"
			sed -i '/^$/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
			sed -i '/.egstore/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
			rm -f "/tmp/regataos-gcs/config/installed/$game_nickname.json"
		fi
	fi

	# If the executable was found, add the name of the game to the list of installed games
	if [[ $(grep -wr "$game_nickname" "/tmp/regataos-gcs/config/game-install-dir.conf") == *".exe"* ]]; then
		if [[ $(grep -wr "$game_nickname" "/tmp/regataos-gcs/config/installed-games.conf") != *"$game_nickname"* ]]; then
			echo "$game_nickname" >> "/tmp/regataos-gcs/config/installed-games.conf"
			sed -i '/^$/d' "/tmp/regataos-gcs/config/installed-games.conf"
			sed -i '/.egstore/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
		fi
	else
		if [[ $(grep -wr "$game_nickname" "/tmp/regataos-gcs/config/installed-games.conf") == *"$game_nickname"* ]]; then
			sed -i "s/$game_nickname//" "/tmp/regataos-gcs/config/installed-games.conf"
			sed -i '/^$/d' "/tmp/regataos-gcs/config/installed-games.conf"
			sed -i '/.egstore/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
		fi
	fi
}

# Get game information and check if they are installed
installed_launchers=$(cat "/tmp/regataos-gcs/config/installed-launchers.conf")
launcher_blacklist=$(cat "/opt/regataos-gcs/scripts/blacklist-launchers-from-game-search.txt")

for i in /opt/regataos-gcs/games-list/*.json; do
	game_nickname="$(grep -R '"gamenickname":' $i | awk '{print $2}' | sed 's/"\|,//g')"
	game_executable="$(grep -R '"gameexecutable":' $i | awk -F: '{print $2 $3}' | sed 's/"\|,//g')"
	game_launcher="$(grep -R '"launchernickname":' $i | awk '{print $2}' | sed 's/"\|,//g')"
	game_origin="$(grep -R '"gameorigin":' $i | awk '{print $2}' | sed 's/"\|,//g')"

	if [[ $(echo $game_origin) == *"suggestedgame"* ]]; then
		if [[ $(echo $installed_launchers) == *"$game_launcher"* ]]; then
			if [[ $(echo $launcher_blacklist) != *"$game_launcher"* ]]; then
				search_installed_games
			fi
		fi
	fi
done

# Check for installed games from the Epic Games Store
if test ! -e $HOME/.config/regataos-gcs/installed/*-epicstore.json; then
	rm -f "$HOME/.config/regataos-gcs/installed/show-installed-games-epic.txt"
else
	echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-epic.txt"
fi
