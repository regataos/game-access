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

				if test -e "$GAME_PATH/$custom_runtime_name"; then
					ln -sf "$GAME_PATH/$custom_runtime_name" "$HOME/.config/regataos-gcs/custom-runtime/"
					echo "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name" \
						>"$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"

				else
					if test ! -e "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"; then
						wget --no-check-certificate -O "$GAME_PATH/$custom_runtime_file" "$custom_runtime_download"
					fi

					if [[ $(echo $custom_runtime_file) == *".tar.xz"* ]]; then
						tar xf "$GAME_PATH/$custom_runtime_file" -C "$GAME_PATH/"
					fi

					ln -sf "$GAME_PATH/$custom_runtime_name" "$HOME/.config/regataos-gcs/custom-runtime/"
					echo "$HOME/.config/regataos-gcs/custom-runtime/$custom_runtime_name" \
						>"$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"

					rm -f "$GAME_PATH/$custom_runtime_file"
				fi
			fi
		fi

		# Prepare symlink for compatibility mode.
		mkdir -p "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"

		for f in "$(echo "$GAME_PATH")"/*; do
			file_name=$(echo $f | sed 's|/| |g' | awk '{print $NF}')

			if [[ $(echo $file_name) != *"dosdevices"* ]]; then
				ln -sf "$f" "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode/"
			fi
		done

		rm -rf "$GAME_PATH/dosdevices"
		ln -sf "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode/dosdevices" "$GAME_PATH/dosdevices"

		if [[ "$(echo $GAME_PATH)" != *"$HOME/Game Access"* ]]; then
			ln -sf "$(echo $GAME_PATH)" "$HOME/Game Access/"
		fi

		export WINEPREFIX="$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"
		wineboot -u

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
