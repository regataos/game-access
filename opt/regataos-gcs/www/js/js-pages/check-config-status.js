// If necessary, activate the FPS counter
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
