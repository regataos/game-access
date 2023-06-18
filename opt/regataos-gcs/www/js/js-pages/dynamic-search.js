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

	//Read the list of games that should appear in each block
	//for (var i = 0; i < games.length; i++) {
	games.forEach(gamesdata => {
		//Configure according to game launcher
		if (typeof gamesdata.gameorigin !== 'undefined') {
			//Request the creation of the new element (block) for each game
			var new_game_blocks = document.createElement("div");

			//Add classes to the new game blocks
			new_game_blocks.classList.add("app-block", gamesdata.launchernickname + "-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

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

		} else {
			if ((gamesdata.launchernickname.indexOf("steam") > -1) == "1") {
				if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-steam.json')) {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gamenickname + "-block";

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

					//Variable required for uninstall game button
					var gamenickname = "'" + gamesdata.gamenickname + "'"

					//Check game plataform
					if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
						var game_plataform = "nativegame"
					} else {
						var game_plataform = "steamplay"
					}

					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
						<div class="universal-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + gamesdata.gamenickname + '.jpg)"></div> \
							<div class="block-play-universal"> \
								<div id="' + gamesdata.gameid + '" class="install-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_steam_game();"> \
								<div class="play-button"> \
									<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
								</div> \
							</div> \
							</div> \
							<div class="block-text-universal" title="' + gamesdata.gamename + '"> \
								<div class="block-title">' + gamesdata.gamename + '</div> \
								<div class="block-desc">Steam</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
									<div class="native-game-desc ' + game_plataform + '">Native</div> \
								</div> \
							</div> \
						</div>';

					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
					pagesBlocksLang();

				} else {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gamenickname + "-block";

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

					//Variable required for uninstall game button
					var gamenickname = "'" + gamesdata.gamenickname + "'"

					//Check game plataform
					if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
						var game_plataform = "nativegame"
					} else {
						var game_plataform = "steamplay"
					}

					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
						<div class="universal-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + gamesdata.gamenickname + '.jpg)"></div> \
							<div class="block-play-universal"> \
							<div id="' + gamesdata.gameid + '" class="play-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_steam_game();"> \
								<div class="play-button"> \
									<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
								</div> \
							</div> \
							</div> \
							<div class="block-text-universal" title="' + gamesdata.gamename + '"> \
								<div class="block-title">' + gamesdata.gamename + '</div> \
								<div class="block-desc">Steam</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
									<div class="native-game-desc ' + game_plataform + '">Native</div> \
								</div> \
							</div> \
						</div>';

					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
					pagesBlocksLang();
				}
				// Show Steam Games
				$("div.app-block-steam").css("display", "block")

			} else if ((gamesdata.launchernickname.indexOf("epicstore") > -1) == "1") {
				if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-epicstore.json')) {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gameid + "-block";

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

					//Variable required for uninstall game button
					var gamenickname = "'" + gamesdata.gamenickname + "'"

					//Set game image
					if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + gamesdata.gamenickname + '.jpg')) {
						var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + gamesdata.gamenickname + ".jpg"
						var gamebackg = "file://" + background

					} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + gamesdata.gamenickname + '.png')) {
						var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + gamesdata.gamenickname + ".png"
						var gamebackg = "file://" + background

					} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + gamesdata.gamenickname)) {
						var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + gamesdata.gamenickname
						var gamebackg = "file://" + background

					} else {
						var gamebackg = "'" + gamesdata.game_img1 + "'"
					}

					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
						<div class="universal-game-img epicstore-game-img" style="background-image: url(' + gamebackg + ')"></div> \
							<div class="block-play-universal"> \
								<div id="' + gamesdata.gamenickname + '" class="install-box-universal" onclick="window.gamenickname=this.id; window.gamenickname=' + gamenickname + '; install_epicstore_game();"> \
								<div class="play-button"> \
									<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
								</div> \
							</div> \
							</div> \
							<div class="block-text-universal" title="' + gamesdata.gamename + '"> \
								<div class="block-title">' + gamesdata.gamename + '</div> \
								<div class="block-desc">Epic Games Store</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
									<div class="native-game-desc gcs">Game Access</div> \
								</div> \
							</div> \
						</div>';

					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
					pagesBlocksLang();

				} else {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gameid + "-block";

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

					//Variable required for uninstall game button
					var gamenickname = "'" + gamesdata.gamenickname + "'"

					//Set game image
					if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + gamesdata.gamenickname + '.jpg')) {
						var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + gamesdata.gamenickname + ".jpg"
						var gamebackg = "file://" + background

					} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + gamesdata.gamenickname + '.png')) {
						var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + gamesdata.gamenickname + ".png"
						var gamebackg = "file://" + background

					} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + gamesdata.gamenickname)) {
						var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + gamesdata.gamenickname
						var gamebackg = "file://" + background

					} else {
						var gamebackg = "'" + gamesdata.game_img1 + "'"
					}

					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
						<div class="universal-game-img epicstore-game-img" style="background-image: url(' + gamesdata.game_img1 + ')"></div> \
							<div class="block-play-universal"> \
								<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove=' + gamenickname + '; uninstall_epicstore_game();"> \
									<i class="fas fa-trash-alt"></i> \
								</div> \
								<div id="' + gamesdata.gameid + '" class="play-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_epicstore_game();"> \
								<div class="play-button"> \
									<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
								</div> \
							</div> \
							</div> \
							<div class="block-text-universal" title="' + gamesdata.gamename + '"> \
								<div class="block-title">' + gamesdata.gamename + '</div> \
								<div class="block-desc">Epic Games Store</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
									<div class="native-game-desc gcs">Game Access</div> \
								</div> \
							</div> \
						</div>';

					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
					pagesBlocksLang();
				}

			} else if ((gamesdata.launchernickname.indexOf("gog") > -1) == "1") {
				if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-gog.json')) {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gameid + "-block";

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

					//Variable required for uninstall game button
					var gamenickname = "'" + gamesdata.gamenickname + "'"

					//Set game image
					if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + gamesdata.gamenickname + '.webp')) {
						var background = "/tmp/regataos-gcs/config/gog-games/img/" + gamesdata.gamenickname + ".webp"
						var gamebackg = "file://" + background
					}

					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
						<div class="universal-game-img gog-game-img" style="background-image: url(' + gamebackg + ')"></div> \
							<div class="block-play-universal"> \
								<div id="' + gamesdata.gamenickname + '" class="install-box-universal" onclick="window.gamenickname=this.id; window.gamenickname=' + gamenickname + '; install_gog_game();"> \
								<div class="play-button"> \
									<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
								</div> \
							</div> \
							</div> \
							<div class="block-text-universal" title="' + gamesdata.gamename + '"> \
								<div class="block-title">' + gamesdata.gamename + '</div> \
								<div class="block-desc">GOG Galaxy</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
									<div class="native-game-desc gcs">Game Access</div> \
								</div> \
							</div> \
						</div>';

					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
					pagesBlocksLang();

				} else {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gameid + "-block";

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

					//Variable required for uninstall game button
					var gamenickname = "'" + gamesdata.gamenickname + "'"

					//Set game image
					if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + gamesdata.gamenickname + '.webp')) {
						var background = "/tmp/regataos-gcs/config/gog-games/img/" + gamesdata.gamenickname + ".webp"
						var gamebackg = "file://" + background
					}

					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
						<div class="universal-game-img gog-game-img" style="background-image: url(' + gamebackg + ')"></div> \
							<div class="block-play-universal"> \
								<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove=' + gamenickname + '; uninstall_gog_game();"> \
									<i class="fas fa-trash-alt"></i> \
								</div> \
								<div id="' + gamesdata.gameid + '" class="play-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_gog_game();"> \
								<div class="play-button"> \
									<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
								</div> \
							</div> \
							</div> \
							<div class="block-text-universal" title="' + gamesdata.gamename + '"> \
								<div class="block-title">' + gamesdata.gamename + '</div> \
								<div class="block-desc">GOG Galaxy</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
									<div class="native-game-desc gcs">Game Access</div> \
								</div> \
							</div> \
						</div>';

					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
					pagesBlocksLang();
				}

			} else if ((gamesdata.launchernickname.indexOf("gcs") > -1) == "1") {
				if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '.json')) {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block", gamesdata.launchernickname + "-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/" + gamesdata.launchernickname + "/" + gamesdata.gamenickname + ".jpg')";

					//Add game details within the newly created block
					//Special variables for running games
					var gameNickname = "'" + gamesdata.gamenickname + "'";

					new_game_blocks.innerHTML = ' \
						<div class="block-play ' + gamesdata.gamenickname + '-hover"> \
							<div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId=' + gameNickname + '; goGamePageId();"> \
								<i class="fa fa-plus"></i> \
							</div> \
							<div id="' + gamesdata.gamenickname + '" class="install-box-universal" onclick="window.gameId=this.id; installGameId();"> \
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

				} else {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block", gamesdata.launchernickname + "-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/" + gamesdata.launchernickname + "/" + gamesdata.gamenickname + ".jpg')";

					//Add game details within the newly created block
					//Special variables for running games
					var gameNickname = "'" + gamesdata.gamenickname + "'";

					new_game_blocks.innerHTML = ' \
						<div class="block-play ' + gamesdata.gamenickname + '-hover"> \
							<div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId=' + gameNickname + '; goGamePageId();"> \
								<i class="fa fa-plus"></i> \
							</div> \
							<div id="' + gamesdata.gamenickname + '" class="play-box-universal" onclick="window.gameId=this.id; runGameId();"> \
								<div class="play-button"> \
									<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
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

			} else {
				//Request the creation of the new element (block) for each game
				var new_game_blocks = document.createElement("div");

				//Add classes to the new game blocks
				new_game_blocks.classList.add("app-block", gamesdata.launchernickname + "-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

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
		}

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
