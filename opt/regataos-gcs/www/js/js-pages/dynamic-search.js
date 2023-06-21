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

// For search page
function listSearchedGames(gameNickname, launcherNickname, jsonDefaultDir) {
	const fs = require("fs");
	const path = require('path');
	let data = "";

	// Directory with JSON files of installed games
	const installedGamesJsonFiles = "/tmp/regataos-gcs/config/installed"

	// Read JSON files with the list of games
	const filePath = fs.existsSync(path.join(jsonDefaultDir, `${gameNickname}-${launcherNickname}.json`))
		? path.join(jsonDefaultDir, `${gameNickname}-${launcherNickname}.json`)
		: path.join(jsonDefaultDir, `${gameNickname}.json`);

	data = fs.readFileSync(filePath, "utf8");
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

		allBlocks.appendChild(newGameBlocks);
		pagesBlocksLang();
	})
	return;
}

// Display elements on the screen with "display: block;"
function showElements(displayElements) {
	const elements = document.querySelectorAll(`.${displayElements.join(", .")}`);
	elements.forEach((element) => {
		element.classList.add("show-element");
	});
}

// Search for games according to the keyword
function search() {
	const fs = require('fs');
	const keywordFile = "/tmp/regataos-gcs/search.txt"
	const readKeyword = fs.readFileSync(keywordFile, "utf8");

	if (readKeyword.length >= 2) {
		const jsonDefaultDir = "/opt/regataos-gcs/games-list"
		const jsonFiles = fs.readdirSync(jsonDefaultDir);

		for (let i = 0; i < jsonFiles.length; i++) {
			const gameInfo = fs.readFileSync(`${jsonDefaultDir}/${jsonFiles[i]}`, "utf8");
			const listGames = JSON.parse(gameInfo);

			listGames.forEach((game) => {
				const gameKeywords = game.gamekeywords.en || game.gamekeywords;

				if (gameKeywords && (gameKeywords.includes(readKeyword) ||
					readKeyword.includes(game.gamekeywords.pt))) {
					listSearchedGames(game.gamenickname, game.launchernickname, jsonDefaultDir);
					showElements(["title-top", "display-search-keyword"]);
				}
			});
		}

		// If no results were found, display unsuccessful search message
		const noResults = document.querySelector(".app-block");
		if (!noResults) {
			showElements(["noresultsfound", "blocks4"]);
		}
	}
}
search();
