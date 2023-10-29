// Enable/disable FPS
function enableFpsHud() {
	const checkBox = document.querySelector("#fps-hud-enabled");
	const fpsPositionMenu = document.querySelector("#fps-position");
	const fpsPosition = document.querySelector("#show-fps-hud-options");

	let showFpsHud = "";

	if (checkBox.checked == true) {
		fpsPosition.style.display = "block";
		showFpsHud = "/opt/regataos-gcs/scripts/settings-page -fpshud true";
	} else {
		fpsPosition.style.display = "none";
		fpsPositionMenu.style.display = "none";
		showFpsHud = "/opt/regataos-gcs/scripts/settings-page -fpshud false";
	}

	const exec = require('child_process').exec;
	exec(showFpsHud, function (error, call, errlog) { });
}

sessionStorage.setItem("hideMenu", "");
function hideSpecifiedMenu() {
	let buttonId = sessionStorage.getItem("buttonId");
	let menuId = sessionStorage.getItem("hideMenu");
	let clickedElement = document.activeElement.id;

	if (clickedElement != buttonId) {
		let elementToHide = document.querySelector(`#${menuId}`);
		elementToHide.style.display = "none";
	}
}

function showSpecifiedMenu(buttonId, menuId, optionId) {
	let extendedMenu = document.querySelector(`#${menuId}`);
	let styleDefaultValue = extendedMenu.style.display;

	if (styleDefaultValue == "" || styleDefaultValue == "none") {
		extendedMenu.style.display = "block";
		sessionStorage.setItem("hideMenu", menuId);
		sessionStorage.setItem("buttonId", buttonId);
	} else {
		extendedMenu.style.display = "none";
		let buttonText = document.querySelector(`.${optionId}`).textContent;
		document.querySelector(`#${buttonId}`).textContent = buttonText;
	}

	const exec = require('child_process').exec;
	const setFpsHudPosition = `/opt/regataos-gcs/scripts/settings-page -fpshud -position-${optionId}`;
	exec(setFpsHudPosition, function (error, call, errlog) {
	});
}

function enableFsr() {
	const checkBox = document.querySelector("#amd-fsr-enabled");
	let enableFsr = "";

	if (checkBox.checked == true) {
		enableFsr = "/opt/regataos-gcs/scripts/settings-page -amd-fsr true";
	} else {
		enableFsr = "/opt/regataos-gcs/scripts/settings-page -amd-fsr false";
	}

	const exec = require('child_process').exec;
	exec(enableFsr, function (error, call, errlog) { });
}

// Enable/disable automatic closing of Game Access
function enableAutoClose() {
	const checkBox = document.querySelector("#auto-close-enabled");
	let enableAutoClose = "";

	if (checkBox.checked == true) {
		enableAutoClose = "/opt/regataos-gcs/scripts/settings-page -autoclose true";
	} else {
		enableAutoClose = "/opt/regataos-gcs/scripts/settings-page -autoclose false";
	}

	const exec = require('child_process').exec;
	exec(enableAutoClose, function (error, call, errlog) { });
}

// Add external games folder
$('input[id="add-external-games-folder"]').change(function (e) {
	const fileinput = document.querySelector('input#add-external-games-folder');
	const path = fileinput.value;

	const exec = require('child_process').exec;
	const create_external_games_folder_file = `
	echo "${path}" > "/tmp/regataos-gcs/config/external-games-folder.txt"; \
	rm -rf "$HOME/Game Access/External-Disc"; \
	ln -sf "${path}" "$HOME/Game Access/External-Disc"; \
	/opt/regataos-gcs/scripts/search-installeds -search`;
	exec(create_external_games_folder_file, function (error, call, errlog) {
	});

	setTimeout(function () {
		check_external_games_folder();
	}, 1000);

	fileinput.value = '';
});

// Remove external games folder
function remove_external_games_folder() {
	const fs = require('fs')
	const path = "/tmp/regataos-gcs/config/external-games-folder.txt";

	try {
		fs.unlinkSync(path)

	} catch (err) {
		console.error(err)
	}

	setTimeout(function () {
		check_external_games_folder();
	}, 1000);

	const exec = require('child_process').exec;
	const search_games = `/opt/regataos-gcs/scripts/search-installeds -search`;
	exec(search_games, function (error, call, errlog) {
	});
}
