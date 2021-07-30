// Open a pop-up that allows login to launcher
function open_url(URL) {
	window.open(URL, 'popup', 'width=1024, height=590')
}



// If necessary, display the loading status on the page
function check_status() {
	var verification_time = setInterval(show_loading, 1000);

	function show_loading() {
		const fs = require('fs');

		if (fs.existsSync('/tmp/regataos-gcs/login-id.txt')) {
			$("div.title-top").css("display", "none")
			$("div.epicstore-login").css("display", "none")
			$("div.blocks3").css("display", "none")
			$("div.loading").css("display", "block")
			$("div.loading-games").css("display", "block")

		} else {
			$("div.title-top").css("display", "block")
			$("div.epicstore-login").css("display", "block")
			$("div.blocks3").css("display", "block")
			$("div.loading").css("display", "none")
			$("div.loading-games").css("display", "none")
			clearInterval(verification_time);
		}
	}
}

// Save login id to a cache file
function save_login_id() {
	const exec = require('child_process').exec;
	const fs = require('fs');
	fs.writeFileSync("/tmp/regataos-gcs/login-id.txt", login_id, "utf8");

	setTimeout(function(){
		check_status()
		var command_line = '/opt/regataos-gcs/scripts/show-epicstore-games.sh start';
		exec(command_line,function(error,call,errlog){
		});
	}, 1000);
}

// Verify that Epic Games Store login has already been performed
window.onmessage = function (e) {
	if (e.data) {
		window.login_id = e.data;
		save_login_id();
	}
};
