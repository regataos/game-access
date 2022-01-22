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

	steam_games.forEach(games => {
		// Simplify game name to create a nickname
		let gamename_lowercase = games.name.toLowerCase();
		gamename_lowercase = gamename_lowercase.replace(/[:-]/g,"");
		gamename_lowercase = gamename_lowercase.replace(/[.]/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(|)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(,)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(>)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(_)/g,"")
		gamename_lowercase = gamename_lowercase.replace(/[+®]/g,"")
		gamename_lowercase = gamename_lowercase.replace(/(&)/g,"and")
		gamename_lowercase = gamename_lowercase.replace(/\s+/g,"-");
		gamename_lowercase = gamename_lowercase.replace(/'|\(|\)/g, "")
		gamename_lowercase = gamename_lowercase.replace(/[!-]/g,            '');
		gamename_lowercase = gamename_lowercase.replace(/[!?]/g,            '');
		gamename_lowercase = gamename_lowercase.replace(/(™)/g,             '');
		gamename_lowercase = gamename_lowercase.replace(/(ç)/g,             'c');
		gamename_lowercase = gamename_lowercase.replace(/(á)|(â)|(ã)|(à)/g, 'a');
		gamename_lowercase = gamename_lowercase.replace(/(é)|(ê)|(ẽ)/g,     'e');
		gamename_lowercase = gamename_lowercase.replace(/(í)/g,             'i');
		gamename_lowercase = gamename_lowercase.replace(/(ó)|(ô)|(ô)/g,     'o');
		gamename_lowercase = gamename_lowercase.replace(/(ü)|(ú)|(û)|(ũ)/g, 'u');

		// If not, create the games JSON file
		if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/json/games/' + gamename_lowercase + '-steam.json')) {
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
					let gamekeywords = gamename_lowercase.replace(/(-)/g," ");

					// Create JSON file with game information
    				const exec = require('child_process').exec;
					var command_line = 'export game_name="' + game_name + '"; export gamename_lowercase="' + gamename_lowercase + '"; export gamekeywords="' + gamekeywords + '"; export gameid="' + game_id + '"; export gametype="' + game_type + '"; export gamenative="' + game_native + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
					console.log(command_line);
					exec(command_line,function(error,call,errlog){
					});

				} catch (error) {
					console.error(error.message);
				};
				});

			}).on("error", (error) => {
				// No internet or something like that, unable to make the request on the site
				console.error(error.message);
			});

		} else if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/img/' + gamename_lowercase + '.jpg')) {
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
					let gamekeywords = gamename_lowercase.replace(/(-)/g," ");

					// Create JSON file with game information
    				const exec = require('child_process').exec;
					var command_line = 'export game_name="' + game_name + '"; export gamename_lowercase="' + gamename_lowercase + '"; export gamekeywords="' + gamekeywords + '"; export gameid="' + game_id + '"; export gametype="' + game_type + '"; export gamenative="' + game_native + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
					console.log(command_line);
					exec(command_line,function(error,call,errlog){
					});

				} catch (error) {
					console.error(error.message);
				};
				});

			}).on("error", (error) => {
				// No internet or something like that, unable to make the request on the site
				console.error(error.message);
			});
		}

		if (!fs.existsSync('/opt/regataos-gcs/games-list/' + gamename_lowercase + '-steam.json')) {
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
					let gamekeywords = gamename_lowercase.replace(/(-)/g," ");

					// Create JSON file with game information
    				const exec = require('child_process').exec;
					var command_line = 'export game_name="' + game_name + '"; export gamename_lowercase="' + gamename_lowercase + '"; export gamekeywords="' + gamekeywords + '"; export gameid="' + game_id + '"; export gametype="' + game_type + '"; export gamenative="' + game_native + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
					exec(command_line,function(error,call,errlog){
					});

				} catch (error) {
					console.error(error.message);
				};
				});

			}).on("error", (error) => {
				// No internet or something like that, unable to make the request on the site
				console.error(error.message);
			});
		}
	})
return;
}
});
});
}

