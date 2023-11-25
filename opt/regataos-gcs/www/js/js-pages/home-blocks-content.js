// Home page images and game names
function contentSuggestedHomeGames() {
    // Content of block 2
    document.querySelector(".home-game2 .block-title").innerHTML = "Xonotic";
    document.querySelector(".home-game2 .home-game-img").style.backgroundImage = 'url("./../images/games-blocks/block2-xonotic.jpg")';

    // Content of block 3
    document.querySelector(".home-game3 .block-title").innerHTML = "Warframe";
    document.querySelector(".home-game3 .home-game-img").style.backgroundImage = 'url("./../images/games-blocks/block3-warframe.jpg")';
}
contentSuggestedHomeGames();
