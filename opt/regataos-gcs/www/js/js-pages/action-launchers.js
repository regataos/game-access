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
function remove_user_account(launcher) {
	const removeAccount = `echo "${launcher}" > "/tmp/regataos-gcs/remove-user-account.txt"`;
	runShellProcessLauncher(removeAccount);
}

// Check if you have logged in to the Epic Games Store
function legendary_status() {
	const fs = require("fs");

	if (fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-games.txt")) {
		const legendaryStatus = '/opt/regataos-gcs/tools/legendary/legendary status';
		runShellProcessLauncher(legendaryStatus);
	}
}
legendary_status();

// Detect changes in launcher installation and execute specific functions
function detectInstallationLaunchers() {
	const fs = require("fs");

	if (!fs.existsSync("/tmp/regataos-gcs/config/epicstore-games/show-games.txt")) {
		return;
	}

	hideInstallButtonLauncher();

	const fileWithInstalledLaunchers = "/tmp/regataos-gcs/config/installed-launchers.conf";
	fs.watchFile(fileWithInstalledLaunchers, function () {
		hideInstallButtonLauncher();
	});
}
detectInstallationLaunchers();

// Cancel user account removal
function cancel_remove_account() {
	const fs = require('fs');
	const removeUserAccountFile = "/tmp/regataos-gcs/remove-user-account.txt";
	handleCssClass("remove", "show-element", "remove-user-account");
	if (fs.existsSync(removeUserAccountFile)) {
		fs.unlinkSync(removeUserAccountFile);
	}
}

// Proceed with user account removal
function remove_account_launcher() {
	const fs = require('fs');
	const checkLauncher = fs.readFileSync("/tmp/regataos-gcs/remove-user-account.txt", "utf8");
	const commandLine = `/opt/regataos-gcs/scripts/remove-user-account -${checkLauncher}`;

	handleCssClass("remove", "show-element", "remove-user-account");
	fs.unlinkSync("/tmp/regataos-gcs/remove-user-account.txt");

	setTimeout(function () {
		runShellScript(commandLine);
	}, 2000);
}
