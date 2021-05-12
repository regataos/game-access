// Functions to navigate between pages

//Back button function, to previous page
function voltar() {
	history.go(-1);
}

//Go for pages
function go_home() {
	$("#block-home").css("display", "block")
	$(".top-bar-arrow").css("display", "none")
	$("ul#top-menu").css("margin-left", "50px")
	$("a.p-home").css("font-weight", "700")
	$(".block-top").css("display", "none")
	$("a.p-installed").css("font-weight", "400")
	$("a.p-allgames").css("font-weight", "400")
	$(".text-app").css("font-weight", "400")

	document.getElementById("iframegcs").contentWindow.document.location.href="pages/home.html";
}

function go_installed() {
	$("a.p-installed").css("font-weight", "700")
	$("a.p-allgames").css("font-weight", "400")
	$(".top-bar-arrow").css("display", "block")
	$("ul#top-menu").css("margin-left", "80px")
	$("a.p-home").css("font-weight", "400")
	$(".text-app").css("font-weight", "400")

	document.getElementById("iframegcs").contentWindow.document.location.href="pages/installed.html";
}

function go_allgames() {
	$("a.p-installed").css("font-weight", "400")
	$("a.p-allgames").css("font-weight", "700")
	$(".top-bar-arrow").css("display", "block")
	$("ul#top-menu").css("margin-left", "80px")
	$("a.p-home").css("font-weight", "400")
	$(".text-app").css("font-weight", "400")

	document.getElementById("iframegcs").contentWindow.document.location.href="pages/allgames.html";
}

function go_to_page() {
	document.getElementById("iframegcs").contentWindow.document.location.href="pages/" + launchername + "-games.html";
}
