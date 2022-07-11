function home_content() {
    $(document).ready(function() {
        // Content of slide 1
        //Block image
        $(".slideshow .slide .slide-img1").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/slide-img1.jpg")');
        $(".slideshow .slide .slide-img1").css("background-position", '0% 100%');
        $(".slide-content .slide-title1").text("League of Legends");

        // Content of slide 2
        //Block image
        $(".slideshow .slide .slide-img2").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/slide-img2.jpg")');
        $(".slide-content .slide-title2").text("Overwatch");

        // Content of slide 3
        //Block image
        $(".slideshow .slide .slide-img3").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/slide-img3.jpg")');
        $(".slide-content .slide-title3").text("Battlefield V");

        // Content of slide 4
        //Block image
        $(".slideshow .slide .slide-img4").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/slide-img4.jpg")');
        $(".slide-content .slide-title4").text("Control");
    });

    // Detect User Language
    var command_line = "echo $LANG";
    const exec = require('child_process').exec;
    exec(command_line, (error, stdout, stderr) => {
    if (stdout) {
        var user_language = stdout
        if ((user_language.indexOf("pt_BR") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Title and description
                $(".slide-content .slide-desc1 p").text("Chame os amigos, escolha um Campeão e faça jogadas memoráveis");
                $(".slide-content .slide-button1").text("Jogue agora");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("Enfrente inimigos usando um repertório alucinante de poderes e armas");
                $(".slide-content .slide-button2").text("Jogue agora com Battle.net");

                // Content of slide 3
                //Title and description
                $(".slide-content .slide-desc3 p").text("Prove seu valor enfrentando batalhas da Segunda Guerra Mundial");
                $(".slide-content .slide-button3").text("Jogue agora com Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("O mundo agora é sua arma em uma luta épica contra um inimigo assustador");
                $(".slide-content .slide-button4").text("Jogue agora com a Epic Games Store");
            });

        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Block image
                $(".slideshow .slide .slide-img1").css("background-image", 'url("https://i.ibb.co/QK6SXCt/img1.jpg")');

                //Title and description
                $(".slide-content .slide-desc1 p").text("Chame os amigos, escolha um Campeão e faça jogadas memoráveis");
                $(".slide-content .slide-button1").text("Jogue agora");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("Enfrente inimigos usando um repertório alucinante de poderes e armas");
                $(".slide-content .slide-button2").text("Jogue agora com Battle.net");

                // Content of slide 3
                //Title and description
                $(".slide-content .slide-desc3 p").text("Prove seu valor enfrentando batalhas da Segunda Guerra Mundial");
                $(".slide-content .slide-button3").text("Jogue agora com Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("O mundo agora é sua arma em uma luta épica contra um inimigo assustador");
                $(".slide-content .slide-button4").text("Jogue agora com a Epic Games Store");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Title and description
                $(".slide-content .slide-desc1 p").text("Call your friends, choose a champion and make memorable plays");
                $(".slide-content .slide-button1").text("Play now");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("Take on enemies using a mind-boggling repertoire of powers and weapons");
                $(".slide-content .slide-button2").text("Play now with Battle.net");

                // Content of slide 3
               //Title and description
                $(".slide-content .slide-desc3 p").text("Prove your worth by fighting WWII battles");
                $(".slide-content .slide-button3").text("Play now with Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("The world is now your weapon in an epic fight against a terrifying enemy");
                $(".slide-content .slide-button4").text("Play now with the Epic Games Store");
            });

        } else {
            $(document).ready(function() {
                // Content of slide 1
                //Title and description
                $(".slide-content .slide-desc1 p").text("Call your friends, choose a champion and make memorable plays");
                $(".slide-content .slide-button1").text("Play now");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("Take on enemies using a mind-boggling repertoire of powers and weapons");
                $(".slide-content .slide-button2").text("Play now with Battle.net");

                // Content of slide 3
               //Title and description
                $(".slide-content .slide-desc3 p").text("Prove your worth by fighting WWII battles");
                $(".slide-content .slide-button3").text("Play now with Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("The world is now your weapon in an epic fight against a terrifying enemy");
                $(".slide-content .slide-button4").text("Play now with the Epic Games Store");
            });
        }
    }
    });
}
home_content();
