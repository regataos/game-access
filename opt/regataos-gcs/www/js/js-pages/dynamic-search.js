// This script helps to dynamically search the game
function search() {
const fs = require('fs');

// Read the JSON file with the list of games
fs.readdirSync("/opt/regataos-gcs/www/js/js-pages/games-list").forEach(files => {
fs.readFile("/opt/regataos-gcs/www/js/js-pages/games-list/" +files , "utf8", function(err, data) {
if(!err) {
var games = JSON.parse(data);

for (var i = 0; i < games.length; i++) {

	// Capture the game nickname, user search and game keywords
	var data_game = games[i].gamenickname
	var data_keywords = games[i].gamekeywords
	var search = fs.readFileSync("/tmp/regataos-gcs/search.txt", "utf8");

		// Check which games are related to the search and display them
		if (data_keywords.indexOf(search) > -1) {
		$(document).ready(function() {
			$(".title-top").css("display", "block")
			$(".title-top2").css("display", "block")
			$(".noresultsfound").css("display", "none")
			$("." + data_game).css("display", "block")
		});
		} else {
		$(document).ready(function() {
			$("." + data_game).css("display", "none")
		});
		}
	}
	return;
}
});
});
}

search();
