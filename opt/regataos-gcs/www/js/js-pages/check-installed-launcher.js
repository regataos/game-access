// Verify that lauencher is installed
function check_installed_launchers() {
	const fs = require('fs');

	const launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	const iframeurl = document.getElementById("iframegcs").contentWindow.location.href;
    const url_split1 = iframeurl.split("pages/")[1];
	const launcher_name = url_split1.replace('-games.html', '');

	if ((iframeurl.indexOf("-games.html") > -1) == "1") {
		if (launchers.indexOf(launcher_name)==-1) {
				$(".block-top").css("display", "none");
				$("div#block-home").css("display", "block");
		} else {

			if (launchers.indexOf(launcher_name) > -1) {
				$("div#block-home").css("display", "none");
				$(".block-top").css("display", "none");

				setTimeout(() => {
					$(".block-" + launcher_name).css("display", "block");
				}, "300");

			} else {
				$(".block-" + launcher_name).css("display", "none");
				$("div#block-home").css("display", "block");
			}
		}

	} else {
		$(".block-top").css("display", "none");
	}
}
