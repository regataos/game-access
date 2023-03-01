// Auto close Game Access
function autoCloseGcs() {
	const exec = require('child_process').exec;
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

			const goPage = 'echo "' + pagename + '" > "/tmp/regataos-gcs/go-page-auto"';
			exec(goPage, function (error, call, errlog) {
			});

			setTimeout(function () {
				const gameStarted = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				exec(gameStarted, function (error, call, errlog) {
				});
			}, 15000);
		}
	}
}

// Stilde functions
function slide_function1() {
	setTimeout(function () {
		sessionStorage.setItem("game-gcs-id", "lol");
		window.location.href = './../pages/gcs-games.html';
	}, 500);
}

function slide_function2() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	const listInstalledLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	const listInstalledGames = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");

	if ((listInstalledLaunchers.indexOf("origin") > -1) == "1") {
		const runLauncher = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "EALauncher.desktop"';
		exec(runLauncher, function (error, call, errlog) {
		});

		autoCloseGcs();

	} else {
		const installLancher = 'echo "eadesktop" > "/tmp/regataos-gcs/confirm-installation"';
		exec(installLancher, function (error, call, errlog) {
		});
	}
}

function slide_function3() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	const listInstalledLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	const listInstalledGames = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");

	if ((listInstalledLaunchers.indexOf("battlenet") > -1) == "1") {
		if ((listInstalledGames.indexOf("overwatch") > -1) == "1") {
			if (fs.existsSync("/usr/share/applications/gcs-slide-function3.desktop")) {
				const runLauncher = 'gtk-launch "gcs-slide-function3.desktop"';
				exec(runLauncher, function (error, call, errlog) {
				});

			} else {
				const runGame = `
				export GAME="overwatch";
				export LAUNCHER="battlenet";
				export RUNGAME="Pro";
				/opt/regataos-gcs/scripts/action-games/rungame`;
				exec(runGame, function (error, call, errlog) {
				});
			}

			autoCloseGcs();

		} else {
			const runLauncher = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Battle.net.desktop"';
			exec(runLauncher, function (error, call, errlog) {
			});

			autoCloseGcs();
		}

	} else {
		const installLancher = 'echo "battlenet" > "/tmp/regataos-gcs/confirm-installation"';
		exec(installLancher, function (error, call, errlog) {
		});
	}
}

function slide_function4() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	const listInstalledLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

	if ((listInstalledLaunchers.indexOf("epicstore") > -1) == "1") {
		const runLauncher = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Epic Games Launcher.desktop"';
		exec(runLauncher, function (error, call, errlog) {
		});

	} else {
		if (fs.existsSync("/tmp/regataos-gcs/config/installed/rocket-league-epicstore.json")) {
			if (fs.existsSync("/usr/share/applications/gcs-slide-function4.desktop")) {
				const runLauncher = 'gtk-launch "gcs-slide-function4.desktop"';
				exec(runLauncher, function (error, call, errlog) {
				});

			} else {
				const runEpicGame = 'export GAMEID="Sugar"; /opt/regataos-gcs/scripts/action-games/rungame-epicstore';
				exec(runEpicGame, function (error, call, errlog) {
				});
			}

			autoCloseGcs();

		} else if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/json/rocket-league-epicstore.json")) {
			const installEpicGame = 'echo "rocket-league" > "/tmp/regataos-gcs/start-installation-epicstore.txt"';
			exec(installEpicGame, function (error, call, errlog) {
			});

		} else {
			if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-egs.txt")) {
				window.open("https://www.epicgames.com/store/p/rocket-league", 'popup')

			} else {
				url = "./../pages/epicstore-games.html";
				window.location.assign(url)
			}
		}
	}
}
