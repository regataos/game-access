function showFreeGameHome() {
    // Content of block 1
    let gameTile = "HUMANKIND";
    const gameImg = 'url("https://cdn1.epicgames.com/offer/02c14a01b7044db98de3f3a10813a42e/HK_Landscape_2560x1440-0233eae757a0e921c879b7be3a697d97?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "13 de fevereiro";
    const endPromotionEnUS = "February 13";

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
