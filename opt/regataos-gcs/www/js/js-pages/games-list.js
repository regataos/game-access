// Reload page
function reloadPage() {
	setTimeout(function () {
		const fs = require("fs");
		const reloadFilePath = "/tmp/regataos-gcs/reload-page.txt";
		if (fs.existsSync(reloadFilePath)) {
			location.reload();
			fs.unlinkSync(reloadFilePath);
		}
	}, 10000);
}

// This script helps to dynamically create game blocks
function games_list1() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
		fs.readFile("/opt/regataos-gcs/games-list/" + files, "utf8", function (err, data) {
			if (!err) {
				var games = JSON.parse(data);

				// Request the dynamic creation of game blocks on the HTML page
				//Capture the main element where the game blocks will be created
				var all_blocks = document.querySelector("div.blocks3");

				//Read the list of games that should appear in each block
				games.forEach(gamesdata => {
					//Only display games for the specific launcher
					var url = window.location.href;
					var url_split1 = url.split("pages/")[1];
					var pagename = url_split1.replace('-games.html', '');

					if ((gamesdata.launchernickname.indexOf(pagename) > -1) == "1") {
						//Request the creation of the new element (block) for each game
						var new_game_blocks = document.createElement("div");

						//Add classes to the new game blocks
						new_game_blocks.classList.add("app-block", gamesdata.launchernickname + "-block", gamesdata.gamenickname);

						//Add the game image in the background
						new_game_blocks.style.backgroundImage = "url('./../images/games-backg/" + gamesdata.launchernickname + "/" + gamesdata.gamenickname + ".jpg')";

						//Add game details within the newly created block
						//Special variables for running games
						var winevariable = "'" + gamesdata.winevariable + "'";
						var launchername = "'" + gamesdata.launchernickname + "'";
						var rungame = "'" + gamesdata.gamerun_appid + "'";

						new_game_blocks.innerHTML = ' \
			<div class="block-play ' + gamesdata.gamenickname + '-hover"> \
				<div id="' + gamesdata.gamenickname + '" class="play-box" onclick="window.gamename=this.id; window.winevariable=' + winevariable + '; window.launchername=' + launchername + '; window.rungame=' + rungame + '; run_game();"> \
					<div class="play-button"> \
						<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
					</div> \
				</div> \
				<div id="' + gamesdata.gamenickname + '" class="install-box" onclick="window.gamename=this.id; window.winevariable=' + winevariable + '; window.launchername=' + launchername + '; window.rungame=' + rungame + '; run_game();"> \
					<div class="play-button"> \
						<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
					</div> \
				</div> \
			</div> \
			<div class="block-text ' + gamesdata.gamenickname + '" title="' + gamesdata.gamename + '"> \
				<div class="block-title">' + gamesdata.gamename + '</div> \
				<div class="block-desc">' + gamesdata.launcher + '</div> \
				<div class="native-game"> \
					<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
					<div class="native-game-desc gcs">Game Access</div> \
				</div> \
			</div>';

						//Finally, create the new game blocks dynamically
						all_blocks.appendChild(new_game_blocks);
						pagesBlocksLang();
					}
				});
				return;
			}
		});
	});
}

