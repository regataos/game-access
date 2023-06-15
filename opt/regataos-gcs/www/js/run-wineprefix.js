// Run .exe file in wineprefix
function runExternalExeFile() {
	const exec = require('child_process').exec;
	const fs = require('fs');
	const launcherJsonFilesDir = "/opt/regataos-gcs/launchers-list"

	let launcherJsonFiles = [];

	// Read JSON files with the list of launchers
	fs.readdirSync(launcherJsonFilesDir).forEach(launcherJsonFiles => {
	fs.readFile(`${launcherJsonFilesDir}/${launcherJsonFiles}` , "utf8", function(err, data) {
	if(!err) {
		const launchers = JSON.parse(data);

		for (let i = 0; i < launchers.length; i++) {
			const launcher_nickname = launchers[i].launcher_nickname

			if (launcher_nickname.indexOf(launcher_name) > -1) {
				const environment_variable = launchers[i].environment_variable

				const runExternalExe = `
					export LAUNCHERVAR="${environment_variable}";
					export LAUNCHER="${launcher_name}";
					export RUN_EXE="${externalExeFile}";
					/opt/regataos-gcs/scripts/action-games/runlauncher_exe start
					`;
				console.log(runExternalExe);
				exec(runExternalExe,function(error,call,errlog){
				});
			}
		}
	return;
	}
	});
	});
}

function run_launcher_exe(launcher_name) {
	$('input[id="run-'+ launcher_name +'"]').change(function(e){
		window.externalExeFile = document.getElementById("run-"+ launcher_name).value

		runExternalExeFile();

		setTimeout(function(){
			document.getElementById("run-"+ launcher_name).value='';
		}, 1000);
	});
}
