function showFreeGameHome() {
    // Content of block 1
    const gameTile = "Chivalry 2";
    const gameImg = 'url("https://i.ibb.co/GCZrr6d/chivalry2.webp")';
    const endPromotionPtBt = "06 de junho";
    const endPromotionEnUS = "June 06";

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
