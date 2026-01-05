function showFreeGameHome() {
    // Content of block 1
    let gameTile = "Total War: THREE KINGDOMS";
    const gameImg = 'url("https://cdn1.epicgames.com/offer/d5241c76f178492ea1540fce45616757/Jan1-7_Game17_giveaway_2560x14401_2560x1440-dba68e265f1045f883693b0348cf6ea2?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "8 de janeiro";
    const endPromotionEnUS = "january 8";

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
