#!/bin/bash
#

# Download compatibility mode
if test ! -e "/opt/wine-gcs/bin/wine"; then
	/opt/regataos-gcs/scripts/install/scripts-install/download-wine-gcs.sh start
fi

# Capture game information
game_nickname="$(cat /tmp/regataos-gcs/start-installation-amazon.txt)"

#Clear cache
rm -f "/tmp/regataos-gcs/start-installation-amazon.txt"

game_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
installation_path="$GAME_PATH"

# Import the game
(
	# Import the game from Amazon Games with nile tool
	/opt/regataos-gcs/tools/nile/nile import "$game_id" --path "$installation_path/" 2>&1 | (pv -n >/var/log/regataos-logs/importing-$game_nickname-amazon.log)

	# Put the game in the installed list
	cp -f "$HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json" \
		"$HOME/.config/regataos-gcs/installed/$game_nickname-amazon.json"

	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-amazon.txt"
	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games.txt"

) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
	--title "Regata OS Game Access" \
	--text "<big>Importing the $game_name game.\nThis may take a few minutes...</big>" \
	--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' \
	"$game_name imported successfully!" "$game_name was imported successfully."

# Check UI status
file_status="/tmp/regataos-gcs/config/file-status.txt"
echo "rearrange game blocks" > "$file_status"
sleep 2
echo "rearrange game blocks" > "$file_status"
