// This script helps to dynamically search the game
function search() {
const fs = require('fs');

// Read the JSON file with the list of games
fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
fs.readFile("/opt/regataos-gcs/games-list/" + files, "utf8", function(err, data) {
if(!err) {
	var games = JSON.parse(data);
	games.forEach(gamesdata => {

	// Capture the game nickname, user search and game keywords
	var gamenickname = gamesdata.gamenickname
	var gamekeywords = gamesdata.gamekeywords
	var search = fs.readFileSync("/tmp/regataos-gcs/search.txt", "utf8");

		// Check which games are related to the search and display them
		if (search.length >= 2) {
			if ((gamekeywords.indexOf(search) > -1) == "1") {
				$(".title-top").css("display", "block")
				$(".title-top2").css("display", "block")
				$(".noresultsfound").css("display", "none")
				$("." + gamenickname).css("display", "block")

			} else {
				$("." + gamenickname).css("display", "none")
			}

		} else {
			$(".app-block-universal").css("display", "none")
		}
	});
	return;
}
});
});
}

search();
