// Create the cache with JSON files of games available in the user's Steam account
function create_cache_steam_games() {
	var fs = require("fs");

	var files = [];

	// Read JSON files with the list of games
	fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/steam-id").forEach(files => {
	fs.readFile("/tmp/regataos-gcs/config/steam-games/json/steam-id/" + files, "utf8", function (err, data) {
		if (!err) {
			var steam_games = JSON.parse(data);
				steam_games = steam_games.response.games;

			// Request the dynamic creation of game blocks on the HTML page
			//Capture the main element where the game blocks will be created
			var steam_all_games = document.querySelector("div.steam-all-games");
			var installed_games = document.querySelector("div.steam-installed-games");

			steam_games.forEach(games => {

				// If not, create the games JSON file
				if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/json/games-account/' + games.appid + '.json')) {
					// Make the request, putting the id directly in the URL, and send the return to the variable "res"
					const https = require('https');
					https.get(`https://store.steampowered.com/api/appdetails?appids=${games.appid}&cc=br&l=br`, (res) => {
					let data = "";

					// Take the data from the url and put it into the variable "data"
					res.on("data", (chunk) => {
						data += chunk;
					});

					// Convert raw content to JSON and show return
					res.on("end", () => {
					try {
						let json = JSON.parse(data);
						let game_name = json[games.appid].data.name;
						let game_id = json[games.appid].data.steam_appid;
						let game_type = json[games.appid].data.type;
						let game_native = json[games.appid].data.platforms.linux;

						// Create JSON file with game information
    					const exec = require('child_process').exec;
						var command_line = 'export gamename="' + game_name + '"; export gameid="' + game_id + '"; export gametype="' + game_type + '"; export gamenative="' + game_native + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
						console.log(command_line);
						exec(command_line,function(error,call,errlog){
						});

						if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/json/installed/' + game_id + '.json')) {
							//Request the creation of the new element (block) for each game
							var steam_game_blocks = document.createElement("div");
	
							//Add classes to the new game blocks
							steam_game_blocks.classList.add("app-block-steam");
	
							//Add the game image in the background
							steam_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

							//Check game plataform
							if ((game_native.indexOf("true") > -1) == "1") {
								var game_plataform = "nativegame"
							} else {
								var game_plataform = "steamplay"
							}
	
							//Add game details within the newly created block
							steam_game_blocks.innerHTML = ' \
							<div class="steam-game-img" style="background-image: url(https://cdn.cloudflare.steamstatic.com/steam/apps/'+ games.appid + '/header.jpg)"></div> \
							<div class="block-play-steam"> \
								<div id="' + game_id + '" class="install-box-steam" onclick="window.gameid=this.id; run_steam_game();"> \
									<div class="play-button"> \
										<i class="fas fa-download"></i><div class="install-txt">Instalar</div> \
									</div> \
								</div> \
							</div> \
							<div class="block-text-steam" title="' + game_name + '"> \
								<div class="block-title">' + game_name + '</div> \
								<div class="block-desc">Steam</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
									<div class="native-game-desc ' + game_plataform + '">Native</div> \
								</div> \
							</div>';

							//Finally, create the new game blocks dynamically
							steam_all_games.appendChild(steam_game_blocks);

						} else {
							//Request the creation of the new element (block) for each game
							var steam_game_blocks = document.createElement("div");

							//Add classes to the new game blocks
							steam_game_blocks.classList.add("app-block-steam");

							//Add the game image in the background
							steam_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

							//Check game plataform
							if ((game_native.indexOf("true") > -1) == "1") {
								var game_plataform = "nativegame"
							} else {
								var game_plataform = "steamplay"
							}
	
							//Add game details within the newly created block
							steam_game_blocks.innerHTML = ' \
							<div class="steam-game-img" style="background-image: url(https://cdn.cloudflare.steamstatic.com/steam/apps/'+ games.appid + '/header.jpg)"></div> \
							<div class="block-play-steam"> \
								<div id="' + game_id + '" class="play-box-steam" onclick="window.gameid=this.id; run_steam_game();"> \
									<div class="play-button"> \
										<i class="fas fa-play"></i><div class="play-txt">Instalar</div> \
									</div> \
								</div> \
							</div> \
							<div class="block-text-steam" title="' + game_name + '"> \
								<div class="block-title">' + game_name + '</div> \
								<div class="block-desc">Steam</div> \
								<div class="native-game"> \
									<div class="native-game-img" style="background-image: url(./../images/' + game_plataform + '.png)"></div> \
									<div class="native-game-desc ' + game_plataform + '">Native</div> \
								</div> \
							</div>';

							//Finally, create the new game blocks dynamically
							installed_games.appendChild(steam_game_blocks);
						}

					} catch (error) {
						console.error(error.message);
					};
					});

					}).on("error", (error) => {
						// No internet or something like that, unable to make the request on the site
						console.error(error.message);
					});

				} else {

					fs.readFile("/tmp/regataos-gcs/config/steam-games/json/games-account/" + games.appid + ".json", "utf8", function (err, data2) {
					if (!err) {
						var steam_games_json = JSON.parse(data2);

						//Read the list of games that should appear in each block
						steam_games_json.forEach(gamesdata => {

						// Save game image to cache
						if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/img/' + games.appid + '.jpg')) {
							// Create JSON file with game information
							const exec = require('child_process').exec;
							var command_line = 'export gameid="' + games.appid + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
							console.log(command_line);
							exec(command_line,function(error,call,errlog){
							});
						}

						if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/json/installed/' + games.appid + '.json')) {
							//Request the creation of the new element (block) for each game
							var steam_game_blocks = document.createElement("div");

							//Add classes to the new game blocks
							steam_game_blocks.classList.add("app-block-steam");

							//Add the game image in the background
							steam_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

							//Check game plataform
							if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
								var game_plataform = "nativegame"
							} else {
								var game_plataform = "steamplay"
							}
	
							//Add game details within the newly created block
							steam_game_blocks.innerHTML = ' \
								<div class="steam-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + gamesdata.gameid + '.jpg)"></div> \
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
							steam_all_games.appendChild(steam_game_blocks);

						} else {
							//Request the creation of the new element (block) for each game
							var steam_game_blocks = document.createElement("div");

							//Add classes to the new game blocks
							steam_game_blocks.classList.add("app-block-steam");

							//Add the game image in the background
							steam_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

							//Check game plataform
							if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
								var game_plataform = "nativegame"
							} else {
								var game_plataform = "steamplay"
							}
	
							//Add game details within the newly created block
							steam_game_blocks.innerHTML = ' \
							<div class="steam-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + gamesdata.gameid + '.jpg)"></div> \
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
							installed_games.appendChild(steam_game_blocks);
						}

						})
					return;
					}
					});
				}
			})
		return;
		}
	});
	});
}
