// Portuguese language translation
$(document).ready(function() {
	// Top bar
	//Back button
	$(".top-bar-arrow").attr({title:"Voltar"});
	//Top menu
	$(".p-installed").text("Instalados");
	$(".p-allgames").text("Todos os jogos");
	$(".p-steam").text("Steam");
	$(".p-settings").text("Configurações");
	//Top search
	$("#field").attr({value:"Pesquisar jogos"});
	$("#field").attr({onfocus:"if (this.value == 'Pesquisar jogos') {this.value = '';}"});
	$("#field").attr({onblur:"if (this.value == '') {this.value = 'Pesquisar jogos';}"});

	// Side bar
	//Sidebar titles
	$(".block-title").text("Launchers disponíveis");
	$(".block-title-others").text("Outros");
	//Display FPS HUD
	$(".fpshud p").text("Exibir contador de FPS");
	//Remove launcher
	$(".remove-launcher").attr({title:"Remover"});
	//Run .exe file
	$(".label-run").attr({title:"Rode um arquivo .exe neste drive virtual."});
	//Open launcher installation folder
	$(".open-folder").attr({title:"Abrir pasta de instalação do driver virtual."});
	//Run launcher
	$(".run-launcher").attr({title:"Executar"});
	//Uninstall button
	$(".text-remove").text("Remover");

	// Confirm box
	//Install game
	$(".donwload-game-title").text("Fazer download do jogo ou importá-lo?");
	$(".install-default-directory-desc").text("Instalar jogo no diretório padrão.");
	$(".download-game-txt").text("Instalar jogo");
	$(".import-game-txt").text("Localizar jogo");
	$(".donwload-cancel-button").text("Cancelar");

	//Remove game
	$(".confir-title-game").text("Você realmente quer desinstalar o jogo? Isso deve apagar todos os arquivos.");
	$(".uninstall-game-button").text("Desinstalar");
	$(".uninstall-cancel-button").text("Cancelar");

	//Remove account
	$(".confir-title-remove-account").text("Remover conta de usuário?");
	$(".true-button").text("Sim");
	$(".false-button").text("Cancelar");
});
