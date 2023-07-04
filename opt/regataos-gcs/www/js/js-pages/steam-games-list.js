// Create the cache with JSON files of games available in the user's Steam account
function createCacheSteamGames() {
	const fs = require("fs");
	const steamGameFiles = "/tmp/regataos-gcs/config/steam-games";

	if (fs.existsSync(`${steamGameFiles}/json/steam-id/show-steam-games.txt`)) {
		fs.readdirSync(`${steamGameFiles}/json/steam-id/`).forEach(jsonFile => {
			const filePath = `${steamGameFiles}/json/steam-id/${jsonFile}`;

			fs.readFile(filePath, "utf8", (err, data) => {
				if (err) {
					console.error(err);
					return;
				}

				let steamGames = JSON.parse(data);
				steamGames = steamGames.response.games;

				steamGames.forEach((games) => {
					const gamename = games.name;
					const appid = games.appid;

					let gamenameLowercase = gamename.toLowerCase()
						.replace(/[-:.,|>()_+®&'()!?™ç]/g, '')
						.replace(/[áàâã]/g, 'a')
						.replace(/[éêẽ]/g, 'e')
						.replace(/í/g, 'i')
						.replace(/[óôõ]/g, 'o')
						.replace(/[üúûũ]/g, 'u');

					gamenameLowercase = gamenameLowercase.replace(/\s+/g, '-');
					console.log(gamenameLowercase);

					function createGameJsonFile() {
						const https = require('https');
						https.get(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=br&l=br`, (res) => {
							let data = "";

							// Take the data from the url and put it into the variable "data"
							res.on("data", (chunk) => {
								data += chunk;
							});

							// Convert raw content to JSON and show return
							res.on("end", () => {
								try {
									const gameJson = JSON.parse(data);
									const {
										name: game_name,
										steam_appid: game_id,
										type: game_type,
										platforms: { linux: game_native }
									} = gameJson[appid].data;

									const gamekeywords = gamenameLowercase.replace(/(-)/g, " ");

									// Create JSON file with game information
									const commandLine = `
									export game_name="${game_name}"; \
									export gamename_lowercase="${gamenameLowercase}"; \
									export gamekeywords="${gamekeywords}"; \
									export gameid="${game_id}"; \
									export gametype="${game_type}"; \
									export gamenative="${game_native}"; \
									/opt/regataos-gcs/scripts/create-cache-steam-games`;

									runShellScript(commandLine);

								} catch (error) {
									console.error(error.message);
								};
							});
						}).on("error", (error) => {
							console.error(error.message);
						});
					}

					// If not, create the games JSON file
					if ((!fs.existsSync(`${steamGameFiles}/json/games/${gamenameLowercase}-steam.json`)) ||
						(!fs.existsSync(`${steamGameFiles}/img/${gamenameLowercase}.jpg`))) {
						createGameJsonFile();
					}
				})
			});
		});
	}
}
createCacheSteamGames();

function list_steam_games_account_load() {
	var fs = require("fs");

	var files = [];
	var child = [];

	// Read JSON files with the list of games
	fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/games").forEach(files => {
		fs.readFile("/tmp/regataos-gcs/config/steam-games/json/games/" + files, "utf8", function (err, data2) {
			if (!err) {
				var steam_games_json = JSON.parse(data2);

				//Read the list of games that should appear in each block
				steam_games_json.forEach(gamesdata => {
					if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-steam.json')) {
						$("div.universal-all-games div#" + gamesdata.gamenickname + "-block").css("display", "block")
						$("div.universal-installed-games div#" + gamesdata.gamenickname + "-block").css("display", "none")
					} else {
						$("div.universal-all-games div#" + gamesdata.gamenickname + "-block").css("display", "none")
						$("div.universal-installed-games div#" + gamesdata.gamenickname + "-block").css("display", "block")
					}
				})
				return;
			}
		});
	});
}

// Show the list of installed games
function show_installed_games() {
	const fs = require("fs");

	if (fs.existsSync('/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt')) {
		$(".universal-installed-games").css("min-height", "280px");
		$(".universal-installed-games").css("display", "grid");
		$(".universal-account-title").css("margin-top", "25px");
		$(".installed-title-steam").css("display", "block");

	} else {
		$(".universal-installed-games").css("display", "none");
		$(".universal-account-title").css("margin-top", "100px");
		$(".installed-title-steam").css("display", "none");
	}
}

// Show list of games in user account
function show_steam_games() {
	var fs = require("fs");
	fs.access('/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt', (err) => {
		if (!err) {
			$(".universal-account-title").css("display", "block");
			$(".universal-all-games").css("display", "grid");
			$(".universal-more").css("display", "block");
			return;
		} else {
			$(".universal-account-title").css("display", "none");
			$(".universal-all-games").css("display", "none");
			$(".universal-more").css("display", "block");
		}
	});
}

var page_url = window.location.href
if ((page_url.indexOf("steam-games") > -1) == "1") {
	list_steam_games_account_load();

	setTimeout(function () {
		setInterval(function () {
			list_steam_games_account_load();
		}, 1000);
	}, 1000);

	show_steam_games();
	show_installed_games();

	setInterval(function () {
		show_steam_games();
		show_installed_games();
	}, 1000);
}
