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
	game_dir=$(find /mnt /run/media /run/mount "$HOME/Game Access" -type f -iname "$(echo "$game_executable" | sed 's/ //')")
	echo "$game_dir"
	if [[ "$game_dir" == *"$(echo "$game_executable" | sed 's/ //')"* ]]; then
		if [[ $(grep -wr "$(echo "$game_executable" | sed 's/ //')" "/tmp/regataos-gcs/config/game-install-dir.conf") != *"$game_dir"* ]]; then
			echo "$game_nickname=$game_dir" >> "/tmp/regataos-gcs/config/game-install-dir.conf"
			sed -i '/^$/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
			sed -i '/.egstore/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
		fi

		# Apply corrections
		if [[ $(echo "$game_executable" | sed 's/ //') == *"Borderlands2.exe"* ]]; then
			sed -i '/.egstore/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
			/opt/regataos-gcs/scripts/specific-game-fixes/borderlands2.sh start
		fi

	else
		echo "Game not installed or not found."
		game_dir_cache=$(grep -wr "$(echo "$game_executable" | sed 's/ //')" "/tmp/regataos-gcs/config/game-install-dir.conf")
		echo $game_dir_cache
		if [[ $game_dir_cache == *"$(echo "$game_executable" | sed 's/ //')"* ]]; then
			sed -i "/\($(echo "$game_executable" | sed 's/ //')\)/d" "/tmp/regataos-gcs/config/game-install-dir.conf"
			sed -i '/^$/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
			sed -i '/.egstore/d' "/tmp/regataos-gcs/config/game-install-dir.conf"
		fi
	fi

	# If the executable was found, add the name of the game to the list of installed games
	if [[ $(grep -wr "$(echo "$game_executable" | sed 's/ //')" "/tmp/regataos-gcs/config/game-install-dir.conf") == *"$(echo "$game_executable" | sed 's/ //')"* ]]; then
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
for i in /opt/regataos-gcs/games-list/*.json; do
	game_nickname="$(grep -R '"gamenickname":' $i | awk '{print $2}' | sed 's/"\|,//g')"
	game_executable="$(grep -R '"gameexecutable":' $i | awk -F: '{print $2 $3}' | sed 's/"\|,//g')"
	game_launcher="$(grep -R '"launchernickname":' $i | awk '{print $2}' | sed 's/"\|,//g')"

	if [[ $(grep -wr "$game_launcher" "/tmp/regataos-gcs/config/installed-launchers.conf") == *"$game_launcher"* ]]; then
		search_installed_games
	fi
done
