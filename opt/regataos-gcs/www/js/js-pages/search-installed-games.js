// Verify that Epic Games Store has been logged in and search for games
function run_search_epicstore_games() {
	const exec = require('child_process').exec;
	var command_line = 'if [[ $(ls "$HOME/.config/regataos-gcs/epicstore-games/json/" | grep json) == *".json"* ]]; then /bin/bash /opt/regataos-gcs/scripts/search-epicstore-games.sh; fi';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}
run_search_epicstore_games();

// Search for installed games
function run_search_installed_games() {
	const exec = require('child_process').exec;
	var command_line = '/opt/regataos-gcs/scripts/search-installeds start';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}
run_search_installed_games();
