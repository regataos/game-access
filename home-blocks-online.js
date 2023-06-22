function home_content() {
    // Content of block 1
    const appbc1 = document.querySelector(".appbc1");
    const blockTitle = appbc1.querySelector(".block-title");
    const blockDesc = appbc1.querySelector(".block-desc");
    
    blockTitle.textContent = "theHunter: Call of the Wild";
    appbc1.style.backgroundImage = 'url("https://i.ibb.co/tmStgh6/hcw-block1.webp")';
    appbc1.style.backgroundPosition = "0% 100%";

    const datePtBr = "29 de junho";
    const dateEnUs = "June 29";

    // Detect User Language
    const user_language = selectTranslation();

    if (user_language.includes("pt-br")) {
        blockDesc.textContent = `Disponível de graça na Epic Games Store até ${datePtBr}.`;
    } else if (user_language.includes("pt-pt")) {
        blockDesc.textContent = `Disponível de graça na Epic Games Store até ${datePtBr}.`;
    } else {
        blockDesc.textContent = `Available for free at the Epic Games Store until ${dateEnUs}.`;
    }
}

home_content();
