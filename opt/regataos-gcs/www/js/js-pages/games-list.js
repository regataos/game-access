// This script helps to dynamically create game blocks
function games_list1() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/opt/regataos-gcs/www/js/js-pages/games-list").forEach(files => {
	fs.readFile("/opt/regataos-gcs/www/js/js-pages/games-list/" +files , "utf8", function(err, data) {
	if(!err) {
	var games = JSON.parse(data);

		// Request the dynamic creation of game blocks on the HTML page
		//Capture the main element where the game blocks will be created
		var all_blocks = document.querySelector("div.blocks3");

		//Read the list of games that should appear in each block
		for (var i = 0; i < games.length; i++) {

		//Only display games for the specific launcher
    	var url = window.location.href;
    	var url_split1 = url.split("pages/")[1];
		var pagename = url_split1.replace('-games.html', '');

		if ((games[i].launchernickname.indexOf(pagename) > -1) == "1") {

		//if (games[i].launchernickname.indexOf("battlenet") > -1) {
			//Request the creation of the new element (block) for each game
			var new_game_blocks = document.createElement("div");

			//Add classes to the new game blocks
			new_game_blocks.classList.add("app-block", games[i].launchernickname + "-block", games[i].gamenickname);

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
		}

		}
		return;
	}
	});
	});
}

function games_list2() {
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

			//Request the creation of the new element (block) for each game
			var new_game_blocks = document.createElement("div");

			//Add classes to the new game blocks
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
		}
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
