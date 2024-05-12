// English language translation for all pages
$(document).ready(function () {
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
	//Game blocks
	$(".home-game2 .block-desc").html("Fun and addictive arena-style first person shooter.");
	$(".home-game3 .block-desc").html("Awaken as a ruthless warrior.");

	// All Games page
	//Page title
	$(".installed-title").text("List with all games detected by the Regata OS Game Access");
	$(".nogamefound-title").text("No games found");
	$(".nogamefound-desc").text("Unfortunately, I haven't found any games installed yet.");
	$(".allgames-title").text("List with some of the games that you can run with Regata OS Game Access");
	$(".loading-games").text("Loading your game library...");
	$(".remove-game-button").attr({ title: "Uninstall game" });
	$(".morefor-game-button").attr({ title: "More about the game" });

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
	$(".battlenet-title").text("Games to play with Battle.net");
	//View more
	$(".battlenet-more").text("See more at Battle.net");

	// Epic Games Store page
	//Page title
	$(".installed-title-epicstore").text("Installed games");
	$(".account-title-epicstore").text("Available in your Epic Games Store account");
	//View more
	$(".epicstore-more").text("See more at Epic Games Store");
	//Install
	$(".epicstore-install").text("Install Epic Games Store");
	//Login button
	$(".login-button-epicstore").text("Log in to Epic Games Store");
	//Remove account button
	$(".remove-account").text("Remove account");

	// Amazon Games page
	//Page title
	$(".installed-title-amazon").text("Installed games");
	$(".account-title-amazon").text("Available in your Amazon Games account");
	//View more
	$(".amazon-more").text("See more at Amazon Games");
	//Install
	$(".amazon-install").text("Install Amazon Games");
	//Login button
	$(".login-button-amazon").text("Log in to Amazon Games");
	//Remove account button
	$(".remove-account").text("Remove account");

	// GOG Galaxy page
	//Page title
	$(".gog-title").text("Games to play with GOG Galaxy");
	//View more
	$(".gog-more").text("See more at GOG Galaxy");

	// Origin page
	//Page title
	$(".origin-title").text("Games to play with Origin");
	//View more
	$(".origin-more").text("See more at Origin");

	// EA App page
	//Page title
	$(".eadesktop-title").text("Games to play with EA App");
	//View more
	$(".eadesktop-more").text("See more at EA App");

	// Rockstar Games Launcher page
	//Page title
	$(".rockstar-title").text("Games to play with Rockstar Games Launcher");
	//View more
	$(".rockstar-more").text("See more at Rockstar Games Launcher");

	// Ubisoft Connect page
	//Page title
	$(".ubisoftconnect-title").text("Games to play with Ubisoft Connect");
	//View more
	$(".ubisoftconnect-more").text("See more at Ubisoft Connect");

	// Settings
	//Page title
	$(".settings-title").text("Settings");

	//FPS option
	$(".option-fps-hud-title").text("Show FPS of games");
	$(".option-fps-hud-desc").text("This option enables a HUD that displays details about gaming performance and hardware usage. You can also choose which corner of the screen it will appear in and what it will look like.");
	$(".fps-hud-desc").text("View FPS HUD");

	//FPS display position
	$(".fps-top-left").text("At the top left corner of the screen");
	$(".fps-top-right").text("At the top right corner of the screen");
	$(".fps-bottom-left").text("At the bottom left corner of the screen");
	$(".fps-bottom-right").text("At the bottom right corner of the screen");

	//FPS look
	$("#fps-hud-appearance-title").text("Choose a style for the FPS HUD");
	$("#fps-hud-preview").text("View the FPS HUD");

	//AMD FSR option
	$(".option-amd-fsr-title").text("Enable AMD FidelityFX Super Resolution (FSR)");
	$(".option-amd-fsr-desc").text("This option enables the AMD FSR feature to help boost your gaming frame rates.");
	$(".amd-fsr-desc").text("Enable AMD FSR");

	//Close automatically 
	$(".option-auto-close-title").text("Close the Game Access app automatically");
	$(".option-auto-close-desc").text("This option allows Game Access to close when a game or launcher is running.");
	$(".auto-close-desc").text("Close automatically");

	//Add external games folder
	$(".option-find-games-external-folder").text("Automatically find games in an external folder");
	$(".option-find-games-external-folder-desc").text("This option allows Game Access to also search for games in another external directory/disk.");
	$(".external-games-folder-button-txt").text("Add external folder");
	$("#remove-external-games-folder-dir").attr({ title: "Remove" });
});

function langSelectingFpsHudLook(classItem) {
	const styleName = {
		"look-name-1": "Display only FPS",
		"look-name-2": "FPS HUD horizontally",
		"look-name-3": "Extended FPS HUD",
		"look-name-4": "More detailed FPS HUD"
	};

	if (typeof styleName[classItem] !== "undefined") {
		const displayStyleName = document.querySelector(`.${classItem}`);
		displayStyleName.innerHTML = styleName[classItem];
	}
}
