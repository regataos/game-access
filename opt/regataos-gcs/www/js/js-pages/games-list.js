// Reload page
function reloadPage() {
	setTimeout(function () {
		const fs = require("fs");
		const reloadFilePath = "/tmp/regataos-gcs/reload-page.txt";
		if (fs.existsSync(reloadFilePath)) {
			location.reload();
			fs.unlinkSync(reloadFilePath);
		}
	}, 10000);
}

// This script helps to dynamically create game blocks
function listSpecificGames() {
	const fs = require("fs");

	let jsonFiles = [];

	// Directory with JSON files of installed games
	const installedGamesJsonFiles = "/tmp/regataos-gcs/config/installed"

	// Read JSON jsonFiles with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(jsonFiles => {
		fs.readFile(`/opt/regataos-gcs/games-list/${jsonFiles}`, "utf8", function (err, data) {
			if (!err) {
				const games = JSON.parse(data);

				// Dynamically create search results
				const allBlocks = document.querySelector("div.blocks3");

				games.forEach(gamesdata => {
					// Display game blocks according to the launcher
					const pagename = window.location.href.split("pages/")[1].replace('-games.html', '');

					if (gamesdata.launchernickname.includes(pagename)) {
						// Set game image
						const gameBanner = `url('./../images/games-backg/${gamesdata.launchernickname}/${gamesdata.gamenickname}.jpg')`;
						const gamePlataform = "gcs";
						const gameAccess = "GAME ACCESS";

						// Check if the game is installed and create the game tile according to the game installation status.
						const isInstalled = fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}.json`) ||
							fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}-${gamesdata.launchernickname}.json`);

						const buttonId = gamesdata.gamenickname;
						const buttonClass = isInstalled ? "play-box-universal" : "install-box-universal";
						const buttonIconClass = isInstalled ? "fas fa-play" : "fas fa-download";
						const buttonText = isInstalled ? "Jogar" : "Instalar";

						const runGame = `window.launchername='${gamesdata.launchernickname}'; window.rungame='${gamesdata.gamerun_appid}'; run_game();`;
						const installGame = runGame;

						const playInstallButton = `
						<div id="${buttonId}" class="${buttonClass}" onclick="window.gameId=this.id; ${isInstalled ? runGame : installGame};">
							<div class="play-button">
								<i class="${buttonIconClass}"></i>
								<div class="install-txt">${buttonText}</div>
							</div>
						</div>`;

						// Create game blocks
						const newGameBlocks = document.createElement("div");
						newGameBlocks.classList.add("app-block", `${gamesdata.launchernickname}-block"`, `${gamesdata.gamenickname}-block`, gamesdata.gamenickname);
						newGameBlocks.style.backgroundImage = `url('./../images/games-backg/steam/steam.jpg')`;

						newGameBlocks.innerHTML = `
						<div class="game-img" style="background-image: ${gameBanner}"></div>
						<div class="block-play ${gamesdata.gamenickname}-hover">
							${playInstallButton}
						</div>
						<div class="block-text ${gamesdata.gamenickname}" title="${gamesdata.gamename}'">
							<div class="block-title">${gamesdata.gamename}</div>
							<div class="block-desc">${gamesdata.launcher}</div>
							<div class="native-game">
							<div class="native-game-img" style="background-image: url(./../images/${gamePlataform}.png)"></div>
							<div class="native-game-desc ${gamePlataform}">${gameAccess}</div>
							</div>
						</div>`;

						//Finally, create the new game blocks dynamically
						allBlocks.appendChild(newGameBlocks);
						pagesBlocksLang();
					}
				});
				return;
			}
		});
	});
}

