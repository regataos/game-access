function home_content() {
    $(document).ready(function () {
        // Content of block 1
        //Title
        $(".appbc1 .block-title").text("Train Valley 2");
        //Block image
        $(".appbc1").css("background-image", 'url("https://cdn1.epicgames.com/spt-assets/6d6a89f661f74d70bdc8be636c577056/train-valley-2-offer-bq0s1.jpg?h=480&quality=medium&resize=1&w=854")');
        $(".appbc1").css("background-position", "0% 100%")
        //Date
        date_pt_br = "20 de julho"
        date_en_us = "July 20"
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
