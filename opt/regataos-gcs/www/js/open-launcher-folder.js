// Open the virtual driver installation folder
function openfolder_battlenet() {
	const exec = require('child_process').exec;
	var command_line = 'xdg-open "$HOME/.local/share/wineprefixes/battlenet-compatibility-mode/drive_c"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function openfolder_epicstore() {
	const exec = require('child_process').exec;
	var command_line = 'xdg-open "$HOME/.local/share/wineprefixes/epicstore-compatibility-mode/drive_c"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function openfolder_gog() {
	const exec = require('child_process').exec;
	var command_line = 'xdg-open "$HOME/.local/share/wineprefixes/gog-compatibility-mode/drive_c"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function openfolder_origin() {
	const exec = require('child_process').exec;
	var command_line = 'xdg-open "$HOME/.local/share/wineprefixes/origin-compatibility-mode/drive_c"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function openfolder_eadesktop() {
	const exec = require('child_process').exec;
	var command_line = 'xdg-open "$HOME/.local/share/wineprefixes/eadesktop-compatibility-mode/drive_c"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function openfolder_rockstar() {
	const exec = require('child_process').exec;
	var command_line = 'xdg-open "$HOME/.local/share/wineprefixes/rockstar-compatibility-mode/drive_c"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}

function openfolder_ubisoftconnect() {
	const exec = require('child_process').exec;
	var command_line = 'xdg-open "$HOME/.local/share/wineprefixes/ubisoftconnect-compatibility-mode/drive_c"';
	console.log(command_line);
	exec(command_line,function(error,call,errlog){
	});
}
