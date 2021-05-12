// This script helps to dynamically create launcher blocks
function list_launchers_options() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of launchers
	fs.readdirSync("/opt/regataos-gcs/www/js/js-pages/launchers-list").forEach(files => {
	fs.readFile("/opt/regataos-gcs/www/js/js-pages/launchers-list/" +files , "utf8", function(err, data) {
	if(!err) {
		var launchers = JSON.parse(data);

		// Request the dynamic creation of launcher blocks on the HTML page
		//Capture the main element where the game blocks will be created
		var all_blocks = document.querySelector("div#side-bar");

		//Read the list of launchers that should appear in each block
		for (var i = 0; i < launchers.length; i++) {
			//Request the creation of the new element (block) for each launcher
			var new_game_blocks = document.createElement("div");

			//Add classes to the new launcher blocks
			new_game_blocks.classList.add("block-top", "block-" + launchers[i].launcher_nickname);

			//Add launcher details within the newly created block
			//Special variables for running launchers
			var launcher_nickname = "'" + launchers[i].launcher_nickname + "'";

			new_game_blocks.innerHTML = ' \
			<div class="icon-app-top" style="background-image:url(images/icon-apps/' + launchers[i].launcher_nickname + '.png);"></div> \
			<div class="text-app-top">' + launchers[i].launcher_name + '</div> \
			<div class="div-line"></div> \
			<div id="block-remove"> \
				<div class="checkbox-apps ' + launchers[i].launcher_nickname + '-fps fpson"> \
					<label class="checkbox fpshud" onclick="showfps();"><p class="checkbox-fpstxt">Exibir contador de FPS</p> \
						<input type="checkbox" checked="checked" id="' + launchers[i].launcher_nickname + 'fps"><span class="checkmark"></span></label> \
				</div> \
				<div class="checkbox-apps ' + launchers[i].launcher_nickname + '-nonfps fpsoff"> \
					<label class="checkbox fpshud" onclick="hidefps();"><p class="checkbox-fpstxt">Exibir contador de FPS</p> \
						<input type="checkbox" id="' + launchers[i].launcher_nickname + 'nonfps"><span class="checkmark"></span></label> \
				</div> \
				<div class="div-buttons"> \
					<div class="div-label"> \
						<label class="label-run" id="' + launchers[i].launcher_nickname + '" onclick="window.launcher_name=this.id; run_launcher_exe();" title="Rode um arquivo .exe neste drive virtual." for="run-' + launchers[i].launcher_nickname + '"> \
							<div class="label-run-div"><i class="fas fa-cogs"></i></div> \
						</label> \
						<input type="file" id="run-' + launchers[i].launcher_nickname + '" name="files[]" /> \
					</div> \
					<div class="open-folder" onclick="openfolder_' + launchers[i].launcher_nickname + '();" title="Abrir pasta de instalação do driver virtual."> \
						<i class="fas fa-folder"></i> \
					</div> \
					<div class="run-launcher" onclick="window.launcher_name=' + launcher_nickname + '; run_launcher();" title="Executar"> \
						<i class="fas fa-play"></i> \
					</div> \
				</div> \
				<div class="button-remove" onclick="uninstall_app();"> \
					<i class="fas fa-times-circle"></i><div class="text-remove">Remover</div> \
				</div> \
			</div>';

			//Finally, create the new launcher blocks dynamically
			all_blocks.appendChild(new_game_blocks);
		}
		return;
	}
	});
	});
}

list_launchers_options();
