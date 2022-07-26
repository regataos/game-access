// Enable/disable FPS
var checkbox_fps_hud = $(".fpshud input[type='checkbox']");
checkbox_fps_hud.change(function(event) {
	var checkbox_fps_hud = event.target;
	if (checkbox_fps_hud.checked) {
		const exec = require('child_process').exec;
		var command_line = "/opt/regataos-gcs/scripts/settings-page -fpshud";
		exec(command_line,function(error,call,errlog){
		});
	} else {
		const exec = require('child_process').exec;
		var command_line = "/opt/regataos-gcs/scripts/settings-page -fpshud";
		exec(command_line,function(error,call,errlog){
		});
	}
});

// Enable/disable automatic closing of Game Access
var checkbox_fps_hud = $(".autoclose input[type='checkbox']");
checkbox_fps_hud.change(function(event) {
	var checkbox_fps_hud = event.target;
	if (checkbox_fps_hud.checked) {
		const exec = require('child_process').exec;
		var command_line = "/opt/regataos-gcs/scripts/settings-page -autoclose";
		exec(command_line,function(error,call,errlog){
		});
	} else {
		const exec = require('child_process').exec;
		var command_line = "/opt/regataos-gcs/scripts/settings-page -autoclose";
		exec(command_line,function(error,call,errlog){
		});
	}
});

// Enable/disable AMD FSR
var checkbox_fps_hud = $(".amdfsr input[type='checkbox']");
checkbox_fps_hud.change(function(event) {
	var checkbox_fps_hud = event.target;
	if (checkbox_fps_hud.checked) {
		const exec = require('child_process').exec;
		var command_line = "/opt/regataos-gcs/scripts/settings-page -amd-fsr";
		exec(command_line,function(error,call,errlog){
		});
	} else {
		const exec = require('child_process').exec;
		var command_line = "/opt/regataos-gcs/scripts/settings-page -amd-fsr";
		exec(command_line,function(error,call,errlog){
		});
	}
});

// Add external games folder
$('input[id="add-external-games-folder"]').change(function(e){
	const fileinput = document.querySelector('input#add-external-games-folder');
	const path = fileinput.value;

	const exec = require('child_process').exec;
	const create_external_games_folder_file = `echo "${path}" > "/tmp/regataos-gcs/config/external-games-folder.txt"; \
	rm -rf "$HOME/Game Access/External-Disc"; \
	ln -sf "${path}" "$HOME/Game Access/External-Disc"`;
	exec(create_external_games_folder_file,function(error,call,errlog){
	});

	setTimeout(function(){
		check_external_games_folder();
	}, 1000);

	fileinput.value='';
});

// Remove external games folder
function remove_external_games_folder() {
	const fs = require('fs')
	const path = "/tmp/regataos-gcs/config/external-games-folder.txt";

	try {
		fs.unlinkSync(path)

	} catch(err) {
  		console.error(err)
	}

	setTimeout(function(){
		check_external_games_folder();
	}, 1000);
}
