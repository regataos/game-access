// This script performs actions for the games
//If necessary, request the installation of the launcher
function show_confirm_install() {
	const exec = require('child_process').exec;
	var command_line = 'echo "' + launchername + '" > "/tmp/regataos-gcs/confirm-installation"';
	exec(command_line,function(error,call,errlog){
	});
}

// Auto close Game Access
function autoCloseGameAccess() {
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

			const goPage = 'echo "'+ pagename +'" > "/tmp/regataos-gcs/go-page-auto"';
			exec(goPage,function(error,call,errlog){
			});

			setTimeout(function(){
				const gameStarted = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				exec(gameStarted,function(error,call,errlog){
				});
			}, 15000);
		}
	}
}

// Function to run games
function run_game() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	if ((installed_launchers.indexOf(launchername) > -1) == "1") {
		var command_line = 'export GAMEVAR="' + winevariable + '"; export GAME="' + gamename + '"; export LAUNCHER="' + launchername + '"; export RUNGAME="' + rungame + '"; /opt/regataos-gcs/scripts/action-games/rungame';
		exec(command_line,function(error,call,errlog){
		});

		autoCloseGameAccess();

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
			$("." + gamename + "-hover .play-box-universal").css("opacity", ".5")
			$("." + gamename + "-hover .play-box-universal").css("cursor", "default")
			$("." + gamename + "-hover .play-box-universal").css("pointer-events", "none");
		},1000);

		setTimeout(function(){
			$("." + gamename + "-hover .play-box-universal").css("opacity", "1")
			$("." + gamename + "-hover .play-box-universal").css("cursor", "pointer")
			$("." + gamename + "-hover .play-box-universal").css("pointer-events", "auto");
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

		show_confirm_install();
	}
}

// Run Steam game
function run_steam_game() {
    const exec = require('child_process').exec;

	var command_line = 'export GAMEID="' + gameid + '"; /opt/regataos-gcs/scripts/action-games/rungame-steam';
    exec(command_line,function(error,call,errlog){
    });

	autoCloseGameAccess();

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

// Uninstall game from Epic Games Store
function uninstall_epicstore_game() {
	const exec = require('child_process').exec;
	var command_line = 'echo "' + game_for_remove + '" > "/tmp/regataos-gcs/start-uninstallation-epicstore.txt"';
	exec(command_line,function(error,call,errlog){
	});
}

// Run game from Epic Games Store
function run_epicstore_game() {
    const exec = require('child_process').exec;
    const command_line = `export GAMEID="${gameid}"; /opt/regataos-gcs/scripts/action-games/rungame-epicstore`;
    exec(command_line,function(error,call,errlog){
    });

	autoCloseGameAccess();

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

// Start installing game from GOG Galaxy
function install_gog_game() {
    const exec = require('child_process').exec;
	var command_line = 'export GAME_NIcKNAME="' + gamenickname + '"; /opt/regataos-gcs/scripts/action-games/install-game-gog';
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

// Uninstall game from GOG Galaxy
function uninstall_gog_game() {
	const exec = require('child_process').exec;
	var command_line = 'echo "' + game_for_remove + '" > "/tmp/regataos-gcs/start-uninstallation-gog.txt"';
	exec(command_line,function(error,call,errlog){
	});
}

// Run game from GOG Galaxy
function run_gog_game() {
    const exec = require('child_process').exec;
    var command_line = 'export GAME_NIcKNAME="' + gamenickname + '"; /opt/regataos-gcs/scripts/action-games/rungame-gog';
    exec(command_line,function(error,call,errlog){
    });

	autoCloseGameAccess();

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
