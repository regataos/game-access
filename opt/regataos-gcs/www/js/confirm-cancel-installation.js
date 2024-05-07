// Open box confirm cancel installation
function showconfirmbox_installation() {
    const fs = require('fs');

    fs.access('/tmp/progressbar-gcs/confirm-cancel-installation', (err) => {
        if (!err) {
            confirm_cancel_installation();
            document.querySelector(".confirmation-cancel-installation").style.display = "block";
            return;
        }
    });

}

// Close confirm box
function hideconfirmboxinstallation() {
    const exec = require('child_process').exec;
    const commandLine = "rm -f /tmp/progressbar-gcs/confirm-cancel-installation";
    exec(commandLine, function (error, call, errlog) { });
    document.querySelector(".confirmation-cancel-installation").style.display = "none";
}

// If prompted, Cancel download
function cancel_down() {
    const exec = require('child_process').exec;
    const fs = require('fs');

    hideconfirmboxinstallation();

    fs.readFile('/tmp/progressbar-gcs/wget-pid', (err, wgetpid) => {
        if (err) throw err;
        const wgetpid = wgetpid

        const commandLine1 = "kill -CONT " + wgetpid;
        exec(commandLine1, function (error, call, errlog) { });

        const commandLine2 = "kill SIGKILL " + wgetpid;
        exec(commandLine2, function (error, call, errlog) { });
    });

    const commandLine3 = "chmod +x /tmp/progressbar-gcs/script-cancel; /tmp/progressbar-gcs/script-cancel start";
    exec(commandLine3, function (error, call, errlog) { });
}

setInterval(function () {
    showconfirmbox_installation();
}, 500);
