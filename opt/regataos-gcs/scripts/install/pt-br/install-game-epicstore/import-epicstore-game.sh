#!/bin/bash
#

# Capture game information
game_nickname="$(cat /tmp/regataos-gcs/start-installation-epicstore.txt)"

#Clear cache
rm -f "/tmp/regataos-gcs/start-installation-epicstore.txt"

game_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
installation_path="$GAME_PATH"

# Import the game
(
	# Import the game from Epic Games Store with Legendary
	/opt/regataos-gcs/tools/legendary/legendary import -y "$game_id" "$installation_path/" 2>&1 | (pv -n >/var/log/regataos-logs/importing-$game_nickname-epicstore.log)

	# Put the game in the installed list
	cp -f "$HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json" \
		"$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"

	# Fix for games
	cp -f "/opt/regataos-gcs/tools/legendary/config.ini" "$HOME/.config/legendary/config.ini"

	# Automatically sync all games with the Epic Games Launcher
	if [[ $(cat /tmp/regataos-gcs/config/installed-launchers.conf) == *"epicstore"* ]]; then
		PREFIX_LOCATION="$HOME/.local/share/wineprefixes/epicstore-compatibility-mode"
		MANIFESTS_DIR="$PREFIX_LOCATION/drive_c/ProgramData/Epic/EpicGamesLauncher/Data/Manifests"

		/opt/regataos-gcs/tools/legendary/legendary -y egl-sync \
		--egl-manifest-path "$MANIFESTS_DIR" \
		--egl-wine-prefix "$PREFIX_LOCATION"

		# Fix the game install location in the Manifest file for the Epic Games Store.
		checkFiles="$(ls $MANIFESTS_DIR | grep .item)"
		if [[ $checkFiles == *".item"* ]]; then
			for manifest in $checkFiles; do
				checkInstallLocation=$(cat "$MANIFESTS_DIR/$manifest" | grep InstallLocation | cut -d':' -f 2- | sed 's/ "//' | sed 's/",//')

				if [[ $checkInstallLocation != *"Z:\\"* ]]; then
					echo -e 'Fix Manifest the "'"$manifest"'" file to show the game in Epic Games Store launcher.\n'
					echo -e "Old install path: $checkInstallLocation\n"

					oldInstallPath=$(cat "$MANIFESTS_DIR/$manifest" | grep InstallLocation | cut -d':' -f 2- | sed "s/ //" | sed 's/",//')
					newInstallPathShow=$(echo "$oldInstallPath" | sed 's|"\/|Z:\\\\|g' | sed 's|\/|\\\\|g')
					echo "New install path: $newInstallPathShow"

					newInstallPath=$(echo "$oldInstallPath" | sed 's|"\/|Z:\\\\\\\\|g' | sed 's|\/|\\\\\\\\|g')
					sed -i "s|$oldInstallPath|$newInstallPath|g" "$MANIFESTS_DIR/$manifest"
				fi
			done
		fi
	fi

	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-epic.txt"
	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games.txt"

) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
	--title "Regata OS Game Access" \
	--text "<big>Importando o jogo $game_name.\nIsso pode levar alguns minutos...</big>" \
	--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' \
	"$game_name importado com sucesso!" "$game_name foi importado com sucesso."

# Check UI status
file_status="/tmp/regataos-gcs/config/file-status.txt"
echo "rearrange game blocks" > "$file_status"
sleep 2
echo "rearrange game blocks" > "$file_status"
