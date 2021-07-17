// This script helps to dynamically create game blocks
function list_steam_games() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/steam-id").forEach(files => {
	fs.readFile("/tmp/regataos-gcs/config/steam-games/json/steam-id/" + files, "utf8", function(err, data) {
	if(!err) {
		var steam_games = JSON.parse(data);
		steam_games = steam_games.response.games;

		// Request the dynamic creation of game blocks on the HTML page
		//Capture the main element where the game blocks will be created
		var all_blocks = document.querySelector("div.steam-all-games");

		//Read the list of games that should appear in each block
		for (var i = 0; i < steam_games.length; i++) {
		if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/json/installed/' + steam_games[i].appid + '.json')) {

			//Request the creation of the new element (block) for each game
			var steam_game_blocks = document.createElement("div");

			//Add classes to the new game blocks
			steam_game_blocks.classList.add("app-block-steam");

			//Add the game image in the background
			steam_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

			//Add game details within the newly created block
			steam_game_blocks.innerHTML = ' \
			<div class="steam-game-img" style="background-image: url(https://cdn.cloudflare.steamstatic.com/steam/apps/'+ steam_games[i].appid + '/header.jpg)"></div> \
			<div class="block-play-steam"> \
				<div id="' + steam_games[i].appid + '" class="install-box-steam" onclick="window.gameid=this.id; run_steam_game();"> \
					<div class="play-button"> \
						<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
					</div> \
				</div> \
			</div> \
			<div class="block-text-steam" title="' + steam_games[i].name +'"> \
				<div class="block-title">' + steam_games[i].name + '</div> \
				<div class="block-desc">Steam</div> \
			</div>';

			//Finally, create the new game blocks dynamically
			all_blocks.appendChild(steam_game_blocks);
		}
		}
		return;
	}
	});
	});
}
list_steam_games();

// This script helps to dynamically create game blocks
function games_installed_steam() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/installed").forEach(files => {
	fs.readFile("/tmp/regataos-gcs/config/steam-games/json/installed/" +files , "utf8", function(err, data) {
	if(!err) {
	var games = JSON.parse(data);

		// Request the dynamic creation of game blocks on the HTML page
		//Capture the main element where the game blocks will be created
		var all_blocks = document.querySelector("div.steam-installed-games");

		//Read the list of games that should appear in each block
		for (var i = 0; i < games.length; i++) {
			//Request the creation of the new element (block) for each game
			var new_game_blocks = document.createElement("div");

			//Add classes to the new game blocks
			new_game_blocks.classList.add("app-block-steam");

			//Add the game image in the background
			new_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

			//Add game details within the newly created block
			new_game_blocks.innerHTML = ' \
			<div class="steam-game-img" style="background-image: url(https://cdn.cloudflare.steamstatic.com/steam/apps/'+ games[i].appid + '/header.jpg)"></div> \
			<div class="block-play-steam"> \
				<div id="' + games[i].appid + '" class="play-box-steam" onclick="window.gameid=this.id; run_steam_game();"> \
					<div class="play-button"> \
						<i class="fas fa-play"></i><div class="play-txt">Jogar</div> \
					</div> \
				</div> \
			</div> \
			<div class="block-text-steam" title="' + games[i].name +'"> \
				<div class="block-title">' + games[i].name + '</div> \
				<div class="block-desc">Steam</div> \
			</div>';

			//Finally, create the new game blocks dynamically
			all_blocks.appendChild(new_game_blocks);
		}
		return;
	}
	});
	});
}
games_installed_steam();
