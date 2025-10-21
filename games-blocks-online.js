function showFreeGameHome() {
    // Content of block 1
    let gameTile = "Amnesia: The Bunker";
    const gameImg = 'url("https://cdn1.epicgames.com/spt-assets/671aee4c8fb64a1c967d97f31f093e7a/amnesia-the-bunker-1x2n7.png?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "23 de outubro";
    const endPromotionEnUS = "october 23";

    // Detect User Language
    const userLanguage = selectTranslation();

    // Game block description 1
    const gameBlockDesc1 = document.querySelector(".home-game1 .block-desc");

    if (userLanguage.includes("pt-br") || userLanguage.includes("pt-pt")) {
        gameBlockDesc1.innerHTML = `Disponível de graça na Epic Games Store até ${endPromotionPtBt}.`;
    } else if (userLanguage.includes("en-us")) {
        gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${endPromotionEnUS}.`;
    } else {
        gameBlockDesc1.innerHTML = `Available for free at the Epic Games Store until ${endPromotionEnUS}.`;
    }

    document.querySelector(".home-game1 .block-title").innerHTML = gameTile;
    document.querySelector(".home-game1 .home-game-img").style.backgroundImage = gameImg;
}
showFreeGameHome();
