// Portuguese language translation for all pages
$(document).ready(function () {
	// For all pages
	//Display FPS HUD
	$(".fpshud p").text("Exibir contador de FPS");
	//Play button
	$(".text-play").text("Jogar");
	//Uninstall button
	$(".text-remove").text("Remover");
	//Install button
	$(".text-install").text("Instalar");

	// Home page
	//First home page title
	$(".first-home-title").text("Para você");
	//Check internet connection
	$(".networkoff-title").text("Não foi possível conectar-se à Internet");
	$(".networkoff-desc").html("Verifique os cabos de rede, modem e roteador ou<br/> conecte à rede Wi-Fi novamente.");
	//Game blocks
	$(".home-game2 .block-desc").html("Divertido jogo de tiro em primeira pessoa estilo arena.");
	$(".home-game3 .block-desc").html("Desperte como um guerreiro implacável.");

	// All Games page
	//Page title
	$(".installed-title").text("Lista com todos os jogos detectados pelo Regata OS Game Access");
	$(".nogamefound-title").text("Nenhum jogo encontrado");
	$(".nogamefound-desc").text("Infelizmente, ainda não achei nenhum jogo instalado.");
	$(".allgames-title").text("Lista com alguns dos jogos que você pode rodar com o Regata OS Game Access");
	$(".loading-games").text("Carregando a sua biblioteca de jogos...");
	$(".remove-game-button").attr({ title: "Desinstalar jogo" });
	$(".morefor-game-button").attr({ title: "Mais sobre o jogo" });

	// Steam games
	//Page title
	$(".installed-title-steam").text("Jogos instalados pelo Steam");
	//View more
	$(".steam-more").text("Ver mais no Steam");
	$(".account-title-steam").text("Disponíveis na sua conta Steam");

	// Search page
	//Page title
	$(".search-title").text("Buscar no Game Access por");
	//Search without result
	$(".noresults-title").text("Nenhum resultado encontrado");
	$(".noresults-desc").text("Infelizmente não achei nenhum resultado para a sua busca.");

	// Battle.net page
	//Page title
	$(".battlenet-title").text("Games para jogar com o Battle.net");
	//View more
	$(".battlenet-more").text("Ver mais no Battle.net");

	// Epic Games Store page
	//Page title
	$(".installed-title-epicstore").text("Jogos instalados");
	$(".account-title-epicstore").text("Disponíveis na sua conta da Epic Games Store");
	//View more
	$(".epicstore-more").text("Ver mais na Epic Games Store");
	//Install
	$(".epicstore-install").text("Instalar a Epic Games Store");
	//Login button
	$(".login-button-epicstore").text("Fazer login na Epic Games Store");
	//Remove account button
	$(".remove-account").text("Remover conta");

	// Amazon Games page
	//Page title
	$(".installed-title-amazon").text("Jogos instalados");
	$(".account-title-amazon").text("Disponíveis na sua conta do Amazon Games");
	//View more
	$(".amazon-more").text("Ver mais no Amazon Games");
	//Install
	$(".amazon-install").text("Instalar o Amazon Games");
	//Login button
	$(".login-button-amazon").text("Fazer login no Amazon Games");
	//Remove account button
	$(".remove-account").text("Remover conta");

	// GOG Galaxy page
	//Page title
	$(".gog-title").text("Games para jogar com o GOG Galaxy");
	//View more
	$(".gog-more").text("Ver mais no GOG Galaxy");

	// Origin page
	//Page title
	$(".origin-title").text("Games para jogar com o Origin");
	//View more
	$(".origin-more").text("Ver mais no Origin");

	// EA App page
	//Page title
	$(".eadesktop-title").text("Games para jogar com o EA App");
	//View more
	$(".eadesktop-more").text("Ver mais no EA App");

	// Rockstar Games Launcher page
	//Page title
	$(".rockstar-title").text("Games para jogar com o Rockstar Games Launcher");
	//View more
	$(".rockstar-more").text("Ver mais no Rockstar Games Launcher");

	// Ubisoft Connect page
	//Page title
	$(".ubisoftconnect-title").text("Games para jogar com o Ubisoft Connect");
	//View more
	$(".ubisoftconnect-more").text("Ver mais no Ubisoft Connect");

	// Settings
	//Page title
	$(".settings-title").text("Configurações");

	//FPS option
	$(".option-fps-hud-title").text("Mostrar o FPS dos jogos");
	$(".option-fps-hud-desc").text("Esta opção habilita um HUD que exibe detalhes sobre o desempenho dos jogos e uso do hardware. Você também pode escolher em que canto da tela ele irá aparecer e qual será a aparência.");
	$(".fps-hud-desc").text("Exibir FPS HUD");

	//FPS display position
	$(".fps-top-left").text("No canto superior esquerdo da tela");
	$(".fps-top-right").text("No canto superior direito da tela");
	$(".fps-bottom-left").text("No canto inferior esquerdo da tela");
	$(".fps-bottom-right").text("No canto inferior direito da tela");

	//FPS look
	$("#fps-hud-appearance-title").text("Escolha um estilo para o FPS HUD");
	$("#fps-hud-preview").text("Visualizar o FPS HUD");

	//AMD FSR option
	$(".option-amd-fsr-title").text("Ativar o AMD FidelityFX Super Resolution (FSR)");
	$(".option-amd-fsr-desc").text("Esta opção habilita o recurso AMD FSR para ajudar a impulsionar suas taxas de quadros nos jogos.");
	$(".amd-fsr-desc").text("Ativar o AMD FSR");

	//Close automatically
	$(".option-auto-close-title").text("Fechar o aplicativo Game Access automaticamente");
	$(".option-auto-close-desc").text("Esta opção permite que o Game Access seja fechado quando um jogos ou launcher estiver em execução.");
	$(".auto-close-desc").text("Fechar automaticamente");

	//Add external games folder
	$(".option-find-games-external-folder").text("Localizar automaticamente jogos em uma pasta externa");
	$(".option-find-games-external-folder-desc").text("Esta opção permite ao Game Access buscar também jogos em um outro diretório/disco externo.");
	$(".external-games-folder-button-txt").text("Adicionar pasta externa");
	$("#remove-external-games-folder-dir").attr({ title: "Remover" });
});

function langSelectingFpsHudLook(classItem) {
	const styleName = {
		"look-name-1": "Exibir apenas o FPS",
		"look-name-2": "FPS HUD na horizontal",
		"look-name-3": "FPS HUD extendido",
		"look-name-4": "FPS HUD mais detalhado"
	};

	if (typeof styleName[classItem] !== "undefined") {
		const displayStyleName = document.querySelector(`.${classItem}`);
		displayStyleName.innerHTML = styleName[classItem];
	}
}
