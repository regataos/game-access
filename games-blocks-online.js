function showFreeGameHome() {
    // Content of block 1
    let gameTile = "Zoeti";
    const gameImg = 'url("https://cdn1.epicgames.com/spt-assets/78af28ae56cb41e69cbca318bbc180e3/zoeti-1vjnz.jpg?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "27 de novembro";
    const endPromotionEnUS = "november 27";

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
