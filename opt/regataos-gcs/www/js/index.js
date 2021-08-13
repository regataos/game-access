const fs = require('fs');
const exec = require('child_process').exec;

// View Sidebar Options
$("#block-home").css("display", "block")
$(".top-bar-arrow").css("display", "none")
$("ul#top-menu").css("margin-left", "50px")
$("a.p-home").css("font-weight", "700")
$("a.p-installed").css("font-weight", "400")
$("a.p-allgames").css("font-weight", "400")

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

	setTimeout(function() {
		$(".progress-bar-full").css("display", "none")
	}, 100);
}
});

}

// Show progress bar if process starts
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
    exec(command_line,function(error,call,errlog){
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

// If necessary, increase the size of the progress bar box
function downspeed() {
fs.access('/tmp/progressbar-gcs/speed', (err) => {
if (!err) {
	$("#iframepb").css("height", "205px")
	return;
} else {
	$("#iframepb").css("height", "180px")
}
});
}

// Show the link to the installed games page
function installed_page() {
	fs.access('/tmp/regataos-gcs/config/installed/show-installed-games.txt', (err) => {
	if (!err) {
		$(".p-installed-li").css("display", "block");
	} else {
		$(".p-installed-li").css("display", "none");
	}
	});
}

// Check if Steam is installed and if there are any games installed
function steam_games() {
	fs.access('/tmp/regataos-gcs/config/steam-games/no-steam-games.txt', (err) => {
	if (!err) {
		fs.access('/tmp/regataos-gcs/config/steam-games/json/steam-id/show-steam-games.txt', (err) => {
		if (!err) {
			$(".p-steam-li").css("display", "block");
			return;
		} else {
			$(".p-steam-li").css("display", "none");
		}
		});

		return;
	} else {
		$(".p-steam-li").css("display", "block");
	}
	});
}

setInterval(function() {
	installed_page();
	steam_games();
}, 500);

setInterval(function() {
	show_progressbar();
	downspeed();
	//home_url();
}, 500);
