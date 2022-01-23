// Dynamically display games available in the GOG Galaxy account on the screen
function list_gog_account() {
var fs = require("fs");

var files = [];
var child = [];
window.content_brake_gog = 0

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/gog-games/json").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/gog-games/json/" + files, "utf8", function (err, data) {
if (!err) {
	// Request the dynamic creation of game blocks on the HTML page
	//Capture the main element where the game blocks will be created
	var gog_all_games = document.querySelector("div.universal-all-games");
	var games = JSON.parse(data);

	//Read the list of games that should appear in each block
	for (var i = 0; i < games.length; i++) {
		const child = gog_all_games.querySelector("div." + games[i].gamenickname + "-block");

		if (child == null) {
			//Request the creation of the new element (block) for each game
			var gog_game_blocks = document.createElement("div");
			gog_game_blocks.id = games[i].gameid + "-block";

			//Add classes to the new game blocks
			gog_game_blocks.classList.add("app-block-universal", games[i].gamenickname + "-block");

			//Add the game image in the background
			gog_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

			//Set game image
			if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + games[i].gamenickname + '.webp')) {
				var background = "/tmp/regataos-gcs/config/gog-games/img/" + games[i].gamenickname + ".webp"
				var gamebackg = "file://" + background
			} else {
				var gamebackg = "'" + games[i].game_img1 + "'"
			}

			//Add game details within the newly created block
			gog_game_blocks.innerHTML = ' \
			<div class="universal-game-img gog-game-img" style="background-image: url(' + gamebackg + ')"></div> \
				<div class="block-play-universal"> \
					<div id="' + games[i].gamenickname + '" class="install-box-universal" onclick="window.gamenickname=this.id; install_gog_game();"> \
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
			if ( content_brake_gog >= 16) {
				break;
			} else {
				window.content_brake_gog = content_brake_gog + 1
				gog_all_games.appendChild(gog_game_blocks);
			}
		}

		if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + games[i].gamenickname + '-gog.json')) {
			$("div.universal-all-games div." + games[i].gamenickname + "-block").css("display", "block")
			$("div#universal-installed div." + games[i].gamenickname + "-block").css("display", "none")
		} else {
			$("div.universal-all-games div." + games[i].gamenickname + "-block").css("display", "none")
			$("div#universal-installed div." + games[i].gamenickname + "-block").css("display", "block")
		}
	}
return;
}
});
});
}
list_gog_account();

$(window).scroll(function() {
	if ( $(document).height() == $(window).scrollTop() + $(window).height()) {
		list_gog_account();
	}
});

function list_gog_account_load() {
var fs = require("fs");

var files = [];
var child = [];

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/gog-games/json").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/gog-games/json/" + files, "utf8", function (err, data) {
if (!err) {
	var gog_games_json = JSON.parse(data);

	//Read the list of games that should appear in each block
	gog_games_json.forEach(gamesdata => {
		if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-gog.json')) {
			$("div.universal-all-games div." + gamesdata.gamenickname + "-block").css("display", "block")
			$("div#universal-installed div." + gamesdata.gamenickname + "-block").css("display", "none")
		} else {
			$("div.universal-all-games div." + gamesdata.gamenickname + "-block").css("display", "none")
			$("div#universal-installed div." + gamesdata.gamenickname + "-block").css("display", "block")
		}
	})
return;
}
});
});
}

