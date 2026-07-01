#!/bin/bash
#

# Capture game information
launcher="gog"
game_nickname="$(cat /tmp/regataos-gcs/start-uninstallation-$launcher.txt)"

#Clear cache
echo "$game_nickname" >"/tmp/regataos-gcs/game-to-hide.txt"
rm -f "/tmp/regataos-gcs/start-uninstallation-$launcher.txt"

game_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/$launcher-games/json/$game_nickname-$launcher.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/$launcher-games/json/$game_nickname-$launcher.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"

# Uninstall game
(
	# Remove game from installed list
	rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname-$launcher.json"

	# Uninstall game from GOG with gogdl
	/opt/regataos-gcs/tools/gogdl/gogdl uninstall "$game_id" 2>&1 | (pv -n >/var/log/regataos-logs/uninstall-$game_nickname-$launcher.log)

	# Check for installed games from the GOG
	if test ! -e $HOME/.config/regataos-gcs/installed/*-$launcher.json; then
		rm -f "$HOME/.config/regataos-gcs/installed/show-installed-games-$launcher.txt"
	else
		echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-$launcher.txt"
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
if [[ $(echo $check_installed_games) != *"$launcher.json"* ]]; then
	rm -f "$directory_installed_json/show-installed-games-$launcher.txt"
fi

# Check UI status
file_status="/tmp/regataos-gcs/config/file-status.txt"
echo "rearrange game blocks" > "$file_status"