function listAllGames() {
	const fs = require("fs");
	const path = require('path');

	let jsonFiles = [];
	window.contentBrake = 0

	// Directory with JSON files of installed games
	const installedGamesJsonFiles = "/tmp/regataos-gcs/config/installed"

	// Read JSON jsonFiles with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(jsonFiles => {
		fs.readFile("/opt/regataos-gcs/games-list/" + jsonFiles, "utf8", function (err, data) {
			if (!err) {
				const games = JSON.parse(data);

				// Define some variables in advance
				let gameBanner = "";
				let installGame = "";
				let runGame = "";
				let specialButtonFunction = "";
				let specialButtonHtml = "";
				let gamePlataform = "";
				let gameAccess = "";

				// Dynamically create search results
				const allBlocks = document.querySelector("div.blocks4");

				games.forEach(gamesdata => {
					// Before creating the game block, check if it already exists
					let child = allBlocks.querySelector(`.${gamesdata.gamenickname}-block`);
					if (child == null) {
						// Set default image directory
						defaultImageDirectory = `./../images/games-backg/${gamesdata.launchernickname}`;

						// Set game image
						function getGameBannerUrl(filedirectory, filename) {
							const extensions = ["jpg", "png", "webp", "jfif"];
							for (const extension of extensions) {
								const imagePath = `${filedirectory}/${filename}`;
								const imagePathExtension = `${imagePath}.${extension}`;

								if (fs.existsSync(imagePath)) {
									return `url('file://${imagePath}')`;
								}

								if (fs.existsSync(imagePathExtension)) {
									return `url('file://${imagePathExtension}')`;
								}
							}

							return false;
						}

						// Set some default settings
						if (gamesdata.launchernickname.includes("gcs")) {
							installGame = "installGameId()";
							runGame = "runGameId()";
							specialButtonFunction = "goGamePageId()";

							gameBanner = `url('${defaultImageDirectory}/${gamesdata.gamenickname}.jpg')`;

						} else if (gamesdata.launchernickname.includes("steam")) {
							installGame = runGame = `run_${gamesdata.launchernickname}_game()`;

							const steamImg = `/tmp/regataos-gcs/config/${gamesdata.launchernickname}-games/img`
							gameBanner = getGameBannerUrl(steamImg, gamesdata.gamenickname);

						} else if ((gamesdata.launchernickname.includes("gog")) ||
							(gamesdata.launchernickname.includes("epicstore"))) {
							installGame = `install_${gamesdata.launchernickname}_game()`;
							runGame = `run_${gamesdata.launchernickname}_game()`;
							specialButtonFunction = `uninstall_${gamesdata.launchernickname}_game()`;

							const imgDir = `/tmp/regataos-gcs/config/${gamesdata.launchernickname}-games/img`
							gameBanner = getGameBannerUrl(imgDir, gamesdata.gamenickname);

							if (!gameBanner) {
								if (gamesdata.launchernickname.includes("epicstore")) {
									gameBanner = `url('${gamesdata.game_img1}')`;
								} else {
									gameBanner = `url('${defaultImageDirectory}/${gamesdata.gamenickname}.jpg')`;
								}
							}

						} else {
							gameBanner = `url('${defaultImageDirectory}/${gamesdata.gamenickname}.jpg')`;
						}

						// Set game plataform
						if (gamesdata.launchernickname.includes("steam")) {
							gamePlataform = gamesdata.gamenative.includes("true") ? "nativegame" : "steamplay";
						} else {
							gamePlataform = "gcs";
							gameAccess = "GAME ACCESS";
						}

						// Special button
						if (gamesdata.launchernickname.includes("gcs")) {
							specialButtonHtml = `
							  <div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId='${gamesdata.gamenickname}'; ${specialButtonFunction};">
								<i class="fa fa-plus"></i>
							  </div>`;

						} else if (fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}-${gamesdata.launchernickname}.json`) ||
							fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}.json`)) {
							if (gamesdata.launchernickname.includes("epicstore") || gamesdata.launchernickname.includes("gog")) {
								specialButtonHtml = `
								<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove='${gamesdata.gamenickname}'; ${specialButtonFunction}; reloadPage();">
								  <i class="fas fa-trash-alt"></i>
								</div>`;
							}

						} else {
							specialButtonHtml = "";
						}

						// Check if the game is installed and create the game tile according to the game installation status.
						const isInstalled = fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}.json`) ||
							fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}-${gamesdata.launchernickname}.json`);

						const buttonId = gamesdata.gamenickname;
						const buttonClass = isInstalled ? "play-box-universal" : "install-box-universal";
						const buttonIconClass = isInstalled ? "fas fa-play" : "fas fa-download";
						const buttonText = isInstalled ? "Jogar" : "Instalar";

						const playInstallButton = `
						<div id="${buttonId}" class="${buttonClass}" onclick="window.gameId=this.id; ${isInstalled ? runGame : installGame};">
							<div class="play-button">
								<i class="${buttonIconClass}"></i>
								<div class="install-txt">${buttonText}</div>
							</div>
						</div>`;

						// Create game blocks
						const newGameBlocks = document.createElement("div");
						newGameBlocks.classList.add("app-block", `${gamesdata.launchernickname}-block"`, `${gamesdata.gamenickname}-block`, gamesdata.gamenickname);
						newGameBlocks.style.backgroundImage = `url('./../images/games-backg/steam/steam.jpg')`;

						newGameBlocks.innerHTML = `
						<div class="game-img" style="background-image: ${gameBanner}"></div>
						<div class="block-play ${gamesdata.gamenickname}-hover">
							${specialButtonHtml}
							${playInstallButton}
						</div>
						<div class="block-text ${gamesdata.gamenickname}" title="${gamesdata.gamename}'">
							<div class="block-title">${gamesdata.gamename}</div>
							<div class="block-desc">${gamesdata.launcher}</div>
							<div class="native-game">
							<div class="native-game-img" style="background-image: url(./../images/${gamePlataform}.png)"></div>
							<div class="native-game-desc ${gamePlataform}">${gameAccess}</div>
							</div>
						</div>`;

						//Finally, create the new game blocks dynamically
						if (contentBrake >= 16) {
							return;
						} else {
							window.contentBrake = contentBrake + 1
							allBlocks.appendChild(newGameBlocks);
							pagesBlocksLang();
						}
					}
				})
				return;
			}
		});
	});
}

// Load more games when the user scrolls to the end of the page.
$(window).scroll(function () {
	if ($(document).height() == $(window).scrollTop() + $(window).height()) {
		listAllGames();
	}
});

// List the games according to the page accessed by the user.
(window.location.href.includes("-games")) ? listSpecificGames() : listAllGames();
