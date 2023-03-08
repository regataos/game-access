#!/bin/bash
#

# Capture game information
game_nickname="$(cat /tmp/regataos-gcs/start-installation-gcs.txt)"
rm -f "/tmp/regataos-gcs/start-installation-gcs.txt"

game_name="$(grep -r "gamename" "/opt/regataos-gcs/games-list/$game_nickname.json" | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_plataform="$(grep -r "plataform" "/opt/regataos-gcs/games-list/$game_nickname.json" | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime="$(grep -r "custom_runtime" "/opt/regataos-gcs/games-list/$game_nickname.json" | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime_download="$(grep -r "custom_runtime_download" "/opt/regataos-gcs/games-list/$game_nickname.json" | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime_file="$(grep -r "custom_runtime_file" "/opt/regataos-gcs/games-list/$game_nickname.json" | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
custom_runtime_name="$(grep -r "custom_runtime_name" "/opt/regataos-gcs/games-list/$game_nickname.json" | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"

# Import the game
(
	# Prepare wineprefix to run the launcher and games
	if [[ $(echo $game_plataform) == *"windows"* ]]; then
		# For custom runtime
		if [[ $(echo $custom_runtime) == *"true"* ]]; then
			# Prepare custom runtime
			if test ! -e "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name"; then
				mkdir -p "$HOME/.config/regataos-gcs/custom-runtime"

				if test ! -e "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"; then
					wget --no-check-certificate -O "/tmp/regataos-gcs/$custom_runtime_file" "$custom_runtime_download"
				fi

				if [[ $(echo $custom_runtime_file) == *".tar.xz"* ]]; then
					tar xf "/tmp/regataos-gcs/$custom_runtime_file" -C "$HOME/.config/regataos-gcs/custom-runtime/"
				fi

				echo "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name" >"$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"
				rm -f "/tmp/regataos-gcs/$custom_runtime_file"
			fi
		fi

		# Prepare symlink for compatibility mode.
		ln -sf "$(echo $GAME_PATH)" "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"

		if [[ "$(echo $GAME_PATH)" != *"$HOME/Game Access"* ]]; then
			ln -sf "$(echo $GAME_PATH)" "$HOME/Game Access/"
		fi

	else
		if [[ "$(echo $GAME_PATH)" != *"$HOME/Game Access"* ]]; then
			ln -sf "$(echo $GAME_PATH)" "$HOME/Game Access/"
		fi
	fi

	# Put the game in the installed list
	cp -f "/opt/regataos-gcs/games-list/$game_nickname.json" "$HOME/.config/regataos-gcs/installed/$game_nickname.json"
	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"

) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
	--title "Regata OS Game Access" \
	--text "<big>Importing the $game_name game.\nThis may take a few minutes...</big>" \
	--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' "$game_name imported successfully!" "$game_name was imported successfully."
