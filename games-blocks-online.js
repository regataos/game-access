function showFreeGameHome() {
    const userLanguage = typeof selectTranslation === "function" ? selectTranslation() : "pt-br";
    const isPt = userLanguage.includes("pt-br") || userLanguage.includes("pt-pt");

    // Jogo 1 (Bloco 1)
    const game1 = {
        title: "Idle Champions of the Forgotten Realms",
        img: "https://cdn1.epicgames.com/spt-assets/a53f91e55c6840018cb5de0b204f1ad9/idle-champions-of-the-forgotten-realms-1gbsg.jpg",
        end: isPt ? "12 de novembro" : "november 12",
        desc: "Idle Champions \u00e9 um videogame de gest\u00e3o estrat\u00e9gica com licen\u00e7a de Dungeons & Dragons que une personagens ic\u00f4nicos de livros, c..."
    };

    // Jogo 2 (Bloco 2) - Se houver 2 jogos grátis na Epic
    const hasGame2 = true;
    const game2 = hasGame2 ? {
        title: "Flotsam",
        img: "https://cdn1.epicgames.com/spt-assets/5c36b876e80d4285b9993947efeeaf2b/flotsam-1yczl.jpg",
        end: isPt ? "12 de novembro" : "november 12",
        desc: "O jogo de sobreviv\u00eancia da cidade flutuante de lixo! Colete lixo precioso da superf\u00edcie do oceano e fa\u00e7a sua cidade crescer enq..."
    } : null;

    function applyBlocks() {
        // Bloco 1 (Jogo 1): Resumo primeiro, frase de gratuidade logo abaixo
        const blockTitle1 = document.querySelector(".home-game1 .block-title");
        const blockImg1 = document.querySelector(".home-game1 .home-game-img");
        const blockDesc1 = document.querySelector(".home-game1 .block-desc");

        if (blockTitle1) blockTitle1.innerHTML = game1.title;
        if (blockImg1) blockImg1.style.backgroundImage = 'url("' + game1.img + '")';
        if (blockDesc1) {
            let promoText1 = isPt
                ? `${game1.desc}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Disponível de graça na Epic Games Store até ${game1.end}.</span>`
                : `${game1.desc}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Available for free at the Epic Games Store until ${game1.end}.</span>`;
            blockDesc1.innerHTML = promoText1;
        }

        // Bloco 2: Segundo jogo grátis ou Fallback para Xonotic
        const block2 = document.querySelector(".home-game2");
        const blockTitle2 = document.querySelector(".home-game2 .block-title");
        const blockImg2 = document.querySelector(".home-game2 .home-game-img");
        const blockDesc2 = document.querySelector(".home-game2 .block-desc");

        if (hasGame2 && game2) {
            if (blockTitle2) blockTitle2.innerHTML = game2.title;
            if (blockImg2) blockImg2.style.backgroundImage = 'url("' + game2.img + '")';
            if (blockDesc2) {
                let promoText2 = isPt
                    ? `${game2.desc}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Disponível de graça na Epic Games Store até ${game2.end}.</span>`
                    : `${game2.desc}<br/><span style="opacity: 0.8; font-size: 15px; margin-top: 6px; display: inline-block;">Available for free at the Epic Games Store until ${game2.end}.</span>`;
                blockDesc2.innerHTML = promoText2;
            }
            if (block2) {
                block2.onclick = function() {
                    block_function1();
                };
            }
        } else {
            // Caso haja apenas 1 jogo gratuito na Epic, garante a restauração do Xonotic padrão
            if (blockTitle2) blockTitle2.innerHTML = "Xonotic";
            if (blockImg2) blockImg2.style.backgroundImage = 'url("./../images/games-blocks/block2-xonotic.jpg")';
            if (blockDesc2) {
                blockDesc2.innerHTML = isPt
                    ? "Divertido jogo de tiro em primeira pessoa estilo arena."
                    : "Fun and addictive arena-style first person shooter.";
            }
            if (block2) {
                block2.onclick = function() {
                    if (typeof block_function2 === "function") {
                        block_function2();
                    }
                };
            }
        }
    }

    // Executa e reaplica com delay para garantir prioridade sobre traduções estáticas de pages-lang.js
    applyBlocks();
    setTimeout(applyBlocks, 200);
    setTimeout(applyBlocks, 800);
}
showFreeGameHome();
