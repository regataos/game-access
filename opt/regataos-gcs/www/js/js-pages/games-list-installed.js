// This script helps to dynamically create game blocks
function games_list_installed() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/opt/regataos-gcs/www/js/js-pages/games-list").forEach(files => {
	fs.readFile("/opt/regataos-gcs/www/js/js-pages/games-list/" +files , "utf8", function(err, data) {
	if(!err) {
		var games = JSON.parse(data);

		// Request the dynamic creation of game blocks on the HTML page
		//Capture the main element where the game blocks will be created
		var all_blocks = document.querySelector("div.blocks4");

		//Read the list of games that should appear in each block
		for (var i = 0; i < games.length; i++) {
		var gamename = games[i].gamenickname
		var installed_games = fs.readFileSync("/tmp/regataos-gcs/config/installed-games.conf", "utf8");
		if ((installed_games.indexOf(gamename) > -1) == "0") {
				document.getElementById(gamename).remove()
		} else {
			var launchernickname = games[i].launchernickname;
			var installed_launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
			if ((installed_launchers.indexOf(launchernickname) > -1) == "1") {

			const main_element = document.getElementById("games_installed");
			const child = main_element.querySelector("." + games[i].gamenickname);
			if (child == null) {

			//Request the creation of the new element (block) for each game
			var new_game_blocks = document.createElement("div");

			//Add ID and classes to the new game blocks
			new_game_blocks.id = games[i].gamenickname;
			new_game_blocks.classList.add("app-block", games[i].launchernickname+"-block", games[i].gamenickname);

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
			</div>';

			//Finally, create the new game blocks dynamically
			all_blocks.appendChild(new_game_blocks);

			const main_element = document.getElementById("games_installed");
			const child = main_element.querySelector(".app-block");
		
			if (child !== null) {
				$("div.title-top").css("display", "block")
				$(".nogamefound").css("display", "none")
			} else {
				$(".title-top").css("display", "none")
				$(".nogamefound").css("display", "block")
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

// Notify me if no installed games are found
function nogames_installed() {
	const main_element = document.getElementById("games_installed");
	const child = main_element.querySelector(".app-block");

	if (child !== null) {
		$("div.title-top").css("display", "block")
		$(".nogamefound").css("display", "none")
	} else {
		$(".title-top").css("display", "none")
		$(".nogamefound").css("display", "block")
	}
}

var url = window.location.href;
if ((url.indexOf("installed") > -1) == "1") {
	games_list_installed();

	setTimeout(function(){ 
		setInterval(function(){
			games_list_installed()
		}, 5000);
	}, 5000);

	setInterval(function(){
		nogames_installed()
	}, 100);
}
