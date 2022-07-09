// Check configuration files.
function checkConfigFile(data, desiredString) {
    const searchString = new RegExp(`(?<=${desiredString}).*`, "g");

    let systemConfig = data.match(searchString)[0];
    systemConfig = systemConfig.toLowerCase();
    systemConfig = systemConfig.replace(/:.*/g, '');
    systemConfig = systemConfig.replace(/\.utf-8/g, "").replace(/\.utf8/g, "");
    return systemConfig;
}

// Get the game ID through sessionStorage feature to apply the content on the page, among other game information.
function getGameId() {
    const fs = require("fs");

    const gameId = sessionStorage.getItem("game-gcs-id");

    if (fs.existsSync(`/opt/regataos-gcs/games-list/${gameId}.json`)) {
        const data = fs.readFileSync(`/opt/regataos-gcs/games-list/${gameId}.json`, "utf8");
        const game = JSON.parse(data);

        for (let i = 0; i < game.length; i++) {
            // Game title.
            document.querySelector(".game-title").innerHTML = game[i].gamename;

            // Game banner
            document.querySelector("body").style.backgroundImage = `url(${game[i].gamebanner})`;

            // Game logo
            document.getElementById("game-logo-img").src = `./../images/games-logo/${game[i].gamenickname}-logo.png`;

            // Game logo top
            document.getElementById("game-logo-img-top").src = `./../images/games-logo/${game[i].gamenickname}-logo-top.png`;

            // Game developer.
            document.querySelector(".game-developer").innerHTML = game[i].gamedev;

            // Game publisher.
            document.querySelector(".game-publisher").innerHTML = game[i].publisher;

            // Game images
            const img1 = game[i].gameimages.img1
            const gameImg1 = document.querySelectorAll(".game-img1");
            for (let i = 0; i < gameImg1.length; i++) {
                gameImg1[i].src = img1;
            }

            const img2 = game[i].gameimages.img2
            const gameImg2 = document.querySelectorAll(".game-img2");
            for (let i = 0; i < gameImg2.length; i++) {
                gameImg2[i].src = img2;
            }

            const img3 = game[i].gameimages.img3
            const gameImg3 = document.querySelectorAll(".game-img3");
            for (let i = 0; i < gameImg3.length; i++) {
                gameImg3[i].src = img3;
            }

            const img4 = game[i].gameimages.img4
            const gameImg4 = document.querySelectorAll(".game-img4");
            for (let i = 0; i < gameImg4.length; i++) {
                gameImg4[i].src = img4;
            }

            // system requirements
            document.querySelector(".minimum-cpu").innerHTML = game[i].specifications.minimum.cpu;
            document.querySelector(".minimum-gpu").innerHTML = game[i].specifications.minimum.gpu;
            document.querySelector(".minimum-memory").innerHTML = game[i].specifications.minimum.memory;
            document.querySelector(".minimum-disk").innerHTML = game[i].specifications.minimum.disk;
            document.querySelector(".recommended-cpu").innerHTML = game[i].specifications.recommended.cpu;
            document.querySelector(".recommended-gpu").innerHTML = game[i].specifications.recommended.gpu;
            document.querySelector(".recommended-memory").innerHTML = game[i].specifications.recommended.memory;
            document.querySelector(".recommended-disk").innerHTML = game[i].specifications.recommended.disk;

            // Detect system language to correctly select content.
            const langGamePrice = {
                "pt_br": game[i].gameprice.pt,
                "pt_pt": game[i].gameprice.pt,
                "en_us": game[i].gameprice.en,
                "en": game[i].gameprice.en
            };

            const langGameGenre = {
                "pt_br": game[i].gamegenre.pt,
                "pt_pt": game[i].gamegenre.pt,
                "en_us": game[i].gamegenre.en,
                "en": game[i].gamegenre.en
            };

            const langGameDesc = {
                "pt_br": game[i].gamedescription.pt,
                "pt_pt": game[i].gamedescription.pt,
                "en_us": game[i].gamedescription.en,
                "en": game[i].gamedescription.en
            };

            const langGameRelease = {
                "pt_br": game[i].releasedate.pt,
                "pt_pt": game[i].releasedate.pt,
                "en_us": game[i].releasedate.en,
                "en": game[i].releasedate.en
            };

            const langGameUpdate = {
                "pt_br": game[i].gameupdate.pt,
                "pt_pt": game[i].gameupdate.pt,
                "en_us": game[i].gameupdate.en,
                "en": game[i].gameupdate.en
            };

            function localeUserDetected() {
                // Show if the game is free
                document.querySelector(".game-price").innerHTML = langGamePrice[languageDetected];

                // Show game genre
                document.querySelector(".game-genre").innerHTML = langGameGenre[languageDetected];

                // Show game description
                document.querySelector(".discretion-text").innerHTML = langGameDesc[languageDetected];

                // Show game release date
                document.querySelector(".game-release").innerHTML = langGameRelease[languageDetected];

                // Show game update date
                if (game[i].gameupdate.status.indexOf("true") > -1) {
                    document.querySelector(".game-update").innerHTML = langGameUpdate[languageDetected];

                    const showGameUpdateStatus = document.querySelectorAll(".game-release-up");
                    for (let i = 0; i < showGameUpdateStatus.length; i++) {
                        showGameUpdateStatus[i].style.cssText = "display: block !important;"
                    }
                }
            }

            function localeUserNotDetected() {
                // Show if the game is free
                document.querySelector(".game-price").innerHTML = game[i].gameprice.en;

                // Show game genre
                document.querySelector(".game-genre").innerHTML = game[i].gamegenre.en;

                // Show game description
                document.querySelector(".discretion-text").innerHTML = game[i].gamedescription.en;

                // Show game release date
                document.querySelector(".game-release").innerHTML = game[i].releasedate.en;

                // Show game update date
                if (game[i].gameupdate.status.indexOf("true") > -1) {
                    document.querySelector(".game-update").innerHTML = game[i].gameupdate.en;

                    const showGameUpdateStatus = document.querySelectorAll(".game-release-up");
                    for (let i = 0; i < showGameUpdateStatus.length; i++) {
                        showGameUpdateStatus[i].style.cssText = "display: block !important;"
                    }
                }
            }

            if (fs.existsSync("/tmp/regataos-configs/config/plasma-localerc")) {
                const checkLangSystem = fs.readFileSync("/tmp/regataos-configs/config/plasma-localerc", "utf8");

                if (checkLangSystem.includes("LANGUAGE")) {
                    const configOption = "LANGUAGE="
                    window.languageDetected = checkConfigFile(checkLangSystem, configOption);

                    if (typeof langGamePrice[languageDetected] !== "undefined") {
                        localeUserDetected();
                    } else {
                        localeUserNotDetected();
                    }

                } else if (checkLangSystem.includes("LANG")) {
                    const configOption = "LANG="
                    window.languageDetected = checkConfigFile(checkLangSystem, configOption);

                    if (typeof langGamePrice[languageDetected] !== "undefined") {
                        localeUserDetected();
                    } else {
                        localeUserNotDetected();
                    }
                }

            } else if (fs.existsSync("/tmp/regataos-configs/config/user-dirs.locale")) {
                window.languageDetected = fs.readFileSync("/tmp/regataos-configs/config/user-dirs.locale", "utf8");

                if (typeof langGamePrice[languageDetected] !== "undefined") {
                    localeUserDetected();
                } else {
                    localeUserNotDetected();
                }
            }
        }
    }
}

getGameId();
