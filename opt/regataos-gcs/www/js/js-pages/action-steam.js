// Open the Steam client
function run_steam_client() {
    const exec = require('child_process').exec;

    var command_line = 'cd /usr/share/applications/; gtk-launch "steam.desktop"';
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

// Run Steam game
function run_steam_game() {
    const exec = require('child_process').exec;

    var command_line = 'cd /usr/share/applications/; gtk-launch "steam.desktop"; sleep 5; steam steam://rungameid/' + gameid;
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}
