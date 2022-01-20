#!/bin/bash

# Move suggested games JSON files to JSON files created from user library on GOG Galaxy
function move_suggested_games() {
	directory_1="/opt/regataos-gcs/games-list"
	directory_2="/tmp/regataos-gcs/config/gog-games/json-old"
	mkdir -p "$directory_2/"

	mv -f "$directory_1/awp.json" "$directory_2/awp.json"
	mv -f "$directory_1/fallout3.json" "$directory_2/fallout3.json"
	mv -f "$directory_1/lost-ember.json" "$directory_2/lost-ember.json"
	mv -f "$directory_1/mrr-edge.json" "$directory_2/mrr-edge.json"
	mv -f "$directory_1/ptnn.json" "$directory_2/ptnn.json"
	mv -f "$directory_1/sniper-contracts.json" "$directory_2/sniper-contracts.json"
	mv -f "$directory_1/sniper3.json" "$directory_2/sniper3.json"
	mv -f "$directory_1/tw2.json" "$directory_2/tw2.json"
	mv -f "$directory_1/tw3.json" "$directory_2/tw3.json"
}

# Restore suggested games JSON files for GOG Galaxy
function restore_suggested_games() {
	directory_1="/tmp/regataos-gcs/config/gog-games/json-old"
	directory_2="/opt/regataos-gcs/games-list"

	mv -f "$directory_1/awp.json" "$directory_2/awp.json"
	mv -f "$directory_1/fallout3.json" "$directory_2/fallout3.json"
	mv -f "$directory_1/lost-ember.json" "$directory_2/lost-ember.json"
	mv -f "$directory_1/mrr-edge.json" "$directory_2/mrr-edge.json"
	mv -f "$directory_1/ptnn.json" "$directory_2/ptnn.json"
	mv -f "$directory_1/sniper-contracts.json" "$directory_2/sniper-contracts.json"
	mv -f "$directory_1/sniper3.json" "$directory_2/sniper3.json"
	mv -f "$directory_1/tw2.json" "$directory_2/tw2.json"
	mv -f "$directory_1/tw3.json" "$directory_2/tw3.json"

	# Clear cache
	rm -f $directory_2/*-gog.json
	rm -f /tmp/regataos-gcs/config/installed/*-gog.json
	rm -f /tmp/regataos-gcs/config/installed/show-installed-games-gog.txt

	if test -e "$HOME/.config/regataos-gcs/gog-games/gamedb.json"; then
		rm -f "$HOME/.config/regataos-gcs/gog-games/gamedb.json"
	fi
}

# Make sure the GOG Galaxy client is installed to start collecting user game data
if [[ $(cat "$HOME/.config/regataos-gcs/installed-launchers.conf") == *"gog"* ]]; then
	if [[ $(grep -r userId "$HOME/.local/share/wineprefixes/gog-compatibility-mode/drive_c/users/josue/AppData/Local/GOG.com/Galaxy/Configuration/config.json") == *"userId"* ]]; then
		# Use GOG-Galaxy-Export-Script to collect the data
		if test -e "$HOME/.local/share/wineprefixes/gog-compatibility-mode/drive_c/ProgramData/GOG.com/Galaxy/storage/galaxy-2.0.db"; then
			mkdir -p "$HOME/.config/regataos-gcs/gog-games/"
			python3 /opt/regataos-gcs/tools/gog-galaxy-export-script/galaxy_library_export.py -i "$HOME/.local/share/wineprefixes/gog-compatibility-mode/drive_c/ProgramData/GOG.com/Galaxy/storage/galaxy-2.0.db" -o "$HOME/.config/regataos-gcs/gog-games/gamedb.csv" -d ,

			cd "$HOME/.config/regataos-gcs/gog-games/"
			python3 /opt/regataos-gcs/tools/csv-to-json-converter/csv-to-json-converter.py

			# Rename suggested game json files
			if test -e "$HOME/.config/regataos-gcs/gog-games/gamedb.json"; then
				move_suggested_games
			else
				restore_suggested_games
			fi
		else
			restore_suggested_games
		fi
	else
		restore_suggested_games
	fi
else
	restore_suggested_games
fi
