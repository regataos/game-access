function home_content() {
    $(document).ready(function() {
        // Content of block 1
        //Title
        $(".appbc1 .block-title").text("Car Mechanic Simulator 2018");
        //Block image
        $(".appbc1").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/block-img1.jpg")');
        $(".appbc1").css("background-position", "50% 50%")
        //Date
        date_pt_br="30 de junho"
        date_en_us="June 30"

        // Content of block 2
        //Title
        $(".appbc2 .block-title").text("Path of Exile");
        //Block image
        $(".appbc2").css("background-image", 'url("file:///tmp/regataos-gcs/config/cache/img/block-img2.jpg")');
        $(".appbc2").css("background-position", "50% 0%")

        // Content of block 3
        //Title
        $(".appbc3 .block-title").text("Rocket League");
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
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });
        
        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");

                // Content of block 2
                //Description
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");

                // Content of block 2
                //Description
                $(".appbc2 .block-desc").text("Available for free on the Epic Games Store.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });

        } else {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");

                // Content of block 2
                //Description
                $(".appbc2 .block-desc").text("Available for free on the Epic Games Store.");

                // Content of block 3
                //Description
                $(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });
        }
    }
    });
}
home_content();
