function showFreeGameHome() {
    // Content of block 1
    const gameTile = "Orcs Must Die! 3";
    const gameImg = 'url("https://i.ibb.co/tsf9R17/omd-block1.webp")';
    const endPromotionPtBt = "09 de maio";
    const endPromotionEnUS = "May 09";

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
