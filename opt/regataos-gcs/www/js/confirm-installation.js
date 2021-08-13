// Open box confirm installation
function show_confirmbox_installation() {
const fs = require('fs');
	fs.access("/tmp/regataos-gcs/confirm-installation", (err) => {
	if (!err) {
		var launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-installation", "utf8");
		var launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");

		$('.' + launchername + '-install').css('display', 'block')
		window[('confirm_' + launchername + '_installation')]();

	return;
	}
	});
}

// Cancel installation or close confirm box
function cancel_install() {
const fs = require('fs');
	var launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-installation", "utf8");
	var launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");

	$("." + launchername + "-install").css("display", "none")
	fs.unlinkSync("/tmp/regataos-gcs/confirm-installation");
}

// If prompted, install apps
function install_launcher() {
const exec = require('child_process').exec;
const fs = require('fs');
	var launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-installation", "utf8");
	var launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");

	var command_line = "/bin/bash /opt/regataos-gcs/scripts/install/scripts-install/" + launchername + "-compatibility-mode.sh";
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
cancel_install();
}

// Start installing game from Epic Games Store
function show_confirmbox_installing_game_epicstore() {
const fs = require('fs');
	fs.access("/tmp/regataos-gcs/start-installation-epicstore.txt", (err) => {
	if (!err) {
		$('.confirm-start-game-installation').css('display', 'block')
	return;
	}
	});
}

// Start uninstall game from Epic Games Store
function show_confirmbox_uninstall_game_epicstore() {
const fs = require('fs');
	fs.access("/tmp/regataos-gcs/start-uninstallation-epicstore.txt", (err) => {
	if (!err) {
		$('.confirm-start-game-uninstallation').css('display', 'block')
	return;
	}
	});
}

// Remove user account
function show_remove_user_account() {
const fs = require('fs');
	fs.access("/tmp/regataos-gcs/remove-user-account-epicstore.txt", (err) => {
	if (!err) {
		$('.remove-user-account').css('display', 'block')
	return;
	}
	});
}

setInterval(function() {
	show_confirmbox_installing_game_epicstore();
	show_confirmbox_uninstall_game_epicstore();
	show_confirmbox_installation();
	show_remove_user_account();
}, 1500);

// Cancel game installation
function cancel_game_installation() {
	const exec = require('child_process').exec;

	var command_line = "rm -f /tmp/regataos-gcs/start-installation-*.txt";
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});

	$('.confirm-start-game-installation').css('display', 'none')
}

// Enable or disable the default folder for installing games
function default_folder_enabled() {
	var checkBox = document.getElementById("default-folder-enabled");
	if (checkBox.checked == true){
		document.getElementById("select-installation-folder").disabled = true;
	} else {
		document.getElementById("select-installation-folder").disabled = false;
	}
}

function default_folder_disabled() {
	var checkBox = document.getElementById("default-folder-disabled");
	if (checkBox.checked == true){
		document.getElementById("select-installation-folder").disabled = true;
	} else {
		document.getElementById("select-installation-folder").disabled = false;
	}
}

// Import game from Epic Games Store
function import_game_epicstore() {
	$('input[id="select-file"]').change(function(e){
		var fileinput = document.querySelector('input#select-file');
		var path = fileinput.value;

		const exec = require('child_process').exec;
		var command_line = 'export GAME_PATH="' + path + '"; /opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/import-epicstore-game.sh';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});

		$('.confirm-start-game-installation').css('display', 'none')
		fileinput.value='';
	});
}

// Install game from Epic Games Store
//Install game using default directory
function install_game_epicstore_default_folder_enabled() {
	const exec = require('child_process').exec;
	var command_line = 'export GAME_PATH=""; /opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/install-epicstore-game.sh';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});

	$('.confirm-start-game-installation').css('display', 'none')
}

//Install game by choosing a specific directory
function install_game_epicstore_default_folder_disabled() {
	$('input[id="select-installation-folder"]').change(function(e){
		var fileinput = document.querySelector('input#select-installation-folder');
		var path = fileinput.value;

		const exec = require('child_process').exec;
		var command_line = 'export GAME_PATH="' + path + '"; /opt/regataos-gcs/scripts/install/scripts-install/install-game-epicstore/install-epicstore-game.sh';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});

		$('.confirm-start-game-installation').css('display', 'none')
		fileinput.value='';
	});
}

//Check user preferences for game folder
function default_folder() {
	var checkBox1 = document.getElementById("default-folder-enabled");
	var checkBox2 = document.getElementById("default-folder-disabled");

	if (checkBox1.checked == true){
		document.getElementById("select-installation-folder").disabled = true;
		install_game_epicstore_default_folder_enabled()
	} else if (checkBox2.checked == true){
		document.getElementById("select-installation-folder").disabled = true;
		install_game_epicstore_default_folder_enabled()
	} else {
		document.getElementById("select-installation-folder").disabled = false;
		install_game_epicstore_default_folder_disabled()
	}
}

// Uninstall game from Epic Games Store
function start_uninstall_epicstore_game() {
	const exec = require('child_process').exec;
	var command_line = '/opt/regataos-gcs/scripts/remove/scripts-remove/uninstall-game-epicstore/uninstall-epicstore-game.sh';
	exec(command_line,function(error,call,errlog){
	});

	$('.confirm-start-game-uninstallation').css('display', 'none')
}

function cancel_uninstall_epicstore_game() {
	const exec = require('child_process').exec;
	var command_line = 'rm -f /tmp/regataos-gcs/start-uninstallation-epicstore.txt';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});

	$('.confirm-start-game-uninstallation').css('display', 'none')
}
