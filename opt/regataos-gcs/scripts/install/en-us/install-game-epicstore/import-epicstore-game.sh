#!/bin/bash 
#

# Capture game information
game_nickname="$(cat /tmp/regataos-gcs/start-installation-epicstore.txt)"

#Clear cache
rm -f "/tmp/regataos-gcs/start-installation-epicstore.txt"

game_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | awk '{print $2}' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | awk '{print $2}' | sed 's/"\|,//g')"
installation_path="$GAME_PATH"

# Import the game
(
	# Import the game from Epic Games Store with Legendary
	/opt/regataos-gcs/legendary/legendary import-game -y "$game_id" "$installation_path/" 2>&1 | (pv -n > /var/log/regataos-logs/importing-$game_nickname-epicstore.log)

	# Put the game in the installed list
	cp -f "$HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json" \
	"$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"

	echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-epic.txt"

) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
--title "Regata OS Game Access" \
--text "<big>Importing the $game_name game.\nThis may take a few minutes...</big>" \
--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' \
"$game_name imported successfully!" "$game_name was imported successfully."
