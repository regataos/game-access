// Create the cache with JSON files of games available in the user's GOG Galaxy account
function create_cache_gog_games() {
	const fs = require("fs");
	const exec = require('child_process').exec;
	let files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/tmp/regataos-gcs/config/gog-games").forEach(files => {
		fs.readFile("/tmp/regataos-gcs/config/gog-games/" + files, "utf8", function (err, data) {
			if (!err) {
				let gogGames = JSON.parse(data);

				for (let i = 0; i < gogGames.length; i++) {
					// Simplify game name to create a nickname
					let gamename_lowercase = gogGames[i].originalTitle.toLowerCase();
					gamename_lowercase = gamename_lowercase.replace(/[:-]/g, "");
					gamename_lowercase = gamename_lowercase.replace(/[.]/g, "")
					gamename_lowercase = gamename_lowercase.replace(/(|)/g, "")
					gamename_lowercase = gamename_lowercase.replace(/(,)/g, "")
					gamename_lowercase = gamename_lowercase.replace(/(>)/g, "")
					gamename_lowercase = gamename_lowercase.replace(/(_)/g, "")
					gamename_lowercase = gamename_lowercase.replace(/[+®]/g, "")
					gamename_lowercase = gamename_lowercase.replace(/(&)/g, "and")
					gamename_lowercase = gamename_lowercase.replace(/\s+/g, "-");
					gamename_lowercase = gamename_lowercase.replace(/'|\(|\)/g, "")
					gamename_lowercase = gamename_lowercase.replace(/[!-]/g, '');
					gamename_lowercase = gamename_lowercase.replace(/[!?]/g, '');
					gamename_lowercase = gamename_lowercase.replace(/(™)/g, '');
					gamename_lowercase = gamename_lowercase.replace(/(ç)/g, 'c');
					gamename_lowercase = gamename_lowercase.replace(/(á)|(â)|(ã)|(à)/g, 'a');
					gamename_lowercase = gamename_lowercase.replace(/(é)|(ê)|(ẽ)/g, 'e');
					gamename_lowercase = gamename_lowercase.replace(/(í)/g, 'i');
					gamename_lowercase = gamename_lowercase.replace(/(ó)|(ô)|(ô)/g, 'o');
					gamename_lowercase = gamename_lowercase.replace(/(ü)|(ú)|(û)|(ũ)/g, 'u');

					let game_name = gogGames[i].title;
					let game_img = gogGames[i].backgroundImage;
					let game_keywords = gamename_lowercase.replace(/(-)/g, " ");
					let game_installation_folder = gogGames[i].title.replace(/[:-]/g, "");

					// If not, create the games JSON file
					if (!fs.existsSync('/tmp/regataos-gcs/config/gog-games/json/' + gamename_lowercase + '-gog.json')) {
						// Create JSON file with game information
						const exec = require('child_process').exec;
						var command_line = '\
						export game_name="' + game_name + '"; \
						export gamename_lowercase="' + gamename_lowercase + '"; \
						export gamekeywords="' + game_keywords + '"; \
						export for_id="' + game_img + '"; \
						export gameinstallfolder="' + game_installation_folder + '"; \
						/opt/regataos-gcs/scripts/create-cache-gog-games -create-gog-cache';
						exec(command_line, function (error, call, errlog) {
						});

						$("div.loading").css("display", "block")
						$("div.loading-games").css("display", "block")
					}

					// Create JSON file with game information
					if (!fs.existsSync('/opt/regataos-gcs/games-list/' + gamename_lowercase + '-gog.json')) {
						const exec = require('child_process').exec;
						var command_line = '\
						export game_name="' + game_name + '"; \
						export gamename_lowercase="' + gamename_lowercase + '"; \
						export gamekeywords="' + game_keywords + '"; \
						export for_id="' + game_img + '"; \
						export gameinstallfolder="' + game_installation_folder + '"; \
						/opt/regataos-gcs/scripts/create-cache-gog-games -up-games-cache';
						exec(command_line, function (error, call, errlog) {
						});

						$("div.loading").css("display", "block")
						$("div.loading-games").css("display", "block")
					}

					// Create local cache of images
					if (!fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + gamename_lowercase + '.webp')) {
						const commandLine = 'wget --no-check-certificate -O "/tmp/regataos-gcs/config/gog-games/img/' + gamename_lowercase + '.webp" ' + '"' + game_img + '"';
						exec(commandLine, function (error, call, errlog) {
						});
					}
				}

				let requestRestartPage = sessionStorage.getItem("requestRestartPage");
				if ((!requestRestartPage) || (requestRestartPage) && (requestRestartPage !== "reloaded")) {
					sessionStorage.setItem("requestRestartPage", "reloaded");
					const reloadPage = 'sleep 30; echo "relaod" > "/tmp/regataos-gcs/up-page-gog-login.txt"';
					exec(reloadPage, function (error, call, errlog) {});
				}
				return;
			}
		});
	});
}

// Start creating JSON files for games and images
const createCacheGogTime = setInterval(createCacheGog, 1000);
function createCacheGog() {
	const fs = require('fs');
	if (fs.existsSync("/tmp/regataos-gcs/config/gog-games/gamedb.json")) {
		create_cache_gog_games();
		clearInterval(createCacheGogTime);
	}
}
createCacheGog();
