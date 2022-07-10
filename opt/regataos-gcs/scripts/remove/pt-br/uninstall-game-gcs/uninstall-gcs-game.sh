#!/bin/bash 
#

# Settings and variables
game_name="$(grep -r "gamename" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_folder="$(grep -r "gamefolder" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_nickname="$(grep -r "gamenickname" /opt/regataos-gcs/games-list/$gameNickname.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"

# Uninstall game
(
	# Uninstall game from Epic Games Store with Legendary
	rm -rf "$HOME/Game Access/$game_folder"
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
		echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games-gcs.txt"
		echo "show installed games" > "/tmp/regataos-gcs/config/installed/show-installed-games.txt"
	fi

) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
--title "Regata OS Game Access" \
--text "<big>Desinstalando o jogo $game_name.\nIsso pode levar alguns minutos...</big>" \
--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' \
"$game_name foi desinstalado!" "$game_name foi desinstalado com sucesso."
