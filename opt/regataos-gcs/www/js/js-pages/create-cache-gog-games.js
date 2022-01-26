// Create the cache with JSON files of games available in the user's GOG Galaxy account
function create_cache_gog_games() {
var fs = require("fs");

var files = [];

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/gog-games").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/gog-games/" + files, "utf8", function (err, data) {
if (!err) {
	var gog_games = JSON.parse(data);

	gog_games.forEach(games => {
		// Simplify game name to create a nickname
		let gamename_lowercase = games.originalTitle.toLowerCase();
		gamename_lowercase = gamename_lowercase.replace(/[:-]/g,"");
		gamename_lowercase = gamename_lowercase.replace(/[.]/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(|)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(,)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(>)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(_)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/[+®]/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(&)/g,"and")
		gamename_lowercase = gamename_lowercase.replace(/\s+/g,"-");
		gamename_lowercase = gamename_lowercase.replace(/'|\(|\)/g, "")
		gamename_lowercase = gamename_lowercase.replace(/[!-]/g,            '');
		gamename_lowercase = gamename_lowercase.replace(/[!?]/g,            '');
		gamename_lowercase = gamename_lowercase.replace(/(™)/g,             '');
		gamename_lowercase = gamename_lowercase.replace(/(ç)/g,             'c');
		gamename_lowercase = gamename_lowercase.replace(/(á)|(â)|(ã)|(à)/g, 'a');
		gamename_lowercase = gamename_lowercase.replace(/(é)|(ê)|(ẽ)/g,     'e');
		gamename_lowercase = gamename_lowercase.replace(/(í)/g,             'i');
		gamename_lowercase = gamename_lowercase.replace(/(ó)|(ô)|(ô)/g,     'o');
		gamename_lowercase = gamename_lowercase.replace(/(ü)|(ú)|(û)|(ũ)/g, 'u');

		let game_name = games.title;
		let game_img = games.backgroundImage;
		let game_keywords = gamename_lowercase.replace(/(-)/g," ");
		let game_installation_folder = games.title.replace(/[:-]/g,"");

		// If not, create the games JSON file
		if (!fs.existsSync('/tmp/regataos-gcs/config/gog-games/json/' + gamename_lowercase + '-gog.json')) {
			// Create JSON file with game information
    		const exec = require('child_process').exec;
			var command_line = 'echo "show loading" > "/tmp/regataos-gcs/show-loading-gog.txt"; \
			export game_name="' + game_name + '"; \
			export gamename_lowercase="' + gamename_lowercase + '"; \
			export gamekeywords="' + game_keywords + '"; \
			export for_id="' + game_img + '"; \
			export gameinstallfolder="' + game_installation_folder + '"; \
			/opt/regataos-gcs/scripts/create-cache-gog-games -create-gog-cache';
			exec(command_line,function(error,call,errlog){
			});

			$("div.loading").css("display", "block")
			$("div.loading-games").css("display", "block")
		}

		// Create JSON file with game information
		if (!fs.existsSync('/opt/regataos-gcs/games-list/' + gamename_lowercase + '-gog.json')) {
    		const exec = require('child_process').exec;
			var command_line = 'echo "show loading" > "/tmp/regataos-gcs/show-loading-gog.txt"; \
			export game_name="' + game_name + '"; \
			export gamename_lowercase="' + gamename_lowercase + '"; \
			export gamekeywords="' + game_keywords + '"; \
			export for_id="' + game_img + '"; \
			export gameinstallfolder="' + game_installation_folder + '"; \
			/opt/regataos-gcs/scripts/create-cache-gog-games -up-games-cache';
			exec(command_line,function(error,call,errlog){
			});

			$("div.loading").css("display", "block")
			$("div.loading-games").css("display", "block")
		}

		// Create local cache of images
		if (!fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + gamename_lowercase + '.webp')) {
    		const exec = require('child_process').exec;
			var command_line = 'echo "show loading" > "/tmp/regataos-gcs/show-loading-gog.txt"; wget --no-check-certificate -O "/tmp/regataos-gcs/config/gog-games/img/' + gamename_lowercase + '.webp" ' + '"' + game_img + '"';
			exec(command_line,function(error,call,errlog){
			});
		}
	})

	setTimeout(function(){
		const exec = require('child_process').exec;
		var command_line = 'rm -f "/tmp/regataos-gcs/show-loading-gog.txt"';
		exec(command_line,function(error,call,errlog){
		});
	}, 10000);

return;
}
});
});
}

// Start creating JSON files for games and images
var time_load_account_games = setInterval(create_cache_gog, 200);
function create_cache_gog() {
    const fs = require('fs');

	fs.access("/tmp/regataos-gcs/config/gog-games/gamedb.json", (err) => {
	if (!err) {
		create_cache_gog_games();
		const exec = require('child_process').exec;
		var command_line = '/opt/regataos-gcs/scripts/search-gog-games.sh';
		exec(command_line,function(error,call,errlog){
		});
		clearInterval(time_load_account_games);
		return;
	}
	});
}

// Show user game library loading message
function stop_loading_games() {
	var time_show_account_games = setInterval(show_account_games, 200);
	function show_account_games() {
		const fs = require('fs');

		fs.access("/tmp/regataos-gcs/show-loading-gog.txt", (err) => {
		if (err) {
			location.reload()
			clearInterval(time_show_account_games);
			return;
		}
		});
	}
}

var time_stop_load = setInterval(stop_loading, 200);
function stop_loading() {
	const fs = require('fs');

	fs.access("/tmp/regataos-gcs/show-loading-gog.txt", (err) => {
	if (!err) {
		stop_loading_games();
		clearInterval(time_stop_load);
	return;
	}
	});
}

// Refresh page when user logs out of GOG Galaxy
function refresh_page_logoff_start() {
	var time_refresh_on_logoff = setInterval(refresh_on_logoff, 200);
	function refresh_on_logoff() {
		const fs = require('fs');

		fs.access("/tmp/regataos-gcs/config/gog-games/gamedb.json", (err) => {
		if (err) {
			location.reload()
			clearInterval(time_refresh_on_logoff);
			return;
		}
		});
	}
}

var time_refresh_page_logoff = setInterval(refresh_page_logoff, 200);
function refresh_page_logoff() {
	const fs = require('fs');

	fs.access("/tmp/regataos-gcs/config/gog-games/gamedb.json", (err) => {
	if (!err) {
		refresh_page_logoff_start();
		clearInterval(time_refresh_page_logoff);
	return;
	}
	});
}
