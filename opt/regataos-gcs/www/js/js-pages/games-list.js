// This script helps to dynamically create game blocks.
function listAllGames(specifyLauncher, contentBrake) {
	const fs = require("fs");
	const installedGamesJsonFiles = "/tmp/regataos-gcs/config/installed";
	const accountGameBlocks = document.querySelector("#account-games");
	const installedGameBlocks = document.querySelector("#installed-games");

	let numBrake = contentBrake
	if (!numBrake) {
		numBrake = 0;
	}

	let installGame = "";
	let runGame = "";
	let specialButtonFunction = "";
	let specialButtonHtml = "";
	let gamePlataform = "gcs";
	let gameAccess = "GAME ACCESS";

	// Read JSON jsonFiles with the list of games.
	let allGamesJsonFiles = "/opt/regataos-gcs/games-list";

	if (specifyLauncher.includes("epicstore")) {
		allGamesJsonFiles = "/tmp/regataos-gcs/config/epicstore-games/json";

	} else if (specifyLauncher.includes("gog")) {
		const getInstalledLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
		if (getInstalledLaunchers.includes("gog")) {
			if (fs.existsSync("/tmp/regataos-gcs/config/gog-games/gamedb.json")) {
				allGamesJsonFiles = "/tmp/regataos-gcs/config/gog-games/json";
			}
		}

	} else if (specifyLauncher.includes("steam")) {
		allGamesJsonFiles = "/tmp/regataos-gcs/config/steam-games/json/games";
	}

	fs.readdirSync(allGamesJsonFiles).forEach(jsonFile => {
		const filePath = `${allGamesJsonFiles}/${jsonFile}`;

		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			const dataReceived = JSON.parse(data);
			dataReceived.forEach((gameData) => {
				const { gamename, gamenickname, gamenative, game_img1, gamerun_appid, gameid, launcher, launchernickname } = gameData;

				if ((specifyLauncher.replace("-games", "").includes(launchernickname)) ||
					(specifyLauncher.includes("allgames")) || (specifyLauncher.includes("installed"))) {
					// Set some default settings.
					if (launchernickname.includes("gcs")) {
						installGame = `confirmInstallGameId('${gamenickname}')`;
						runGame = `runGameId('${gamenickname}')`;
						specialButtonFunction = `goGamePageId('${gamenickname}')`;

					} else if (launchernickname.includes("steam")) {
						installGame = `install_${launchernickname}_game('${gamenickname}')`;
						runGame = `run_${launchernickname}_game('${gamenickname})', '${gameid}')`;
						gamePlataform = gamenative.includes("true") ? "nativegame" : "steamplay";

					} else if ((launchernickname.includes("gog")) ||
						(launchernickname.includes("epicstore"))) {
						installGame = `install_${launchernickname}_game('${gamenickname}')`;
						runGame = `run_${launchernickname}_game('${gamenickname})', '${gameid}')`;
						specialButtonFunction = `uninstall_${launchernickname}_game('${gamenickname}')`;

					} else {
						installGame = `run_launcher('${launchernickname}')`;
						runGame = `run_game('${gamenickname}', '${launchernickname}', '${gamerun_appid}')`;
					}

					// Set the game image.
					const gameBanner = getGamesImagePath(launchernickname, gamenickname, game_img1);

					// Check if the game is installed and create the game tile according to the game installation status.
					const isInstalled = fs.existsSync(`${installedGamesJsonFiles}/${gamenickname}.json`) ||
						fs.existsSync(`${installedGamesJsonFiles}/${gamenickname}-${launchernickname}.json`);

					if (launchernickname.includes("gcs")) {
						specialButtonHtml = `
							<div title="Mais sobre o jogo" class="morefor-game-button" onclick="${specialButtonFunction};">
								<i class="fa fa-plus"></i>
							</div>`;

					} else if ((isInstalled) && launchernickname.includes("epicstore") || launchernickname.includes("gog")) {
						specialButtonHtml = `
							<div title="Desinstalar jogo" class="remove-game-button" onclick="${specialButtonFunction};">
								<i class="fas fa-trash-alt"></i>
							</div>`;

					} else {
						specialButtonHtml = "";
					}

					const buttonClass = isInstalled ? "play-box-universal" : "install-box-universal";
					const buttonIconClass = isInstalled ? "fas fa-play" : "fas fa-download";
					const buttonTextClass = isInstalled ? "play" : "install";
					const buttonText = isInstalled ? "Jogar" : "Instalar";
					let playInstallButton = `
						<div class="${gamenickname}-block ${buttonClass}" onclick="${isInstalled ? runGame : installGame};">
							<div class="play-button">
								<i class="${buttonIconClass}"></i>
								<div class="${buttonTextClass}-txt">${buttonText}</div>
							</div>
						</div>`;

					// Generate game block.
					const newGameBlock = document.createElement("div");
					newGameBlock.classList.add("app-block", `${launchernickname}-block`, `${gamenickname}-block`, gamenickname);
					newGameBlock.innerHTML = `
						<div class="game-img" style="background-image: ${gameBanner}"></div>
						<div class="block-play ${gamenickname}-hover">
							${specialButtonHtml}
							${playInstallButton}
						</div>
						<div class="block-text ${gamenickname}" title="${gamename}'">
							<div class="block-title">${gamename}</div>
							<div class="block-desc">${launcher}</div>
							<div class="native-game">
							<div class="native-game-img" style="background-image: url(./../images/${gamePlataform}.png)"></div>
							<div class="native-game-desc ${gamePlataform}">${gameAccess}</div>
							</div>
						</div>`;

					// Create game blocks dynamically.
					function listAccountGames() {
						if (accountGameBlocks) {
							const accountGame = accountGameBlocks.querySelector(`.${gamenickname}-block`);

							if (!accountGame) {
								numBrake = numBrake + 1;

								if (specifyLauncher.includes("-games")) {
									if (isInstalled) {
										specialButtonHtml = ""
										playInstallButton = `
											<div class="install-box-universal" onclick="${isInstalled ? runGame : installGame};">
												<div class="play-button">
													<i class="fas fa-download"></i>
													<div class="install-txt">Instalar</div>
												</div>
											</div>`;

										newGameBlock.classList.add("app-block", "hide-element", `${launchernickname}-block`, `${gamenickname}-block`, gamenickname);
										newGameBlock.innerHTML = `
											<div class="game-img" style="background-image: ${gameBanner}"></div>
											<div class="block-play ${gamenickname}-hover">
												${specialButtonHtml}
												${playInstallButton}
											</div>
											<div class="block-text ${gamenickname}" title="${gamename}'">
												<div class="block-title">${gamename}</div>
												<div class="block-desc">${launcher}</div>
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
									if (isInstalled) {
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
							const installedGame = installedGameBlocks.querySelector(`.${gamenickname}-block`);

							let accountGame = "";
							if (accountGameBlocks) {
								accountGame = accountGameBlocks.querySelector(`.${gamenickname}-block`);
							}

							if (isInstalled) {
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
			});
		});
	});
}

// Start the process of creating the list of games on the screen.
function startListAllGames() {
	const getPageUrl = window.location.href;
	listAllGames(getPageUrl);

	// Load more games when the user scrolls to the end of the page.
	$(window).scroll(function () {
		if ($(document).height() == $(window).scrollTop() + $(window).height()) {
			listAllGames(getPageUrl);
		}
	});
}
startListAllGames();

// Hide the "install" button when the launcher is already installed.
function hideInstallButtonLauncher() {
	const fs = require("fs");
	const fileWithInstalledLaunchers = "/tmp/regataos-gcs/config/installed-launchers.conf";
	const installedLaunchers = fs.readFileSync(fileWithInstalledLaunchers, "utf8");

	const seeMoreButton = document.querySelector(".epicstore-more");
	const installButton = document.querySelector(".epicstore-install");

	if ((!seeMoreButton) && (!seeMoreButton)) {
		return;
	}

	if (installedLaunchers.includes("epicstore")) {
		seeMoreButton.classList.add("show-element");
		installButton.classList.remove("show-element");
	} else {
		seeMoreButton.classList.remove("show-element");
		installButton.classList.add("show-element");
	}
}
hideInstallButtonLauncher()
