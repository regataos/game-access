// Open box confirm uninstall
function show_confirmbox_uninstall() {
const fs = require('fs');
	fs.access("/tmp/regataos-gcs/confirm-uninstall", (err) => {
	if (!err) {
		var launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-uninstall", "utf8");
		var launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");

		$(".confirm-uninstall").css("display", "block")
		window[('confirm_' + launchername + '_uninstall')]();

	return;
	}
	});
}

// Cancel uninstallation or close confirm box
function cancel_uninstall() {
const fs = require('fs');
	$(".confirm-uninstall").css("display", "none")
	fs.unlinkSync("/tmp/regataos-gcs/confirm-uninstall");
}

// If prompted, uninstall apps
function start_uninstall_app() {
const exec = require('child_process').exec;
const fs = require('fs');
	var launcher = fs.readFileSync("/tmp/regataos-gcs/confirm-uninstall", "utf8");
	var launchername = launcher.replace(/(\r\n|\n|\r)/gm, "");

	var command_line = "/opt/regataos-gcs/scripts/remove/scripts-remove/" + launchername + "-compatibility-mode-rm.sh start";
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
cancel_uninstall();	
}

setInterval(function() {
	show_confirmbox_uninstall();
}, 500);
