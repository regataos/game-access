// Enable/disable FPS
function enableFpsHud() {
	const checkBox = document.querySelector("#fps-hud-enabled");
	const fpsPositionMenu = document.querySelector("#fps-position");
	const fpsPosition = document.querySelector("#show-fps-hud-options");
	const fpsHudAppearance = document.querySelector("#fps-hud-appearance");

	let showFpsHud = "";

	if (checkBox.checked == true) {
		fpsPosition.style.display = "block";
		fpsHudAppearance.style.display = "block";
		showFpsHud = "/opt/regataos-gcs/scripts/settings-page -fpshud true";
	} else {
		fpsPosition.style.display = "none";
		fpsPositionMenu.style.display = "none";
		fpsHudAppearance.style.display = "none";
		showFpsHud = "/opt/regataos-gcs/scripts/settings-page -fpshud false";
	}

	const exec = require('child_process').exec;
	exec(showFpsHud, function (error, call, errlog) { });
}

function setFpsHudPosition(position) {
	const exec = require('child_process').exec;
	const setFpsHudPosition = `/opt/regataos-gcs/scripts/settings-page -fpshud -position-${position}`;
	exec(setFpsHudPosition, function (error, call, errlog) {});
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

	function openMenu() {
		extendedMenu.style.display = "block";
		sessionStorage.setItem("hideMenu", menuId);
		sessionStorage.setItem("buttonId", buttonId);
	}

	if (styleDefaultValue == "" || styleDefaultValue == "none") {
		// check if there are any menus open
		let checkMenuOpen = sessionStorage.getItem("hideMenu");
		if (checkMenuOpen && checkMenuOpen != menuId) {
			document.querySelector(`#${menuId}`).style.display = "none";
			setTimeout(function () {
				openMenu();
			}, 100);
		} else {
			openMenu();
		}

	} else {
		extendedMenu.style.display = "none";
		const buttonText = document.querySelector(`#${optionId} span`).textContent;
		console.log(buttonText)
		document.querySelector(`#${buttonId} span`).textContent = buttonText;
	}
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

const fpsHudLookRange = document.querySelector("#fpsHudLookRange");
fpsHudLookRange.addEventListener("input", (event) => {
	const fpsHudLookRangeValue = event.target.value;

	const exec = require('child_process').exec;
	const setFpsHudPosition = `/opt/regataos-gcs/scripts/settings-page -fpshud -preset-${fpsHudLookRangeValue}`;
	exec(setFpsHudPosition, function (error, call, errlog) {
	});

	const lookName = document.querySelector("#look-name");
	lookName.className = "";
	lookName.classList.add(`look-name-${fpsHudLookRangeValue}`);
	langSelectingFpsHudLook(`look-name-${fpsHudLookRangeValue}`)

	if (fpsHudLookRangeValue == 1) {
		fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 0%, #48505a 0%)";
		document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#48505a";
		document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#48505a";
		document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#48505a";

	} else if (fpsHudLookRangeValue == 2) {
		fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 35%, #48505a 0%)";
		document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#48505a";
		document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#48505a";

	} else if (fpsHudLookRangeValue == 3) {
		fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 65%, #48505a 50%)";
		document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#48505a";

	} else if (fpsHudLookRangeValue == 4) {
		fpsHudLookRange.style.background = "linear-gradient(to right, #0078f2 100%, #48505a 0%)";
		document.querySelector(".fps-hud-appearance-1").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-2").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-3").style.backgroundColor = "#0078f2";
		document.querySelector(".fps-hud-appearance-4").style.backgroundColor = "#0078f2";
	}
})

function previewFpsHud() {
	const exec = require('child_process').exec;
	const runFpsHudPreview = "sleep 1; /opt/regataos-gcs/scripts/settings-page -preview-fpshud";
	exec(runFpsHudPreview, function (error, call, errlog) {
	});
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