// Create game blocks on the screen dynamically
function list_steam_games_account() {
var fs = require("fs");

var files = [];
var child = [];

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/games").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/steam-games/json/games/" + files, "utf8", function (err, data2) {
if (!err) {

	// Request the dynamic creation of game blocks on the HTML page
	//Capture the main element where the game blocks will be created
	var steam_all_games = document.querySelector("div.universal-all-games");

	var steam_games_json = JSON.parse(data2);

	//Read the list of games that should appear in each block
	steam_games_json.forEach(gamesdata => {
		const child = steam_all_games.querySelector("div#" + gamesdata.gamenickname + "-block");

		if (child == null) {
			//Request the creation of the new element (block) for each game
			var steam_game_blocks = document.createElement("div");
			steam_game_blocks.id = gamesdata.gamenickname + "-block";

			//Add classes to the new game blocks
			steam_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block");

			//Add the game image in the background
			steam_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

			//Variable required for uninstall game button
			var gamenickname = "'" + gamesdata.gamenickname + "'"

			//Check game plataform
			if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
				var game_plataform = "nativegame"
			} else {
				var game_plataform = "steamplay"
			}

			//Add game details within the newly created block
			steam_game_blocks.innerHTML = ' \
			<div class="universal-game-img" style="background-image: url(file:///tmp/regataos-gcs/config/steam-games/img/' + gamesdata.gamenickname + '.jpg)"></div> \
				<div class="block-play-universal"> \
					<div id="' + gamesdata.gameid + '" class="install-box-universal" onclick="window.gameid=this.id; window.gamenickname=' + gamenickname + '; install_steam_game();"> \
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
			steam_all_games.appendChild(steam_game_blocks);
		}

		if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-steam.json')) {
			$("div.universal-all-games div#" + gamesdata.gamenickname + "-block").css("display", "block")
			$("div.universal-installed-games div#" + gamesdata.gamenickname + "-block").css("display", "none")
		} else {
			$("div.universal-all-games div#" + gamesdata.gamenickname + "-block").css("display", "none")
			$("div.universal-installed-games div#" + gamesdata.gamenickname + "-block").css("display", "block")
		}
	})
return;
}
});
});
}

// Create game blocks on the screen dynamically
function list_installed_steam_games() {
var fs = require("fs");

var files = [];
var child = [];

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/games").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/steam-games/json/games/" + files, "utf8", function (err, data2) {
if (!err) {

	// Request the dynamic creation of game blocks on the HTML page
	//Capture the main element where the game blocks will be created
	var installed_games = document.querySelector("div.universal-installed-games");

	var steam_games_json = JSON.parse(data2);

	//Read the list of games that should appear in each block
	steam_games_json.forEach(gamesdata => {
		const child = installed_games.querySelector("div#" + gamesdata.gamenickname + "-block");

		if (child == null) {
			//Request the creation of the new element (block) for each game
			var steam_game_blocks = document.createElement("div");
			steam_game_blocks.id = gamesdata.gamenickname + "-block";

			//Add classes to the new game blocks
			steam_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block");

			//Add the game image in the background
			steam_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

			//Variable required for uninstall game button
			var gamenickname = "'" + gamesdata.gamenickname + "'"

			//Check game plataform
			if ((gamesdata.gamenative.indexOf("true") > -1) == "1") {
				var game_plataform = "nativegame"
			} else {
				var game_plataform = "steamplay"
			}

			//Add game details within the newly created block
			steam_game_blocks.innerHTML = ' \
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
			installed_games.appendChild(steam_game_blocks);
		}

		if (fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-steam.json')) {
			$("div.universal-all-games div#" + gamesdata.gamenickname + "-block").css("display", "none")
			$("div.universal-installed-games div#" + gamesdata.gamenickname + "-block").css("display", "block")
		} else {
			$("div.universal-all-games div#" + gamesdata.gamenickname + "-block").css("display", "block")
			$("div.universal-installed-games div#" + gamesdata.gamenickname + "-block").css("display", "none")
		}
	})
return;
}
});
});
}

// Show list of games in user account
function show_steam_games() {
	const exec = require('child_process').exec;

    var command_line = "ls $HOME/.local/share/Steam/steamapps/ | grep acf | cut -d'.' -f 2-";
    exec(command_line, (error, stdout, stderr) => {
    if (stdout) {
        var game_file = stdout

		if ((game_file.indexOf("acf") > -1) == "1") {
			$(".universal-installed-games").css("display", "block");
			$(".universal-account-title").css("margin-top", "30px");
			$(".universal-installed-title").css("display", "block");
		} else {
			$(".universal-installed-games").css("display", "none");
			$(".universal-account-title").css("margin-top", "100px");
			$(".universal-installed-title").css("display", "none");
		}
	} else {
		$(".universal-installed-games").css("display", "none");
		$(".universal-account-title").css("margin-top", "100px");
		$(".universal-installed-title").css("display", "none");
	}
	});
}

// Show the list of installed games
function show_installed_games() {
	var fs = require("fs");
	fs.access('/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt', (err) => {
	if (!err) {
		$(".universal-account-title").css("display", "block");
		$(".universal-all-games").css("display", "block");
		$(".universal-more").css("display", "block");
		return;
	} else {
		$(".universal-account-title").css("display", "none");
		$(".universal-all-games").css("display", "none");
		$(".universal-more").css("display", "block");
	}
	});
}

var page_url = window.location.href
if ((page_url.indexOf("steam-games") > -1) == "1") {
	list_steam_games_account();
	list_installed_steam_games();

	setTimeout(function(){
		setInterval(function(){
			list_steam_games_account();
			list_installed_steam_games();
		}, 1000);
	}, 1000);

	show_steam_games();
	show_installed_games();

	setInterval(function(){
		show_steam_games();
		show_installed_games();
	}, 1000);
}
