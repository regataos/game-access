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
function confirmInstallGameId(gamenickname) {
    const fs = require("fs");

    function runInstallation() {
        const exec = require('child_process').exec;
        const command_line = `echo "${gamenickname}" > "/tmp/regataos-gcs/start-installation-gcs.txt"`;
        exec(command_line, function (error, call, errlog) {
        });

        const buttonPlay = document.getElementById(gamenickname);

        setTimeout(function () {
            buttonPlay.style.opacity = ".5";
            buttonPlay.style.cursor = "default";
            buttonPlay.style.pointerEvents = "none";
        }, 1000);

        setTimeout(function () {
            buttonPlay.style.opacity = "1";
            buttonPlay.style.cursor = "pointer";
            buttonPlay.style.pointerEvents = "auto";
        }, 2000);
    }

    if (!fs.existsSync(`/tmp/regataos-gcs/installing-${gamenickname}`)) {
        if (fs.existsSync(`/tmp/progressbar-gcs/queued-process`)) {
            let checkInstallQueue = fs.readFileSync("/tmp/progressbar-gcs/queued-process", "utf8");
            if (checkInstallQueue.includes(gamenickname)) {
                runInstallation();
            }

        } else {
            runInstallation();
        }
    }
}

//Remove the game
function removeGameId(gamenickname) {
    const exec = require('child_process').exec;
    const newGameId = gamenickname.replace('-remove', '');
    const commandInstallGame = `export gameNickname="${newGameId}"; /opt/regataos-gcs/scripts/remove/scripts-remove/uninstall-game-gcs/uninstall-gcs-game.sh`;
    exec(commandInstallGame, function (error, call, errlog) {
    });
}

//Run the game
function runGameId(gamenickname) {
    const fs = require("fs");
    const newGameId = gamenickname.replace('-run', '');

    if (!fs.existsSync(`/tmp/regataos-gcs/running-${newGameId}`)) {
        const exec = require('child_process').exec;
        const commandInstallGame = `
        echo "${newGameId}" > /tmp/regataos-gcs/running-${newGameId}; \
        export gameNickname="${newGameId}"; /opt/regataos-gcs/scripts/action-games/rungame-gcs`;
        exec(commandInstallGame, function (error, call, errlog) {
        });

        autoCloseGameAccess();

        const buttonPlay = document.getElementById(newGameId);

        setTimeout(function () {
            buttonPlay.style.opacity = ".5";
            buttonPlay.style.cursor = "default";
            buttonPlay.style.pointerEvents = "none";
        }, 1000);

        setTimeout(function () {
            buttonPlay.style.opacity = "1";
            buttonPlay.style.cursor = "pointer";
            buttonPlay.style.pointerEvents = "auto";
        }, 10000);
    }
}

//Go game page
function goGamePageId(gamenickname) {
    setTimeout(function () {
        sessionStorage.setItem("game-gcs-id", gamenickname);
        window.location.href = './../pages/gcs-games.html';
    }, 500);
}
