function home_content() {
    const exec = require('child_process').exec;

    // Detect User Language
    var command_line = "echo $LANG";
    exec(command_line, (error, stdout, stderr) => {
    if (stdout) {
        var user_language = stdout
        if ((user_language.indexOf("pt_BR") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Block image
                $(".slideshow .slide .slide-img1").css("background-image", 'url("https://i.ibb.co/QK6SXCt/img1.jpg")');

                //Title and description
                $(".slide-content .slide-title1").text("Grand Theft Auto V");
                $(".slide-content .slide-desc1 p").text("Explore o gigantesco e premiado mundo de Los Santos e Blaine County");
                $(".slide-content .slide-button1").text("Jogue agora");

                // Content of slide 2
                //Block image
                $(".slideshow .slide .slide-img2").css("background-image", 'url("https://i.ibb.co/c1s1CBC/img2.jpg")');

                //Title and description
                $(".slide-content .slide-title2").text("Overwatch");
                $(".slide-content .slide-desc2 p").text("O mundo precisa de heróis");
                $(".slide-content .slide-button2").text("Jogue agora");

                // Content of slide 3
                //Block image
                $(".slideshow .slide .slide-img3").css("background-image", 'url("https://i.ibb.co/XzQj6xH/img3.jpg")');

                //Title and description
                $(".slide-content .slide-title3").text("Battlefield V");
                $(".slide-content .slide-desc3 p").text("Prove seu valor enfrentando batalhas da Segunda Guerra Mundial");
                $(".slide-content .slide-button3").text("Jogue agora");

                // Content of slide 4
                //Block image
                $(".slideshow .slide .slide-img4").css("background-image", 'url("https://i.ibb.co/smDBWZ0/img4.jpg")');

                //Title and description
                $(".slide-content .slide-title4").text("Anthem");
                $(".slide-content .slide-desc4 p").text("Um RPG de ação cooperativo que se passa em um mundo novo e misterioso");
                $(".slide-content .slide-button4").text("Jogue agora");
            });

        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Block image
                $(".slideshow .slide .slide-img1").css("background-image", 'url("https://i.ibb.co/QK6SXCt/img1.jpg")');

                //Title and description
                $(".slide-content .slide-title1").text("Grand Theft Auto V");
                $(".slide-content .slide-desc1 p").text("Explore o gigantesco e premiado mundo de Los Santos e Blaine County");
                $(".slide-content .slide-button1").text("Jogue agora");

                // Content of slide 2
                //Block image
                $(".slideshow .slide .slide-img2").css("background-image", 'url("https://i.ibb.co/c1s1CBC/img2.jpg")');

                //Title and description
                $(".slide-content .slide-title2").text("Overwatch");
                $(".slide-content .slide-desc2 p").text("O mundo precisa de heróis");
                $(".slide-content .slide-button2").text("Jogue agora");

                // Content of slide 3
                //Block image
                $(".slideshow .slide .slide-img3").css("background-image", 'url("https://i.ibb.co/XzQj6xH/img3.jpg")');

                //Title and description
                $(".slide-content .slide-title3").text("Battlefield V");
                $(".slide-content .slide-desc3 p").text("Prove seu valor enfrentando batalhas da Segunda Guerra Mundial");
                $(".slide-content .slide-button3").text("Jogue agora");

                // Content of slide 4
                //Block image
                $(".slideshow .slide .slide-img4").css("background-image", 'url("https://i.ibb.co/smDBWZ0/img4.jpg")');

                //Title and description
                $(".slide-content .slide-title4").text("Anthem");
                $(".slide-content .slide-desc4 p").text("Um RPG de ação cooperativo que se passa em um mundo novo e misterioso");
                $(".slide-content .slide-button4").text("Jogue agora");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of slide 1
                //Block image
                $(".slideshow .slide .slide-img1").css("background-image", 'url("https://i.ibb.co/QK6SXCt/img1.jpg")');

                //Title and description
                $(".slide-content .slide-title1").text("Grand Theft Auto V");
                $(".slide-content .slide-desc1 p").text("Explore the award-winning world of Los Santos and Blaine County");
                $(".slide-content .slide-button1").text("Play now");

                // Content of slide 2
                //Block image
                $(".slideshow .slide .slide-img2").css("background-image", 'url("https://i.ibb.co/c1s1CBC/img2.jpg")');

                //Title and description
                $(".slide-content .slide-title2").text("Overwatch");
                $(".slide-content .slide-desc2 p").text("The world needs heroes");
                $(".slide-content .slide-button2").text("Play now");

                // Content of slide 3
                //Block image
                $(".slideshow .slide .slide-img3").css("background-image", 'url("https://i.ibb.co/XzQj6xH/img3.jpg")');

                //Title and description
                $(".slide-content .slide-title3").text("Battlefield V");
                $(".slide-content .slide-desc3 p").text("Prove your worth by fighting WWII battles");
                $(".slide-content .slide-button3").text("Play now");

                // Content of slide 4
                //Block image
                $(".slideshow .slide .slide-img4").css("background-image", 'url("https://i.ibb.co/smDBWZ0/img4.jpg")');

                //Title and description
                $(".slide-content .slide-title4").text("Anthem");
                $(".slide-content .slide-desc4 p").text("A cooperative action RPG set in a new and mysterious world");
                $(".slide-content .slide-button4").text("Play now");
            });

        } else {
            $(document).ready(function() {
                // Content of slide 1
                //Block image
                $(".slideshow .slide .slide-img1").css("background-image", 'url("https://i.ibb.co/QK6SXCt/img1.jpg")');

                //Title and description
                $(".slide-content .slide-title1").text("Grand Theft Auto V");
                $(".slide-content .slide-desc1 p").text("Explore the award-winning world of Los Santos and Blaine County");
                $(".slide-content .slide-button1").text("Play now");

                // Content of slide 2
                //Block image
                $(".slideshow .slide .slide-img2").css("background-image", 'url("https://i.ibb.co/c1s1CBC/img2.jpg")');

                //Title and description
                $(".slide-content .slide-title2").text("Overwatch");
                $(".slide-content .slide-desc2 p").text("The world needs heroes");
                $(".slide-content .slide-button2").text("Play now");

                // Content of slide 3
                //Block image
                $(".slideshow .slide .slide-img3").css("background-image", 'url("https://i.ibb.co/XzQj6xH/img3.jpg")');

                //Title and description
                $(".slide-content .slide-title3").text("Battlefield V");
                $(".slide-content .slide-desc3 p").text("Prove your worth by fighting WWII battles");
                $(".slide-content .slide-button3").text("Play now");

                // Content of slide 4
                //Block image
                $(".slideshow .slide .slide-img4").css("background-image", 'url("https://i.ibb.co/smDBWZ0/img4.jpg")');

                //Title and description
                $(".slide-content .slide-title4").text("Anthem");
                $(".slide-content .slide-desc4 p").text("A cooperative action RPG set in a new and mysterious world");
                $(".slide-content .slide-button4").text("Play now");
            });
        }
    }
    });
}
home_content();
