// If necessary, activate the installation confirmation box or run the launcher
function run_launcher() {
const exec = require('child_process').exec;
const fs = require('fs');

	// Run the launcher if installed or ask if you should install
	var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

	if (installed_launchers.indexOf(launcher_name) > -1) {

		if ((launcher_name.indexOf("battlenet") > -1) == "1") {
			var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Battle.net.desktop"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});

			setTimeout(function(){
			var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
			}, 5000);
		}

		if ((launcher_name.indexOf("epicstore") > -1) == "1") {
			var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Epic Games Launcher.desktop"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});

			setTimeout(function(){
			var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
			}, 5000);
		}

		if ((launcher_name.indexOf("gog") > -1) == "1") {
			var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "GOG GALAXY.desktop"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});

			setTimeout(function(){
			var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
			}, 5000);
		}

		if ((launcher_name.indexOf("origin") > -1) == "1") {
			var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Origin.desktop"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});

			setTimeout(function(){
			var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
			}, 5000);
		}

		if ((launcher_name.indexOf("rockstar") > -1) == "1") {
			var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Rockstar Games Launcher.desktop"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});

			setTimeout(function(){
			var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
			}, 5000);
		}

		if ((launcher_name.indexOf("ubisoftconnect") > -1) == "1") {
			var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Ubisoft Connect.desktop"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});

			setTimeout(function(){
			var command_line = 'echo "Game started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
			}, 5000);
		}

	} else {
		var command_line = 'echo "' + launcher_name + '" > "/tmp/regataos-gcs/confirm-installation"';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}
}

// Open the Steam client
function run_steam_client() {
    const exec = require('child_process').exec;

    var command_line = 'cd /usr/share/applications/; gtk-launch "steam.desktop"';
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

// Remove user account
function remove_user_account_epicstore() {
    const exec = require('child_process').exec;

    var command_line = 'echo "remove account" > "/tmp/regataos-gcs/remove-user-account-epicstore.txt"';
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}


// Check if you have logged in to the Epic Games Store
function legendary_status() {
	const exec = require('child_process').exec;
	const fs = require("fs");

	if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-egs.txt")) {
		var command_line = '/opt/regataos-gcs/tools/legendary/legendary status';
		exec(command_line,function(error,call,errlog){
		});
	}
}
legendary_status();
