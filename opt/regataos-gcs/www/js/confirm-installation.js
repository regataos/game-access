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

setInterval(function() {
	show_confirmbox_installation();
}, 500);
