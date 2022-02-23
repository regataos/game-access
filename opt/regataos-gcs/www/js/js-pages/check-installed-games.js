// This script helps to dynamically check if the games are installed
function check_installed_games1() {
const fs = require('fs');

var files = [];

// Read the JSON file with the list of games
fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
fs.readFile("/opt/regataos-gcs/games-list/" +files , "utf8", function(err, data) {
if(!err) {
var games = JSON.parse(data);

for (var i = 0; i < games.length; i++) {
	// Capture the nicknames of the games and make sure they are in the list of installed games
    var url = window.location.href;
    var url_split1 = url.split("pages/")[1];
	var pagename = url_split1.replace('-games.html', '');

	if ((games[i].launchernickname.indexOf(pagename) > -1) == "1") {
		var gamename = games[i].gamenickname
		var installed_games = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");

		if (installed_games.indexOf(gamename) > -1) {
			var launchernickname = games[i].launchernickname;
			var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

			if (installed_launchers.indexOf(launchernickname) > -1) {
				$(document).ready(function() {
				$("." + gamename + " .block-play .install-box").css("display", "none");
				$("." + gamename + " .block-play .play-box").css("display", "block");
				});

			} else {
				$(document).ready(function() {
				$("." + gamename + " .block-play .install-box").css("display", "block");
				$("." + gamename + " .block-play .play-box").css("display", "none");
				});
			} 

		} else {
			$(document).ready(function() {
			$("." + gamename + " .block-play .install-box").css("display", "block");
			$("." + gamename + " .block-play .play-box").css("display", "none");
			});
		}
	}
}
	return;
}
});
});
}

function check_installed_games2() {
const fs = require('fs');

var files = [];

// Read the JSON file with the list of games
fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
fs.readFile("/opt/regataos-gcs/games-list/" +files , "utf8", function(err, data) {
if(!err) {
var games = JSON.parse(data);

for (var i = 0; i < games.length; i++) {

	// Capture the nicknames of the games and make sure they are in the list of installed games
	var gamename = games[i].gamenickname
	var installed_games = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");

	if (installed_games.indexOf(gamename) > -1) {
		var launchernickname = games[i].launchernickname;
		var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

		if (installed_launchers.indexOf(launchernickname) > -1) {
			$(document).ready(function() {
			$("." + gamename + " .block-play .install-box").css("display", "none");
			$("." + gamename + " .block-play .play-box").css("display", "block");
			});

		} else {
			$(document).ready(function() {
			$("." + gamename + " .block-play .install-box").css("display", "block");
			$("." + gamename + " .block-play .play-box").css("display", "none");
			});
		} 

	} else {
		$(document).ready(function() {
		$("." + gamename + " .block-play .install-box").css("display", "block");
		$("." + gamename + " .block-play .play-box").css("display", "none");
		});
	}
}
	return;
}
});
});
}

var url = window.location.href;
if ((url.indexOf("-games") > -1) == "1") {
	check_installed_games1();
	
	setTimeout(function(){
		setInterval(function(){
			check_installed_games1();
		}, 5000);
	}, 5000);	
} else {
	check_installed_games2();
	
	setTimeout(function(){
		setInterval(function(){
			check_installed_games2();
		}, 5000);
	}, 5000);	
}
