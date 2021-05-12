//Check the url of the page to get the nickname of the game
function check_url() {
    var iframeurl = document.getElementById("iframegcs").contentWindow.location.href
	var url_split1 = iframeurl.split("pages/")[1];
	window.pagename = url_split1.replace('-games.html', '');
}

// Enable/desable FPS
function enable_fps() {
	check_url();

	const exec = require('child_process').exec;
	var command_line = "sed -i 's/FPS=0/FPS=1/' $HOME/.config/regataos-gcs/" + pagename + ".conf";
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function disable_fps() {
	check_url();

	const exec = require('child_process').exec;
	var command_line = "sed -i 's/FPS=1/FPS=0/' $HOME/.config/regataos-gcs/" + pagename + ".conf";
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function showfps() {
	check_url();

	var checkBox = document.getElementById(pagename + "fps");
	if (checkBox.checked == true){
		enable_fps();
	} else {
		disable_fps();
	}
}

function hidefps() {
	check_url();

	var checkBox = document.getElementById(pagename + "nonfps");
	if (checkBox.checked == true){
		enable_fps();
	} else {
		disable_fps();
	}
}
