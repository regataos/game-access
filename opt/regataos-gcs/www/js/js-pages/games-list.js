// This script helps to dynamically create game blocks
function games_list1() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
	fs.readFile("/opt/regataos-gcs/games-list/" +files , "utf8", function(err, data) {
	if(!err) {
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
			<div class="block-text ' + gamesdata.gamenickname +'" title="' + gamesdata.gamename +'"> \
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

function games_list2() {
	var fs = require("fs");

	var files = [];
	var child = [];
	window.content_brake = 0
	window.content_brake_epicstore = 0
	window.content_brake_steam = 0
	window.content_brake_gog = 0
	window.content_brake_gcs = 0

	// Read JSON files with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
	fs.readFile("/opt/regataos-gcs/games-list/" +files , "utf8", function(err, data) {
	if(!err) {
		var games = JSON.parse(data);

		// Request the dynamic creation of game blocks on the HTML page
		//Capture the main element where the game blocks will be created
		var all_blocks = document.querySelector("div.blocks4");

		//Read the list of games that should appear in each block
		for (var i = 0; i < games.length; i++) {
			const child = all_blocks.querySelector("div." + games[i].gamenickname + "-block");

			if (child == null) {
				//Configure according to game launcher
				if (typeof games[i].gameorigin !== 'undefined') {
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");

					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block", games[i].launchernickname+"-block", games[i].gamenickname + "-block", games[i].gamenickname);

					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/" + games[i].launchernickname + "/" + games[i].gamenickname + ".jpg')";

					//Add game details within the newly created block
					//Special variables for running games
					var winevariable = "'" + games[i].winevariable + "'";
					var launchername = "'" + games[i].launchernickname + "'";
					var rungame = "'" + games[i].gamerun_appid + "'";

					new_game_blocks.innerHTML = ' \
					<div class="block-play ' + games[i].gamenickname + '-hover"> \
						<div id="' + games[i].gamenickname + '" class="play-box" onclick="window.gamename=this.id; window.winevariable=' + winevariable + '; window.launchername=' + launchername + '; window.rungame=' + rungame + '; run_game();"> \
							<div class="play-button"> \
								<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
							</div> \
						</div> \
						<div id="' + games[i].gamenickname + '" class="install-box" onclick="window.gamename=this.id; window.winevariable=' + winevariable + '; window.launchername=' + launchername + '; window.rungame=' + rungame + '; run_game();"> \
							<div class="play-button"> \
								<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
							</div> \
						</div> \
					</div> \
					<div class="block-text ' + games[i].gamenickname +'" title="' + games[i].gamename +'"> \
						<div class="block-title">' + games[i].gamename + '</div> \
						<div class="block-desc">' + games[i].launcher + '</div> \
						<div class="native-game"> \
							<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
							<div class="native-game-desc gcs">Game Access</div> \
						</div> \
					</div>';

					//Finally, create the new game blocks dynamically
					if ( content_brake >= 10) {
						break;
					} else {
						window.content_brake = content_brake + 1
						all_blocks.appendChild(new_game_blocks);
						pagesBlocksLang();
					}

				} else {
					if ((games[i].launchernickname.indexOf("steam") > -1) == "1") {
						if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + games[i].gamenickname + '-steam.json')) {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
							new_game_blocks.id = games[i].gamenickname + "-block";
				
							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block-universal", games[i].gamenickname + "-block", games[i].gamenickname);
					
							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";
				
							//Variable required for uninstall game button
							var gamenickname = "'" + games[i].gamenickname + "'"

							//Check game plataform
							if ((games[i].gamenative.indexOf("true") > -1) == "1") {
								var game_plataform = "nativegame"
							} else {
								var game_plataform = "steamplay"
							}

							//Add game details within the newly created block
							new_game_blocks.innerHTML = ' \
							<div class="universal-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + games[i].gamenickname + '.jpg)"></div> \
								<div class="block-play-universal"> \
									<div id="' + games[i].gameid + '" class="install-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_steam_game();"> \
									<div class="play-button"> \
										<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
									</div> \
								</div> \
								</div> \
								<div class="block-text-universal" title="' + games[i].gamename + '"> \
									<div class="block-title">' + games[i].gamename + '</div> \
									<div class="block-desc">Steam</div> \
									<div class="native-game"> \
										<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
										<div class="native-game-desc ' + game_plataform + '">Native</div> \
									</div> \
								</div> \
							</div>';
				
							//Finally, create the new game blocks dynamically
							if ( content_brake_steam >= 10) {
								break;
							} else {
								window.content_brake_steam = content_brake_steam + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}
				
						} else {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
							new_game_blocks.id = games[i].gamenickname + "-block";

							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block-universal", games[i].gamenickname + "-block", games[i].gamenickname);
				
							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

							//Variable required for uninstall game button
							var gamenickname = "'" + games[i].gamenickname + "'"

							//Check game plataform
							if ((games[i].gamenative.indexOf("true") > -1) == "1") {
								var game_plataform = "nativegame"
							} else {
								var game_plataform = "steamplay"
							}
				
							//Add game details within the newly created block
							new_game_blocks.innerHTML = ' \
							<div class="universal-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + games[i].gamenickname + '.jpg)"></div> \
								<div class="block-play-universal"> \
								<div id="' + games[i].gameid + '" class="play-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_steam_game();"> \
									<div class="play-button"> \
										<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
									</div> \
								</div> \
								</div> \
								<div class="block-text-universal" title="' + games[i].gamename + '"> \
									<div class="block-title">' + games[i].gamename + '</div> \
									<div class="block-desc">Steam</div> \
									<div class="native-game"> \
										<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
										<div class="native-game-desc ' + game_plataform + '">Native</div> \
									</div> \
								</div> \
							</div>';
				
							//Finally, create the new game blocks dynamically
							if ( content_brake_steam >= 10) {
								break;
							} else {
								window.content_brake_steam = content_brake_steam + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}
						}
						// Show Steam Games
						$("div.app-block-steam").css("display", "block")

					} else if ((games[i].launchernickname.indexOf("epicstore") > -1) == "1") {
						if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + games[i].gamenickname + '-epicstore.json')) {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
							new_game_blocks.id = games[i].gameid + "-block";

							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block-universal", games[i].gamenickname + "-block", games[i].gamenickname);

							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

							//Variable required for uninstall game button
							var gamenickname = "'" + games[i].gamenickname + "'"

							//Set game image
							if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + games[i].gamenickname + '.jpg')) {
								var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + games[i].gamenickname + ".jpg"
								var gamebackg = "file://" + background

							} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + games[i].gamenickname + '.png')) {
								var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + games[i].gamenickname + ".png"
								var gamebackg = "file://" + background

							} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + games[i].gamenickname)) {
								var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + games[i].gamenickname
								var gamebackg = "file://" + background

							} else {
								var gamebackg = "'" + games[i].game_img1 + "'"
							}

							//Add game details within the newly created block
							new_game_blocks.innerHTML = ' \
							<div class="universal-game-img epicstore-game-img" style="background-image: url(' + gamebackg + ')"></div> \
								<div class="block-play-universal"> \
									<div id="' + games[i].gamenickname + '" class="install-box-universal" onclick="window.gamenickname=this.id; window.gamenickname=' + gamenickname + '; install_epicstore_game();"> \
									<div class="play-button"> \
										<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
									</div> \
								</div> \
								</div> \
								<div class="block-text-universal" title="' + games[i].gamename + '"> \
									<div class="block-title">' + games[i].gamename + '</div> \
									<div class="block-desc">Epic Games Store</div> \
									<div class="native-game"> \
										<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
										<div class="native-game-desc gcs">Game Access</div> \
									</div> \
								</div> \
							</div>';
				
							//Finally, create the new game blocks dynamically
							if ( content_brake_epicstore >= 10) {
								break;
							} else {
								window.content_brake_epicstore = content_brake_epicstore + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}

						} else {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
							new_game_blocks.id = games[i].gameid + "-block";
				
							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block-universal", games[i].gamenickname + "-block", games[i].gamenickname);
				
							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";
				
							//Variable required for uninstall game button
							var gamenickname = "'" + games[i].gamenickname + "'"

							//Set game image
							if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + games[i].gamenickname + '.jpg')) {
								var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + games[i].gamenickname + ".jpg"
								var gamebackg = "file://" + background

							} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + games[i].gamenickname + '.png')) {
								var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + games[i].gamenickname + ".png"
								var gamebackg = "file://" + background

							} else if (fs.existsSync('/tmp/regataos-gcs/config/epicstore-games/img/' + games[i].gamenickname)) {
								var background = "/tmp/regataos-gcs/config/epicstore-games/img/" + games[i].gamenickname
								var gamebackg = "file://" + background

							} else {
								var gamebackg = "'" + games[i].game_img1 + "'"
							}

							//Add game details within the newly created block
							new_game_blocks.innerHTML = ' \
							<div class="universal-game-img epicstore-game-img" style="background-image: url(' + games[i].game_img1 + ')"></div> \
								<div class="block-play-universal"> \
									<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove=' + gamenickname + '; uninstall_epicstore_game();"> \
										<i class="fas fa-trash-alt"></i> \
									</div> \
									<div id="' + games[i].gameid + '" class="play-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_epicstore_game();"> \
									<div class="play-button"> \
										<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
									</div> \
								</div> \
								</div> \
								<div class="block-text-universal" title="' + games[i].gamename + '"> \
									<div class="block-title">' + games[i].gamename + '</div> \
									<div class="block-desc">Epic Games Store</div> \
									<div class="native-game"> \
										<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
										<div class="native-game-desc gcs">Game Access</div> \
									</div> \
								</div> \
							</div>';
				
							//Finally, create the new game blocks dynamically
							if ( content_brake_epicstore >= 10) {
								break;
							} else {
								window.content_brake_epicstore = content_brake_epicstore + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}
						}

					} else if ((games[i].launchernickname.indexOf("gog") > -1) == "1") {
						if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + games[i].gamenickname + '-gog.json')) {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
							new_game_blocks.id = games[i].gameid + "-block";

							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block-universal", games[i].gamenickname + "-block", games[i].gamenickname);

							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

							//Variable required for uninstall game button
							var gamenickname = "'" + games[i].gamenickname + "'"

							//Set game image
							if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + games[i].gamenickname + '.webp')) {
								var background = "/tmp/regataos-gcs/config/gog-games/img/" + games[i].gamenickname + ".webp"
								var gamebackg = "file://" + background
							}

							//Add game details within the newly created block
							new_game_blocks.innerHTML = ' \
							<div class="universal-game-img gog-game-img" style="background-image: url(' + gamebackg + ')"></div> \
								<div class="block-play-universal"> \
									<div id="' + games[i].gamenickname + '" class="install-box-universal" onclick="window.gamenickname=this.id; window.gamenickname=' + gamenickname + '; install_gog_game();"> \
									<div class="play-button"> \
										<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
									</div> \
								</div> \
								</div> \
								<div class="block-text-universal" title="' + games[i].gamename + '"> \
									<div class="block-title">' + games[i].gamename + '</div> \
									<div class="block-desc">GOG Galaxy</div> \
									<div class="native-game"> \
										<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
										<div class="native-game-desc gcs">Game Access</div> \
									</div> \
								</div> \
							</div>';

							//Finally, create the new game blocks dynamically
							if ( content_brake_gog >= 10) {
								break;
							} else {
								window.content_brake_gog = content_brake_gog + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}
				
						} else {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
							new_game_blocks.id = games[i].gameid + "-block";
				
							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block-universal", games[i].gamenickname + "-block", games[i].gamenickname);
				
							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";
				
							//Variable required for uninstall game button
							var gamenickname = "'" + games[i].gamenickname + "'"

							//Set game image
							if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + games[i].gamenickname + '.webp')) {
								var background = "/tmp/regataos-gcs/config/gog-games/img/" + games[i].gamenickname + ".webp"
								var gamebackg = "file://" + background
							}

							//Add game details within the newly created block
							new_game_blocks.innerHTML = ' \
							<div class="universal-game-img gog-game-img" style="background-image: url(' + gamebackg + ')"></div> \
								<div class="block-play-universal"> \
									<div title="Desinstalar jogo" class="remove-game-button" onclick="window.game_for_remove=' + gamenickname + '; uninstall_gog_game();"> \
										<i class="fas fa-trash-alt"></i> \
									</div> \
									<div id="' + games[i].gameid + '" class="play-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; run_gog_game();"> \
									<div class="play-button"> \
										<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
									</div> \
								</div> \
								</div> \
								<div class="block-text-universal" title="' + games[i].gamename + '"> \
									<div class="block-title">' + games[i].gamename + '</div> \
									<div class="block-desc">GOG Galaxy</div> \
									<div class="native-game"> \
										<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
										<div class="native-game-desc gcs">Game Access</div> \
									</div> \
								</div> \
							</div>';
				
							//Finally, create the new game blocks dynamically
							if ( content_brake_gog >= 10) {
								break;
							} else {
								window.content_brake_gog = content_brake_gog + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}
						}

					} else if ((games[i].launchernickname.indexOf("gcs") > -1) == "1") {
						if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + games[i].gamenickname + '.json')) {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
			
							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block", games[i].launchernickname+"-block", games[i].gamenickname + "-block", games[i].gamenickname);
			
							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/" + games[i].launchernickname + "/" + games[i].gamenickname + ".jpg')";
			
							//Add game details within the newly created block
							//Special variables for running games
							var gameNickname = "'" + games[i].gamenickname + "'";
			
							new_game_blocks.innerHTML = ' \
							<div class="block-play ' + games[i].gamenickname + '-hover"> \
								<div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId=' + gameNickname + '; goGamePageId();"> \
									<i class="fa fa-plus"></i> \
								</div> \
								<div id="' + games[i].gamenickname + '" class="install-box-universal" onclick="window.gameId=this.id; installGameId();"> \
									<div class="play-button"> \
										<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
									</div> \
								</div> \
							</div> \
							<div class="block-text ' + games[i].gamenickname +'" title="' + games[i].gamename +'"> \
								<div class="block-title">' + games[i].gamename + '</div> \
								<div class="block-desc">' + games[i].launcher + '</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
									<div class="native-game-desc gcs">Game Access</div> \
								</div> \
							</div>';
			
							//Finally, create the new game blocks dynamically
							if ( content_brake_gcs >= 10) {
								break;
							} else {
								window.content_brake_gcs = content_brake_gcs + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}

						} else {
							//Request the creation of the new element (block) for each game
							var new_game_blocks = document.createElement("div");
			
							//Add classes to the new game blocks
							new_game_blocks.classList.add("app-block", games[i].launchernickname+"-block", games[i].gamenickname + "-block", games[i].gamenickname);
			
							//Add the game image in the background
							new_game_blocks.style.backgroundImage = "url('./../images/games-backg/" + games[i].launchernickname + "/" + games[i].gamenickname + ".jpg')";
			
							//Add game details within the newly created block
							//Special variables for running games
							var gameNickname = "'" + games[i].gamenickname + "'";
			
							new_game_blocks.innerHTML = ' \
							<div class="block-play ' + games[i].gamenickname + '-hover"> \
								<div title="Mais sobre o jogo" class="morefor-game-button" onclick="window.gameId=' + gameNickname + '; goGamePageId();"> \
									<i class="fa fa-plus"></i> \
								</div> \
								<div id="' + games[i].gamenickname + '" class="play-box-universal" onclick="window.gameId=this.id; runGameId();"> \
									<div class="play-button"> \
										<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
									</div> \
								</div> \
							</div> \
							<div class="block-text ' + games[i].gamenickname +'" title="' + games[i].gamename +'"> \
								<div class="block-title">' + games[i].gamename + '</div> \
								<div class="block-desc">' + games[i].launcher + '</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
									<div class="native-game-desc gcs">Game Access</div> \
								</div> \
							</div>';
			
							//Finally, create the new game blocks dynamically
							if ( content_brake_gcs >= 10) {
								break;
							} else {
								window.content_brake_gcs = content_brake_gcs + 1
								all_blocks.appendChild(new_game_blocks);
								pagesBlocksLang();
							}			
						}

					} else {
						//Request the creation of the new element (block) for each game
						var new_game_blocks = document.createElement("div");

						//Add classes to the new game blocks
						new_game_blocks.classList.add("app-block", games[i].launchernickname+"-block", games[i].gamenickname + "-block", games[i].gamenickname);

						//Add the game image in the background
						new_game_blocks.style.backgroundImage = "url('./../images/games-backg/" + games[i].launchernickname + "/" + games[i].gamenickname + ".jpg')";

						//Add game details within the newly created block
						//Special variables for running games
						var winevariable = "'" + games[i].winevariable + "'";
						var launchername = "'" + games[i].launchernickname + "'";
						var rungame = "'" + games[i].gamerun_appid + "'";

						new_game_blocks.innerHTML = ' \
						<div class="block-play ' + games[i].gamenickname + '-hover"> \
							<div id="' + games[i].gamenickname + '" class="play-box" onclick="window.gamename=this.id; window.winevariable=' + winevariable + '; window.launchername=' + launchername + '; window.rungame=' + rungame + '; run_game();"> \
								<div class="play-button"> \
									<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
								</div> \
							</div> \
							<div id="' + games[i].gamenickname + '" class="install-box" onclick="window.gamename=this.id; window.winevariable=' + winevariable + '; window.launchername=' + launchername + '; window.rungame=' + rungame + '; run_game();"> \
								<div class="play-button"> \
									<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
								</div> \
							</div> \
						</div> \
						<div class="block-text ' + games[i].gamenickname +'" title="' + games[i].gamename +'"> \
							<div class="block-title">' + games[i].gamename + '</div> \
							<div class="block-desc">' + games[i].launcher + '</div> \
							<div class="native-game"> \
								<div class="native-game-img" style="background-image: url(./../images/gcs.png)"></div> \
								<div class="native-game-desc gcs">Game Access</div> \
							</div> \
						</div>';

						//Finally, create the new game blocks dynamically
						if ( content_brake >= 10) {
							break;
						} else {
							window.content_brake = content_brake + 1
							all_blocks.appendChild(new_game_blocks);
							pagesBlocksLang();
						}
					}
				}
			}

		}
	return;
	}
	});
	});
}

