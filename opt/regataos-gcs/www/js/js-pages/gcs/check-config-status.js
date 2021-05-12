//Check the url of the page to get the nickname of the game
function check_url() {
    var url = window.location.href;
    var url_split1 = url.split("pages/")[1];
    window.gamename = url_split1.replace('-gcs.html', '');
}
check_url();

// FPS
function check_fps() {
const fs = require('fs');
	fs.readFile('/tmp/regataos-gcs/config/' + gamename + '.conf', (err, data) => {
	if (err) throw err;

	var data = data
	var fps = "FPS=1"
	var nonfps = "FPS=0"

	var showfps = data.indexOf(fps) > -1;
	var hidefps = data.indexOf(nonfps) > -1;

	if (showfps == '1') {
		$(document).ready(function() {
		$("." + gamename + "-fps").css("display", "block")
		$("." + gamename + "-nonfps").css("display", "none")
		});
	} else if (hidefps == '1') {
		$(document).ready(function() {
		$("." + gamename + "-fps").css("display", "none")
		$("." + gamename + "-nonfps").css("display", "block")
		});
	}

	});
}

setTimeout(function(){
	check_fps();
}, 100);
