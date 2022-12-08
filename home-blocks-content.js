function home_content() {
    $(document).ready(function() {
        // Content of block 1
        //Title
        $(".appbc1 .block-title").text("Saints Row IV: Re-Elected");
        //Block image
        $(".appbc1").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/block-img1.webp")');
        $(".appbc1").css("background-position", "50% 50%")
        //Date
        date_pt_br="15 de dezembro"
        date_en_us="December 15"

        // Content of block 2
        //Title
        $(".appbc2 .block-title").text("Xonotic");
        //Block image
        $(".appbc2").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/block-img2.jpg")');
        $(".appbc2").css("background-position", "50% 0%")

        // Content of block 3
        //Title
        $(".appbc3 .block-title").text("Warframe");
        //Block image
        $(".appbc3").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/block-img3.jpg")');
        $(".appbc3").css("background-position", "50% 0%")
    });

    // Detect User Language
    var command_line = "echo $LANG";
    const exec = require('child_process').exec;
    exec(command_line, (error, stdout, stderr) => {
    if (stdout) {
        var user_language = stdout
        if ((user_language.indexOf("pt_BR") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");

                // Content of block 2
                //Description
                $(".appbc2 .block-desc").text("Divertido jogo de tiro em primeira pessoa estilo arena.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Desperte como um guerreiro implacável.");
            });
        
        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");

                // Content of block 2
                //Description
                $(".appbc2 .block-desc").text("Divertido jogo de tiro em primeira pessoa estilo arena.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Desperte como um guerreiro implacável.");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");

                // Content of block 2
                //Description
                $(".appbc2 .block-desc").text("Fun and addictive arena-style first person shooter.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Awaken as a ruthless warrior.");
            });

        } else {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");

                // Content of block 2
                //Description
                $(".appbc2 .block-desc").text("Fun and addictive arena-style first person shooter.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Awaken as a ruthless warrior.");
            });
        }
    }
    });
}
home_content();
