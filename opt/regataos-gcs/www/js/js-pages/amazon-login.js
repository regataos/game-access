// Get url to login to Amazon Games 
function amazonLoginUrl() {
	const fs = require('fs');
	const amazonLoginFile = "/tmp/regataos-gcs/amazon-login.json";

	fs.readFile(amazonLoginFile, 'utf8', (erro, data) => {
		if (erro) {
			console.error('Error reading file:', erro);
			return;
		}

		try {
			const amazonLogin = JSON.parse(data);
			const loginUrl = amazonLogin.url;
			window.location.href = loginUrl;
		} catch (erro) {
			console.error('Error when parsing JSON:', erro);
		}
	});
}

// Open a pop-up that allows login to Amazon Games
function openUrl() {
	let popupUrl = "";
	const amazonLoginFile = "/tmp/regataos-gcs/amazon-login.json";
	const { execSync } = require('child_process');

	try {
		execSync(`/opt/regataos-gcs/tools/nile/nile auth --login --non-interactive > "${amazonLoginFile}"`);
		popupUrl = window.open("./../pages/go-amazon.html", 'popup');
	} catch (erro) {
		console.error('An error occurred while executing the command:', erro);
	}

	document.getElementById("login-button").style.pointerEvents = "none";

	setTimeout(function () {
		popupUrl.focus();
		document.getElementById("login-button").style.pointerEvents = "auto";
	}, 3000);
}

// Save login id to a cache file
function saveLoginId(authorizationCode) {
	const fs = require('fs');

	const amazonLoginFile = "/tmp/regataos-gcs/amazon-login.json";

	fs.readFile(amazonLoginFile, 'utf8', (erro, data) => {
		if (erro) {
			console.error('Error reading file:', erro);
			return;
		}

		try {
			const amazonLogin = JSON.parse(data);
			const clientId = amazonLogin.client_id;
			const codeVerifier = amazonLogin.code_verifier;
			const serial = amazonLogin.serial;

			const forLogin = `--code ${authorizationCode} --client-id ${clientId} --code-verifier ${codeVerifier} --serial ${serial}`;
			fs.writeFileSync("/tmp/regataos-gcs/login-amazon-games.txt", forLogin, "utf8");

		} catch (erro) {
			console.error('Error when parsing JSON:', erro);
		}
	});

	fs.writeFileSync("/tmp/regataos-gcs/config/file-status.txt", "user account change", "utf8");
	let commandLine = "";

	setTimeout(function () {
		if (!fs.existsSync("/opt/wine-gcs/bin/wine")) {
			commandLine = '/opt/regataos-gcs/scripts/install/scripts-install/download-wine-gcs.sh; \
			/opt/regataos-gcs/scripts/show-amazon-games.sh & \
			/opt/regataos-gcs/scripts/install/scripts-install/install-game-amazon/prepare-compatibility-mode.sh';
		} else {
			commandLine = '/opt/regataos-gcs/scripts/show-amazon-games.sh & \
			/opt/regataos-gcs/scripts/install/scripts-install/install-game-amazon/prepare-compatibility-mode.sh';
		}
		runShellScript(commandLine)
	}, 1000);
}

// Verify that Amazon Games login has already been performed
window.onmessage = function (e) {
	if (e.data) {
		const authorizationCode = e.data;
		saveLoginId(authorizationCode);
	}
};

// Check if the user is logged in and if the games available in the Amazon Games 
// account should be displayed on the screen.
let hideLoginScreenInterval = "";

function hideLoginScreen() {
	const fs = require("fs");

	function showGameBlocks() {
		const showInstalledGamesFile = "/tmp/regataos-gcs/config/installed/show-installed-games-amazon.txt";

		handleCssClass("add", "show-games", "list-account-games");
		handleCssClass("add", "hide-element", ["loading", "loading-games", "amazon-login"]);
		handleCssClass("remove", "grid-element", "amazon-login");
		handleCssClass("remove", "show-element", ["loading", "loading-games"]);

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
		handleCssClass("add", "show-element", ["page-buttons", "blocks3-universal"]);
		handleCssClass("remove", "hide-element", ["page-buttons", "blocks3-universal"]);
		handleCssClass("remove", "body-epic-background", "body-page");
		handleCssClass("add", "body-no-background", "body-page");

		const statusLoadGames = sessionStorage.getItem("loaded");
		if ((statusLoadGames) && (statusLoadGames.includes("false"))) {
			sessionStorage.setItem("loaded", "true");
			detectLogin();
		}

		clearInterval(hideLoginScreenInterval);
	}

	function showLoginScreen() {
		if (fs.existsSync("/tmp/regataos-gcs/login-amazon-games.txt")) {
			handleCssClass("remove", "grid-element", "amazon-login");
			handleCssClass("remove", "body-amazon-img", "body-page");
			handleCssClass("add", "show-element", ["loading", "loading-games"]);
		} else {
			handleCssClass("remove", "hide-element", "amazon-login");
			handleCssClass("add", "grid-element", "amazon-login");
			handleCssClass("add", "body-amazon-img", "body-page");
			handleCssClass("remove", "show-element", ["loading", "loading-games"]);
		}

		sessionStorage.setItem("loaded", "false");
		handleCssClass("remove", "show-title-games-available", "universal-account-title");
		handleCssClass("remove", "title-games-available-min", "universal-account-title");
		handleCssClass("remove", "show-element", ["page-buttons", "blocks3-universal", "universal-installed-title"]);
		handleCssClass("add", "hide-element", ["page-buttons", "blocks3-universal"]);
		handleCssClass("remove", "show-games", ["list-installed-games", "list-account-games"]);
	}

	// Old verification method. This may be removed in the future.
	const oldcheckUserLoginFile = "/tmp/regataos-gcs/config/amazon-games/show-games.txt";
	const checkUserLogin = fs.existsSync(oldcheckUserLoginFile);
	checkUserLogin ? showGameBlocks() : showLoginScreen();
}
hideLoginScreen();

function detectLoggedAccount() {
	const fs = require("fs");
	if (!fs.existsSync("/tmp/regataos-gcs/config/amazon-games/show-games.txt")) {
		hideLoginScreenInterval = setInterval(hideLoginScreen, 1000);
	} else {
		hideLoginScreen();
	}
}
detectLoggedAccount();

// Hide the "install" button when the launcher is already installed.
function hideInstallButtonLauncher() {
	const fs = require("fs");
	const fileWithInstalledLaunchers = "/tmp/regataos-gcs/config/installed-launchers.conf";
	const installedLaunchers = fs.readFileSync(fileWithInstalledLaunchers, "utf8");

	const seeMoreButtonAmazon = document.querySelector(".amazon-more");
	const installButtonAmazon = document.querySelector(".amazon-install");

	if (installedLaunchers.includes("amazon")) {
		seeMoreButtonAmazon.classList.add("show-element");
		installButtonAmazon.classList.remove("show-element");
	} else {
		seeMoreButtonAmazon.classList.remove("show-element");
		installButtonAmazon.classList.add("show-element");
	}
}
hideInstallButtonLauncher();

// Detect changes in launcher installation and execute specific functions
function detectInstallationLaunchers() {
	const fs = require("fs");

	if (!fs.existsSync("/tmp/regataos-gcs/config/amazon-games/show-games.txt")) {
		return;
	}

	hideInstallButtonLauncher();

	const fileWithInstalledLaunchers = "/tmp/regataos-gcs/config/installed-launchers.conf";
	fs.watchFile(fileWithInstalledLaunchers, function () {
		hideInstallButtonLauncher();
	});
}
detectInstallationLaunchers();
