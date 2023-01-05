function home_content() {
    $(document).ready(function() {
        // Content of block 1
        //Title
        $(".appbc1 .block-title").text("Kerbal Space Program");
        //Block image
        $(".appbc1").css("background-image", 'url("https://i.ibb.co/rMZzSHG/ksp-block1.webp")');
        $(".appbc1").css("background-position", "0% 100%")
        //Date
        date_pt_br="12 de janeiro"
        date_en_us="January 12"
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
                // $(".appbc1 .block-desc").text("Jogo misterioso grátis na Epic Games Store.");
            });
        
        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");
                // $(".appbc1 .block-desc").text("Jogo misterioso grátis na Epic Games Store.");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");
                // $(".appbc1 .block-desc").text("Free Mysterious Game at Epic Games Store.");
            });

        } else {
            $(document).ready(function() {
                // Content of block 1
                //Description
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");
                // $(".appbc1 .block-desc").text("Free Mysterious Game at Epic Games Store.");
            });
        }
    }
    });
}

home_content();
