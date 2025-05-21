// Run shell process including scripts and commands
function runShellProcess(commandLine) {
	// Keep the process running independently from
	// the main process using 'spawn'.
	const { spawn } = require('child_process');
	const runCommandLine = spawn(commandLine, {
		shell: true,
		detached: true,
		stdio: 'ignore'
	});

	// Unlink the child process
	runCommandLine.unref();
}

// This script performs actions for the games
//If necessary, request the installation of the launcher
function show_confirm_install() {
	const commandLine = `echo "${launchername}" > "/tmp/regataos-gcs/confirm-installation"`;
	runShellProcess(commandLine);
}

// Auto close Game Access
function autoCloseGameAccess() {
	const fs = require("fs");

	const checkConfigFileData = fs.readFileSync("/tmp/regataos-gcs/config/regataos-gcs.conf", "utf8");
	const configOption = "auto-close="

	// Check configuration files
	function checkConfigFile(data, desiredString) {
		const searchString = new RegExp(`(?<=${desiredString}).*`, "g");

		let systemConfig = data.match(searchString)[0];
		systemConfig = systemConfig.toLowerCase();
		systemConfig = systemConfig.replace(/:.*/g, '');
		return systemConfig;
	}

	if (checkConfigFileData.includes("auto-close")) {
		const autoClose = checkConfigFile(checkConfigFileData, configOption);

		if ((autoClose.indexOf("true") > -1) == "1") {
			let pagename = window.location.href
			pagename = pagename.split("pages/")[1];
			pagename = pagename.replace('.html', '');

			const commandLine = `echo "${pagename}" > "/tmp/regataos-gcs/go-page-auto"`;
			runShellProcess(commandLine);
		}
	}
}

// Function to run games
function run_game(gamenickname, launchername, rungame) {
	const fs = require('fs');

	const installedLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	if (installedLaunchers.includes(launchername)) {
		const commandLine = `
		export GAME="${gamenickname}";
		export LAUNCHER="${launchername}";
		export RUNGAME="${rungame}";
		/opt/regataos-gcs/scripts/action-games/auto-close-game-access &
		/opt/regataos-gcs/scripts/action-games/rungame`;
		runShellProcess(commandLine);

		autoCloseGameAccess();

		setTimeout(function () {
			$(`.${gamename}-block .play-box-universal`).css("opacity", ".5")
			$(`.${gamename}-block .play-box-universal`).css("cursor", "default")
			$(`.${gamename}-block .play-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamename}-block .play-box-universal`).css("opacity", "1")
			$(`.${gamename}-block .play-box-universal`).css("cursor", "pointer")
			$(`.${gamename}-block .play-box-universal`).css("pointer-events", "auto");
		}, 30000);

		setTimeout(function () {
			$(`.${gamename}-block .install-box-universal`).css("opacity", ".5")
			$(`.${gamename}-block .install-box-universal`).css("cursor", "default")
			$(`.${gamename}-block .install-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamename}-block .install-box-universal`).css("opacity", "1")
			$(`.${gamename}-block .install-box-universal`).css("cursor", "pointer")
			$(`.${gamename}-block .install-box-universal`).css("pointer-events", "auto");
		}, 8000);

	} else {
		setTimeout(function () {
			$(`.${gamename}-block .install-box-universal`).css("opacity", ".5")
			$(`.${gamename}-block .install-box-universal`).css("cursor", "default")
			$(`.${gamename}-block .install-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamename}-block .install-box-universal`).css("opacity", "1")
			$(`.${gamename}-block .install-box-universal`).css("cursor", "pointer")
			$(`.${gamename}-block .install-box-universal`).css("pointer-events", "auto");
		}, 8000);

		show_confirm_install();
	}
}

// Run Steam game
function run_steam_game(gamenickname, gameid) {
	const fs = require("fs");

	if (!fs.existsSync(`/tmp/regataos-gcs/running-${gamenickname}`)) {
		const commandLine = `
		export GAME_NICKNAME="${gamenickname}";
		export GAME_ID="${gameid}";
		echo "${gamenickname}" > /tmp/regataos-gcs/running-${gamenickname};
		/opt/regataos-gcs/scripts/action-games/auto-close-game-access &
		/opt/regataos-gcs/scripts/action-games/rungame-steam`;

		runShellProcess(commandLine);
		autoCloseGameAccess();

		setTimeout(function () {
			$(`.${gamenickname}-block .play-box-universal`).css("opacity", ".5")
			$(`.${gamenickname}-block .play-box-universal`).css("cursor", "default")
			$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamenickname}-block .play-box-universal`).css("opacity", "1")
			$(`.${gamenickname}-block .play-box-universal`).css("cursor", "pointer")
			$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "auto");
		}, 10000);
	}
}

// Install Steam game
function install_steam_game(gamenickname, gameid) {
	const commandLine = `steam steam://rungameid/${gameid} & sleep 10; steam steam://open/downloads`;
	runShellProcess(commandLine);

	setTimeout(function () {
		$(`.${gamenickname}-block .install-box-universal`).css("opacity", ".5")
		$(`.${gamenickname}-block .install-box-universal`).css("cursor", "default")
		$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "none");
	}, 1000);

	setTimeout(function () {
		$(`.${gamenickname}-block .install-box-universal`).css("opacity", "1")
		$(`.${gamenickname}-block .install-box-universal`).css("cursor", "pointer")
		$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "auto");
	}, 15000);
}

