// Portuguese language translation
$(document).ready(function() {
	// Top bar
	//Back button
	$(".top-bar-arrow").attr({title:"Voltar"});
	//Top menu
	$(".p-installed").text("Instalados");
	$(".p-allgames").text("Todos os jogos");
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
});
