// This script performs actions for the games
//If necessary, request the installation of the launcher
function show_confirm_install() {
	const exec = require('child_process').exec;

	var command_line = 'echo "' + launchername + '" > "/tmp/regataos-gcs/confirm-installation"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

// Function to run games
function run_game() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	if ((installed_launchers.indexOf(launchername) > -1) == "1") {
		var command_line = 'export GAMEVAR="' + winevariable + '"; export GAME="' + gamename + '"; export LAUNCHER="' + launchername + '"; export RUNGAME="' + rungame + '"; /opt/regataos-gcs/scripts/action-games/rungame';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});

		var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});

		var pageurl = window.location.href
    	var urlsplit = pageurl.split("pages/")[1];
		var pagename = urlsplit.replace('.html', '');

		if ((pagename.indexOf("installed") > -1) == "1") {
			var command_line = 'echo "installed" > "/tmp/regataos-gcs/go-page-auto"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});

		} else {
			var command_line = 'echo "'+ pagename +'" > "/tmp/regataos-gcs/go-page-auto"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
		}

		setTimeout(function(){
			$("." + gamename + "-hover .play-box").css("opacity", ".5")
			$("." + gamename + "-hover .play-box").css("cursor", "default")
			$("." + gamename + "-hover .play-box").css("pointer-events", "none");
		},1000);

		setTimeout(function(){
			$("." + gamename + "-hover .play-box").css("opacity", "1")
			$("." + gamename + "-hover .play-box").css("cursor", "pointer")
			$("." + gamename + "-hover .play-box").css("pointer-events", "auto");
		},30000);

		setTimeout(function(){
			$("." + gamename + "-hover .install-box").css("opacity", ".5")
			$("." + gamename + "-hover .install-box").css("cursor", "default")
			$("." + gamename + "-hover .install-box").css("pointer-events", "none");
		},1000);

		setTimeout(function(){
			$("." + gamename + "-hover .install-box").css("opacity", "1")
			$("." + gamename + "-hover .install-box").css("cursor", "pointer")
			$("." + gamename + "-hover .install-box").css("pointer-events", "auto");
		},8000);

	} else {
		show_confirm_install();
	}
}

// Run Steam game
function run_steam_game() {
    const exec = require('child_process').exec;
	const fs = require("fs");

	// Verify that hybrid graphics are supported and run with the dGPU
	if (fs.existsSync("/tmp/regataos-prime/use-hybrid-graphics.txt")) {
    	var command_line = 'regataos-dgpu gamemoderun steam steam://rungameid/' + gameid;
	} else {
    	var command_line = 'gamemoderun steam steam://rungameid/' + gameid;
	}

    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

// Install Steam game
function install_steam_game() {
    const exec = require('child_process').exec;

    var command_line = 'steam steam://rungameid/' + gameid + ' & sleep 10; steam steam://open/downloads';
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}
