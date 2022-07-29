// English language translation
$(document).ready(function() {
	// Top bar
	//Back button
	$(".top-bar-arrow").attr({title:"Return"});
	//Top menu
	$(".p-installed").text("Installed");
	$(".p-allgames").text("All games");
	$(".p-steam").text("Steam");
	$(".p-settings").text("Settings");
	//Top search
	$("#field").attr({value:"Search games"});
	$("#field").attr({onfocus:"if (this.value == 'Search games') {this.value = '';}"});
	$("#field").attr({onblur:"if (this.value == '') {this.value = 'Search games';}"});

	// Side bar
	//Sidebar titles
	$(".block-title").text("Available launchers");
	$(".block-title-others").text("Others");
	//Display FPS HUD
	$(".fpshud p").text("Display FPS counter");
	//Remove launcher
	$(".remove-launcher").attr({title:"Uninstall"});
	//Run .exe file
	$(".label-run").attr({title:"Run an .exe file on this virtual drive."});
	//Open launcher installation folder
	$(".open-folder").attr({title:"Open virtual driver installation folder."});
	//Run launcher
	$(".run-launcher").attr({title:"Run"});
	//Uninstall button
	$(".text-remove").text("Uninstall");

	// Confirm box
	//Install game
	$(".donwload-game-title").text("Download the game or import it?");
	$(".install-default-directory-desc").text("Install game in default directory.");
	$(".download-game-txt").text("Install game");
	$(".import-game-txt").text("Find game");
	$(".donwload-cancel-button").text("Cancel");

	//Remove game
	$(".confir-title-game").text("Do you really want to uninstall the game? This should delete all files.");
	$(".uninstall-game-button").text("Uninstall");
	$(".uninstall-cancel-button").text("Cancel");

	//Remove account
	$(".confir-title-remove-account").text("Remove user account?");
	$(".true-button").text("Yes");
	$(".false-button").text("Cancel");
});
