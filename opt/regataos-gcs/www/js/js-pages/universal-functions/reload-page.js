// Reload page
function reloadPage(setTime) {
    setTimeout(function () {
        location.reload();
    }, setTime);
}

const reloadCurrentPageInterval = setInterval(reloadCurrentPage, 1000);
function reloadCurrentPage() {
	const fs = require('fs');
    if (fs.existsSync("/tmp/regataos-gcs/reload-page.txt")) {
        fs.unlinkSync("/tmp/regataos-gcs/reload-page.txt");
        reloadPage(1000);
    }
}
