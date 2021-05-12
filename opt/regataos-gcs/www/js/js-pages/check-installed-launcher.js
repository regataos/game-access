// Verify that lauencher is installed
function check_installed_launchers() {
const fs = require('fs');

	var launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

	var iframeurl = document.getElementById("iframegcs").contentWindow.location.href
    var url_split1 = iframeurl.split("pages/")[1];
	var launcher_name = url_split1.replace('-games.html', '');

	if (launchers.indexOf(launcher_name)==-1) {
			$(".block-top").css("display", "none");
			$("div#block-home").css("display", "block");
	} else {
		if (launchers.indexOf(launcher_name) > -1) {
			$("div#block-home").css("display", "none");
			$(".block-" + launcher_name).css("display", "block");
		return;
		} else {
			$(".block-" + launcher_name).css("display", "none");
			$("div#block-home").css("display", "block");
		}
	}
}

setInterval(function() {
	check_installed_launchers();
}, 100);
