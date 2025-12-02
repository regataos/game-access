function showFreeGameHome() {
    // Content of block 1
    let gameTile = "Universe for Sale";
    const gameImg = 'url("https://cdn1.epicgames.com/spt-assets/5159c30d2bba476484db4f9c97beb47e/universe-for-sale-xr25c.jpg?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "04 de dezembro";
    const endPromotionEnUS = "december 04";

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
