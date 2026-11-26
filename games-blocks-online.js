function showFreeGameHome() {
    const userLanguage = typeof selectTranslation === "function" ? selectTranslation() : "pt-br";
    const isPt = userLanguage.includes("pt-br") || userLanguage.includes("pt-pt");

    // Jogo 1 (Bloco 1)
    const game1 = {
        title: "Firestone \u2013 Idle Clicker Online RPG",
        img: "https://raw.githubusercontent.com/regataos/game-access/refs/heads/gh-pages/images/free-game-1.png",
        end: isPt ? "03 de dezembro" : "december 03",
        desc: "*Firestone: Online Idle RPG* \u00e9 um jogo de fantasia multiplayer. Colete her\u00f3is, atualize seus equipamentos e habilidades e envie..."
    };

    // Jogo 2 (Bloco 2) - Se houver 2 jogos grátis na Epic
    const hasGame2 = true;
    const game2 = hasGame2 ? {
        title: "Bread and Fred",
        img: "https://raw.githubusercontent.com/regataos/game-access/refs/heads/gh-pages/images/free-game-2.png",
        end: isPt ? "03 de dezembro" : "december 03",
        desc: "Grab your best bud for help in this new co-op challenge to help two adorable penguins, Bread and Fred, reach the top of the sno..."
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
