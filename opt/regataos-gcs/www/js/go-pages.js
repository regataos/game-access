// Functions to navigate between pages

//Back button function, to previous page
function voltar() {
	history.go(-1);
}

//Go for pages
function go_home() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/home.html";
}

function go_installed() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/installed.html";
}

function go_allgames() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/allgames.html";
}

function go_steam() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/steam-games.html";
}

function go_settings() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/settings.html";
}

function go_to_page() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/" + launchername + "-games.html";
}
