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

	var command_line = 'export GAMEID="' + gameid + '"; /opt/regataos-gcs/scripts/action-games/rungame-steam';
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
		var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}, 5000);

	setTimeout(function(){
		$("." + gamenickname + "-block .play-box-universal").css("opacity", ".5")
		$("." + gamenickname + "-block .play-box-universal").css("cursor", "default")
		$("." + gamenickname + "-block .play-box-universal").css("pointer-events", "none");
	},1000);

	setTimeout(function(){
		$("." + gamenickname + "-block .play-box-universal").css("opacity", "1")
		$("." + gamenickname + "-block .play-box-universal").css("cursor", "pointer")
		$("." + gamenickname + "-block .play-box-universal").css("pointer-events", "auto");
	},10000);
}

// Install Steam game
function install_steam_game() {
    const exec = require('child_process').exec;
    var command_line = 'steam steam://rungameid/' + gameid + ' & sleep 10; steam steam://open/downloads';
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	setTimeout(function(){
		$("." + gamenickname + "-block .install-box-universal").css("opacity", ".5")
		$("." + gamenickname + "-block .install-box-universal").css("cursor", "default")
		$("." + gamenickname + "-block .install-box-universal").css("pointer-events", "none");
	},1000);

	setTimeout(function(){
		$("." + gamenickname + "-block .install-box-universal").css("opacity", "1")
		$("." + gamenickname + "-block .install-box-universal").css("cursor", "pointer")
		$("." + gamenickname + "-block .install-box-universal").css("pointer-events", "auto");
	},15000);
}

// Start installing game from Epic Games Store
function install_epicstore_game() {
    const exec = require('child_process').exec;
	var command_line = 'echo "' + gamenickname + '" > "/tmp/regataos-gcs/start-installation-epicstore.txt"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});

	setTimeout(function(){
		$("." + gamenickname + "-block .install-box-universal").css("opacity", ".5")
		$("." + gamenickname + "-block .install-box-universal").css("cursor", "default")
		$("." + gamenickname + "-block .install-box-universal").css("pointer-events", "none");
	},1000);

	setTimeout(function(){
		$("." + gamenickname + "-block .install-box-universal").css("opacity", "1")
		$("." + gamenickname + "-block .install-box-universal").css("cursor", "pointer")
		$("." + gamenickname + "-block .install-box-universal").css("pointer-events", "auto");
	},5000);
}

// Start installing game from GOG Galaxy
function install_gog_game() {
    const exec = require('child_process').exec;
	var command_line = 'export GAME_NIcKNAME="' + gamenickname + '"; /opt/regataos-gcs/scripts/action-games/install-game-gog';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});

	setTimeout(function(){
		$("." + gamenickname + "-block .install-box-universal").css("opacity", ".5")
		$("." + gamenickname + "-block .install-box-universal").css("cursor", "default")
		$("." + gamenickname + "-block .install-box-universal").css("pointer-events", "none");
	},1000);

	setTimeout(function(){
		$("." + gamenickname + "-block .install-box-universal").css("opacity", "1")
		$("." + gamenickname + "-block .install-box-universal").css("cursor", "pointer")
		$("." + gamenickname + "-block .install-box-universal").css("pointer-events", "auto");
	},50000);
}

// Uninstall game from Epic Games Store
function uninstall_epicstore_game() {
	const exec = require('child_process').exec;
	var command_line = 'echo "' + game_for_remove + '" > "/tmp/regataos-gcs/start-uninstallation-epicstore.txt"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

// Run game from Epic Games Store
function run_epicstore_game() {
    const exec = require('child_process').exec;
    var command_line = 'export GAMEID="' + gameid + '"; /opt/regataos-gcs/scripts/action-games/rungame-epicstore';
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
		var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}, 5000);

	setTimeout(function(){
		$("." + gamenickname + "-block .play-box-universal").css("opacity", ".5")
		$("." + gamenickname + "-block .play-box-universal").css("cursor", "default")
		$("." + gamenickname + "-block .play-box-universal").css("pointer-events", "none");
	},1000);

	setTimeout(function(){
		$("." + gamenickname + "-block .play-box-universal").css("opacity", "1")
		$("." + gamenickname + "-block .play-box-universal").css("cursor", "pointer")
		$("." + gamenickname + "-block .play-box-universal").css("pointer-events", "auto");
	},10000);
}

// Uninstall game from GOG Galaxy
function uninstall_gog_game() {
	const exec = require('child_process').exec;
	var command_line = 'echo "' + game_for_remove + '" > "/tmp/regataos-gcs/start-uninstallation-gog.txt"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

// Run game from GOG Galaxy
function run_gog_game() {
    const exec = require('child_process').exec;
    var command_line = 'export GAME_NIcKNAME="' + gamenickname + '"; /opt/regataos-gcs/scripts/action-games/rungame-gog';
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
		var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}, 5000);

	setTimeout(function(){
		$("." + gamenickname + "-block .play-box-universal").css("opacity", ".5")
		$("." + gamenickname + "-block .play-box-universal").css("cursor", "default")
		$("." + gamenickname + "-block .play-box-universal").css("pointer-events", "none");
	},1000);

	setTimeout(function(){
		$("." + gamenickname + "-block .play-box-universal").css("opacity", "1")
		$("." + gamenickname + "-block .play-box-universal").css("cursor", "pointer")
		$("." + gamenickname + "-block .play-box-universal").css("pointer-events", "auto");
	},50000);
}

// Show suggested games or titles available in the user's library
function run_search_gog_games() {
	const exec = require('child_process').exec;
	var command_line = '/opt/regataos-gcs/scripts/search-gog-games.sh';
	exec(command_line,function(error,call,errlog){
	});
}
run_search_gog_games()

setTimeout(function(){
	setInterval(function(){
		run_search_gog_games()
	}, 1000);
}, 1000);
