//Check the url of the page to get the nickname of the game
function check_url() {
    var url = window.location.href;
    var url_split1 = url.split("pages/")[1];
    window.gamename = url_split1.replace('-gcs.html', '');
}
check_url();

// Enable/desable FPS
function enable_fps() {
	const exec = require('child_process').exec;
	var command_line = "sed -i 's/FPS=0/FPS=1/' $HOME/.config/regataos-gcs/" + gamename + ".conf";
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function disable_fps() {
	const exec = require('child_process').exec;
	var command_line = "sed -i 's/FPS=1/FPS=0/' $HOME/.config/regataos-gcs/" + gamename + ".conf";
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function showfps() {
	var checkBox = document.getElementById(gamename + "fps");
	if (checkBox.checked == true){
		enable_fps();
	} else {
		disable_fps();
	}
}

function hidefps() {
	var checkBox = document.getElementById(gamename + "nonfps");
	if (checkBox.checked == true){
		enable_fps();
	} else {
		disable_fps();
	}
}
