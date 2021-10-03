function home_content() {
    $(document).ready(function() {
        // Content of slide 1
        //Block image
        $(".slideshow .slide .slide-img1").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/slide-img1.jpg")');
        $(".slide-content .slide-title1").text("Grand Theft Auto V");

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
        $(".slide-content .slide-title4").text("Anthem");
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
                $(".slide-content .slide-desc1 p").text("Explore o gigantesco e premiado mundo de Los Santos e Blaine County");
                $(".slide-content .slide-button1").text("Jogue agora com Rockstar Launcher");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("O mundo precisa de heróis");
                $(".slide-content .slide-button2").text("Jogue agora com Battle.net");

                // Content of slide 3
                //Title and description
                $(".slide-content .slide-desc3 p").text("Prove seu valor enfrentando batalhas da Segunda Guerra Mundial");
                $(".slide-content .slide-button3").text("Jogue agora com Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("Um RPG de ação cooperativo que se passa em um mundo novo e misterioso");
                $(".slide-content .slide-button4").text("Jogue agora com Origin");
            });

        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Block image
                $(".slideshow .slide .slide-img1").css("background-image", 'url("https://i.ibb.co/QK6SXCt/img1.jpg")');

                //Title and description
                $(".slide-content .slide-desc1 p").text("Explore o gigantesco e premiado mundo de Los Santos e Blaine County");
                $(".slide-content .slide-button1").text("Jogue agora com Rockstar Launcher");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("O mundo precisa de heróis");
                $(".slide-content .slide-button2").text("Jogue agora com Battle.net");

                // Content of slide 3
                //Title and description
                $(".slide-content .slide-desc3 p").text("Prove seu valor enfrentando batalhas da Segunda Guerra Mundial");
                $(".slide-content .slide-button3").text("Jogue agora com Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("Um RPG de ação cooperativo que se passa em um mundo novo e misterioso");
                $(".slide-content .slide-button4").text("Jogue agora com Origin");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Title and description
                $(".slide-content .slide-desc1 p").text("Explore the award-winning world of Los Santos and Blaine County");
                $(".slide-content .slide-button1").text("Play now with Rockstar Launcher");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("The world needs heroes");
                $(".slide-content .slide-button2").text("Play now with Battle.net");

                // Content of slide 3
               //Title and description
                $(".slide-content .slide-desc3 p").text("Prove your worth by fighting WWII battles");
                $(".slide-content .slide-button3").text("Play now with Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("A cooperative action RPG set in a new and mysterious world");
                $(".slide-content .slide-button4").text("Play now with Origin");
            });

        } else {
            $(document).ready(function() {
                // Content of slide 1
                //Title and description
                $(".slide-content .slide-desc1 p").text("Explore the award-winning world of Los Santos and Blaine County");
                $(".slide-content .slide-button1").text("Play now with Rockstar Launcher");

                // Content of slide 2
                //Title and description
                $(".slide-content .slide-desc2 p").text("The world needs heroes");
                $(".slide-content .slide-button2").text("Play now with Battle.net");

                // Content of slide 3
               //Title and description
                $(".slide-content .slide-desc3 p").text("Prove your worth by fighting WWII battles");
                $(".slide-content .slide-button3").text("Play now with Origin");

                // Content of slide 4
                //Title and description
                $(".slide-content .slide-desc4 p").text("A cooperative action RPG set in a new and mysterious world");
                $(".slide-content .slide-button4").text("Play now with Origin");
            });
        }
    }
    });
}
home_content();
