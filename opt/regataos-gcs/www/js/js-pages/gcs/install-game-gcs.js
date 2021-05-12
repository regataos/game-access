//If prompted, install the game
function run_install_game() {
    const exec = require('child_process').exec;
    const fs = require('fs');

	var url = window.location.href;

	if (((url.indexOf("allgames") > -1) == "-1")||((url.indexOf("search") > -1) == "-1")) {
		var url_split1 = url.split("pages/")[1];
		window.gamename = url_split1.replace('.html', '');
	}

    fs.access("/tmp/regataos-gcs/installing-" + gamename, (err) => {
    if (err) {
        fs.access("/tmp/regataos-gcs/confirm-installation", (err) => {
        if (!err) {
	        var command_line = 'gamename=$(cat "/tmp/regataos-gcs/confirm-installation"); rm -f "/tmp/regataos-gcs/confirm-installation"; "/opt/regataos-gcs/scripts/install/scripts-install/$gamename-compatibility-mode.sh" start';
	        console.log(command_line);
	        exec(command_line,function(error,call,errlog){
            });
		return;
		}
        });
    return;
    }
    });
}

setInterval(function(){ 
    run_install_game()
}, 1000);
