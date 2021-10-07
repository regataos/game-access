// Enable/desable FPS
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

// Add external games folder
$('input[id="add-external-games-folder"]').change(function(e){
	var fileinput = document.querySelector('input#add-external-games-folder');
	var path = fileinput.value;

	const exec = require('child_process').exec;
	var command_line = 'echo "' + path + '" > "/tmp/regataos-gcs/config/external-games-folder.txt"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
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
		//file removed
	} catch(err) {
  		console.error(err)
	}

	setTimeout(function(){
		check_external_games_folder();
	}, 1000);
}
