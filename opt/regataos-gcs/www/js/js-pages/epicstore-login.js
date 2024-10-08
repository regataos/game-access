// Open a pop-up that allows login to launcher
function openUrl() {
	const popup = window.open("./../pages/go-egs.html", 'popup')
	document.getElementById("login-button").style.pointerEvents = "none";

	setTimeout(function () {
		popup.focus();
		document.getElementById("login-button").style.pointerEvents = "auto";
	}, 3000);
}

// Save login id to a cache file
function saveLoginId(loginId) {
	const fs = require('fs');
	fs.writeFileSync("/tmp/regataos-gcs/login-id.txt", loginId, "utf8");
	fs.writeFileSync("/tmp/regataos-gcs/config/file-status.txt", "user account change", "utf8");
	let commandLine = "";

	setTimeout(function () {
		if (!fs.existsSync("/opt/wine-gcs/bin/wine")) {
			commandLine = '/opt/regataos-gcs/scripts/install/scripts-install/download-wine-gcs.sh; \
			/opt/regataos-gcs/scripts/show-epicstore-games.sh & \
			/opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/prepare-compatibility-mode.sh';
		} else {
			commandLine = '/opt/regataos-gcs/scripts/show-epicstore-games.sh & \
			/opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/prepare-compatibility-mode.sh';
		}
		runShellScript(commandLine)
	}, 1000);
}

// Verify that Epic Games Store login has already been performed
window.onmessage = function (e) {
	if (e.data) {
		const loginId = e.data;
		saveLoginId(loginId);
	}
};

// Hide the "install" button when the launcher is already installed.
function hideInstallButtonLauncher() {
	const fs = require("fs");
	const fileWithInstalledLaunchers = "/tmp/regataos-gcs/config/installed-launchers.conf";
	const installedLaunchers = fs.readFileSync(fileWithInstalledLaunchers, "utf8");

	const seeMoreButtonEpic = document.querySelector(".epicstore-more");
	const installButtonEpic = document.querySelector(".epicstore-install");
	const installButtonEpic2 = document.querySelector(".install-button-epicstore");

	if (installedLaunchers.includes("epicstore")) {
		seeMoreButtonEpic.classList.add("show-element");
		seeMoreButtonEpic.classList.remove("hide-element");

		installButtonEpic.classList.remove("show-element");
		installButtonEpic.classList.add("hide-element");

		installButtonEpic2.classList.add("button-effect-disabled");
	} else {
		seeMoreButtonEpic.classList.remove("show-element");
		seeMoreButtonEpic.classList.add("hide-element");

		installButtonEpic.classList.add("show-element");
		installButtonEpic.classList.remove("hide-element");

		installButtonEpic2.classList.remove("button-effect-disabled");
	}
}
hideInstallButtonLauncher();

// Check if the user is logged in and if the games available in the Epic Games Store 
// account should be displayed on the screen.
let hideLoginScreenInterval = "";

function hideLoginScreen() {
	const fs = require("fs");

	function showGameBlocks() {
		const showInstalledGamesFile = "/tmp/regataos-gcs/config/installed/show-installed-games-epic.txt";

		handleCssClass("add", "show-games", "list-account-games");
		handleCssClass("add", "hide-element", ["loading", "loading-games", "epicstore-login"]);
		handleCssClass("remove", "grid-element", "epicstore-login");
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

		hideInstallButtonLauncher();
		clearInterval(hideLoginScreenInterval);
	}

	function showLoginScreen() {
		if (fs.existsSync('/tmp/regataos-gcs/login-id.txt')) {
			handleCssClass("remove", "grid-element", "epicstore-login");
			handleCssClass("remove", "body-epic-img", "body-page");
			handleCssClass("add", "show-element", ["loading", "loading-games"]);
		} else {
			handleCssClass("remove", "hide-element", "epicstore-login");
			handleCssClass("add", "grid-element", "epicstore-login");
			handleCssClass("add", "body-epic-img", "body-page");
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
	const oldcheckUserLoginFile = "/tmp/regataos-gcs/config/epicstore-games/show-games.txt";
	const checkUserLogin = fs.existsSync(oldcheckUserLoginFile);
	checkUserLogin ? showGameBlocks() : showLoginScreen();
}
hideLoginScreen();

function detectLoggedAccount() {
	const fs = require("fs");
	if (!fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-games.txt")) {
		hideLoginScreenInterval = setInterval(hideLoginScreen, 1000);
	} else {
		hideLoginScreen();
	}
}
detectLoggedAccount();

// Detect changes in launcher installation and execute specific functions
function detectInstallationLaunchers() {
	const fs = require("fs");
	const fileWithInstalledLaunchers = "/tmp/regataos-gcs/config/installed-launchers.conf";

	fs.watchFile(fileWithInstalledLaunchers, function () {
		hideInstallButtonLauncher();
		console.log("Update elements in the UI...")
	});
}
detectInstallationLaunchers();
