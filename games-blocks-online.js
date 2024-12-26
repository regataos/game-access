function showFreeGameHome() {
    // Content of block 1
    let gameTile = "";
    const gameImg = 'url("https://cdn1.epicgames.com/offer/d5241c76f178492ea1540fce45616757/EGS_HolidaySale_2024_WrappingPaper_1920x1080_1920x1080-a0f773a33796e48cc1d33e5072271fc8?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "19 de dezembro";
    const endPromotionEnUS = "December 19";

    // Detect User Language
    const userLanguage = selectTranslation();

    // Game block description 1
    const gameBlockDesc1 = document.querySelector(".home-game1 .block-desc");

    if (userLanguage.includes("pt-br") || userLanguage.includes("pt-pt")) {
        // Game Description 1
        // gameBlockDesc1.innerHTML = `Disponível de graça na Epic Games Store até ${endPromotionPtBt}.`;
        gameTile = "Jogo misterioso na Epic Games Store";
        gameBlockDesc1.innerHTML = `Resgate um jogo misterioso gratuitamente na Epic Games Store.`;
    } else if (userLanguage.includes("en-us")) {
        // Game Description 1
        // gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${endPromotionEnUS}.`;
        gameTile = "Mysterious game on Epic Games Store";
        gameBlockDesc1.innerHTML = `Claim a mystery game for free on the Epic Games Store.`;
    } else {
        // Game Description 1
        // gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${endPromotionEnUS}.`;
        gameTile = "Mysterious game on Epic Games Store";
        gameBlockDesc1.innerHTML = `Claim a mystery game for free on the Epic Games Store.`;
    }

    document.querySelector(".home-game1 .block-title").innerHTML = gameTile;
    document.querySelector(".home-game1 .home-game-img").style.backgroundImage = gameImg;
}
showFreeGameHome();
