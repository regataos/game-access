// For search page
function listSearchedGames(gamename, gamenickname, gamenative, game_img1, gamerun_appid, launcher, launchernickname) {
	const fs = require("fs");
	const installedGamesJsonFiles = "/tmp/regataos-gcs/config/installed"
	const allBlocks = document.querySelector("#account-games");

	let installGame = "";
	let runGame = "";
	let specialButtonFunction = "";
	let specialButtonHtml = "";
	let gamePlataform = "gcs";
	let gameAccess = "GAME ACCESS";

	// Set some default settings
	if (launchernickname.includes("gcs")) {
		installGame = `confirmInstallGameId('${gamenickname}')`;
		runGame = `runGameId('${gamenickname}')`;
		specialButtonFunction = `goGamePageId('${gamenickname}')`;

	} else if (launchernickname.includes("steam")) {
		installGame = `install_${launchernickname}_game('${gamenickname}')`;
		runGame = `run_${launchernickname}_game('${gamenickname})')`;
		gamePlataform = gamenative.includes("true") ? "nativegame" : "steamplay";

	} else if ((launchernickname.includes("gog")) ||
		(launchernickname.includes("epicstore"))) {
		installGame = `install_${launchernickname}_game('${gamenickname}')`;
		runGame = `run_${launchernickname}_game('${gamenickname})')`;
		specialButtonFunction = `uninstall_${launchernickname}_game('${gamenickname}')`;

	} else {
		installGame = `run_launcher('${launchernickname}')`;
		runGame = `run_game('${gamenickname}', '${launchernickname}', '${gamerun_appid}')`;
	}

	// Set the game image
	const gameBanner = getGamesImagePath(launchernickname, gamenickname, game_img1);

	// Set game plataform
	if (launchernickname.includes("steam")) {
		gamePlataform = gamenative.includes("true") ? "nativegame" : "steamplay";
	}

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

	const buttonId = gamenickname;
	const buttonClass = isInstalled ? "play-box-universal" : "install-box-universal";
	const buttonIconClass = isInstalled ? "fas fa-play" : "fas fa-download";
	const buttonTextClass = isInstalled ? "play" : "install";
	const buttonText = isInstalled ? "Jogar" : "Instalar";
	const playInstallButton = `
		<div id="${buttonId}" class="${buttonClass}" onclick="${isInstalled ? runGame : installGame};">
			<div class="play-button">
				<i class="${buttonIconClass}"></i>
				<div class="${buttonTextClass}-txt">${buttonText}</div>
			</div>
		</div>`;

	// Create game blocks
	const newGameBlocks = document.createElement("div");
	newGameBlocks.classList.add("app-block", `${launchernickname}-block"`, `${gamenickname}-block`, gamenickname);
	newGameBlocks.innerHTML = `
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

	allBlocks.appendChild(newGameBlocks);
	pagesBlocksLang();
}

// Search for games according to the keyword
function search() {
	const fs = require('fs');
	const keywordFile = "/tmp/regataos-gcs/search.txt"
	const readKeyword = fs.readFileSync(keywordFile, "utf8");

	if (readKeyword.length >= 2) {
		const jsonDefaultDir = "/opt/regataos-gcs/games-list"
		const jsonFiles = fs.readdirSync(jsonDefaultDir);
		let contentBrake = 0;

		for (let i = 0; i < jsonFiles.length; i++) {
			const gameInfo = fs.readFileSync(`${jsonDefaultDir}/${jsonFiles[i]}`, "utf8");
			const listGames = JSON.parse(gameInfo);

			listGames.forEach((game) => {
				const { gamename, gamenickname, gamenative, game_img1, gamerun_appid, launcher, launchernickname, gamekeywords } = game;
				const { en, pt } = game.gamekeywords;
				const keywordLanguage = en || gamekeywords;
				const showResults = keywordLanguage && (keywordLanguage.includes(readKeyword) || readKeyword.includes(pt));

				if (showResults) {
					handleCssClass("add", "show-element", ["title-top", "display-search-keyword"]);

					if (contentBrake >= 16) {
						return;
					} else {
						const allBlocks = document.querySelector("#account-games");
						const searchResult = allBlocks.querySelector(`div.${gamenickname}-block`);
						if (searchResult == null) {
							contentBrake = contentBrake + 1;
							listSearchedGames(gamename, gamenickname, gamenative, game_img1, gamerun_appid, launcher, launchernickname);
						}
					}
				}
			});
		}

		// If no results were found, display unsuccessful search message
		const noResults = document.querySelector(".app-block");
		if (!noResults) {
			handleCssClass("add", "show-element", ["noresultsfound", "search-results"]);
		}
	}
}
search();

// Load more games when the user scrolls to the end of the page.
$(window).scroll(function () {
	if ($(document).height() == $(window).scrollTop() + $(window).height()) {
		search();
	}
});
