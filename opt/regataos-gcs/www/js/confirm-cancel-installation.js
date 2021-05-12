// Open box confirm cancel installation
function showconfirmbox_installation() {
const fs = require('fs');

fs.access('/tmp/progressbar-gcs/confirm-cancel-installation', (err) => {
if (!err) {
	confirm_cancel_installation();
	$(".confirmation-cancel-installation").css("display", "block")
	return;
}
});

}

// Close confirm box
function hideconfirmboxinstallation() {
const exec = require('child_process').exec;

	var command_line = "rm -f /tmp/progressbar-gcs/confirm-cancel-installation";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	$(".confirmation-cancel-installation").css("display", "none")
}

// If prompted, Cancel download
function cancel_down() {
const exec = require('child_process').exec;
const fs = require('fs');

	hideconfirmboxinstallation();

	fs.readFile('/tmp/progressbar-gcs/wget-pid', (err, wgetpid) => {
	if (err) throw err;
	console.log(wgetpid);
	var wgetpid = wgetpid

    var command_line = "kill -CONT "+wgetpid;
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

    var command_line = "kill SIGKILL "+wgetpid;
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

	});

	var command_line = "chmod +x /tmp/progressbar-gcs/script-cancel; /tmp/progressbar-gcs/script-cancel start";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });

}

setInterval(function() {
	showconfirmbox_installation();
}, 500);
