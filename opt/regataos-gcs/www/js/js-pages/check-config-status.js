// Check if FPS HUD is enabled
function checkFps() {
	const fs = require('fs');
	const readSettings = fs.readFileSync("/tmp/regataos-gcs/config/regataos-gcs.conf", "utf8");
	const checkBox = document.querySelector("#fps-hud-enabled");
	const fpsHudOptions = document.querySelector("#show-fps-hud-options");
	const fpsHudAppearance = document.querySelector("#fps-hud-appearance");

	if (readSettings.includes("fps=true")) {
		checkBox.checked = "checked";
		fpsHudOptions.style.display = "block";
		fpsHudAppearance.style.display = "block";
	} else if (readSettings.includes("fps=false")) {
		checkBox.checked = "";
		fpsHudOptions.style.display = "none";
		fpsHudAppearance.style.display = "none";
	} else {
		checkBox.checked = "";
		fpsHudOptions.style.display = "none";
		fpsHudAppearance.style.display = "none";
	}

	// Check FPS HUD position
	const readMangohudSettings = fs.readFileSync("/tmp/regataos-gcs/config/MangoHud.conf", "utf8");
	const fpsPositionButton = document.querySelector("#fps-hud-position");

	if (readMangohudSettings.includes("position")) {
		const getPosition = checkConfigFile(readMangohudSettings, "position=");
		fpsPositionButton.classList.add(`fps-${getPosition}`);
	} else {
		fpsPositionButton.classList.add("fps-top-left");
	}

	// Check FPS HUD Look
	if (readMangohudSettings.includes("preset")) {
		const usedLook = checkConfigFile(readMangohudSettings, "preset=");
		const fpsHudLookRange = document.querySelector("#fpsHudLookRange");
		fpsHudLookRange.value = usedLook

		if (usedLook == 1) {
			fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 0%, #3f464e 0%)";
			document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#3f464e";
			document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#3f464e";
			document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#3f464e";

		} else if (usedLook == 2) {
			fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 35%, #3f464e 0%)";
			document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#3f464e";
			document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#3f464e";

		} else if (usedLook == 3) {
			fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 65%, #3f464e 50%)";
			document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#3f464e";

		} else if (usedLook == 4) {
			fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 100%, #3f464e 0%)";
			document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#0078f2";
			document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#0078f2";
		}

	} else {
		fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 65%, #3f464e 50%)";
		document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#3f464e";
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
