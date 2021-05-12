// folder with the file with the value
var dir = "/tmp/progressbar-gcs/"

// Remove installations on process queue
function stop_queued1() {
    var command_line = "sed -i 1d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function stop_queued2() {
    var command_line = "sed -i 2d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function stop_queued3() {
    var command_line = "sed -i 3d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function stop_queued4() {
    var command_line = "sed -i 4d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function stop_queued5() {
    var command_line = "sed -i 5d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function stop_queued6() {
    var command_line = "sed -i 6d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function stop_queued7() {
    var command_line = "sed -i 7d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}

function stop_queued8() {
    var command_line = "sed -i 8d "+dir+"queued-process";
    console.log(command_line);
    exec(command_line,function(error,call,errlog){
    });
}
