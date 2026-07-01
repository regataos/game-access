#!/bin/bash
#

# Download compatibility mode
if test ! -e "/opt/wine-gcs/bin/wine"; then
	/opt/regataos-gcs/scripts/install/scripts-install/download-wine-gcs.sh start
fi

# Capture game information
game_nickname="$(cat /tmp/regataos-gcs/start-installation-gog.txt)"

#Clear cache
rm -f "/tmp/regataos-gcs/start-installation-gog.txt"

game_name="$(grep -r "gamename" $HOME/.config/regataos-gcs/gog-games/json/$game_nickname-gog.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
game_id="$(grep -r "gameid" $HOME/.config/regataos-gcs/gog-games/json/$game_nickname-gog.json | cut -d":" -f 2- | sed 's/ //' | sed 's/"\|,//g')"
installation_path="$GAME_PATH"

# Import the game
(
	# Import the game from GOG with gogdl
	/opt/regataos-gcs/tools/gogdl/gogdl import "$game_id" "$installation_path/" 2>&1 | (pv -n >/var/log/regataos-logs/importing-$game_nickname-gog.log)

	# Put the game in the installed list
	cp -f "$HOME/.config/regataos-gcs/gog-games/json/$game_nickname-gog.json" \
		"$HOME/.config/regataos-gcs/installed/$game_nickname-gog.json"

	echo "show installed games" >"/tmp/regataos-gcs/config/installed/show-installed-games-gog.txt"
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
