// Check if FPS HUD is enabled
function checkFps() {
	const fs = require('fs');
	const readSettings = fs.readFileSync("/tmp/regataos-gcs/config/regataos-gcs.conf", "utf8");
	const checkBox = document.querySelector("#fps-hud-enabled");
	const fpsHudOptions = document.querySelector("#show-fps-hud-options");

	if (readSettings.includes("fps=true")) {
		checkBox.checked = "checked";
		fpsHudOptions.style.display = "block";
	} else if (readSettings.includes("fps=false")) {
		checkBox.checked = "";
		fpsHudOptions.style.display = "none";
	} else {
		checkBox.checked = "";
		fpsHudOptions.style.display = "none";
	}

	const readMangohudSettings = fs.readFileSync("/tmp/regataos-gcs/config/MangoHud.conf", "utf8");
	const fpsPositionButton = document.querySelector("#fps-hud-position");

	if (readMangohudSettings.includes("position")) {
		const languageDetected = checkConfigFile(readMangohudSettings, "position=");
		fpsPositionButton.classList.add(`fps-${languageDetected}`);
	} else {
		fpsPositionButton.classList.add("fps-top-left");
	}
}
checkFps()

// Check if AMD FSR is enabled
function checkAmdFsr() {
	const fs = require('fs');
	const readSettings = fs.readFileSync("/tmp/regataos-gcs/config/regataos-gcs.conf", "utf8");
	const checkBox = document.querySelector("#amd-fsr-enabled");

	if (readSettings.includes("amd-fsr=true")) {
		checkBox.checked = "checked";
	} else if (readSettings.includes("amd-fsr=false")) {
		checkBox.checked = "";
	} else {
		checkBox.checked = "";
	}
}
checkAmdFsr()

// Check if the automatically close game access function is enabled
function checkAutoClose() {
	const fs = require('fs');
	const readSettings = fs.readFileSync("/tmp/regataos-gcs/config/regataos-gcs.conf", "utf8");
	const checkBox = document.querySelector("#auto-close-enabled");

	if (readSettings.includes("auto-close=true")) {
		checkBox.checked = "checked";
	} else if (readSettings.includes("auto-close=false")) {
		checkBox.checked = "";
	} else {
		checkBox.checked = "";
	}
}
checkAutoClose()

function check_external_games_folder() {
	const fs = require('fs');

	fs.access("/tmp/regataos-gcs/config/external-games-folder.txt", (err) => {
		if (!err) {
			let external_games_dir = fs.readFileSync("/tmp/regataos-gcs/config/external-games-folder.txt", "utf8");
			external_games_dir = external_games_dir.replace(/(\r\n|\n|\r)/gm, "");

			$(".external-games-folder-dir-desc").text(external_games_dir);
			$(".external-games-folder-dir").css("display", "block")

			return;
		} else {
			$(".external-games-folder-dir").css("display", "none")

			const exec = require('child_process').exec;
			const remove_external_games_folder_file = 'rm -f "$HOME/Game Access/External-Disc"';
			exec(remove_external_games_folder_file, function (error, call, errlog) {
			});
		}
	});
}

check_external_games_folder()
