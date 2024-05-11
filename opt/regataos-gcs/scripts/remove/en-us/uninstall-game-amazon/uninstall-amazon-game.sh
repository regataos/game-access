#!/bin/bash
#

# Capture game information
game_nickname="$(cat /tmp/regataos-gcs/start-uninstallation-amazon.txt)"

#Clear cache
echo "$game_nickname" >"/tmp/regataos-gcs/game-to-hide.txt"
rm -f "/tmp/regataos-gcs/start-uninstallation-amazon.txt"

game_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/amazon-games/json/$game_nickname-amazon.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"

# Uninstall game
(
	# Remove game from installed list
	rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname-amazon.json"

	# Uninstall game from Amazon Games with nile
	/opt/regataos-gcs/tools/nile/nile uninstall $game_id 2>&1 | (pv -n >/var/log/regataos-logs/uninstall-$game_nickname-amazon.log)

	# Check for installed games from the Amazon Games
	if test ! -e $HOME/.config/regataos-gcs/installed/*-amazon.json; then
		rm -f "$HOME/.config/regataos-gcs/installed/show-installed-games-amazon.txt"
	else
		echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-amazon.txt"
	fi

) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
	--title "Regata OS Game Access" \
	--text "<big>Uninstalling $game_name game.\nThis may take a few minutes...</big>" \
	--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' \
	"$game_name has been uninstalled!" "$game_name was successfully uninstalled."

# Check for JSON files in the directory listing installed games
check_installed_games=$(ls "/tmp/regataos-gcs/config/installed/")
if [[ $(echo $check_installed_games) != *"amazon.json"* ]]; then
	rm -f "$directory_installed_json/show-installed-games-amazon.txt"
fi

# Check UI status
file_status="/tmp/regataos-gcs/config/file-status.txt"
echo "rearrange game blocks" > "$file_status"