// Start installing game from Epic Games Store
function install_epicstore_game(gamenickname) {
	const fs = require("fs");

	function runInstallation() {
		const commandLine = `echo "${gamenickname}" > "/tmp/regataos-gcs/start-installation-epicstore.txt"`;
		runShellProcess(commandLine);

		setTimeout(function () {
			$(`.${gamenickname}-block .install-box-universal`).css("opacity", ".5")
			$(`.${gamenickname}-block .install-box-universal`).css("cursor", "default")
			$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamenickname}-block .install-box-universal`).css("opacity", "1")
			$(`.${gamenickname}-block .install-box-universal`).css("cursor", "pointer")
			$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "auto");
		}, 5000);
	}

	if (!fs.existsSync(`/tmp/regataos-gcs/installing-${gamenickname}`)) {
		if (fs.existsSync(`/tmp/progressbar-gcs/queued-process`)) {
			let checkInstallQueue = fs.readFileSync("/tmp/progressbar-gcs/queued-process", "utf8");

			if ((checkInstallQueue.indexOf(gamenickname) > -1) == "0") {
				runInstallation();
			}
		} else {
			runInstallation();
		}
	}
}

// Uninstall game from Epic Games Store
function uninstall_epicstore_game(gamenickname) {
	const fs = require("fs");

	const gameToRemove = "/tmp/regataos-gcs/start-uninstallation-epicstore.txt"
	fs.writeFileSync(gameToRemove, gamenickname);

	// Refresh the page
	const fileStatus = "/tmp/regataos-gcs/config/file-status.txt";

	//Before checking UI status changes, clear the cache.
	let interfaceStatus = fs.readFileSync(fileStatus, "utf8");
	if (!interfaceStatus.includes("inactive")) {
		fs.writeFileSync(fileStatus, "inactive", "utf8");
	}

	fs.watch(fileStatus, (eventType, filename) => {
		interfaceStatus = fs.readFileSync(fileStatus, "utf8");
		if (interfaceStatus.includes("rearrange game blocks")) {
			var getPageUrl = window.location.href;
			if ((getPageUrl.includes("search.html")) ||
				(getPageUrl.includes("allgames.html"))) {
				reloadPage(1000);
			}
		}
	});
}

// Run game from Epic Games Store
function run_epicstore_game(gamenickname, gameid) {
	const fs = require("fs");

	if (!fs.existsSync(`/tmp/regataos-gcs/running-${gamenickname}`)) {
		const commandLine = `echo "${gamenickname}" > "/tmp/regataos-gcs/running-${gamenickname}";
		export GAMENICK="${gamenickname}";
		export GAMEID="${gameid}";
		/opt/regataos-gcs/scripts/action-games/auto-close-game-access &
		/opt/regataos-gcs/scripts/action-games/rungame-epicstore`;

		runShellProcess(commandLine);
		autoCloseGameAccess();

		setTimeout(function () {
			$(`.${gamenickname}-block .play-box-universal`).css("opacity", ".5")
			$(`.${gamenickname}-block .play-box-universal`).css("cursor", "default")
			$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamenickname}-block .play-box-universal`).css("opacity", "1")
			$(`.${gamenickname}-block .play-box-universal`).css("cursor", "pointer")
			$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "auto");
		}, 10000);
	}
}

// Start installing game from GOG Galaxy
function install_gog_game(gamenickname) {
	const commandLine = `export GAME_NIcKNAME="${gamenickname}";
	/opt/regataos-gcs/scripts/action-games/install-game-gog`;

	runShellProcess(commandLine);

	setTimeout(function () {
		$(`.${gamenickname}-block .install-box-universal`).css("opacity", ".5")
		$(`.${gamenickname}-block .install-box-universal`).css("cursor", "default")
		$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "none");
	}, 1000);

	setTimeout(function () {
		$(`.${gamenickname}-block .install-box-universal`).css("opacity", "1")
		$(`.${gamenickname}-block .install-box-universal`).css("cursor", "pointer")
		$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "auto");
	}, 50000);
}

