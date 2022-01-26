// Verify that Epic Games Store has been logged in and search for games
const search_epicstore_timeout = setTimeout(run_search_epicstore_games, 2500);

function run_search_epicstore_games() {
	const exec = require('child_process').exec;
	var command_line = 'if [[ $(ls "$HOME/.config/regataos-gcs/epicstore-games/json/" | grep json) == *".json"* ]]; then \
	/opt/regataos-gcs/scripts/search-epicstore-games.sh start; \
	fi';
	exec(command_line,function(error,call,errlog){
	});
}
run_search_epicstore_games();

// Search for installed games
const search_installed_timeout = setTimeout(run_search_installed_games, 2000);

function run_search_installed_games() {
	const exec = require('child_process').exec;
	var command_line = '/opt/regataos-gcs/scripts/search-installeds';
	exec(command_line,function(error,call,errlog){
	});
}

// Show suggested games or titles available in the user's library
function run_search_gog_games() {
	const exec = require('child_process').exec;
	var command_line = '/opt/regataos-gcs/scripts/search-gog-games.sh; /opt/regataos-gcs/scripts/search-installed-games-gog.sh';
	exec(command_line,function(error,call,errlog){
	});
}
run_search_gog_games()

setTimeout(function(){
	setInterval(function(){
		run_search_gog_games()
	}, 1000);
}, 1000);
