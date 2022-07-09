// Portuguese language translation

// Game action buttons
document.querySelector(".text-play").innerHTML = "Jogar";
document.querySelector(".text-remove").innerHTML = "Remover";
document.querySelector(".text-install").innerHTML = "Instalar";

// Page content title
document.querySelector(".discretion-title").innerHTML = "Sobre o jogo";

// System requirements
document.querySelector(".system-requirements").innerHTML = "Requisitos do sistema";
document.querySelector(".system-minimum").innerHTML = "Mínimo";
document.querySelector(".system-recommended").innerHTML = "Recomendado";

const systemProcessor = document.querySelectorAll(".system-processor");
for (let i = 0; i < systemProcessor.length; i++) {
    systemProcessor[i].innerHTML = "Processador:";
}

const systemMemory = document.querySelectorAll(".system-memory");
for (let i = 0; i < systemMemory.length; i++) {
    systemMemory[i].innerHTML = "Memória:";
}

const systemGpu = document.querySelectorAll(".system-gpu");
for (let i = 0; i < systemGpu.length; i++) {
    systemGpu[i].innerHTML = "Placa de vídeo:";
}

const systemStorage = document.querySelectorAll(".system-storage");
for (let i = 0; i < systemStorage.length; i++) {
    systemStorage[i].innerHTML = "Espaço em discos:";
}

// Informações do desenvolvedor
document.getElementById("dev-name").innerHTML = "Desenvolvedor:";
document.getElementById("publisher").innerHTML = "Editora:";
document.getElementById("initial-release").innerHTML = "Data de lançamento:";
document.getElementById("update-release").innerHTML = "Data de atualização:";
