// English language translation for all pages
$(document).ready(function() {
	// For all pages
	//Display FPS HUD
	$(".fpshud p").text("Display FPS HUD");
	//Play button
	$(".text-play").text("Play");
	//Uninstall button
	$(".text-remove").text("Uninstall");
	//Install button
	$(".text-install").text("Install");

	// Home page
	//First home page title
	$(".first-home-title").text("For you");
	//Check internet connection
	$(".networkoff-title").text("Unable to connect to the Internet");
	$(".networkoff-desc").html("Check the network, modem and router cables or<br/> connect to the Wi-Fi network again.");

	// All Games page
	//Page title
	$(".installed-title").text("List with all games detected by the Regata OS Game Access");
	$(".nogamefound-title").text("No games found");
	$(".nogamefound-desc").text("Unfortunately, I haven't found any games installed yet.");
	$(".allgames-title").text("List with some of the games that you can run with Regata OS Game Access");
	$(".loading-games").text("Loading your game library...");
	$(".remove-game-button").attr({title:"Uninstall game"});

	// Steam games
	//Page title
	$(".installed-title-steam").text("Games installed by Steam");
	//View more
	$(".steam-more").text("See more on Steam");
	$(".account-title-steam").text("Available on your Steam account");

	// Search page
	//Page title
	$(".search-title").text("Search in Regata OS Game Access for");
	//Search without result
	$(".noresults-title").text("No results found");
	$(".noresults-desc").text("Unfortunately, I couldn't find any results for your search.");

	// Battle.net page
	//Page title
	$(".battlenet-title").text("Games accessible through Battle.net");
	//View more
	$(".battlenet-more").text("See more at Battle.net");

	// Epic Games Store page
	//Page title
	$(".installed-title-epicstore").text("Installed games");
	$(".account-title-epicstore").text("Available in your Epic Games Store account");
	//View more
	$(".epicstore-more").text("Install Epic Games Store");
	//Login button
	$(".login-button-epicstore").text("Log in to Epic Games Store");
	//Remove account button
	$(".remove-account").text("Remove account");

	// GOG Galaxy page
	//Page title
	$(".gog-title").text("Games accessible through GOG Galaxy");
	//View more
	$(".gog-more").text("See more at GOG Galaxy");

	// Origin page
	//Page title
	$(".origin-title").text("Games accessible through Origin");
	//View more
	$(".origin-more").text("See more at Origin");

	// Rockstar Games Launcher page
	//Page title
	$(".rockstar-title").text("Games accessible through Rockstar Games Launcher");
	//View more
	$(".rockstar-more").text("See more at Rockstar Games Launcher");

	// Ubisoft Connect page
	//Page title
	$(".ubisoftconnect-title").text("Games accessible through Ubisoft Connect");
	//View more
	$(".ubisoftconnect-more").text("See more at Ubisoft Connect");
});
