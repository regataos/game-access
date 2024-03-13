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

// Check if the user is logged in and if the games available in the Epic Games Store 
// account should be displayed on the screen.
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
	}

	let hideLoginScreenInterval = "";
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
			clearInterval(hideLoginScreenInterval);
		}

		sessionStorage.setItem("loaded", "false");
		handleCssClass("remove", "show-title-games-available", "universal-account-title");
		handleCssClass("remove", "title-games-available-min", "universal-account-title");
		handleCssClass("remove", "show-element", ["page-buttons", "blocks3-universal", "universal-installed-title"]);
		handleCssClass("add", "hide-element", ["page-buttons", "blocks3-universal"]);
		handleCssClass("remove", "show-games", ["list-installed-games", "list-account-games"]);
	}

	// Old verification method. This may be removed in the future.
	const oldcheckUserLoginFile = "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt";
	const checkUserLogin = fs.existsSync(oldcheckUserLoginFile);
	checkUserLogin ? showGameBlocks() : showLoginScreen();
}
hideLoginScreen();

// Check status to make UI changes.
function checkUiChanges() {
	const fs = require("fs");
	const fileStatus = "/tmp/regataos-gcs/config/file-status.txt";
	const urlPage = window.location.href;

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
				hideLoginScreen();
				listAllGames(urlPage, 16);
				resetInterfaceStatus();
			}, 2000);

		} else if (interfaceStatus.includes("user account change")) {
			hideLoginScreenInterval = setInterval(hideLoginScreen, 1000);
		}
	});
}
checkUiChanges();
