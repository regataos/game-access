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
			</div>';

			//Finally, create the new game blocks dynamically
			all_blocks.appendChild(new_game_blocks);
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
		if ((gamesdata.launchernickname.indexOf("steam") > -1) == "1") {

			if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/json/installed/' + gamesdata.gamenickname + '.json')) {
				const child = all_blocks.querySelector("div#" + gamesdata.gamenickname + "-block");
	
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gamenickname + "-block";
	
					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-steam", gamesdata.gamenickname);
		
					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";
	
					//Check game plataform
					if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
						var game_plataform = "nativegame"
					} else {
						var game_plataform = "steamplay"
					}
	
					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
					<div class="steam-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + gamesdata.gamenickname + '.jpg)"></div> \
						<div class="block-play-steam"> \
							<div id="' + gamesdata.gameid + '" class="install-box-steam" onclick="window.gameid=this.id; run_steam_game();"> \
							<div class="play-button"> \
								<i class="fas fa-download"></i><div class="install-txt">Jogar</div> \
							</div> \
						</div> \
						</div> \
						<div class="block-text-steam" title="' + gamesdata.gamename + '"> \
							<div class="block-title">' + gamesdata.gamename + '</div> \
							<div class="block-desc">Steam</div> \
							<div class="native-game"> \
								<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
								<div class="native-game-desc ' + game_plataform + '">Native</div> \
						</div> \
					</div>';
	
					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
	
			} else {
				const child = all_blocks.querySelector("div#" + gamesdata.gamenickname + "-block");
					//Request the creation of the new element (block) for each game
					var new_game_blocks = document.createElement("div");
					new_game_blocks.id = gamesdata.gamenickname + "-block";
	
					//Add classes to the new game blocks
					new_game_blocks.classList.add("app-block-steam", gamesdata.gamenickname);
		
					//Add the game image in the background
					new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";
	
					//Check game plataform
					if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
						var game_plataform = "nativegame"
					} else {
						var game_plataform = "steamplay"
					}
	
					//Add game details within the newly created block
					new_game_blocks.innerHTML = ' \
					<div class="steam-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + gamesdata.gamenickname + '.jpg)"></div> \
						<div class="block-play-steam"> \
						<div id="' + gamesdata.gameid + '" class="play-box-steam" onclick="window.gameid=this.id; run_steam_game();"> \
							<div class="play-button"> \
								<i class="fas fa-play"></i><div class="play-txt">Instalar</div> \
							</div> \
						</div> \
						</div> \
						<div class="block-text-steam" title="' + gamesdata.gamename + '"> \
							<div class="block-title">' + gamesdata.gamename + '</div> \
							<div class="block-desc">Steam</div> \
						<div class="native-game"> \
							<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
							<div class="native-game-desc ' + game_plataform + '">Native</div> \
						</div> \
					</div>';
	
					//Finally, create the new game blocks dynamically
					all_blocks.appendChild(new_game_blocks);
			}
		} else {
			//Request the creation of the new element (block) for each game
			var new_game_blocks = document.createElement("div");

			//Add classes to the new game blocks
			new_game_blocks.classList.add("app-block", gamesdata.launchernickname+"-block", gamesdata.gamenickname);

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
			</div>';

			//Finally, create the new game blocks dynamically
			all_blocks.appendChild(new_game_blocks);
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
} else {
	games_list2();
}
