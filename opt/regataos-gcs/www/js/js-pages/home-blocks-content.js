function home_content() {
    $(document).ready(function () {
        // Content of block 2
        //Title
        $(".gamebc2 .block-title").text("Xonotic");
        //Block image
        $(".gamebc2").css("background-image", 'url("./../images/games-blocks/block2-xonotic.jpg")');
        $(".gamebc2").css("background-position", "50% 0%")

        // Content of block 3
        //Title
        $(".gamebc3 .block-title").text("Warframe");
        //Block image
        $(".gamebc3").css("background-image", 'url("./../images/games-blocks/block3-warframe.jpg")');
        $(".gamebc3").css("background-position", "50% 0%")
    });

    // Detect User Language
    var command_line = "echo $LANG";
    const exec = require('child_process').exec;
    exec(command_line, (error, stdout, stderr) => {
        if (stdout) {
            var user_language = stdout
            if ((user_language.indexOf("pt_BR") > -1) == "1") {
                $(document).ready(function () {
                    // Content of block 2
                    //Description
                    $(".gamebc2 .block-desc").text("Divertido jogo de tiro em primeira pessoa estilo arena.");

                    // Content of block 3
                    //Description
                    $(".gamebc3 .block-desc").text("Desperte como um guerreiro implacável.");
                });

            } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
                $(document).ready(function () {
                    // Content of block 2
                    //Description
                    $(".gamebc2 .block-desc").text("Divertido jogo de tiro em primeira pessoa estilo arena.");

                    // Content of block 3
                    //Description
                    $(".gamebc3 .block-desc").text("Desperte como um guerreiro implacável.");
                });

            } else if ((user_language.indexOf("en_US") > -1) == "1") {
                $(document).ready(function () {
                    // Content of block 2
                    //Description
                    $(".gamebc2 .block-desc").text("Fun and addictive arena-style first person shooter.");

                    // Content of block 3
                    //Description
                    $(".gamebc3 .block-desc").text("Awaken as a ruthless warrior.");
                });

            } else {
                $(document).ready(function () {
                    // Content of block 2
                    //Description
                    $(".gamebc2 .block-desc").text("Fun and addictive arena-style first person shooter.");

                    // Content of block 3
                    //Description
                    $(".gamebc3 .block-desc").text("Awaken as a ruthless warrior.");
                });
            }
        }
    });
}

home_content();
