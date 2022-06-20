// Functions to navigate between pages

//Back button function, to previous page
function voltar() {
	$(".block-top").css("display", "none");
	history.go(-1);
	back_button_pages();
}

//Go for pages
function go_home() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/home.html";
	$(".block-top").css("display", "none");
}

function go_installed() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/installed.html";
	$(".block-top").css("display", "none");
}

function go_allgames() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/allgames.html";
	$(".block-top").css("display", "none");
}

function go_steam() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/steam-games.html";
	$(".block-top").css("display", "none");
}

function go_settings() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/settings.html";
	$(".block-top").css("display", "none");
}

function go_to_page() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/" + launchername + "-games.html";
	$(".block-top").css("display", "none");
}
