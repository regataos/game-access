#!/bin/bash

allSuggestedGames="/opt/regataos-gcs/games-list"
gogGamesNoLongerSuggested="/tmp/regataos-gcs/config/gog-games/json-old"

# Move suggested games JSON files to JSON files created from user library on GOG Galaxy
function move_suggested_games() {
	mkdir -p "$gogGamesNoLongerSuggested/"
	mv -fv "$allSuggestedGames/awp.json" "$gogGamesNoLongerSuggested/awp.json"
	mv -fv "$allSuggestedGames/fallout3.json" "$gogGamesNoLongerSuggested/fallout3.json"
	mv -fv "$allSuggestedGames/lost-ember.json" "$gogGamesNoLongerSuggested/lost-ember.json"
	mv -fv "$allSuggestedGames/mrr-edge.json" "$gogGamesNoLongerSuggested/mrr-edge.json"
	mv -fv "$allSuggestedGames/ptnn.json" "$gogGamesNoLongerSuggested/ptnn.json"
	mv -fv "$allSuggestedGames/sniper-contracts.json" "$gogGamesNoLongerSuggested/sniper-contracts.json"
	mv -fv "$allSuggestedGames/sniper3.json" "$gogGamesNoLongerSuggested/sniper3.json"
	mv -fv "$allSuggestedGames/tw2.json" "$gogGamesNoLongerSuggested/tw2.json"
	mv -fv "$allSuggestedGames/tw3.json" "$gogGamesNoLongerSuggested/tw3.json"
}

# Restore suggested games JSON files for GOG Galaxy
function restore_suggested_games() {
	if test -e "$gogGamesNoLongerSuggested" && [[ $(ls "$gogGamesNoLongerSuggested/") == *".json"* ]]; then
		mv -fv "$gogGamesNoLongerSuggested/awp.json" "$allSuggestedGames/awp.json"
		mv -fv "$gogGamesNoLongerSuggested/fallout3.json" "$allSuggestedGames/fallout3.json"
		mv -fv "$gogGamesNoLongerSuggested/lost-ember.json" "$allSuggestedGames/lost-ember.json"
		mv -fv "$gogGamesNoLongerSuggested/mrr-edge.json" "$allSuggestedGames/mrr-edge.json"
		mv -fv "$gogGamesNoLongerSuggested/ptnn.json" "$allSuggestedGames/ptnn.json"
		mv -fv "$gogGamesNoLongerSuggested/sniper-contracts.json" "$allSuggestedGames/sniper-contracts.json"
		mv -fv "$gogGamesNoLongerSuggested/sniper3.json" "$allSuggestedGames/sniper3.json"
		mv -fv "$gogGamesNoLongerSuggested/tw2.json" "$allSuggestedGames/tw2.json"
		mv -fv "$gogGamesNoLongerSuggested/tw3.json" "$allSuggestedGames/tw3.json"

		# Clear cache
		rm -fv $allSuggestedGames/*-gog.json
		rm -fv /tmp/regataos-gcs/config/installed/*-gog.json
		rm -fv /tmp/regataos-gcs/config/installed/show-installed-games-gog.txt

		if test -e "$HOME/.config/regataos-gcs/gog-games/gamedb.json"; then
			rm -fv "$HOME/.config/regataos-gcs/gog-games/gamedb.json"
		fi
	fi
}

# Make sure the GOG Galaxy client is installed to start collecting user game data
if [[ $(cat "$HOME/.config/regataos-gcs/installed-launchers.conf") == *"gog"* ]]; then
	user=$(users | awk '{print $1}')
	if [[ $(grep -r userId "$HOME/.local/share/wineprefixes/gog-compatibility-mode/drive_c/users/$user/AppData/Local/GOG.com/Galaxy/Configuration/config.json") == *"userId"* ]]; then
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
				echo "gamedb.json: No such file or directory!"
				restore_suggested_games
			fi
		else
			echo "galaxy-2.0.db: No such file or directory!"
			restore_suggested_games
		fi
	else
		echo "The "userId" was not found!"
		restore_suggested_games
	fi
else
	echo "GOG Galaxy is not installed!"
	restore_suggested_games
fi
