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
