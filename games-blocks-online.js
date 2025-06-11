function showFreeGameHome() {
    // Content of block 1
    let gameTile = "DEATHLOOP";
    const gameImg = 'url("https://cdn1.epicgames.com/offer/d5241c76f178492ea1540fce45616757/Day8wide_2560x1440-bf6d342edbd2411ccf24e326852fca93?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "12 de junho";
    const endPromotionEnUS = "June 12";

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
