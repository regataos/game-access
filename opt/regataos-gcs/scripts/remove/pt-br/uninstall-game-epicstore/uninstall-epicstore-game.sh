#!/bin/bash 
#

# Capture game information
game_nickname="$(cat /tmp/regataos-gcs/start-uninstallation-epicstore.txt)"

#Clear cache
rm -f "/tmp/regataos-gcs/start-uninstallation-epicstore.txt"

game_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | awk '{print $2}' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/epicstore-games/json/$game_nickname-epicstore.json | awk '{print $2}' | sed 's/"\|,//g')"

# Uninstall game
(
	# Uninstall game from Epic Games Store with Legendary
	/opt/regataos-gcs/legendary/legendary uninstall -y $game_id 2>&1 | (pv -n > /var/log/regataos-logs/uninstall-$game_nickname-epicstore.log)

	# Remove game from installed list
	if test -e "$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"; then
		rm -f "$HOME/.config/regataos-gcs/installed/$game_nickname-epicstore.json"
	fi

) | env GTK_THEME=Adwaita:dark zenity --progress --pulsate --width 450 --window-icon "/usr/share/pixmaps/regataos-gcs.png" \
--title "Regata OS Game Access" \
--text "<big>Desinstalando o jogo $game_name.\nIsso pode levar alguns minutos...</big>" \
--auto-close --auto-kill --no-cancel

# Notify
notify-send -i regataos-gcs -u normal -a 'Regata OS Game Access' \
"$game_name foi desinstalado!" "$game_name foi desinstalado com sucesso."
