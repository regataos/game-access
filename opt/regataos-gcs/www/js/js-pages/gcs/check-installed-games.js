// This script helps to dynamically check if the games are installed
function check_installed_games() {
const fs = require('fs');

var files = [];

// Read the JSON file with the list of games
fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
fs.readFile("/opt/regataos-gcs/games-list/" +files , "utf8", function(err, data) {
if(!err) {
var games = JSON.parse(data);

for (var i = 0; i < games.length; i++) {

	// Capture the nicknames of the games and make sure they are in the list of installed games
	var launcher = games[i].game_access
	if (launcher.indexOf("true") > -1) {
		var gamename = games[i].gamenickname
		var installed_games = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");

		if (installed_games.indexOf(gamename) > -1) {
		$(document).ready(function() {
			$("." + gamename + " .block-play .install-box").css("display", "none");
			$("." + gamename + " .block-play .play-box").css("display", "block");

			$(".run-button").css("display", "flex");
			$(".remove-button").css("display", "flex");
			$(".install-button").css("display", "none");
			$(".apps-configs").css("display", "block");
		});
		} else {
		$(document).ready(function() {
			$("." + gamename + " .block-play .install-box").css("display", "block");
			$("." + gamename + " .block-play .play-box").css("display", "none");

			$(".install-button").css("display", "flex");
			$(".run-button").css("display", "none");
			$(".remove-button").css("display", "none");
			$(".apps-configs").css("display", "none");
		});
		}
	}

}
	return;
}
});
});
}

check_installed_games();

setTimeout(function(){
	setInterval(function(){
		check_installed_games();
	}, 10000);
}, 10000);
