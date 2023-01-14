// For game page
//Check if the game is installed
function checkGameInstalled() {
    const fs = require("fs");
    const gameId = sessionStorage.getItem("game-gcs-id");

    if (fs.existsSync(`/tmp/regataos-gcs/config/installed/${gameId}.json`)) {
        document.querySelector(".install-button").style.display = "none";

        const runButton = document.querySelector(".run-button")
        runButton.style.display = "flex";
        runButton.id = `${gameId}-run`;

        const removeButton = document.querySelector(".remove-button")
        removeButton.style.display = "flex";
        removeButton.id = `${gameId}-remove`;

    } else {
        document.querySelector(".run-button").style.display = "none";
        document.querySelector(".remove-button").style.display = "none";

        const removeButton = document.querySelector(".install-button")
        removeButton.style.display = "flex";
        removeButton.id = `${gameId}`;
    }
}
checkGameInstalled();
setInterval(function () { checkGameInstalled() }, 1000);

// Start installing game
function confirmInstallGameId() {
    const exec = require('child_process').exec;
	var command_line = `echo "${gameId}" > "/tmp/regataos-gcs/start-installation-gcs.txt"`;
	exec(command_line,function(error,call,errlog){
	});

    const buttonPlay = document.getElementById(gameId);

    setTimeout(function(){
        buttonPlay.style.opacity = ".5";
        buttonPlay.style.cursor = "default";
        buttonPlay.style.pointerEvents = "none";
    },1000);

    setTimeout(function(){
        buttonPlay.style.opacity = "1";
        buttonPlay.style.cursor = "pointer";
        buttonPlay.style.pointerEvents = "auto";
    },2000);
}

//Remove the game
function removeGameId() {
    const exec = require('child_process').exec;

    let newGameId = gameId.replace('-remove', '');

    const commandInstallGame = `export gameNickname="${newGameId}"; /opt/regataos-gcs/scripts/remove/scripts-remove/uninstall-game-gcs/uninstall-gcs-game.sh`;
    exec(commandInstallGame, function (error, call, errlog) {
    });
}

//Run the game
function runGameId() {
    const exec = require('child_process').exec;

    let newGameId = gameId.replace('-run', '');

    const commandInstallGame = `export gameNickname="${newGameId}"; /opt/regataos-gcs/scripts/action-games/rungame-gcs`;
    exec(commandInstallGame, function (error, call, errlog) {
    });

    autoCloseGameAccess();

    const buttonPlay = document.getElementById(gameId);

    setTimeout(function(){
        buttonPlay.style.opacity = ".5";
        buttonPlay.style.cursor = "default";
        buttonPlay.style.pointerEvents = "none";
    },1000);

    setTimeout(function(){
        buttonPlay.style.opacity = "1";
        buttonPlay.style.cursor = "pointer";
        buttonPlay.style.pointerEvents = "auto";
    },10000);
}

//Go game page
function goGamePageId() {
    setTimeout(function(){
        sessionStorage.setItem("game-gcs-id", gameId);
        window.location.href = './../pages/gcs-games.html';
    }, 500);
}
