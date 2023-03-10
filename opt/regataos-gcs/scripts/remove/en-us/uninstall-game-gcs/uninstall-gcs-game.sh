#!/bin/bash
#

# Settings and variables
game_name="$(grep -r "gamename" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_folder="$(grep -r "gamefolder" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_nickname="$(grep -r "gamenickname" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"

# Uninstall game
(
	# Remove game folder
	if test -e "$HOME/Game Access/$game_folder/gcs-game.conf"; then
		rm -rf "$(cat "$HOME/Game Access/$game_folder/gcs-game.conf" | grep installdir | cut -d"=" -f 2-)"
	fi

	if test -e "$HOME/Game Access/$game_nickname/gcs-game.conf"; then
		rm -rf "$(cat "$HOME/Game Access/$game_folder/gcs-game.conf" | grep installdir | cut -d"=" -f 2-)"
	fi

	if test -e "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode/gcs-game.conf"; then
		rm -rf "$(cat "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode/gcs-game.conf" | grep installdir | cut -d"=" -f 2-)"
	fi

	rm -rf "$HOME/Game Access/$game_folder"
	rm -rf "$HOME/Game Access/$game_nickname"
	rm -rf "$HOME/.local/share/wineprefixes/$game_nickname-compatibility-mode"

	custom_runtime=$(cat "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt")
	rm -rf "$(echo $custom_runtime)"
	rm -f "$HOME/.config/regataos-gcs/custom-runtime/$game_nickname.txt"

	# Remove game from installed list
	rm -f "/tmp/regataos-gcs/config/installed/$game_nickname.json"

	# Check for installed games from the Epic Games Store
	if test ! -e /tmp/regataos-gcs/config/installed/*.json; then
		rm -f "/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		rm -f "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
	else
		echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games.txt"
	fi

	sleep 5
) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
	--title "Regata OS Game Access" \
	--text "<big>Uninstalling $game_name game.\nThis may take a few minutes...</big>" \
	--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' \
	"$game_name has been uninstalled!" "$game_name was successfully uninstalled."
