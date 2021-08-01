// If necessary, activate the installation confirmation box or run the launcher
function remove_account() {
const exec = require('child_process').exec;
const fs = require('fs');

	if ((launcher_name.indexOf("epicstore-remove-account") > -1) == "1") {
		var command_line = '/opt/regataos-gcs/legendary/legendary auth --delete; rm -f "/tmp/regataos-gcs/config/epicstore-games/show-egs.txt"';
		console.log(command_line);
		exec(command_line,function(error,call,errlog){
		});
	}
}
