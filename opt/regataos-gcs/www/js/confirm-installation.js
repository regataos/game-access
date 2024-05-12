// Open box confirm installation
function show_confirmbox_installation() {
	const fs = require('fs');

	fs.access("/tmp/regataos-gcs/confirm-installation", (err) => {
		if (!err) {
			const launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-installation", "utf8");
			const launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");

			$('.' + launchername + '-install').css('display', 'block')
			window[('confirm_' + launchername + '_installation')]();

			return;
		}
	});
}

// Cancel installation or close confirm box
function cancel_install() {
	const fs = require('fs');
	const launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-installation", "utf8");
	const launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");

	$("." + launchername + "-install").css("display", "none")
	fs.unlinkSync("/tmp/regataos-gcs/confirm-installation");
}

// If prompted, install apps
function install_launcher() {
	const exec = require('child_process').exec;
	const fs = require('fs');

	const launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-installation", "utf8");
	const launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");
	let command_line = "";
	if (!fs.existsSync("/opt/wine-gcs/bin/wine")) {
		command_line = "/opt/regataos-gcs/scripts/install/scripts-install/download-wine-gcs.sh; \
		/opt/regataos-gcs/scripts/install/scripts-install/" + launchername + "-compatibility-mode.sh";
	} else {
		command_line = "/opt/regataos-gcs/scripts/install/scripts-install/" + launchername + "-compatibility-mode.sh";
	}

	exec(command_line, function (error, call, errlog) { });

	cancel_install();

	// Check if the installation is complete
	function installationStarted() {
		const checkInstallationTime = setInterval(checkInstallation, 1000);

		function checkInstallation() {
			if (!fs.existsSync(`/tmp/regataos-gcs/installing-${launchername}`)) {
				clearInterval(checkInstallationTime);
			}
		}
	}

	const checkInstallationStartedTime = setInterval(checkInstallationStarted, 1000);
	function checkInstallationStarted() {
		if (fs.existsSync(`/tmp/regataos-gcs/installing-${launchername}`)) {
			installationStarted();
			clearInterval(checkInstallationStartedTime);
		}
	}
}

// Start installing game
function show_confirmbox_installing_game() {
	const fs = require('fs');
	if (fs.existsSync("/tmp/regataos-gcs/start-installation-epicstore.txt")) {
		document.querySelector(".confirm-start-game-installation").style.display = "block"
	} else if (fs.existsSync("/tmp/regataos-gcs/start-installation-amazon.txt")) {
		document.querySelector(".confirm-start-game-installation-amazon").style.display = "block"
	} else if (fs.existsSync("/tmp/regataos-gcs/start-installation-gcs.txt")) {
		document.querySelector(".confirm-start-game-installation").style.display = "block"
	}
}

// Start uninstall game
function show_confirmbox_uninstall_game() {
	const fs = require('fs');

	fs.access("/tmp/regataos-gcs/start-uninstallation-epicstore.txt", (err) => {
		if (!err) {
			$('.confirm-start-game-uninstallation').css('display', 'block')
			return;
		}
	});

	fs.access("/tmp/regataos-gcs/start-uninstallation-amazon.txt", (err) => {
		if (!err) {
			$('.confirm-start-game-uninstallation-amazon').css('display', 'block')
			return;
		}
	});

	fs.access("/tmp/regataos-gcs/start-uninstallation-gog.txt", (err) => {
		if (!err) {
			$('.confirm-start-game-uninstallation-gog').css('display', 'block')
			return;
		}
	});
}

// Remove user account
function show_remove_user_account() {
	const fs = require('fs');
	const removeUserAccountFile = "/tmp/regataos-gcs/remove-user-account.txt";

	if (fs.existsSync(removeUserAccountFile)) {
		handleCssClass("add", "show-element", "remove-user-account");
		return;
	}
}

setInterval(function () {
	show_confirmbox_installing_game();
	show_confirmbox_uninstall_game();
	show_confirmbox_installation();
	show_remove_user_account();
}, 1500);

// Cancel game installation
function cancel_game_installation() {
	const exec = require('child_process').exec;

	const command_line = "rm -f /tmp/regataos-gcs/start-installation-*.txt";
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-installation').css('display', 'none');
	$('.confirm-start-game-installation-amazon').css('display', 'none');
}

