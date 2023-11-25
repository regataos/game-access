// Check games for GOG
const checkInstalledGamesGogTime = setInterval(checkInstalledGamesGog, 1000);
function checkInstalledGamesGog() {
	const fs = require("fs");

	// Check installed games
	if (fs.existsSync('/tmp/regataos-gcs/config/installed/show-installed-games-gog.txt')) {
		document.querySelector(".list-installed-games").style.display = "grid";
		document.querySelector("div.gog-title-installed").style.display = "block";
		document.querySelector(".blocks3-universal .account-title-gog").style.marginTop = "30px";
	} else {
		document.querySelector(".list-installed-games").style.display = "none";
		document.querySelector("div.gog-title-installed").style.display = "none";
		document.querySelector(".blocks3-universal .account-title-gog").style.marginTop = "100px";
	}

	// Check login
	if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/gamedb.json')) {
		document.querySelector(".title-top-box .gog-title").style.display = "none";
		document.querySelector(".blocks3-universal .account-title-gog").style.display = "block";
	} else {
		document.querySelector(".title-top-box .gog-title").style.display = "block";
		document.querySelector(".blocks3-universal .account-title-gog").style.display = "none";
	}
}
checkInstalledGamesGog();

// Show suggested games or titles available in the user's library
const runSearchGogGamesTime = setInterval(runSearchGogGames, 1000);
function runSearchGogGames() {
	const exec = require('child_process').exec;
	const commandLine = '/opt/regataos-gcs/scripts/search-installed-games-gog.sh';
	exec(commandLine, function (error, call, errlog) { });
}

// Relaod page
const reloadPageTime = setInterval(reloadPage, 1000);
function reloadPage() {
	const fs = require('fs');
	let checkStatus = "";

	if (fs.existsSync('/tmp/regataos-gcs/config/gog-games/gamedb.json2')) {
		checkStatus = "reloaded";
		sessionStorage.setItem("pageStatus", "reloaded");
	} else {
		checkStatus = "";
		sessionStorage.setItem("pageStatus", "");
	}

	if (fs.existsSync("/tmp/regataos-gcs/up-page-gog.txt")) {
		fs.unlinkSync("/tmp/regataos-gcs/up-page-gog.txt");
		clearInterval(reloadPageTime);
		location.reload();
	} else if (fs.existsSync("/tmp/regataos-gcs/up-page-gog-login.txt")) {
		checkStatus = sessionStorage.getItem("pageStatus");

		if ((!checkStatus) || (checkStatus) && (checkStatus !== "reloaded")) {
			fs.unlinkSync("/tmp/regataos-gcs/up-page-gog-login.txt");
			clearInterval(reloadPageTime);
			sessionStorage.setItem("pageStatus", "reloaded");
			location.reload();
		} else {
			fs.unlinkSync("/tmp/regataos-gcs/up-page-gog-login.txt");
		}
	}
}
