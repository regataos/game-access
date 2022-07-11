// Stilde functions
function slide_function1() {
	setTimeout(function(){
        	sessionStorage.setItem("game-gcs-id", "lol");
        	window.location.href = './../pages/gcs-games.html';
	}, 500);
}

function slide_function2() {
const exec = require('child_process').exec;
const fs = require('fs');

var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
if ((installed_launchers.indexOf("battlenet") > -1) == "1") {

	var installed_games = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");
	if ((installed_games.indexOf("overwatch") > -1) == "1") {

		var command_line = 'export GAMEVAR="WINEESYNC=1 WINE_LARGE_ADDRESS_AWARE=1"; export GAME="overwatch"; export LAUNCHER="battlenet"; export RUNGAME=""; /opt/regataos-gcs/scripts/action-games/rungame';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});

	} else {
		var command_line = 'export LAUNCHERVAR="WINEESYNC=1 WINE_LARGE_ADDRESS_AWARE=1"; export LAUNCHER="battlenet"; export RUNLAUNCHER="dosdevices/c:/Program Files (x86)/Battle.net/Battle.net.exe"; /opt/regataos-gcs/scripts/action-games/runlauncher';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}

} else {
	var comando = 'echo "battlenet" > "/tmp/regataos-gcs/confirm-installation"';
	console.log(comando);
	exec(comando,function(error,call,errlog){
	});
}
}

function slide_function3() {
const exec = require('child_process').exec;
const fs = require('fs');

var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
if ((installed_launchers.indexOf("origin") > -1) == "1") {

	var installed_games = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");
	if ((installed_games.indexOf("bfv") > -1) == "1") {

		var command_line = 'export GAMEVAR="WINEESYNC=1 WINE_LARGE_ADDRESS_AWARE=1"; export GAME="bfv"; export LAUNCHER="origin"; export RUNGAME=""; /opt/regataos-gcs/scripts/action-games/rungame';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});

	} else {
		var command_line = 'export LAUNCHERVAR="WINEESYNC=1 WINE_LARGE_ADDRESS_AWARE=1"; export LAUNCHER="origin"; export RUNLAUNCHER="dosdevices/c:/Program Files (x86)/Origin/Origin.exe"; /opt/regataos-gcs/scripts/action-games/runlauncher';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}

} else {
	var comando = 'echo "origin" > "/tmp/regataos-gcs/confirm-installation"';
	console.log(comando);
	exec(comando,function(error,call,errlog){
	});
}
}

function slide_function4() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	if ((installed_launchers.indexOf("epicstore") > -1) == "1") {
		var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Epic Games Launcher.desktop"';
		exec(command_line,function(error,call,errlog){
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
