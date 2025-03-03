const fs = require('fs');
const exec = require('child_process').exec;

// View Sidebar Options
$(".top-bar-arrow").css("display", "none")
$("ul#top-menu").css("margin-left", "50px")
$("a.p-home").css("font-weight", "700")
$("a.p-installed").css("font-weight", "400")
$("a.p-allgames").css("font-weight", "400")
$("a.p-steam").css("font-weight", "400")
$("a.p-settings").css("font-weight", "400")

// Show progress bar if process starts
function show_progressbarfull() {
	fs.access('/tmp/progressbar-gcs/show-barfull', (err) => {
		if (!err) {
			$(".progress-bar-full").css("display", "block")
			$(".progress-bar-full").css("margin-left", "270px")
			$(".progress-bar-full").css("opacity", "1")
			return;
		} else {
			$(".progress-bar-full").css("margin-left", "260px")
			$(".progress-bar-full").css("opacity", "0.5")

			setTimeout(function () {
				$(".progress-bar-full").css("display", "none")
			}, 100);
		}
	});

}

// Show progress bar if process starts
setInterval(show_progressbar, 500);
function show_progressbar() {
	fs.access('/tmp/progressbar-gcs/progressbar', (err) => {
		if (!err) {
			$(".progress-bar").css("display", "block")
			$(".others").css("display", "none")
			show_progressbarfull()
			return;
		} else {
			$(".progress-bar").css("display", "none")
			$(".progress-bar-full").css("display", "none")

			$(".others").css("display", "block")

			var command_line = "rm -f /tmp/progressbar-gcs/show-barfull";
			//console.log(command_line);
			exec(command_line, function (error, call, errlog) {
			});
		}
	});

	fs.access('/tmp/progressbar-gcs/queued-2', (err) => {
		if (!err) {
			console.error('myfile already exists');
			$(".progress-bar-full").css("width", "435px")

			return;
		} else {
			$(".progress-bar-full").css("width", "423px")
		}
	});

}

// Show the link to the installed games page
setInterval(installed_page, 500);
function installed_page() {
	fs.access('/tmp/regataos-gcs/config/installed/show-installed-games.txt', (err) => {
		if (!err) {
			document.querySelector(".p-installed-li").style.display = "block";
			document.querySelector(".p-installed-li a").style.display = "inline-block";
		} else {
			document.querySelector(".p-installed-li").style.display = "none";
			document.querySelector(".p-installed-li a").style.display = "none";
		}
	});
}

// Check if Steam is installed and if there are any games installed
const checkSteamCache = setInterval(steam_games, 500);
function steam_games() {
	if (!fs.existsSync('/tmp/regataos-gcs/config/steam-games/no-steam-games.txt')) {
		if (fs.existsSync('/tmp/regataos-gcs/config/steam-games/show-menu-steam.txt')) {
			document.querySelector(".p-steam-li").style.display = "block";
			document.querySelector(".p-steam-li a").style.display = "inline-block";
			clearInterval(checkSteamCache);

		} else {
			if (fs.readdirSync("/tmp/regataos-gcs/config/steam-games/json/games").length) {
				document.querySelector(".p-steam-li").style.display = "block";
				document.querySelector(".p-steam-li a").style.display = "inline-block";
				clearInterval(checkSteamCache);
			} else {
				$(".p-steam-li").css("display", "none");
				document.querySelector(".p-steam-li").style.display = "none";
				document.querySelector(".p-steam-li a").style.display = "none";
			}
		}

	} else {
		$(".p-steam-li").css("display", "none");
		document.querySelector(".p-steam-li").style.display = "none";
		document.querySelector(".p-steam-li a").style.display = "none";
	}
}
