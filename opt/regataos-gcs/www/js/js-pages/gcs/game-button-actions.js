// Check if the game is installed
function checkGameInstalled() {
    const fs = require("fs");

    sessionStorage.setItem("game-gcs-id", "xonotic");
    const gameId = sessionStorage.getItem("game-gcs-id");

    if (fs.existsSync(`/tmp/regataos-gcs/config/installed/${gameId}.json`)) {
        document.querySelector(".run-button").style.display = "flex";
        document.querySelector(".remove-button").style.display = "flex";
        document.querySelector(".install-button").style.display = "none";
    } else {
        document.querySelector(".run-button").style.display = "none";
        document.querySelector(".remove-button").style.display = "none";
        document.querySelector(".install-button").style.display = "flex";
    }
}
checkGameInstalled();

setInterval(function () { checkGameInstalled() }, 1000);

// Install the game
function installGame() {
    const exec = require('child_process').exec;

    sessionStorage.setItem("game-gcs-id", "xonotic");
    const gameId = sessionStorage.getItem("game-gcs-id");

    const commandInstallGame = `export gameNickname="${gameId}"; /opt/regataos-gcs/scripts/install/pt-br/install-game-gcs/install-gcs-game.sh`;
    exec(commandInstallGame, function (error, call, errlog) {
    });
}

// Remove the game
function removeGame() {
    const exec = require('child_process').exec;

    sessionStorage.setItem("game-gcs-id", "xonotic");
    const gameId = sessionStorage.getItem("game-gcs-id");

    const commandInstallGame = `export gameNickname="${gameId}"; /opt/regataos-gcs/scripts/action-games/remove-game-gcs`;
    exec(commandInstallGame, function (error, call, errlog) {
    });
}

// Run the game
function runGame() {
    const exec = require('child_process').exec;

    sessionStorage.setItem("game-gcs-id", "xonotic");
    const gameId = sessionStorage.getItem("game-gcs-id");

    const commandInstallGame = `export gameNickname="${gameId}"; /opt/regataos-gcs/scripts/action-games/rungame-gcs`;
    exec(commandInstallGame, function (error, call, errlog) {
    });
}
