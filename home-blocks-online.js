function home_content() {
    $(document).ready(function () {
        // Content of block 1
        //Title
        $(".appbc1 .block-title").text("theHunter: Call of the Wild");
        //Block image
        $(".appbc1").css("background-image", 'url("https://i.ibb.co/tmStgh6/hcw-block1.webp")');
        $(".appbc1").css("background-position", "0% 100%")
        //Date
        const date_pt_br = "29 de junho"
        const date_en_us = "June 29"
    });

    // Detect User Language
    const user_language = selectTranslation();
    if ((user_language.indexOf("pt-br") > -1) == "1") {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");
            // $(".appbc1 .block-desc").text("Jogo misterioso grátis na Epic Games Store.");
        });

    } else if ((user_language.indexOf("pt-pt") > -1) == "1") {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Disponível de graça na Epic Games Store até " + date_pt_br + ".");
            // $(".appbc1 .block-desc").text("Jogo misterioso grátis na Epic Games Store.");
        });

    } else if ((user_language.indexOf("en-us") > -1) == "1") {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");
            // $(".appbc1 .block-desc").text("Free Mysterious Game at Epic Games Store.");
        });

    } else {
        $(document).ready(function () {
            // Content of block 1
            //Description
            $(".appbc1 .block-desc").text("Available for free at the Epic Games Store until " + date_en_us + ".");
            // $(".appbc1 .block-desc").text("Free Mysterious Game at Epic Games Store.");
        });
    }
}

home_content();
