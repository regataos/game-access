// Check configuration files
function checkConfigFile(configFileForVerification, stringForVerification) {
    const fs = require("fs");

    const searchString = new RegExp(`(?<=${stringForVerification}).*`, "g");
    const data = fs.readFileSync(configFileForVerification, "utf8");

    const verifiedConfig = data
        .match(searchString)[0]
        .toLowerCase()
        .replace(/:.*/g, "")
        .replace(/\.utf-8/g, "")
        .replace(/\.utf8/g, "")
        .replace(/_/g, "-")
        .replace(/=/g, "");
    return verifiedConfig;
}
