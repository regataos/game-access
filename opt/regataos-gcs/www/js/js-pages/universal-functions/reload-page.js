// Reload page
function reloadPage(setTime) {
    setTimeout(function () {
        const fs = require("fs");
        const reloadFilePath = "/tmp/regataos-gcs/reload-page.txt";
        location.reload();
    }, setTime);
}

function handleCssClass(type, display, elements) {
    const unsupportedOperation = `handleCssClass: the "${type}" operation is not supported!`

    if (typeof elements === "object") {
        const getElements = document.querySelectorAll(`.${elements.join(", .")}`);
        getElements.forEach((element) => {
            if (type.includes("add")) {
                element.classList.add(display);
            } else if (type.includes("remove")) {
                element.classList.remove(display);
            } else {
                return console.log(unsupportedOperation)
            }
        });

    } else {
        const element = document.querySelector(`.${elements}`);

        if (type.includes("add")) {
            element.classList.add(display);
        } else if (type.includes("remove")) {
            element.classList.remove(display);
        } else {
            return console.log(unsupportedOperation)
        }
    }
}
