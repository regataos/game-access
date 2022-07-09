// Portuguese language translation

// Game action buttons
document.querySelector(".text-play").innerHTML = "Play";
document.querySelector(".text-remove").innerHTML = "Uninstall";
document.querySelector(".text-install").innerHTML = "Install";

// Page content title
document.querySelector(".discretion-title").innerHTML = "About the game";

// System requirements
document.querySelector(".system-requirements").innerHTML = "System requirements";
document.querySelector(".system-minimum").innerHTML = "Minimum";
document.querySelector(".system-recommended").innerHTML = "Recommended";

const systemProcessor = document.querySelectorAll(".system-processor");
for (let i = 0; i < systemProcessor.length; i++) {
    systemProcessor[i].innerHTML = "Processor:";
}

const systemMemory = document.querySelectorAll(".system-memory");
for (let i = 0; i < systemMemory.length; i++) {
    systemMemory[i].innerHTML = "Memory:";
}

const systemGpu = document.querySelectorAll(".system-gpu");
for (let i = 0; i < systemGpu.length; i++) {
    systemGpu[i].innerHTML = "Graphics:";
}

const systemStorage = document.querySelectorAll(".system-storage");
for (let i = 0; i < systemStorage.length; i++) {
    systemStorage[i].innerHTML = "Disk storage:";
}

// Informações do desenvolvedor
document.getElementById("dev-name").innerHTML = "Developer:";
document.getElementById("publisher").innerHTML = "Publisher:";
document.getElementById("initial-release").innerHTML = "Release date:";
document.getElementById("update-release").innerHTML = "Update date:";
