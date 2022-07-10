// folder with the file with the value

// Remove installations on process queue
function stop_queued1() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -1 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 1d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}

function stop_queued2() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -2 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 2d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}

function stop_queued3() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -3 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 3d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}

function stop_queued4() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -4 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 4d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}

function stop_queued5() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -5 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 5d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}

function stop_queued6() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -6 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 6d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}

function stop_queued7() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -7 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 7d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}

function stop_queued8() {
    let commandLine = `gameId=$(cat "/tmp/progressbar-gcs/queued-process" | awk '{print $1}' | head -8 | tail -1 | cut -d'=' -f -1); \
    sed -i "/$gameId/d" "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i '/^$/d' "/tmp/regataos-gcs/gcs-for-install.txt"; \
    sed -i 8d "/tmp/progressbar-gcs/queued-process"`;
    exec(commandLine,function(error,call,errlog){
    });
}
