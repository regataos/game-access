// This script helps to dynamically search the game
function search() {
	const fs = require('fs');

	// Read the JSON file with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
	fs.readFile("/opt/regataos-gcs/games-list/" + files, "utf8", function(err, data) {
	if(!err) {
		let games = JSON.parse(data);
		games.forEach(gamesdata => {
			if (typeof gamesdata.gamekeywords.en !== "undefined") {
				let gamenickname = gamesdata.gamenickname
				let search = fs.readFileSync("/tmp/regataos-gcs/search.txt", "utf8");
				let gamekeywords_gcs_en = gamesdata.gamekeywords.en
				let gamekeywords_gcs_pt = gamesdata.gamekeywords.pt

				if (search.length >= 2) {
					if ((gamekeywords_gcs_en.indexOf(search) > -1) == "1") {
						$(".title-top").css("display", "block")
						$(".title-top2").css("display", "block")
						$(".noresultsfound").css("display", "none")
						$("." + gamenickname).css("display", "block")

					} else if ((gamekeywords_gcs_pt.indexOf(search) > -1) == "1") {
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

			} else {
				let gamenickname = gamesdata.gamenickname
				let search = fs.readFileSync("/tmp/regataos-gcs/search.txt", "utf8");
				let gamekeywords = gamesdata.gamekeywords

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
			}
		});
		return;
	}
	});
	});
}

search();
