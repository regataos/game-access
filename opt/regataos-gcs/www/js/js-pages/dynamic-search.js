// For search page
function games_list3(gameNickname, launcherNickname) {
	const fs = require("fs");
	let data = "";

	// Read JSON files with the list of games
	if (fs.existsSync(`/opt/regataos-gcs/games-list/${gameNickname}-${launcherNickname}.json`)) {
		data = fs.readFileSync(`/opt/regataos-gcs/games-list/${gameNickname}-${launcherNickname}.json`, "utf8");
	} else {
		data = fs.readFileSync(`/opt/regataos-gcs/games-list/${gameNickname}.json`, "utf8");
	}

	const games = JSON.parse(data);

	// Request the dynamic creation of game blocks on the HTML page
	//Capture the main element where the game blocks will be created
	const all_blocks = document.querySelector("div.blocks4");

	// Set game banner image
	let game_banner = "";

	// Define action functions
	let install_game = "";
	let run_game = "";
	let special_game_button = "";

	// Set game plataform
	let game_plataform = "";

	// Special buttons
	let special_button = "";
	let play_install_button = "";

	//Read the list of games that should appear in each block
	//for (var i = 0; i < games.length; i++) {
	games.forEach(gamesdata => {
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
		}

		// Special button
		if ((gamesdata.launchernickname.indexOf("gcs") > -1) == "1") {
			special_button = `
			<div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId='${gamesdata.gamenickname}'; ${special_game_button};"> \
				<i class="fa fa-plus"></i>
			</div>`;

		} else {
			if (fs.existsSync(`/tmp/regataos-gcs/config/installed/${gamesdata.gamenickname}.json`)) {
				if ((gamesdata.launchernickname.indexOf("epicstore") > -1) == "1") {
					special_button = `
					<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove='${gamesdata.gamenickname}'; ${special_game_button};"> \
						<i class="fas fa-trash-alt"></i> \
					</div>`;

				} else if ((gamesdata.launchernickname.indexOf("gog") > -1) == "1") {
					special_button = `
					<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove='${gamesdata.gamenickname}'; ${special_game_button};">
						<i class="fas fa-trash-alt"></i>
					</div>`;
				}

			} else {
				special_button = "";
			}
		}

		// Check if the game is installed and create the game tile according to the game installation status.
		if (fs.existsSync(`/tmp/regataos-gcs/config/installed/${gamesdata.gamenickname}.json`)) {
			play_install_button = `
			<div id="${gamesdata.gamenickname}" class="play-box-universal" onclick="window.gameId=this.id; ${run_game};">
				<div class="play-button">
					<i class="fas fa-play"></i>
					<div class="play-txt">Jogar</div>
				</div>
			</div>`

		} else {
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
		new_game_blocks.classList.add("app-block", gamesdata.launchernickname + "-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

		// Add the game image in the background
		new_game_blocks.style.backgroundImage = game_banner;

		new_game_blocks.innerHTML = `
		<div class="block-play ${gamesdata.gamenickname}-hover">
			${special_button}
			${play_install_button}
		</div>
		<div class="block-text ${gamesdata.gamenickname}" title="${gamesdata.gamename}'">
			<div class="block-title">${gamesdata.gamename}</div>
			<div class="block-desc">${gamesdata.launcher}</div>
			<div class="native-game">
				<div class="native-game-img" style="background-image: url(./../images/${game_plataform}.png)"></div>
				<div class="native-game-desc ${game_plataform}">${gamesdata.launcher}</div>
			</div>
		</div>`;

		//Finally, create the new game blocks dynamically
		all_blocks.appendChild(new_game_blocks);
		pagesBlocksLang();

	})
	return;
}

// This script helps to dynamically search the game
function check_results() {
	if (document.querySelector(".app-block-universal") !== null) {
		document.querySelector(".noresultsfound").style.display = "none";

	} else if (document.querySelector(".app-block") !== null) {
		document.querySelector(".noresultsfound").style.display = "none";

	} else {
		document.querySelector(".noresultsfound").style.display = "block";
		document.querySelector(".blocks4").style.display = "block";
		console.log("teste 2")
	}
}

// Read the JSON file with the list of games
function search() {
	const fs = require('fs');
	let jsonFiles = fs.readdirSync("/opt/regataos-gcs/games-list");

	for (let i = 0; i < jsonFiles.length; i++) {
		gameInfo = fs.readFileSync("/opt/regataos-gcs/games-list/" + jsonFiles[i], "utf8");
		const listGames = JSON.parse(gameInfo);

		for (let i = 0; i < listGames.length; i++) {
			if (typeof listGames[i].gamekeywords.en !== "undefined") {
				let gamenickname = listGames[i].gamenickname
				let launchernickname = listGames[i].launchernickname
				let search = fs.readFileSync("/tmp/regataos-gcs/search.txt", "utf8");
				let gamekeywords_gcs_en = listGames[i].gamekeywords.en
				let gamekeywords_gcs_pt = listGames[i].gamekeywords.pt

				if (search.length >= 2) {
					if ((gamekeywords_gcs_en.indexOf(search) > -1) == "1") {
						$(".title-top").css("display", "block")
						$(".title-top2").css("display", "block")

						games_list3(gamenickname, launchernickname);
						$("." + gamenickname).css("display", "block")

					} else if ((gamekeywords_gcs_pt.indexOf(search) > -1) == "1") {
						$(".title-top").css("display", "block")
						$(".title-top2").css("display", "block")

						games_list3(gamenickname, launchernickname);
						$("." + gamenickname).css("display", "block")
					}

				} else {
					$(".app-block-universal").css("display", "none")
				}

			} else {
				let gamenickname = listGames[i].gamenickname
				let launchernickname = listGames[i].launchernickname
				let search = fs.readFileSync("/tmp/regataos-gcs/search.txt", "utf8");
				let gamekeywords = listGames[i].gamekeywords

				if (search.length >= 2) {
					if ((gamekeywords.indexOf(search) > -1) == "1") {
						$(".title-top").css("display", "block")
						$(".title-top2").css("display", "block")

						games_list3(gamenickname, launchernickname);
						$("." + gamenickname).css("display", "block")
					}

				} else {
					$(".app-block-universal").css("display", "none")
				}
			}
		}
	}
	check_results();
}
search();