$(window).scroll(function() {
	if ( $(document).height() == $(window).scrollTop() + $(window).height()) {
		games_list2();
	}
});

// For search page
function games_list3() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
	fs.readFile("/opt/regataos-gcs/games-list/" +files , "utf8", function(err, data) {
	if(!err) {
		var games = JSON.parse(data);

		// Request the dynamic creation of game blocks on the HTML page
		//Capture the main element where the game blocks will be created
		var all_blocks = document.querySelector("div.blocks4");

		//Read the list of games that should appear in each block
		//for (var i = 0; i < games.length; i++) {
		games.forEach(gamesdata => {
			//Configure according to game launcher
			if (typeof gamesdata.gameorigin !== 'undefined') {
				//Request the creation of the new element (block) for each game
				var new_game_blocks = document.createElement("div");

				//Add classes to the new game blocks
				new_game_blocks.classList.add("app-block", gamesdata.launchernickname+"-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

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
				<div class="block-text ' + gamesdata.gamenickname +'" title="' + gamesdata.gamename +'"> \
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
						new_game_blocks.classList.add("app-block", gamesdata.launchernickname+"-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);
		
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
						<div class="block-text ' + gamesdata.gamenickname +'" title="' + gamesdata.gamename +'"> \
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
						new_game_blocks.classList.add("app-block", gamesdata.launchernickname+"-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);
		
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
						<div class="block-text ' + gamesdata.gamenickname +'" title="' + gamesdata.gamename +'"> \
							<div class="block-title">' + gamesdata.gamename + '</div> \
							<div class="block-desc">' +gamesdata.launcher + '</div> \
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
					new_game_blocks.classList.add("app-block", gamesdata.launchernickname+"-block", gamesdata.gamenickname + "-block", gamesdata.gamenickname);

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
					<div class="block-text ' + gamesdata.gamenickname +'" title="' + gamesdata.gamename +'"> \
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
	});
	});
}

var url = window.location.href;
if ((url.indexOf("-games") > -1) == "1") {
	games_list1();
} else if ((url.indexOf("search") > -1) == "1") {
	games_list3();
} else {
	games_list2();
}

// Game to hide as it will be removed
function game_to_hide() {
	var fs = require("fs");
	var filePath = "/tmp/regataos-gcs/game-to-hide.txt"

	if (fs.existsSync(filePath)) {
		var gamenickname = fs.readFileSync(filePath, "utf8");
		gamenickname = gamenickname.replace(/(\r\n|\n|\r)/gm, "");

		$("div." + gamenickname + "-block").remove();

		setTimeout(function(){
			fs.unlinkSync(filePath);
		}, 1000);
	}
}

setInterval(function(){
	game_to_hide()
}, 1000);
