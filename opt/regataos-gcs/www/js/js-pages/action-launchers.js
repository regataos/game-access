// If necessary, activate the installation confirmation box or run the launcher
function run_launcher() {
const exec = require('child_process').exec;
const fs = require('fs');

	// Run the launcher if installed or ask if you should install
	const installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

	if (installed_launchers.indexOf(launcher_name) > -1) {

		if ((launcher_name.indexOf("battlenet") > -1) == "1") {
			const runBattlenet = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Battle.net.desktop"';
			console.log(runBattlenet);
			exec(runBattlenet,function(error,call,errlog){
			});

			setTimeout(function(){
				const launchStarted = 'echo "Launcher started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				console.log(launchStarted);
				exec(launchStarted,function(error,call,errlog){
				});
			}, 5000);
		}

		if ((launcher_name.indexOf("epicstore") > -1) == "1") {
			const runEpicstore = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Epic Games Launcher.desktop"';
			console.log(runEpicstore);
			exec(runEpicstore,function(error,call,errlog){
			});

			setTimeout(function(){
				const launchStarted = 'echo "Launcher started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				console.log(launchStarted);
				exec(launchStarted,function(error,call,errlog){
				});
			}, 5000);
		}

		if ((launcher_name.indexOf("gog") > -1) == "1") {
			const runGog = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "GOG GALAXY.desktop"';
			console.log(runGog);
			exec(runGog,function(error,call,errlog){
			});

			setTimeout(function(){
				const launchStarted = 'echo "Launcher started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				console.log(launchStarted);
				exec(launchStarted,function(error,call,errlog){
				});
			}, 5000);
		}

		if ((launcher_name.indexOf("origin") > -1) == "1") {
			const runOrigin = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Origin.desktop"';
			console.log(runOrigin);
			exec(runOrigin,function(error,call,errlog){
			});

			setTimeout(function(){
				const launchStarted = 'echo "Launcher started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				console.log(launchStarted);
				exec(launchStarted,function(error,call,errlog){
				});
			}, 5000);
		}

		if ((launcher_name.indexOf("rockstar") > -1) == "1") {
			const runRockstar = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Rockstar Games Launcher.desktop"';
			console.log(runRockstar);
			exec(runRockstar,function(error,call,errlog){
			});

			setTimeout(function(){
				const launchStarted = 'echo "Launcher started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				console.log(launchStarted);
				exec(launchStarted,function(error,call,errlog){
				});
			}, 5000);
		}

		if ((launcher_name.indexOf("ubisoftconnect") > -1) == "1") {
			const runUbiConnect = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Ubisoft Connect.desktop"';
			console.log(runUbiConnect);
			exec(runUbiConnect,function(error,call,errlog){
			});

			setTimeout(function(){
				const launchStarted = 'echo "Launcher started" > "/tmp/regataos-gcs/running-with-regataos-gcs.txt"';
				console.log(launchStarted);
				exec(launchStarted,function(error,call,errlog){
				});
			}, 5000);
		}

	} else {
		const confirmInstalation = 'echo "' + launcher_name + '" > "/tmp/regataos-gcs/confirm-installation"';
		console.log(confirmInstalation);
		exec(confirmInstalation,function(error,call,errlog){
		});
	}
}

// Open the Steam client
function run_steam_client() {
    const exec = require('child_process').exec;

    const runSteam = 'cd /usr/share/applications/; gtk-launch "steam.desktop"';
    console.log(runSteam);
    exec(runSteam,function(error,call,errlog){
    });
}

// Remove user account
function remove_user_account_epicstore() {
    const exec = require('child_process').exec;

    const removeAccountEpic = 'echo "remove account" > "/tmp/regataos-gcs/remove-user-account-epicstore.txt"';
    console.log(removeAccountEpic);
    exec(removeAccountEpic,function(error,call,errlog){
    });
}

// Check if you have logged in to the Epic Games Store
function legendary_status() {
	const exec = require('child_process').exec;
	const fs = require("fs");

	if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-egs.txt")) {
		const legendaryStatus = '/opt/regataos-gcs/tools/legendary/legendary status';
		exec(legendaryStatus,function(error,call,errlog){
		});
	}
}
legendary_status();
