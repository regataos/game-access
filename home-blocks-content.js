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
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_VoidBastards_BlueManchu_S1_2560x1440-6ffb5f547e5434d115cc6de7d13b1bc6?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Void Bastards");
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até 26 de agosto.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_YookaLaylee_Playtonic_S3_2560x1440-779ed9403879e74fe1992fefeec9b0d5?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Yooka-Laylee");
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store até 26 de agosto.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Rocket League");
                $(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });
        
        } else if ((user_language.indexOf("pt_PT") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_VoidBastards_BlueManchu_S1_2560x1440-6ffb5f547e5434d115cc6de7d13b1bc6?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Void Bastards");
                $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até 26 de agosto.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_YookaLaylee_Playtonic_S3_2560x1440-779ed9403879e74fe1992fefeec9b0d5?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Yooka-Laylee");
                $(".appbc2 .block-desc").text("Disponível de graça na Epic Games Store até 26 de agosto.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Rocket League");
                $(".appbc3 .block-desc").text("Disponível de graça na Epic Games Store.");
            });

        } else if ((user_language.indexOf("en_US") > -1) == "1") {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_VoidBastards_BlueManchu_S1_2560x1440-6ffb5f547e5434d115cc6de7d13b1bc6?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Void Bastards");
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until August 26.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_YookaLaylee_Playtonic_S3_2560x1440-779ed9403879e74fe1992fefeec9b0d5?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Yooka-Laylee");
                $(".appbc2 .block-desc").text("Available for free at the Epic Games Store until August 26.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Rocket League");
                $(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });

        } else {
            $(document).ready(function() {
                // Content of block 1
                //Block image
                $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_VoidBastards_BlueManchu_S1_2560x1440-6ffb5f547e5434d115cc6de7d13b1bc6?h=480&resize=1&w=854")');
                $(".appbc1").css("background-position", "50% 50%")

                //Title and description
                $(".appbc1 .block-title").text("Void Bastards");
                $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until August 26.");

                // Content of block 2
                //Block image
                $(".appbc2").css("background-image", 'url("https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_YookaLaylee_Playtonic_S3_2560x1440-779ed9403879e74fe1992fefeec9b0d5?h=480&resize=1&w=854")');
                $(".appbc2").css("background-position", "50% 0%")

                //Title and description
                $(".appbc2 .block-title").text("Yooka-Laylee");
                $(".appbc2 .block-desc").text("Available for free at the Epic Games Store until August 26.");

                // Content of block 3
                //Block image
                $(".appbc3").css("background-image", 'url("https://i.ibb.co/bPzDBvg/block2.jpg")');
                $(".appbc3").css("background-position", "50% 0%")

                //Title and description
                $(".appbc3 .block-title").text("Rocket League");
                $(".appbc3 .block-desc").text("Available for free on the Epic Games Store.");
            });
        }
    }
    });
}
home_content();
