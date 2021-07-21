function home_content() {
    const exec = require('child_process').exec;

    // Detect User Language
    var command_line = "echo $LANG";
    exec(command_line, (error, stdout, stderr) => {
    if (stdout) {
        var user_language = stdout
        if ((user_language.indexOf("pt_BR") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://i.ibb.co/mJq6h1Q/block1.jpg")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Bridge Constructor: The Walking Dead");
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até 15 de julho.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://i.ibb.co/3NLzdSp/block2.jpg")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Ironcast");
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store até 15 de julho.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/tPVBQZK/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Path of Exile");
                $(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });
        
        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://i.ibb.co/mJq6h1Q/block1.jpg")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Bridge Constructor: The Walking Dead");
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até 15 de julho.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://i.ibb.co/3NLzdSp/block2.jpg")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Ironcast");
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store até 15 de julho.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/tPVBQZK/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Path of Exile");
                $(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://i.ibb.co/mJq6h1Q/block1.jpg")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Bridge Constructor: The Walking Dead");
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until July 15.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://i.ibb.co/3NLzdSp/block2.jpg")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Ironcast");
                $(".appbc2 .block-desc").text("Available for free at the Epic Games Store until July 15.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/tPVBQZK/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Path of Exile");
                $(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });

        } else {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://i.ibb.co/mJq6h1Q/block1.jpg")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Bridge Constructor: The Walking Dead");
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until July 15.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://i.ibb.co/3NLzdSp/block2.jpg")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Ironcast");
                $(".appbc2 .block-desc").text("Available for free at the Epic Games Store until July 15.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/tPVBQZK/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Path of Exile");
                $(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });
        }
    }
    });
}
home_content();
