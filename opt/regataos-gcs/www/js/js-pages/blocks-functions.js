// Stilde functions
function block_function1() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	if ((installed_launchers.indexOf("epicstore") > -1) == "1") {
		var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Epic Games Launcher.desktop"';
		exec(command_line,function(error,call,errlog){
		});

	} else {
		if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-games.txt")) {
			window.open("https://www.epicgames.com/store/free-games", 'popup')

		} else {
			url = "./../pages/epicstore-games.html";
			window.location.assign(url)
		}
	}
}

function block_function2() {
	setTimeout(function(){
        	sessionStorage.setItem("game-gcs-id", "xonotic");
        	window.location.href = './../pages/gcs-games.html';
	}, 500);
}

function block_function3() {
	setTimeout(function(){
        	sessionStorage.setItem("game-gcs-id", "warframe");
        	window.location.href = './../pages/gcs-games.html';
	}, 500);
}
