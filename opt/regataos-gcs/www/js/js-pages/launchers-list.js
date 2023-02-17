// This script helps to dynamically create launcher blocks.
function launchers_list() {
	const fs = require("fs");
	const launcherJsonFilesDir = "/opt/regataos-gcs/launchers-list"

	let launcherJsonFiles = [];

	// Read JSON files with the list of launchers.
	fs.readdirSync(launcherJsonFilesDir).forEach(launcherJsonFiles => {
		fs.readFile(`${launcherJsonFilesDir}/${launcherJsonFiles}`, "utf8", function (err, data) {
			if (!err) {
				const launchers = JSON.parse(data);

				// Request the dynamic creation of launcher blocks on the HTML page.
				//Capture the main element where the game blocks will be created.
				const all_blocks = document.querySelector("div#block-home");

				//Read the list of launchers that should appear in each block.
				launchers.forEach(data => {

					//Request the creation of the new element (block) for each launcher.
					const new_game_blocks = document.createElement("div");

					//Add classes to the new launcher blocks
					new_game_blocks.classList.add("block-apps");

					//Add launcher details within the newly created block.
					//Special variables for running launchers.
					const launchernickname = '"' + data.launcher_nickname + '"'

					new_game_blocks.innerHTML = " \
						<div onclick='window.launchername=" + launchernickname + "; go_to_page(); back_button_pages(); check_fps();' class='icon-app' title='" + data.launcher_name + "' style='background-image:url(images/icon-apps/" + data.launcher_nickname + ".png);'></div> \
						<div onclick='window.launchername=" + launchernickname + "; go_to_page(); back_button_pages(); check_fps();' class='text-app " + data.launcher_nickname + "-title'>" + data.launcher_name + "</div>";

					// Create the Origin option in the Game Access sidebar only if the app is installed.
					if ((data.launcher_nickname.indexOf("eadesktop") > -1) == "1") {
						const checkInstalledLaunchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");

						if ((checkInstalledLaunchers.indexOf("eadesktop") > -1) == "1") {

							//Finally, create the new launcher blocks dynamically.
							all_blocks.appendChild(new_game_blocks);
						}

					} else {
						//Finally, create the new launcher blocks dynamically.
						all_blocks.appendChild(new_game_blocks);
					}
				});
				return;
			}
		});
	});
}

// This script helps to dynamically create launchers confirmation box.
function launchers_confirm_box() {
	var fs = require("fs");
	const launcherJsonFilesDir = "/opt/regataos-gcs/launchers-list"

	let launcherJsonFiles = [];

	// Read JSON files with the list of launchers.
	fs.readdirSync(launcherJsonFilesDir).forEach(launcherJsonFiles => {
		fs.readFile(`${launcherJsonFilesDir}/${launcherJsonFiles}`, "utf8", function (err, data) {
			if (!err) {
				var launchers = JSON.parse(data);

				// Request the dynamic creation of launcher blocks on the HTML page.
				//Capture the main element where the game blocks will be created.
				var all_blocks = document.querySelector("body");

				//Read the list of launchers that should appear in each block.
				launchers.forEach(data => {
					//Request the creation of the new element (block) for each launcher.
					var new_game_blocks = document.createElement("div");

					//Add classes to the new launcher blocks
					new_game_blocks.classList.add("confirmation-box", data.launcher_nickname + "-install");

					//Add launcher details within the newly created block.
					//Special variables for running launchers.
					new_game_blocks.innerHTML = ' \
			<div class="confirmation"> \
			<div class="confir-title"></div> \
			<div class="cbuttons"> \
				<div class="confirm-button true-button" onclick="install_launcher();"></div> \
				<div class="confirm-button false-button" onclick="cancel_install();"></div> \
			</div> \
			</div>';

					//Finally, create the new launcher blocks dynamically.
					all_blocks.appendChild(new_game_blocks);
				});
				return;
			}
		});
	});
}


launchers_list();
launchers_confirm_box();
