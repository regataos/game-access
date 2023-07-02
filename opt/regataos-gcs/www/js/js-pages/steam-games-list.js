// Create the cache with JSON files of games available in the user's Steam account
function create_cache_steam_games() {
	var fs = require("fs");

	if (fs.existsSync('/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt')) {

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
						gamename_lowercase = gamename_lowercase.replace(/[:-]/g, "");
						gamename_lowercase = gamename_lowercase.replace(/[.]/g, "")
						gamename_lowercase = gamename_lowercase.replace(/(|)/g, "")
						gamename_lowercase = gamename_lowercase.replace(/(,)/g, "")
						gamename_lowercase = gamename_lowercase.replace(/(>)/g, "")
						gamename_lowercase = gamename_lowercase.replace(/(_)/g, "")
						gamename_lowercase = gamename_lowercase.replace(/[+®]/g, "")
						gamename_lowercase = gamename_lowercase.replace(/(&)/g, "and")
						gamename_lowercase = gamename_lowercase.replace(/\s+/g, "-");
						gamename_lowercase = gamename_lowercase.replace(/'|\(|\)/g, "")
						gamename_lowercase = gamename_lowercase.replace(/[!-]/g, '');
						gamename_lowercase = gamename_lowercase.replace(/[!?]/g, '');
						gamename_lowercase = gamename_lowercase.replace(/(™)/g, '');
						gamename_lowercase = gamename_lowercase.replace(/(ç)/g, 'c');
						gamename_lowercase = gamename_lowercase.replace(/(á)|(â)|(ã)|(à)/g, 'a');
						gamename_lowercase = gamename_lowercase.replace(/(é)|(ê)|(ẽ)/g, 'e');
						gamename_lowercase = gamename_lowercase.replace(/(í)/g, 'i');
						gamename_lowercase = gamename_lowercase.replace(/(ó)|(ô)|(ô)/g, 'o');
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
										let gamekeywords = gamename_lowercase.replace(/(-)/g, " ");

										// Create JSON file with game information
										const exec = require('child_process').exec;
										var command_line = 'export game_name="' + game_name + '"; export gamename_lowercase="' + gamename_lowercase + '"; export gamekeywords="' + gamekeywords + '"; export gameid="' + game_id + '"; export gametype="' + game_type + '"; export gamenative="' + game_native + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
										console.log(command_line);
										exec(command_line, function (error, call, errlog) {
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

						if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/img/' + gamename_lowercase + '.jpg')) {
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
										let gamekeywords = gamename_lowercase.replace(/(-)/g, " ");

										// Create JSON file with game information
										const exec = require('child_process').exec;
										var command_line = 'export game_name="' + game_name + '"; export gamename_lowercase="' + gamename_lowercase + '"; export gamekeywords="' + gamekeywords + '"; export gameid="' + game_id + '"; export gametype="' + game_type + '"; export gamenative="' + game_native + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
										console.log(command_line);
										exec(command_line, function (error, call, errlog) {
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
										let gamekeywords = gamename_lowercase.replace(/(-)/g, " ");

										// Create JSON file with game information
										const exec = require('child_process').exec;
										var command_line = 'export game_name="' + game_name + '"; export gamename_lowercase="' + gamename_lowercase + '"; export gamekeywords="' + gamekeywords + '"; export gameid="' + game_id + '"; export gametype="' + game_type + '"; export gamenative="' + game_native + '"; /opt/regataos-gcs/scripts/create-cache-steam-games';
										exec(command_line, function (error, call, errlog) {
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

					console.log(">> remove update steam cache file")
					fs.unlinkSync('/tmp/regataos-gcs/config/steam-games/update-cache-steam.txt')
					return;
				}
			});
		});
	}
}

const updateSteamCache = setInterval(create_cache_steam, 1000);
function create_cache_steam() {
	var fs = require("fs");

	if (fs.existsSync('/tmp/regataos-gcs/config/installed/show-installed-games.txt')) {
		if (fs.existsSync('/tmp/regataos-gcs/config/steam-games/update-cache-steam.txt')) {
			create_cache_steam_games()

		} else {
			if (fs.existsSync('/tmp/regataos-gcs/config/steam-games/show-menu-steam.txt')) {
				console.log(">> stop update steam cache")
				fs.writeFileSync("/tmp/regataos-gcs/config/steam-games/update-cache-steam.txt", "Update steam cache", "utf8");
			}
		}

	} else {
		clearInterval(updateSteamCache);
	}
}

function list_steam_games_account_load() {
	var fs = require("fs");

	var files = [];
	var child = [];

	// Read JSON files with the list of games
	fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/games").forEach(files => {
		fs.readFile("/tmp/regataos-gcs/config/steam-games/json/games/" + files, "utf8", function (err, data2) {
			if (!err) {
				var steam_games_json = JSON.parse(data2);

				//Read the list of games that should appear in each block
				steam_games_json.forEach(gamesdata => {
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

// Show the list of installed games
function show_installed_games() {
	const fs = require("fs");

	if (fs.existsSync('/tmp/regataos-gcs/config/installed/show-installed-games-steam.txt')) {
		$(".universal-installed-games").css("min-height", "280px");
		$(".universal-installed-games").css("display", "grid");
		$(".universal-account-title").css("margin-top", "25px");
		$(".installed-title-steam").css("display", "block");

	} else {
		$(".universal-installed-games").css("display", "none");
		$(".universal-account-title").css("margin-top", "100px");
		$(".installed-title-steam").css("display", "none");
	}
}

// Show list of games in user account
function show_steam_games() {
	var fs = require("fs");
	fs.access('/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt', (err) => {
		if (!err) {
			$(".universal-account-title").css("display", "block");
			$(".universal-all-games").css("display", "grid");
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
	list_steam_games_account_load();
	list_installed_steam_games();

	setTimeout(function () {
		setInterval(function () {
			list_steam_games_account_load();
			list_installed_steam_games();
		}, 1000);
	}, 1000);

	show_steam_games();
	show_installed_games();

	setInterval(function () {
		show_steam_games();
		show_installed_games();
	}, 1000);
}
