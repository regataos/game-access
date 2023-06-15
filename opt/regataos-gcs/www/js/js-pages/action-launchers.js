// Run shell process including scripts and commands
function runShellProcessLauncher(commandLine) {
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

// If necessary, activate the installation confirmation box or run the launcher
function run_launcher(launcher_name) {
	// Run the launcher if installed or ask if you should install
	const fs = require('fs');
	const installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

	if (installed_launchers.indexOf(launcher_name) > -1) {
		const execute = {
			battlenet: "Battle.net.desktop",
			epicstore: "Epic Games Launcher.desktop",
			gog: "GOG GALAXY.desktop",
			origin: "Origin.desktop",
			eadesktop: "EALauncher.desktop",
			rockstar: "Rockstar Games Launcher.desktop",
			ubisoftconnect: "Ubisoft Connect.desktop"
		};

		const runLauncher = `/opt/regataos-gcs/scripts/action-games/auto-close-game-access &
		cd /opt/regataos-wine/desktop-files/;
		gtk-launch "${execute[launcher_name]}"`;

		runShellProcessLauncher(runLauncher);

	} else {
		const confirmInstalation = `echo "${launcher_name}" > "/tmp/regataos-gcs/confirm-installation"`;
		runShellProcessLauncher(confirmInstalation);
	}
}

// Open the Steam client
function run_steam_client() {
	const runSteam = `/opt/regataos-gcs/scripts/action-games/auto-close-game-access &
	cd /usr/share/applications/; gtk-launch "steam.desktop"`;
	runShellProcessLauncher(runSteam);
}

// Remove user account
function remove_user_account_epicstore() {
	const removeAccountEpic = 'echo "remove account" > "/tmp/regataos-gcs/remove-user-account-epicstore.txt"';
	runShellProcessLauncher(removeAccountEpic);
}

// Check if you have logged in to the Epic Games Store
function legendary_status() {
	const fs = require("fs");

	if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-egs.txt")) {
		const legendaryStatus = '/opt/regataos-gcs/tools/legendary/legendary status';
		runShellProcessLauncher(legendaryStatus);
	}
}
legendary_status();