// Dynamically display installed games
function list_installed_gog_games() {
var fs = require("fs");

var files = [];
var child = [];

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/gog-games/json").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/gog-games/json/" + files, "utf8", function (err, data) {
if (!err) {

	// Request the dynamic creation of game blocks on the HTML page
	//Capture the main element where the game blocks will be created
	var gog_installed_games = document.querySelector("div.universal-installed-games");
	var gog_games_json = JSON.parse(data);

	//Read the list of games that should appear in each block
	gog_games_json.forEach(gamesdata => {
		const child = gog_installed_games.querySelector("div." + gamesdata.gamenickname + "-block");

		if (child == null) {
			//Request the creation of the new element (block) for each game
			var gog_game_blocks = document.createElement("div");
			gog_game_blocks.id = gamesdata.gameid + "-block";

			//Add classes to the new game blocks
			gog_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block");

			//Add the game image in the background
			gog_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

			//Variable required for uninstall game button
			var gamenickname = "'" + gamesdata.gamenickname + "'"

			//Set game image
			if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/img/' + gamesdata.gamenickname + '.webp')) {
				var background = "/tmp/regataos-gcs/config/gog-games/img/" + gamesdata.gamenickname + ".webp"
				var gamebackg = "file://" + background
			} else {
				var gamebackg = "'" + gamesdata.game_img1 + "'"
			}

			//Add game details within the newly created block
			gog_game_blocks.innerHTML = ' \
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
			gog_installed_games.appendChild(gog_game_blocks);
		}

		if (fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-gog.json')) {
			$("div.universal-all-games div." + gamesdata.gamenickname + "-block").css("display", "none")
			$("div#universal-installed div." + gamesdata.gamenickname + "-block").css("display", "block")
		} else {
			$("div.universal-all-games div." + gamesdata.gamenickname + "-block").css("display", "block")
			$("div#universal-installed div." + gamesdata.gamenickname + "-block").css("display", "none")
		}
	})
return;
}
});
});
}

// Check for installed games
function show_installed_games() {
	var fs = require("fs");

	fs.access('/tmp/regataos-gcs/config/installed/show-installed-games-gog.txt', (err) => {
	if (!err) {
		$("div.gog-title-installed").css("display", "block");
		$("div.universal-account-title").css("margin-top", "30px");
		list_installed_gog_games();

	} else {
		$("div.gog-title-installed").css("display", "none");
		$("div.universal-account-title").css("margin-top", "100px");
	}
	});
}
show_installed_games();

// Check Epic Games Store login
function start_list_games() {
	var fs = require("fs");
	fs.access('/tmp/regataos-gcs/config/gog-games/gamedb.json', (err) => {
	if (!err) {
		$("div.gog-title").css("display", "none")
		$("div.account-title-gog").css("display", "block")
		$("div.universal-all-games").css("display", "block")
		$("div.game-access-blocks").css("display", "none")

		list_gog_account_load();
		return;

	} else {
		$("div.gog-title").css("display", "block")
		$("div.account-title-gog").css("display", "none")
		$("div.universal-all-games").css("display", "none")
		$("div.game-access-blocks").css("display", "block")
	}
	});
}
start_list_games()

setTimeout(function(){
	setInterval(function(){
		start_list_games()
		show_installed_games();
	}, 500);
}, 500);

var time_load_account_games = setInterval(load_account_games, 1000);
function load_account_games() {
    const fs = require('fs');
	fs.access("/tmp/regataos-gcs/config/gog-games/gamedb.json", (err) => {
	if (!err) {
		list_gog_account();
		clearInterval(time_load_account_games);
		return;
	}
	});
}

// Show suggested games or titles available in the user's library
function run_search_gog_games() {
	const exec = require('child_process').exec;
	var command_line = '/opt/regataos-gcs/scripts/search-gog-games.sh; /opt/regataos-gcs/scripts/search-installed-games-gog.sh';
	exec(command_line,function(error,call,errlog){
	});
}
run_search_gog_games()

setTimeout(function(){
	setInterval(function(){
		run_search_gog_games()
	}, 1000);
}, 1000);

var uppage = setInterval(up_page_gog, 1000);
function up_page_gog() {
    const fs = require('fs');
	fs.access("/tmp/regataos-gcs/up-page-gog.txt", (err) => {
	if (!err) {
		fs.unlinkSync("/tmp/regataos-gcs/up-page-gog.txt");
		location.reload()
		clearInterval(uppage);
		return;
	}
	});
}
