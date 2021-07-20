// All functions for the game pages

//Check the url of the page to get the nickname of the game
function check_url() {
    var url = window.location.href;
    var url_split1 = url.split("pages/")[1];
    window.gamename = url_split1.replace('-gcs.html', '');
}
check_url();

//Install game
function install_game() {
	const exec = require('child_process').exec;
	var command_line = 'echo "' + gamename + '" > "/tmp/regataos-gcs/confirm-installation"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
    });
}

//Uninstall game
function uninstall_game() {
    const exec = require('child_process').exec;
    var command_line = 'echo "' + gamename + '" > "/tmp/regataos-gcs/confirm-uninstall"';
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

//Run game
function run_game() {
	const fs = require('fs');

	var files = [];

    // Read the JSON file with the list of games
    fs.readdirSync("/opt/regataos-gcs/games-list").forEach(files => {
    fs.readFile("/opt/regataos-gcs/games-list/" +files , "utf8", function(err, data) {
    if(!err) {
        var games = JSON.parse(data);

        for (var i = 0; i < games.length; i++) {
	        if (gamename.indexOf(games[i].gamenickname) > -1) {
                var gamevariables = games[i].winevariable
                var gamenickname = games[i].gamenickname

                const exec = require('child_process').exec;
		        var command_line = 'export GAMEVAR="' + gamevariables + '"; export GAME="' + gamenickname + '"; export LAUNCHER="' + gamenickname + '"; /opt/regataos-gcs/scripts/action-games/rungame';
		        console.log(command_line);
		        exec(command_line,function(error,call,errlog){
		        });

		        setTimeout(function(){
		    	    $(".run-" + gamename).css("opacity", ".5")
		    	    $(".run-" + gamename).css("cursor", "default")
		    	    $(".run-" + gamename).css("pointer-events", "none");
		        },1000);

		        setTimeout(function(){
		    	    $(".run-" + gamename).css("opacity", "1")
		    	    $(".run-" + gamename).css("cursor", "pointer")
		    	    $(".run-" + gamename).css("pointer-events", "auto");
                },30000);
            }
        }
	}
    });
    });
}
