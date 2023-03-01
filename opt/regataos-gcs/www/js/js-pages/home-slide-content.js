function home_content() {
    $(document).ready(function () {
        // Content of slide 1
        //Block image
        $("#slide-img1").css("background-image", 'url("./../images/games-slide/slide1-lol.webp")');
        $(".slideshow .slide .slide-img1").css("background-position", '0% 100%');
        $(".slide-content .slide-title1").text("League of Legends");

        // Content of slide 2
        //Block image
        $("#slide-img2").css("background-image", 'url("./../images/games-slide/slide2-ts4.webp")');
        $(".slide-content .slide-title2").text("The Sims 4");

        // Content of slide 3
        //Block image
        $("#slide-img3").css("background-image", 'url("./../images/games-slide/slide3-ow2.webp")');
        $("#slide-img3").css("background-position", '50% 100%');
        $(".slide-content .slide-title3").text("Overwatch 2");

        // Content of slide 4
        //Block image
        $("#slide-img4").css("background-image", 'url("./../images/games-slide/slide4-rl.webp")');
        $("#slide-img4").css("background-position", '50% 0%');
        $(".slide-content .slide-title4").text("Rocket League");
    });

    // Detect User Language
    const userLanguage = selectTranslation();

    if ((userLanguage.indexOf("pt-br") > -1) == "1") {
        $(document).ready(function () {
            // Content of slide 1
            //Title and description
            $(".slide-content .slide-desc1 p").text("Chame os amigos, escolha um Campeão e faça jogadas memoráveis");
            $(".slide-content .slide-button1").text("Jogue agora");

            // Content of slide 2
            //Title and description
            $(".slide-content .slide-desc2 p").text("Solte sua imaginação e dê aos seus Sims aparências e personalidades únicas");
            $(".slide-content .slide-button2").text("Jogue agora com EA App");

            // Content of slide 3
            //Title and description
            $(".slide-content .slide-desc3 p").text("Lute ao lado de seus amigos em batalhas espalhadas ao redor do mundo");
            $(".slide-content .slide-button3").text("Jogue agora com Battle.net");

            // Content of slide 4
            //Title and description
            $(".slide-content .slide-desc4 p").text("Participe de competições radicais de futebol com verdadeiras super máquinas");
            $(".slide-content .slide-button4").text("Jogue agora com a Epic Games Store");
        });

    } else if ((userLanguage.indexOf("pt-pt") > -1) == "1") {
        $(document).ready(function () {
            // Content of slide 1
            //Block image
            $(".slideshow .slide .slide-img1").css("background-image", 'url("https://i.ibb.co/QK6SXCt/img1.jpg")');

            //Title and description
            $(".slide-content .slide-desc1 p").text("Chame os amigos, escolha um Campeão e faça jogadas memoráveis");
            $(".slide-content .slide-button1").text("Jogue agora");

            // Content of slide 2
            //Title and description
            $(".slide-content .slide-desc2 p").text("Solte sua imaginação e dê aos seus Sims aparências e personalidades únicas");
            $(".slide-content .slide-button2").text("Jogue agora com Origin");

            // Content of slide 3
            //Title and description
            $(".slide-content .slide-desc3 p").text("Lute ao lado de seus amigos em batalhas espalhadas ao redor do mundo");
            $(".slide-content .slide-button3").text("Jogue agora com Battle.net");

            // Content of slide 4
            //Title and description
            $(".slide-content .slide-desc4 p").text("Participe de competições radicais de futebol com verdadeiras super máquinas");
            $(".slide-content .slide-button4").text("Jogue agora com a Epic Games Store");
        });

    } else if ((userLanguage.indexOf("en-us") > -1) == "1") {
        $(document).ready(function () {
            // Content of slide 1
            //Title and description
            $(".slide-content .slide-desc1 p").text("Call your friends, choose a champion and make memorable plays");
            $(".slide-content .slide-button1").text("Play now");

            // Content of slide 2
            //Title and description
            $(".slide-content .slide-desc2 p").text("Unleash your imagination and give your Sims unique looks and personalities");
            $(".slide-content .slide-button2").text("Play now with Origin");

            // Content of slide 3
            //Title and description
            $(".slide-content .slide-desc3 p").text("Fight alongside your friends in battles scattered around the world");
            $(".slide-content .slide-button3").text("Play now with Battle.net");

            // Content of slide 4
            //Title and description
            $(".slide-content .slide-desc4 p").text("Participate in extreme football competitions with real super machines");
            $(".slide-content .slide-button4").text("Play now with the Epic Games Store");
        });

    } else {
        $(document).ready(function () {
            // Content of slide 1
            //Title and description
            $(".slide-content .slide-desc1 p").text("Call your friends, choose a champion and make memorable plays");
            $(".slide-content .slide-button1").text("Play now");

            // Content of slide 2
            //Title and description
            $(".slide-content .slide-desc2 p").text("Unleash your imagination and give your Sims unique looks and personalities");
            $(".slide-content .slide-button2").text("Play now");

            // Content of slide 3
            //Title and description
            $(".slide-content .slide-desc3 p").text("Fight alongside your friends in battles scattered around the world");
            $(".slide-content .slide-button3").text("Play now with Battle.net");

            // Content of slide 4
            //Title and description
            $(".slide-content .slide-desc4 p").text("Participate in extreme football competitions with real super machines");
            $(".slide-content .slide-button4").text("Play now with the Epic Games Store");
        });
    }
}

home_content();
