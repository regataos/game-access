function showFreeGameHome() {
    // Content of block 1
    let gameTile = "Styx: Shards of Darkness";
    const gameImg = 'url("https://cdn1.epicgames.com/spt-assets/6ccdf6a1518741f0842177137adc00b0/styx-shards-of-darkness-1bh52.jpg?resize=1&w=854&h=480&quality=medium")';
    const endPromotionPtBt = "22 de janeiro";
    const endPromotionEnUS = "january 22";

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
