// Dynamically display games available in the Epic Games Store account on the screen
function list_epicstore_account() {
var fs = require("fs");

var files = [];
var child = [];

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/epicstore-games/json").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/epicstore-games/json/" + files, "utf8", function (err, data) {
if (!err) {

	// Request the dynamic creation of game blocks on the HTML page
	//Capture the main element where the game blocks will be created
	var epicstore_all_games = document.querySelector("div.universal-all-games");

	var epicstore_games_json = JSON.parse(data);

	//Read the list of games that should appear in each block
	epicstore_games_json.forEach(gamesdata => {
		const child = epicstore_all_games.querySelector("div." + gamesdata.gamenickname + "-block");

		if (child == null) {
			//Request the creation of the new element (block) for each game
			var epicstore_game_blocks = document.createElement("div");
			epicstore_game_blocks.id = gamesdata.gameid + "-block";

			//Add classes to the new game blocks
			epicstore_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block");

			//Add the game image in the background
			epicstore_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

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
			epicstore_game_blocks.innerHTML = ' \
			<div class="universal-game-img epicstore-game-img" style="background-image: url(' + gamebackg + ')"></div> \
				<div class="block-play-universal"> \
					<div id="' + gamesdata.gamenickname + '" class="install-box-universal" onclick="window.gamenickname=this.id; install_epicstore_game();"> \
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
			epicstore_all_games.appendChild(epicstore_game_blocks);
		}

		if (!fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-epicstore.json')) {
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
function list_installed_epicstore_games() {
var fs = require("fs");

var files = [];
var child = [];

// Read JSON files with the list of games
fs.readdirSync("/tmp/regataos-gcs/config/epicstore-games/json").forEach(files => {
fs.readFile("/tmp/regataos-gcs/config/epicstore-games/json/" + files, "utf8", function (err, data) {
if (!err) {

	// Request the dynamic creation of game blocks on the HTML page
	//Capture the main element where the game blocks will be created
	var epicstore_installed_games = document.querySelector("div.universal-installed-games");

	var epicstore_games_json = JSON.parse(data);

	//Read the list of games that should appear in each block
	epicstore_games_json.forEach(gamesdata => {
		const child = epicstore_installed_games.querySelector("div." + gamesdata.gamenickname + "-block");

		if (child == null) {
			//Request the creation of the new element (block) for each game
			var epicstore_game_blocks = document.createElement("div");
			epicstore_game_blocks.id = gamesdata.gameid + "-block";

			//Add classes to the new game blocks
			epicstore_game_blocks.classList.add("app-block-universal", gamesdata.gamenickname + "-block");

			//Add the game image in the background
			epicstore_game_blocks.style.backgroundImage = "url('./../images/games-backg/steam/steam.jpg')";

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
			epicstore_game_blocks.innerHTML = ' \
			<div class="universal-game-img epicstore-game-img" style="background-image: url(' + gamebackg + ')"></div> \
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
			epicstore_installed_games.appendChild(epicstore_game_blocks);
		}

		if (fs.existsSync('/tmp/regataos-gcs/config/installed/' + gamesdata.gamenickname + '-epicstore.json')) {
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
	const exec = require('child_process').exec;

    var command_line = "cat $HOME/.config/legendary/installed.json | grep app_name";
	exec(command_line, (error, stdout, stderr) => {
    if (stdout) {
		var data = stdout
		if ((data.indexOf("app_name") > -1) == "1") {
			$(".universal-installed-games").css("display", "block");
			$(".universal-account-title").css("margin-top", "30px");
			$(".universal-installed-title").css("display", "block");
			list_installed_epicstore_games();

		} else {
			$(".universal-installed-games").css("display", "none");
			$(".universal-account-title").css("margin-top", "100px");
			$(".universal-installed-title").css("display", "none");
		}

	} else {
		fs.access('/tmp/regataos-gcs/config/installed/show-installed-games-epic.txt', (err) => {
		if (!err) {
			$(".universal-installed-games").css("display", "block");
			$(".universal-account-title").css("margin-top", "30px");
			$(".universal-installed-title").css("display", "block");
			list_installed_epicstore_games();

		} else {
			$(".universal-installed-games").css("display", "none");
			$(".universal-account-title").css("margin-top", "100px");
			$(".universal-installed-title").css("display", "none");
		}
		});
	}
	});
}

// Check Epic Games Store login
function start_list_games() {
	var fs = require("fs");
	fs.access('/tmp/regataos-gcs/config/epicstore-games/show-egs.txt', (err) => {
	if (!err) {
		$("div.universal-login").css("display", "none")
		$('body').css('background-image', 'url()');
		$("div.remove-account").css("display", "block")
		$("div.universal-account-title").css("display", "block")
		$("div.universal-all-games").css("display", "block")
		$("div.loading").css("display", "none")
		$("div.loading-games").css("display", "none")

		var launchers = fs.readFileSync("/tmp/regataos-gcs/config/installed-launchers.conf", "utf8");
		if ((launchers.indexOf("epicstore") > -1) == "1") {
			$("div.epicstore-install").css("display", "none")
			$("div.epicstore-more").css("display", "block")
		} else {
			$("div.epicstore-install").css("display", "block")
			$("div.epicstore-more").css("display", "none")
		}

		show_installed_games();
		list_epicstore_account();
		return;

	} else {
		if (fs.existsSync('/tmp/regataos-gcs/login-id.txt')) {
			$("div.universal-login").css("display", "none")
			$('body').css('background-image', 'url()');
		} else {
			$("div.universal-login").css("display", "block")
			$('body').css('background-image', 'url(./../images/games-backg/epicstore/epicstore-backg.jpg)');
		}

		if (fs.existsSync('/tmp/regataos-gcs/login-id.txt')) {
			$("div.loading").css("display", "block")
			$("div.loading-games").css("display", "block")

		} else {
			$("div.loading").css("display", "none")
			$("div.loading-games").css("display", "none")
		}

		$("div.remove-account").css("display", "none")
		$("div.universal-more").css("display", "none")
		$("div.universal-account-title").css("display", "none")
		$("div.universal-installed-title").css("display", "none")
		$("div.universal-installed-games").css("display", "none")
		$("div.universal-all-games").css("display", "none")
	}
	});
}
start_list_games()

setTimeout(function(){
	setInterval(function(){
		start_list_games()
	}, 500);
}, 500);