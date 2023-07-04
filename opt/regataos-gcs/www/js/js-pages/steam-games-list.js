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
				});
			});
		});
	}
}
createCacheSteamGames();

// Show list of games in user account
function show_steam_games() {
	const fs = require("fs");
	const showSteamGamesFile = "/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt";
	const showInstalledGamesFile = "/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt";

	if (fs.existsSync(showSteamGamesFile)) {
		handleCssClass("add", "show-games", "list-account-games");
		handleCssClass("add", "show-element", ["steam-more", "blocks3-universal"]);

		if (fs.existsSync(showInstalledGamesFile)) {
			handleCssClass("add", "show-element", "universal-installed-title");
			handleCssClass("add", "show-games", "list-installed-games");
			handleCssClass("add", "title-games-available-min", "universal-account-title");
		} else {
			handleCssClass("remove", "title-games-available-min", "universal-account-title");
			handleCssClass("remove", "show-element", "universal-installed-title");
			handleCssClass("remove", "show-games", "list-installed-games");
		}

		handleCssClass("add", "show-title-games-available", "universal-account-title");

	} else {
		handleCssClass("remove", "show-games", "list-account-games");
		handleCssClass("remove", "show-element", ["steam-more", "blocks3-universal"]);
		handleCssClass("remove", "show-title-games-available", "universal-account-title");
		handleCssClass("remove", "title-games-available-min", "universal-account-title");
		handleCssClass("remove", "show-element", "universal-installed-title");
		handleCssClass("remove", "show-games", "list-installed-games");
	}
}

function checkUiChanges() {
	const fs = require("fs");
	const fileStatus = "/tmp/regataos-gcs/config/file-status.txt";

	const urlPage = window.location.href
	if (urlPage.includes("steam-games")) {
		show_steam_games();

		// Before checking UI status changes, clear the cache.
		let interfaceStatus = fs.readFileSync(fileStatus, "utf8");
		function resetInterfaceStatus() {
			if (!interfaceStatus.includes("inactive")) {
				fs.writeFileSync(fileStatus, "inactive", "utf8");
			}
		}
		resetInterfaceStatus();

		fs.watch(fileStatus, (eventType, filename) => {
			interfaceStatus = fs.readFileSync(fileStatus, "utf8");
			if (interfaceStatus.includes("rearrange game blocks")) {
				setTimeout(function () {
					show_steam_games();
					listAllGames(urlPage, 16);
					resetInterfaceStatus();
				}, 2000);
			}
		});
	}
}
checkUiChanges();