// Enable or disable the default folder for installing games
function default_folder_enabled() {
	const checkBox = document.getElementById("default-folder-enabled");

	if (checkBox.checked == true) {
		document.getElementById("select-installation-folder").disabled = true;
	} else {
		document.getElementById("select-installation-folder").disabled = false;
	}
}

function default_folder_disabled() {
	const checkBox = document.getElementById("default-folder-disabled");

	if (checkBox.checked == true) {
		document.getElementById("select-installation-folder").disabled = true;
	} else {
		document.getElementById("select-installation-folder").disabled = false;
	}
}

// Import game from Epic Games Store
function import_game() {
	$('input[id="select-file"]').change(function (e) {
		const fileinput = document.querySelector('input#select-file');
		const path = fileinput.value;

		if (path) {
			const exec = require('child_process').exec;

			if (fs.existsSync(`${path}/gcs-game.conf`)) {
				const command_line = 'export GAME_PATH="' + path + '"; \
				/opt/regataos-gcs/scripts/install/scripts-install/install-game-gcs/import-gcs-game.sh';
				exec(command_line, function (error, call, errlog) { });
			} else {
				const command_line = 'export GAME_PATH="' + path + '"; \
				/opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/import-epicstore-game.sh';
				exec(command_line, function (error, call, errlog) { });
			}
		}

		$('.confirm-start-game-installation').css('display', 'none')
		fileinput.value = '';
	});
}

// Import game from Amazon Games
function import_game_amazon() {
	$('input[id="select-file"]').change(function (e) {
		const fileinput = document.querySelector('input#select-file');
		const path = fileinput.value;

		if (path) {
			const exec = require('child_process').exec;
			const command_line = 'export GAME_PATH="' + path + '"; \
			/opt/regataos-gcs/scripts/install/scripts-install/install-game-amazon/import-amazon-game.sh';
			exec(command_line, function (error, call, errlog) { });
		}

		$('.confirm-start-game-installation-amazon').css('display', 'none')
		fileinput.value = '';
	});
}

// Install game from Epic Games Store
//Install game using default directory
function install_game_epicstore_default_folder_enabled() {
	const exec = require('child_process').exec;

	const command_line = 'export GAME_PATH=""; /opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/install-epicstore-game.sh';
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-installation').css('display', 'none')
}

//Install game by choosing a specific directory
function install_game_epicstore_default_folder_disabled() {
	$('input[id="select-installation-folder"]').change(function (e) {
		const fileinput = document.querySelector('input#select-installation-folder');
		const path = fileinput.value;

		const exec = require('child_process').exec;
		const command_line = 'export GAME_PATH="' + path + '"; /opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/install-epicstore-game.sh';
		exec(command_line, function (error, call, errlog) {
		});

		$('.confirm-start-game-installation').css('display', 'none')
		fileinput.value = '';
	});
}

// Install game from Amazon Games
//Install game using default directory
function install_game_amazon_default_folder_enabled() {
	const exec = require('child_process').exec;
	const command_line = 'export GAME_PATH=""; \
	/opt/regataos-gcs/scripts/install/scripts-install/install-game-amazon/install-amazon-game.sh';
	exec(command_line, function (error, call, errlog) { });

	$('.confirm-start-game-installation-amazon').css('display', 'none')
}

//Install game by choosing a specific directory
function install_game_amazon_default_folder_disabled() {
	$('input[id="select-installation-folder"]').change(function (e) {
		const fileinput = document.querySelector('input#select-installation-folder');
		const path = fileinput.value;
		const exec = require('child_process').exec;
		const command_line = 'export GAME_PATH="' + path + '"; \
		/opt/regataos-gcs/scripts/install/scripts-install/install-game-amazon/install-amazon-game.sh';
		exec(command_line, function (error, call, errlog) { });

		$('.confirm-start-game-installation-amazon').css('display', 'none')
		fileinput.value = '';
	});
}

// Install game from Game Access
//Install game using default directory
function install_game_gcs_default_folder_enabled() {
	const fs = require("fs");
	let newGameId = fs.readFileSync("/tmp/regataos-gcs/start-installation-gcs.txt", "utf8");
	newGameId = newGameId.replace(/(\r\n|\n|\r)/gm, "");
	newGameId = newGameId.trim();

	const exec = require('child_process').exec;
	const command_line = `export gameNickname="${newGameId}"; export GAME_PATH="";
	/opt/regataos-gcs/scripts/install/scripts-install/install-game-gcs/install-gcs-game.sh`;
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-installation').css('display', 'none')
}

