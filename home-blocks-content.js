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
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/3928fd8975b2437d894bbc5cd21de9a0/offer/Diesel_productv2_saints-row-the-third-remastered_home_Free_Games_Desktop_horizontal-1060x596-606f53e45df3fe0daefcf09f0a5e527c6bafb9cc-1060x596-facff57675176116ba956106519677ed.jpg?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Saints Row: The Third Remastered");
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até 2 de setembro.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_Automachef_HermesInteractive_S1_2560x1440-448983fc02b127093940156b7c1d489a?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Automachef");
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store até 2 de setembro.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/FD18q23/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Far Cry 3");
                $(".appbc3 .block-desc").text("Disponível de graça no Ubisoft Connect até 11 de setembro.");

                // Content of block 3
                //Block image
                //$(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                //$(".appbc3").css("background-position", "50% 0%")

                //Title and description
                //$(".appbc3 .block-title").text("Rocket League");
                //$(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });
        
        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/3928fd8975b2437d894bbc5cd21de9a0/offer/Diesel_productv2_saints-row-the-third-remastered_home_Free_Games_Desktop_horizontal-1060x596-606f53e45df3fe0daefcf09f0a5e527c6bafb9cc-1060x596-facff57675176116ba956106519677ed.jpg?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Saints Row: The Third Remastered");
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até 2 de setembro.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_Automachef_HermesInteractive_S1_2560x1440-448983fc02b127093940156b7c1d489a?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Automachef");
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store até 2 de setembro.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/FD18q23/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Far Cry 3");
                $(".appbc3 .block-desc").text("Disponível de graça no Ubisoft Connect até 11 de setembro.");

                // Content of block 3
                //Block image
                //$(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                //$(".appbc3").css("background-position", "50% 0%")

                //Title and description
                //$(".appbc3 .block-title").text("Rocket League");
                //$(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/3928fd8975b2437d894bbc5cd21de9a0/offer/Diesel_productv2_saints-row-the-third-remastered_home_Free_Games_Desktop_horizontal-1060x596-606f53e45df3fe0daefcf09f0a5e527c6bafb9cc-1060x596-facff57675176116ba956106519677ed.jpg?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Saints Row: The Third Remastered");
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until September 02.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_Automachef_HermesInteractive_S1_2560x1440-448983fc02b127093940156b7c1d489a?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Automachef");
                $(".appbc2 .block-desc").text("Available for free at the Epic Games Store until September 02.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/FD18q23/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Far Cry 3");
                $(".appbc3 .block-desc").text("Available for free on Ubisoft Connect until September 11th.");

                // Content of block 3
                //Block image
                //$(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                //$(".appbc3").css("background-position", "50% 0%")

                //Title and description
                //$(".appbc3 .block-title").text("Rocket League");
                //$(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });

        } else {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/3928fd8975b2437d894bbc5cd21de9a0/offer/Diesel_productv2_saints-row-the-third-remastered_home_Free_Games_Desktop_horizontal-1060x596-606f53e45df3fe0daefcf09f0a5e527c6bafb9cc-1060x596-facff57675176116ba956106519677ed.jpg?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Saints Row: The Third Remastered");
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until September 02.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_Automachef_HermesInteractive_S1_2560x1440-448983fc02b127093940156b7c1d489a?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Automachef");
                $(".appbc2 .block-desc").text("Available for free at the Epic Games Store until September 02.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/FD18q23/block3.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Far Cry 3");
                $(".appbc3 .block-desc").text("Available for free on Ubisoft Connect until September 11th.");

                // Content of block 3
                //Block image
                //$(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                //$(".appbc3").css("background-position", "50% 0%")

                //Title and description
                //$(".appbc3 .block-title").text("Rocket League");
                //$(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });
        }
    }
    });
}
home_content();
