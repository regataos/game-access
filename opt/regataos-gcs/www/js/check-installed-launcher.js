// Check list of installed launchers and show options in Game Access sidebar.
function checkInstalledLaunchers() {
	const fs = require('fs');

	const getInstalledLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
	let getPageUrl = document.getElementById("iframegcs").contentWindow.location.href;
	getPageUrl = getPageUrl.split("pages/")[1];

	const launcherSidebar = document.querySelector("#block-home");
	const launcherOptionsAll = document.querySelectorAll(".block-top");

	if (getPageUrl.includes("-games.html")) {
		const launcherNickname = getPageUrl.replace("-games.html", "");
		const launcherOptions = document.querySelector(`.block-${launcherNickname}`);

		if (getInstalledLaunchers.includes(launcherNickname)) {
			if (!launcherOptions.classList.contains("show-element")) {
				launcherSidebar.classList.remove("show-element");
				setTimeout(() => { launcherOptions.classList.add("show-element"); }, "300");

				for (let i = 0; i < launcherOptionsAll.length; i++) {
					launcherOptionsAll[i].classList.remove("show-element");
				}
			}

		} else {
			if (launcherOptions.classList.contains("show-element")) {
				launcherOptions.classList.remove("show-element");
			}

			launcherSidebar.classList.add("show-element");

			for (let i = 0; i < launcherOptionsAll.length; i++) {
				launcherOptionsAll[i].classList.remove("show-element");
			}
		}

	} else {
		launcherSidebar.classList.add("show-element");

		for (let i = 0; i < launcherOptionsAll.length; i++) {
			launcherOptionsAll[i].classList.remove("show-element");
		}
	}
}

// Check if any launcher has been installed or removed
function checkLauncherChanges() {
	const fs = require("fs");
	const fileWithInstalledLaunchers = "/tmp/regataos-gcs/config/installed-launchers.conf";

	fs.watchFile(fileWithInstalledLaunchers, function () {
		checkInstalledLaunchers();
	});
}
checkLauncherChanges();
