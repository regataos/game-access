// This script dynamically fetches the games installation directory when searching for game executables

function search_installed_games() {
const exec = require('child_process').exec;
const fs = require('fs');

var files = [];

// Read the JSON file with the list of games
fs.readdirSync("/opt/regataos-gcs/www/js/js-pages/games-list").forEach(files => {
fs.readFile("/opt/regataos-gcs/www/js/js-pages/games-list/" +files , "utf8", function(err, data) {
if(!err) {
var games = JSON.parse(data);

for (var i = 0; i < games.length; i++) {

	// Capture the nicknames of the games and make sure they are in the list of installed games
	var launcher = games[i].game_access
	if (launcher.indexOf("true") > -1) {
		var gamenickname = games[i].gamenickname
		var gameexecutable = games[i].gameexecutable

		var command_line = "/opt/regataos-gcs/scripts/search-installed-games " + gamenickname + " " + gameexecutable;
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}

}
	return;
}
});
});
}

search_installed_games();

setTimeout(function(){
	setInterval(function(){
		search_installed_games();
	}, 30000);
}, 30000);