// Uninstall game from GOG Galaxy
function uninstall_gog_game(gamenickname) {
	const commandLine = `echo "${gamenickname}" > "/tmp/regataos-gcs/start-uninstallation-gog.txt"`;
	runShellProcess(commandLine);
}

// Run game from GOG Galaxy
function run_gog_game(gamenickname) {
	const commandLine = `export GAME_NIcKNAME="${gamenickname}";
	/opt/regataos-gcs/scripts/action-games/auto-close-game-access &
	/opt/regataos-gcs/scripts/action-games/rungame-gog`;

	runShellProcess(commandLine);
	autoCloseGameAccess();

	setTimeout(function () {
		$(`.${gamenickname}-block .play-box-universal`).css("opacity", ".5")
		$(`.${gamenickname}-block .play-box-universal`).css("cursor", "default")
		$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "none");
	}, 1000);

	setTimeout(function () {
		$(`.${gamenickname}-block .play-box-universal`).css("opacity", "1")
		$(`.${gamenickname}-block .play-box-universal`).css("cursor", "pointer")
		$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "auto");
	}, 50000);
}

// Start installing game from Amazon Games
function install_amazon_game(gamenickname) {
	const fs = require("fs");

	function runInstallation() {
		const commandLine = `echo "${gamenickname}" > "/tmp/regataos-gcs/start-installation-amazon.txt"`;
		runShellProcess(commandLine);

		setTimeout(function () {
			$(`.${gamenickname}-block .install-box-universal`).css("opacity", ".5")
			$(`.${gamenickname}-block .install-box-universal`).css("cursor", "default")
			$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamenickname}-block .install-box-universal`).css("opacity", "1")
			$(`.${gamenickname}-block .install-box-universal`).css("cursor", "pointer")
			$(`.${gamenickname}-block .install-box-universal`).css("pointer-events", "auto");
		}, 5000);
	}

	if (!fs.existsSync(`/tmp/regataos-gcs/installing-${gamenickname}`)) {
		if (fs.existsSync(`/tmp/progressbar-gcs/queued-process`)) {
			let checkInstallQueue = fs.readFileSync("/tmp/progressbar-gcs/queued-process", "utf8");

			if ((checkInstallQueue.indexOf(gamenickname) > -1) == "0") {
				runInstallation();
			}
		} else {
			runInstallation();
		}
	}
}

// Uninstall game from Amazon Games
function uninstall_amazon_game(gamenickname) {
	const fs = require("fs");

	const gameToRemove = "/tmp/regataos-gcs/start-uninstallation-amazon.txt"
	fs.writeFileSync(gameToRemove, gamenickname);

	// Refresh the page
	const fileStatus = "/tmp/regataos-gcs/config/file-status.txt";

	//Before checking UI status changes, clear the cache.
	let interfaceStatus = fs.readFileSync(fileStatus, "utf8");
	if (!interfaceStatus.includes("inactive")) {
		fs.writeFileSync(fileStatus, "inactive", "utf8");
	}

	fs.watch(fileStatus, (eventType, filename) => {
		interfaceStatus = fs.readFileSync(fileStatus, "utf8");
		if (interfaceStatus.includes("rearrange game blocks")) {
			var getPageUrl = window.location.href;
			if ((getPageUrl.includes("search.html")) ||
				(getPageUrl.includes("allgames.html"))) {
				reloadPage(1000);
			}
		}
	});
}

// Run game from Amazon Games
function run_amazon_game(gamenickname, gameid) {
	const fs = require("fs");

	if (!fs.existsSync(`/tmp/regataos-gcs/running-${gamenickname}`)) {
		const commandLine = `echo "${gamenickname}" > "/tmp/regataos-gcs/running-${gamenickname}";
		export GAMENICK="${gamenickname}";
		export GAMEID="${gameid}";
		/opt/regataos-gcs/scripts/action-games/auto-close-game-access &
		/opt/regataos-gcs/scripts/action-games/rungame-amazon`;

		runShellProcess(commandLine);
		autoCloseGameAccess();

		setTimeout(function () {
			$(`.${gamenickname}-block .play-box-universal`).css("opacity", ".5")
			$(`.${gamenickname}-block .play-box-universal`).css("cursor", "default")
			$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "none");
		}, 1000);

		setTimeout(function () {
			$(`.${gamenickname}-block .play-box-universal`).css("opacity", "1")
			$(`.${gamenickname}-block .play-box-universal`).css("cursor", "pointer")
			$(`.${gamenickname}-block .play-box-universal`).css("pointer-events", "auto");
		}, 10000);
	}
}
