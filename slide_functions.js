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
		if ((listInstalledGames.indexOf("ts4") > -1) == "1") {
			const runGame = `
			export GAME="ts4";
			export LAUNCHER="origin";
			export RUNGAME="origin://LaunchGame/OFB-EAST:109552299";
			/opt/regataos-gcs/scripts/action-games/rungame`;
			exec(runGame, function (error, call, errlog) {
			});

		} else {
			const runLauncher = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Origin.desktop"';
			exec(runLauncher, function (error, call, errlog) {
			});
		}

	} else {
		const installLancher = 'echo "origin" > "/tmp/regataos-gcs/confirm-installation"';
		exec(installLancher, function (error, call, errlog) {
		});
	}
}

function slide_function3() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	const listInstalledLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	const listInstalledGames = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");

	if ((listInstalledLaunchers.indexOf("origin") > -1) == "1") {
		if ((listInstalledGames.indexOf("bfv") > -1) == "1") {
			const runGame = `
			export GAME="bfv";
			export LAUNCHER="origin";
			export RUNGAME="origin://LaunchGame/Origin.OFR.50.0004662";
			/opt/regataos-gcs/scripts/action-games/rungame`;
			exec(runGame, function (error, call, errlog) {
			});

		} else {
			const runLauncher = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Origin.desktop"';
			exec(runLauncher, function (error, call, errlog) {
			});
		}

	} else {
		const installLancher = 'echo "origin" > "/tmp/regataos-gcs/confirm-installation"';
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
		if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-egs.txt")) {
			window.open("https://www.epicgames.com/store/p/control", 'popup')

		} else {
			url = "./../pages/epicstore-games.html";
			window.location.assign(url)
		}
	}
}