//Install game by choosing a specific directory
function install_game_gcs_default_folder_disabled() {
	$('input[id="select-installation-folder"]').change(function (e) {
		const fileinput = document.querySelector('input#select-installation-folder');
		const path = fileinput.value;

		const fs = require("fs");
		let newGameId = fs.readFileSync("/tmp/regataos-gcs/start-installation-gcs.txt", "utf8");
		newGameId = newGameId.replace(/(\r\n|\n|\r)/gm, "");
		newGameId = newGameId.trim();

		const exec = require('child_process').exec;
		const command_line = `export gameNickname="${newGameId}"; export GAME_PATH="${path}";
		/opt/regataos-gcs/scripts/install/scripts-install/install-game-gcs/install-gcs-game.sh`;
		exec(command_line, function (error, call, errlog) {
		});

		$('.confirm-start-game-installation').css('display', 'none')
		//fileinput.value = '';
	});
}

//Check user preferences for game folder
function default_folder() {
	const checkBox1 = document.getElementById("default-folder-enabled");
	const checkBox2 = document.getElementById("default-folder-disabled");

	if (fs.existsSync("/tmp/regataos-gcs/start-installation-epicstore.txt")) {
		if (checkBox1.checked == true) {
			document.getElementById("select-installation-folder").disabled = true;
			install_game_epicstore_default_folder_enabled();

		} else if (checkBox2.checked == true) {
			document.getElementById("select-installation-folder").disabled = true;
			install_game_epicstore_default_folder_enabled();

		} else {
			document.getElementById("select-installation-folder").disabled = false;
			install_game_epicstore_default_folder_disabled();
		}

	} else if (fs.existsSync("/tmp/regataos-gcs/start-installation-amazon.txt")) {
		if (checkBox1.checked == true) {
			document.getElementById("select-installation-folder").disabled = true;
			install_game_amazon_default_folder_enabled();

		} else if (checkBox2.checked == true) {
			document.getElementById("select-installation-folder").disabled = true;
			install_game_amazon_default_folder_enabled();

		} else {
			document.getElementById("select-installation-folder").disabled = false;
			install_game_amazon_default_folder_disabled();
		}

	} else if (fs.existsSync("/tmp/regataos-gcs/start-installation-gcs.txt")) {
		if (checkBox1.checked == true) {
			document.getElementById("select-installation-folder").disabled = true;
			install_game_gcs_default_folder_enabled();

		} else if (checkBox2.checked == true) {
			document.getElementById("select-installation-folder").disabled = true;
			install_game_gcs_default_folder_enabled();

		} else {
			document.getElementById("select-installation-folder").disabled = false;
			install_game_gcs_default_folder_disabled();
		}
	}
}

// Uninstall game from Epic Games Store
function start_uninstall_epicstore_game() {
	const exec = require('child_process').exec;
	const command_line = '/opt/regataos-gcs/scripts/remove/scripts-remove/uninstall-game-epicstore/uninstall-epicstore-game.sh';
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-uninstallation').css('display', 'none')
}

function cancel_uninstall_epicstore_game() {
	const exec = require('child_process').exec;
	const command_line = 'rm -f /tmp/regataos-gcs/start-uninstallation-epicstore.txt';
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-uninstallation').css('display', 'none')
}

// Uninstall game from Amazon Games
function start_uninstall_amazon_game() {
	const exec = require('child_process').exec;
	const command_line = '/opt/regataos-gcs/scripts/remove/scripts-remove/uninstall-game-amazon/uninstall-amazon-game.sh';
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-uninstallation-amazon').css('display', 'none')
}

function cancel_uninstall_amazon_game() {
	const exec = require('child_process').exec;
	const command_line = 'rm -f /tmp/regataos-gcs/start-uninstallation-amazon.txt';
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-uninstallation-amazon').css('display', 'none')
}

// Uninstall game from GOG Galaxy
function start_uninstall_gog_game() {
	const exec = require('child_process').exec;
	const command_line = '/opt/regataos-gcs/scripts/action-games/remove-game';
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-uninstallation-gog').css('display', 'none')
}

function cancel_uninstall_gog_game() {
	const exec = require('child_process').exec;
	const command_line = 'rm -f /tmp/regataos-gcs/start-uninstallation-gog.txt';
	exec(command_line, function (error, call, errlog) {
	});

	$('.confirm-start-game-uninstallation-gog').css('display', 'none')
}
