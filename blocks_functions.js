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
	var command_line = 'echo "epicstore" > "/tmp/regataos-gcs/confirm-installation"';
	exec(command_line,function(error,call,errlog){
	});
}
}

function block_function2() {
const exec = require('child_process').exec;
const fs = require('fs');

var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
if ((installed_launchers.indexOf("epicstore") > -1) == "1") {
	var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Epic Games Launcher.desktop"';
	exec(command_line,function(error,call,errlog){
	});
} else {
	var command_line = 'echo "epicstore" > "/tmp/regataos-gcs/confirm-installation"';
	exec(command_line,function(error,call,errlog){
	});
}
}

function block_function3() {
const exec = require('child_process').exec;
const fs = require('fs');

var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
if ((installed_launchers.indexOf("epicstore") > -1) == "1") {
	var command_line = 'cd /opt/regataos-wine/desktop-files/; gtk-launch "Epic Games Launcher.desktop"';
	exec(command_line,function(error,call,errlog){
	});
} else {
	var command_line = 'echo "epicstore" > "/tmp/regataos-gcs/confirm-installation"';
	exec(command_line,function(error,call,errlog){
	});
}
}
