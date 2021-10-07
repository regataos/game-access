// Check if FPS HUD is enabled
function check_fps() {
	const fs = require('fs');
	var read_settings = fs.readFileSync("/tmp/regataos-gcs/config/regataos-gcs.conf", "utf8");

	if ((read_settings.indexOf("fps=true") > -1) == "1") {
		$(".option-fps-hud-enabled").css("display", "block")
		$(".option-fps-hud-disabled").css("display", "none")

	} else if ((read_settings.indexOf("fps=false") > -1) == "1") {
		$(".option-fps-hud-enabled").css("display", "none")
		$(".option-fps-hud-disabled").css("display", "block")

	} else {
		$(".option-fps-hud-enabled").css("display", "none")
		$(".option-fps-hud-disabled").css("display", "block")
	}
}
check_fps()

// Check if the automatically close game access function is enabled
function check_auto_close() {
	const fs = require('fs');
	var read_settings = fs.readFileSync("/tmp/regataos-gcs/config/regataos-gcs.conf", "utf8");

	if ((read_settings.indexOf("auto-close=true") > -1) == "1") {
		$(".option-auto-close-enabled").css("display", "block")
		$(".option-auto-close-disabled").css("display", "none")

	} else if ((read_settings.indexOf("auto-close=false") > -1) == "1") {
		$(".option-auto-close-enabled").css("display", "none")
		$(".option-auto-close-disabled").css("display", "block")

	} else {
		$(".option-auto-close-enabled").css("display", "none")
		$(".option-auto-close-disabled").css("display", "block")
	}
}
check_auto_close()

function check_external_games_folder() {
	const fs = require('fs');

	fs.access("/tmp/regataos-gcs/config/external-games-folder.txt", (err) => {
	if (!err) {
		var external_games_dir = fs.readFileSync("/tmp/regataos-gcs/config/external-games-folder.txt", "utf8");
		var external_games_dir = external_games_dir.replace(/(\r\n|\n|\r)/gm, "");
		$(".external-games-folder-dir-desc").text(external_games_dir);
		$(".external-games-folder-dir").css("display", "block")


		return;
	} else {
		$(".external-games-folder-dir").css("display", "none")
	}
	});
}

check_external_games_folder()
