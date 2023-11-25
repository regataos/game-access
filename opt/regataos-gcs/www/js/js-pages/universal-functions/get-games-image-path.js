// Get games image path
function getGamesImagePath(launcher, filename) {
    const fs = require("fs");
    const defaultImageDirectory = `/opt/regataos-gcs/www/images/games-backg/${launcher}`;
    const imgDir = `/tmp/regataos-gcs/config/${launcher}-games/img`;
    const extensions = ["jpg", "png", "webp", "jfif"];

    for (const extension of extensions) {
        const imagePath = `${imgDir}/${filename}`;
        const imagePathExtension = `${imagePath}.${extension}`;

        if (fs.existsSync(imagePath)) {
            return `url('file://${imagePath}')`;
        }
        if (fs.existsSync(imagePathExtension)) {
            return `url('file://${imagePathExtension}')`;
        }
        if (fs.existsSync(`${defaultImageDirectory}/${filename}.jpg`)) {
            return `url('file://${defaultImageDirectory}/${filename}.jpg')`;
        }
    }
    return "false";
}
