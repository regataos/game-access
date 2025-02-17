function homeSlideContent() {
    // Image of the 1st item on the slide.
    document.querySelector("#slide-img1").style.backgroundImage = 'url("./../images/games-slide/slide1-apex-legends.webp")';
    document.querySelector(".slide-content .slide-title1").innerHTML = "Apex Legends";

    // Image of the 2st item on the slide.
    document.querySelector("#slide-img2").style.backgroundImage = 'url("./../images/games-slide/slide2-ts4.webp")';
    document.querySelector(".slide-content .slide-title2").innerHTML = "The Sims 4";

    // Image of the 3st item on the slide.
    document.querySelector("#slide-img3").style.backgroundImage = 'url("./../images/games-slide/slide3-ow2.webp")';
    document.querySelector(".slide-content .slide-title3").innerHTML = "Overwatch 2";

    // Image of the 4st item on the slide.
    document.querySelector("#slide-img4").style.backgroundImage = 'url("./../images/games-slide/slide4-rl.webp")';
    document.querySelector(".slide-content .slide-title4").innerHTML = "Rocket League";

    // Detect User Language
    const userLanguage = selectTranslation();
    if (userLanguage.includes("pt-br") || userLanguage.includes("pt-pt")) {
        // Title and description of the 1st item on the slide.
        document.querySelector(".slide-content .slide-desc1 p").innerHTML = "Herois lendários que lutam por glória e fortuna nos limites da Fronteira";
        document.querySelector(".slide-content .slide-button1").innerHTML = "Jogue agora com EA App";

        // Title and description of the 2st item on the slide.
        document.querySelector(".slide-content .slide-desc2 p").innerHTML = "Solte sua imaginação e dê aos seus Sims aparências e personalidades únicas";
        document.querySelector(".slide-content .slide-button2").innerHTML = "Jogue agora com EA App";

        // Title and description of the 3st item on the slide.
        document.querySelector(".slide-content .slide-desc3 p").innerHTML = "Lute ao lado de seus amigos em batalhas espalhadas ao redor do mundo";
        document.querySelector(".slide-content .slide-button3").innerHTML = "Jogue agora com Battle.net";

        // Title and description of the 4st item on the slide.
        document.querySelector(".slide-content .slide-desc4 p").innerHTML = "Participe de competições radicais de futebol com verdadeiras super máquinas";
        document.querySelector(".slide-content .slide-button4").innerHTML = "Jogue agora com Epic Games Store";

    } else if (userLanguage.includes("en-us")) {
        // Title and description of the 1st item on the slide.
        document.querySelector(".slide-content .slide-desc1 p").innerHTML = "Legendary heroes who fight for glory and fortune on the edge of the Frontier";
        document.querySelector(".slide-content .slide-button1").innerHTML = "Play now with EA App";

        // Title and description of the 2st item on the slide.
        document.querySelector(".slide-content .slide-desc2 p").innerHTML = "Unleash your imagination and give your Sims unique looks and personalities";
        document.querySelector(".slide-content .slide-button2").innerHTML = "Play now with EA App";

        // Title and description of the 3st item on the slide.
        document.querySelector(".slide-content .slide-desc3 p").innerHTML = "Fight alongside your friends in battles scattered around the world";
        document.querySelector(".slide-content .slide-button3").innerHTML = "Play now with Battle.net";

        // Title and description of the 4st item on the slide.
        document.querySelector(".slide-content .slide-desc4 p").innerHTML = "Participate in extreme football competitions with real super machines";
        document.querySelector(".slide-content .slide-button4").innerHTML = "Play now with Epic Games Store";

    } else {
        // Title and description of the 1st item on the slide.
        document.querySelector(".slide-content .slide-desc1 p").innerHTML = "Legendary heroes who fight for glory and fortune on the edge of the Frontier";
        document.querySelector(".slide-content .slide-button1").innerHTML = "Play now with EA App";

        // Title and description of the 2st item on the slide.
        document.querySelector(".slide-content .slide-desc2 p").innerHTML = "Unleash your imagination and give your Sims unique looks and personalities";
        document.querySelector(".slide-content .slide-button2").innerHTML = "Play now with EA App";

        // Title and description of the 3st item on the slide.
        document.querySelector(".slide-content .slide-desc3 p").innerHTML = "Fight alongside your friends in battles scattered around the world";
        document.querySelector(".slide-content .slide-button3").innerHTML = "Play now with Battle.net";

        // Title and description of the 4st item on the slide.
        document.querySelector(".slide-content .slide-desc4 p").innerHTML = "Participate in extreme football competitions with real super machines";
        document.querySelector(".slide-content .slide-button4").innerHTML = "Play now with Epic Games Store";
    }
}
homeSlideContent();
