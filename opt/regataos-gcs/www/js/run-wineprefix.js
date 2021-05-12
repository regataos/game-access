// Run .exe file in wineprefix
function run_launcher() {
const exec = require('child_process').exec;
const fs = require('fs');

var launchers_file = fs.readFileSync("/opt/regataos-gcs/www/js/js-pages/launchers-list/launchers-list.json", "utf8");
var launchers = JSON.parse(launchers_file);

	for (var i = 0; i < launchers.length; i++) {
		var launcher_nickname = launchers[i].launcher_nickname

		if (launcher_nickname.indexOf(launcher_name) > -1) {
			var environment_variable = launchers[i].environment_variable

			var command_line = 'export LAUNCHERVAR="' + environment_variable + '"; export LAUNCHER="' + launcher_name + '"; export RUN_EXE="' + launcher_executable + '"; /opt/regataos-gcs/scripts/action-games/runlauncher_exe';
			console.log(command_line);
			exec(command_line,function(error,call,errlog){
			});
		}
	}
}

function run_launcher_exe() {
	$('input[id="run-'+ launcher_name +'"]').change(function(e){
		window.launcher_executable = document.getElementById("run-"+ launcher_name).value

		run_launcher();

		document.getElementById("run-"+ launcher_name).value='';
	});
}
