// If necessary, activate the FPS counter
function check_fps() {
const fs = require('fs');
	fs.readFile('/tmp/regataos-gcs/config/' + launchername + '.conf', (err, data) => {
	if (err) throw err;

	var data = data
	var fps = "FPS=1"
	var nonfps = "FPS=0"

	var showfps = data.indexOf(fps) > -1;
	var hidefps = data.indexOf(nonfps) > -1;

	if (showfps == '1') {
		$(document).ready(function() {
		$("." + launchername + "-fps").css("display", "block")
		$("." + launchername + "-nonfps").css("display", "none")
		});
	} else if (hidefps == '1') {
		$(document).ready(function() {
		$("." + launchername + "-fps").css("display", "none")
		$("." + launchername + "-nonfps").css("display", "block")
		});
	}

	});
}
