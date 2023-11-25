function showFreeGameHome() {
    // Content of block 1
    const gameTile = "Deliver Us Mars";
    const gameImg = 'url("https://i.ibb.co/MBVMDp8/dm-block1.webp")';
    const endPromotionPtBt = "30 de novembro";
    const endPromotionEnUS = "November 30";

    document.querySelector(".home-game1 .block-title").innerHTML = gameTile;
    document.querySelector(".home-game1 .home-game-img").style.backgroundImage = gameImg;

    // Detect User Language
    const userLanguage = selectTranslation();

    // Game block description 1
    const gameBlockDesc1 = document.querySelector(".home-game1 .block-desc");

    if (userLanguage.includes("pt-br") || userLanguage.includes("pt-pt")) {
        // Game Description 1
        gameBlockDesc1.innerHTML = `Disponível de graça na Epic Games Store até ${endPromotionPtBt}.`;
    } else if (userLanguage.includes("en-us")) {
        // Game Description 1
        gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${endPromotionEnUS}.`;
    } else {
        // Game Description 1
        gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${endPromotionEnUS}.`;
    }
}
showFreeGameHome();

// Keep old code for compatibility.
function home_content() {
    $(document).ready(function () {
        // Content of block 1
        //Title
        $(".appbc1 .block-title").text("Deliver Us Mars");
        //Block image
        $(".appbc1").css("background-image", 'url("https://i.ibb.co/MBVMDp8/dm-block1.webp")');
        $(".appbc1").css("background-position", "0% 100%")
        //Date
        date_pt_br = "30 de novembro"
        date_en_us = "November 30"
    });

    // Detect User Language
    const user_language = selectTranslation();
    if ((user_language.indexOf("pt-br") > -1) == "1") {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");
            // $(".appbc1 .block-desc").text("Jogo misterioso grátis na Epic Games Store.");
        });

    } else if ((user_language.indexOf("pt-pt") > -1) == "1") {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");
            // $(".appbc1 .block-desc").text("Jogo misterioso grátis na Epic Games Store.");
        });

    } else if ((user_language.indexOf("en-us") > -1) == "1") {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");
            // $(".appbc1 .block-desc").text("Free Mysterious Game at Epic Games Store.");
        });

    } else {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");
            // $(".appbc1 .block-desc").text("Free Mysterious Game at Epic Games Store.");
        });
    }
}
home_content();