function list_all_games() {
	const fs = require("fs");

	let files = [];
	window.content_brake = 0

	// Read JSON files with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
		fs.readFile("/opt/regataos-gcs/games-list/" + files, "utf8", function (err, data) {
			if (!err) {
				const games = JSON.parse(data);

				// Request the dynamic creation of game blocks on the HTML page
				//Capture the main element where the game blocks will be created
				const all_blocks = document.querySelector("div.blocks4");

				// Define some variables in advance
				let game_banner = "";
				let install_game = "";
				let run_game = "";
				let special_game_button = "";
				let game_plataform = "";
				let game_access = "";
				let special_button = "";
				let play_install_button = "";

				//Read the list of games that should appear in each block
				//for (var i = 0; i < games.length; i++) {
				games.forEach(gamesdata => {
					let child = all_blocks.querySelector(`.${gamesdata.gamenickname}-block`);
					if (child == null) {
						// Set some default settings
						if ((gamesdata.launchernickname.indexOf("gcs") > -1) == "1") {
							// Set game banner image
							game_banner = `url('./../images/games-backg/${gamesdata.launchernickname}/${gamesdata.gamenickname}.jpg')`;

							// Define action functions
							install_game = "installGameId()";
							run_game = "runGameId()";
							special_game_button = "goGamePageId()"

						} else if ((gamesdata.launchernickname.indexOf("steam") > -1) == "1") {
							// Set game banner image
							game_banner = `url('file:///tmp/regataos-gcs/config/steam-games/img/${gamesdata.gamenickname}.jpg')`;

							// Define action functions
							install_game = "run_steam_game()";
							run_game = "run_steam_game()";

						} else if ((gamesdata.launchernickname.indexOf("gog") > -1) == "1") {
							// Set game banner image
							if (fs.existsSync(`/tmp/regataos-gcs/config/gog-games/img/${gamesdata.gamenickname}.webp`)) {
								game_banner = `url('file:///tmp/regataos-gcs/config/gog-games/img/${gamesdata.gamenickname}.webp')`;

							} else if (fs.existsSync(`/opt/regataos-gcs/www/images/games-backg/${gamesdata.launchernickname}/${gamesdata.gamenickname}.jpg`)) {
								game_banner = `url('./../images/games-backg/${gamesdata.launchernickname}/${gamesdata.gamenickname}.jpg')`;
							}

							// Define action functions
							install_game = "install_gog_game()";
							run_game = "run_gog_game()";
							special_game_button = "uninstall_gog_game()"

						} else if ((gamesdata.launchernickname.indexOf("epicstore") > -1) == "1") {
							// Set game banner image
							if (fs.existsSync(`/tmp/regataos-gcs/config/epicstore-games/img/${gamesdata.gamenickname}.jpg`)) {
								game_banner = `url('file:///tmp/regataos-gcs/config/epicstore-games/img/${gamesdata.gamenickname}.jpg')`;

							} else if (fs.existsSync(`/tmp/regataos-gcs/config/epicstore-games/img/${gamesdata.gamenickname}.png`)) {
								game_banner = `url('file:///tmp/regataos-gcs/config/epicstore-games/img/${gamesdata.gamenickname}.png')`;

							} else if (fs.existsSync(`/tmp/regataos-gcs/config/epicstore-games/img/${gamesdata.gamenickname}`)) {
								game_banner = `url('file:///tmp/regataos-gcs/config/epicstore-games/img/${gamesdata.gamenickname}')`;

							} else {
								game_banner = `url('${gamesdata.game_img1}')`;
							}

							// Define action functions
							install_game = "install_epicstore_game()";
							run_game = "run_epicstore_game()";
							special_game_button = "uninstall_epicstore_game()"

						} else {
							game_banner = `url('./../images/games-backg/${gamesdata.launchernickname}/${gamesdata.gamenickname}.jpg')`;
						}

						// Set game plataform
						if ((gamesdata.launchernickname.indexOf("steam") > -1) == "1") {
							if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
								game_plataform = "nativegame";
							} else {
								game_plataform = "steamplay";
							}

						} else {
							game_plataform = "gcs";
							game_access = "GAME ACCESS"
						}

						// Special button
						if ((gamesdata.launchernickname.indexOf("gcs") > -1) == "1") {
							special_button = `
							<div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId='${gamesdata.gamenickname}'; ${special_game_button};"> \
								<i class="fa fa-plus"></i>
							</div>`;

						} else {
							if ((fs.existsSync(`/tmp/regataos-gcs/config/installed/${gamesdata.gamenickname}-${gamesdata.launchernickname}.json`)) ||
								(fs.existsSync(`/tmp/regataos-gcs/config/installed/${gamesdata.gamenickname}.json`))) {
								if (((gamesdata.launchernickname.indexOf("epicstore") > -1) == "1") ||
									((gamesdata.launchernickname.indexOf("gog") > -1) == "1")) {
									special_button = `
									<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove='${gamesdata.gamenickname}'; ${special_game_button}; reloadPage();"> \
										<i class="fas fa-trash-alt"></i> \
									</div>`;
								}

							} else {
								special_button = "";
							}
						}

						// Check if the game is installed and create the game tile according to the game installation status.
						if ((fs.existsSync(`/tmp/regataos-gcs/config/installed/${gamesdata.gamenickname}-${gamesdata.launchernickname}.json`)) ||
							(fs.existsSync(`/tmp/regataos-gcs/config/installed/${gamesdata.gamenickname}.json`))) {
							play_install_button = `
							<div id="${gamesdata.gamenickname}" class="play-box-universal" onclick="window.gameId=this.id; ${run_game};">
								<div class="play-button">
									<i class="fas fa-play"></i>
									<div class="play-txt">Jogar</div>
								</div>
							</div>`

						} else {
							console.log("teste2: " + gamesdata.gamenickname + ", " + gamesdata.launchernickname)
							play_install_button = `
							<div id="${gamesdata.gamenickname}" class="install-box-universal" onclick="window.gameId=this.id; ${install_game};">
								<div class="play-button">
									<i class="fas fa-download"></i>
									<div class="install-txt">Instalar</div>
								</div>
							</div>`
						}

						// Request the creation of the new element (block) for each game
						const new_game_blocks = document.createElement("div");

						// Add classes to the new game blocks
						new_game_blocks.classList.add("app-block", `${gamesdata.launchernickname}-block"`, `${gamesdata.gamenickname}-block`, gamesdata.gamenickname);

						// Add the game image in the background
						new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

						new_game_blocks.innerHTML = `
						<div class= "game-img" style = "background-image: ${game_banner}"></div >
						<div class="block-play ${gamesdata.gamenickname}-hover">
							${special_button}
							${play_install_button}
						</div>
						<div class="block-text ${gamesdata.gamenickname}" title="${gamesdata.gamename}'">
							<div class="block-title">${gamesdata.gamename}</div>
							<div class="block-desc">${gamesdata.launcher}</div>
							<div class="native-game">
								<div class="native-game-img" style="background-image: url(./../images/${game_plataform}.png)"></div>
								<div class="native-game-desc ${game_plataform}">${game_access}</div>
							</div>
						</div>`;

						//Finally, create the new game blocks dynamically
						if (content_brake >= 16) {
							return;
						} else {
							window.content_brake = content_brake + 1
							all_blocks.appendChild(new_game_blocks);
							pagesBlocksLang();
						}
					}
				})
				return;
			}
		});
	});
}

// Load more games when the user scrolls to the end of the page.
$(window).scroll(function () {
	if ($(document).height() == $(window).scrollTop() + $(window).height()) {
		list_all_games();
	}
});

// List the games according to the page accessed by the user.
(window.location.href.indexOf("-games") > -1) ? games_list1() : list_all_games();

// Game to hide as it will be removed
function game_to_hide() {
	var fs = require("fs");
	var filePath = "/tmp/regataos-gcs/game-to-hide.txt"

	if (fs.existsSync(filePath)) {
		var gamenickname = fs.readFileSync(filePath, "utf8");
		gamenickname = gamenickname.replace(/(\r\n|\n|\r)/gm, "");

		$("div." + gamenickname + "-block").remove();

		setTimeout(function () {
			fs.unlinkSync(filePath);
		}, 1000);
	}
}

setInterval(function () {
	game_to_hide()
}, 1000);
