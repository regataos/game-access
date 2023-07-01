// This script helps to dynamically create game blocks.
function listAllGames(specifyLauncher, contentBrake) {
	const fs = require("fs");
	let jsonFiles = [];
	let numBrake = contentBrake

	if (numBrake < 16) {
		numBrake = 0;
	}

	const allGamesJsonFiles = "/opt/regataos-gcs/games-list"
	const installedGamesJsonFiles = "/tmp/regataos-gcs/config/installed"

	// Read JSON jsonFiles with the list of games.
	fs.readdirSync(allGamesJsonFiles).forEach(jsonFiles => {
		fs.readFile(`${allGamesJsonFiles}/${jsonFiles}`, "utf8", function (err, data) {
			if (!err) {
				// Dynamically create search results.
				const games = JSON.parse(data);
				const accountGameBlocks = document.querySelector("#account-games");
				const installedGameBlocks = document.querySelector("#installed-games");

				// Define some variables in advance.
				let installGame = "installGameId()";
				let runGame = "runGameId()";
				let specialButtonFunction = "goGamePageId()";
				let specialButtonHtml = "";
				let gamePlataform = "gcs";
				let gameAccess = "GAME ACCESS";
				let checkInstalled = ""

				for (let i = 0; i < games.length; i++) {
					let gamesdata = games[i];

					if ((specifyLauncher.replace("-games", "").includes(gamesdata.launchernickname)) ||
						(specifyLauncher.includes("allgames")) || (specifyLauncher.includes("installed"))) {
						// Set some default settings.
						if (gamesdata.launchernickname.includes("steam")) {
							installGame = runGame = `run_${gamesdata.launchernickname}_game()`;
							gamePlataform = gamesdata.gamenative.includes("true") ? "nativegame" : "steamplay";

						} else if ((gamesdata.launchernickname.includes("gog")) ||
							(gamesdata.launchernickname.includes("epicstore"))) {
							installGame = `install_${gamesdata.launchernickname}_game()`;
							runGame = `run_${gamesdata.launchernickname}_game()`;
							specialButtonFunction = `uninstall_${gamesdata.launchernickname}_game()`;
						}

						// Set the game image.
						const gameBanner = getGamesImagePath(gamesdata.launchernickname, gamesdata.gamenickname, gamesdata.game_img1);

						// Special button.
						if (gamesdata.launchernickname.includes("gcs")) {
							specialButtonHtml = `
								<div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId='${gamesdata.gamenickname}'; ${specialButtonFunction};">
									<i class="fa fa-plus"></i>
								</div>`;

						} else if ((fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}-${gamesdata.launchernickname}.json`)) ||
							(fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}.json`))) {
							checkInstalled = "true"

							if (gamesdata.launchernickname.includes("epicstore") || gamesdata.launchernickname.includes("gog")) {
								specialButtonHtml = `
									<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove='${gamesdata.gamenickname}'; ${specialButtonFunction};">
									<i class="fas fa-trash-alt"></i>
									</div>`;
							}
						}

						// Check if the game is installed and create the game tile according to the game installation status.
						const isInstalled = fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}.json`) ||
							fs.existsSync(`${installedGamesJsonFiles}/${gamesdata.gamenickname}-${gamesdata.launchernickname}.json`);

						const buttonId = gamesdata.gamenickname;
						const buttonClass = isInstalled ? "play-box-universal" : "install-box-universal";
						const buttonIconClass = isInstalled ? "fas fa-play" : "fas fa-download";
						const buttonTextClass = isInstalled ? "play" : "install";
						const buttonText = isInstalled ? "Jogar" : "Instalar";
						let playInstallButton = `
							<div class="${buttonClass}" onclick="window.gameId='${buttonId}'; ${isInstalled ? runGame : installGame};">
								<div class="play-button">
									<i class="${buttonIconClass}"></i>
									<div class="${buttonTextClass}-txt">${buttonText}</div>
								</div>
							</div>`;

						// Create game blocks.
						const newGameBlock = document.createElement("div");
						newGameBlock.classList.add("app-block", `${gamesdata.launchernickname}-block"`, `${gamesdata.gamenickname}-block`, gamesdata.gamenickname);
						newGameBlock.innerHTML = `
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

						// Create the new game blocks dynamically.
						function listAccountGames() {
							if (accountGameBlocks) {
								const accountGame = accountGameBlocks.querySelector(`.${gamesdata.gamenickname}-block`);

								if (!accountGame) {
									numBrake = numBrake + 1;

									if (specifyLauncher.includes("-games")) {
										if (checkInstalled === "true") {
											specialButtonHtml = ""
											playInstallButton = `
											<div class="install-box-universal" onclick="window.gameId='${gamesdata.gamenickname}'; ${isInstalled ? runGame : installGame};">
												<div class="play-button">
													<i class="fas fa-download"></i>
													<div class="install-txt">Instalar</div>
												</div>
											</div>`;

											newGameBlock.classList.add("app-block", "hide-element", `${gamesdata.launchernickname}-block"`, `${gamesdata.gamenickname}-block`, gamesdata.gamenickname);
											newGameBlock.innerHTML = `
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
										}
									}

									accountGameBlocks.appendChild(newGameBlock.cloneNode(true));
									pagesBlocksLang();

								} else {
									if (specifyLauncher.includes("-games")) {
										if (checkInstalled === "true") {
											accountGame.classList.add("hide-element");
										} else {
											accountGame.classList.remove("hide-element");
										}
									}
								}
							}
						}

						function listInstalledGames() {
							if (installedGameBlocks) {
								const installedGame = installedGameBlocks.querySelector(`.${gamesdata.gamenickname}-block`);
								const accountGame = accountGameBlocks.querySelector(`.${gamesdata.gamenickname}-block`);

								if (checkInstalled === "true") {
									if (!installedGame) {
										installedGameBlocks.appendChild(newGameBlock.cloneNode(true));
										pagesBlocksLang();
									} else {
										installedGame.classList.remove("hide-element");
										accountGame.classList.add("hide-element");
									}
								} else {
									if (installedGame) {
										installedGame.classList.add("hide-element");
										accountGame.classList.remove("hide-element");
									}
								}
							}
						}

						if (numBrake >= 16) {
							listInstalledGames();
						} else {
							listInstalledGames();
							listAccountGames();
						}

					}
				}
			}
		});
	});
}

// Start the process of creating the list of games on the screen.
function startListAllGames() {
	const urlPage = window.location.href;
	listAllGames(urlPage, 0);

	// Load more games when the user scrolls to the end of the page.
	$(window).scroll(function () {
		if ($(document).height() == $(window).scrollTop() + $(window).height()) {
			listAllGames(urlPage, 0);
		}
	});
}

// If necessary, display game tiles only after login
function detectLogin() {
	const getPageUrl = window.location.href;
	if (getPageUrl.includes("epicstore")) {
		const fs = require("fs");
		if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-egs.txt")) {
			startListAllGames();
		}

	} else {
		startListAllGames();
	}
}
detectLogin();
