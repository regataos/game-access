// Estado inicial
let gamepadState = {
    connected: false,
    index: null
};
let topMenuIndex = 0;
let sideMenuIndex = 0;
const topBar = document.querySelector('.top-bar');
const blockHome = document.getElementById('block-home');
const topMenuItems = topBar.querySelectorAll('.top-menu-item');
let sideMenuItems = blockHome.querySelectorAll('.block-apps');
let lastLBState = false;
let lastRBState = false;
let lastUpState = false;
let lastDownState = false;
let lastSelectState = false;
let lastXState = false;
let lastBState = false;

let isSideMenuActive = sessionStorage.getItem('sideMenuActive') === 'true' || false;
sessionStorage.setItem('sideMenuActive', isSideMenuActive);

const iframe = document.getElementById('iframegcs');
let isIframeActive = false;

function updateTopMenuSelection(triggerClick = true) {
    topMenuItems.forEach((item, index) => {
        item.classList.toggle('selected', index === topMenuIndex);
    });
    if (triggerClick) {
        topMenuItems[topMenuIndex].click();
    }
    console.log(`Seleção na barra superior (.top-bar), item ${topMenuIndex}`);
}

function updateSideMenuSelection(triggerClick = true) {
    sideMenuItems.forEach((item, index) => {
        item.classList.toggle('selected', index === sideMenuIndex);
    });
    if (triggerClick) {
        sideMenuItems[sideMenuIndex].click();
    }
    console.log(`Seleção na barra lateral (#block-home), item ${sideMenuIndex}`);
}

function clearSelection(items) {
    items.forEach(item => item.classList.remove('selected'));
}

function sendGamepadEventToIframe(eventData) {
    if (iframe.contentWindow) { // Remove a dependência de isIframeActive para garantir envio
        iframe.contentWindow.postMessage({
            type: 'gamepadEvent',
            data: eventData
        }, window.location.origin);
        console.log("Evento enviado ao iframe:", eventData);
    }
}

function connectHandler(e) {
    gamepadState.connected = true;
    gamepadState.index = e.gamepad.index;
    if (isSideMenuActive) {
        updateSideMenuSelection();
    } else {
        updateTopMenuSelection();
    }
    console.log("Controle conectado no índice", e.gamepad.index);
}

function disconnectHandler(e) {
    gamepadState.connected = false;
    gamepadState.index = null;
    console.log("Controle desconectado");
}

function updateGamepad() {
    if (!gamepadState.connected) {
        requestAnimationFrame(updateGamepad);
        return;
    }

    const gamepad = navigator.getGamepads()[gamepadState.index];
    if (!gamepad) {
        requestAnimationFrame(updateGamepad);
        return;
    }

    const LBPressed = gamepad.buttons[4].pressed;
    const RBPressed = gamepad.buttons[5].pressed;
    const XPressed = gamepad.buttons[2].pressed;
    const BPressed = gamepad.buttons[1].pressed;
    const selectPressed = gamepad.buttons[8].pressed;
    const verticalAxis = gamepad.axes[1];
    const upPressed = verticalAxis < -0.5;
    const downPressed = verticalAxis > 0.5;
    const horizontalAxis = gamepad.axes[0];

    const gamepadData = {
        LBPressed,
        RBPressed,
        XPressed,
        BPressed,
        selectPressed,
        upPressed,
        downPressed,
        verticalAxis,
        horizontalAxis
    };

    if (XPressed && !lastXState) {
        isIframeActive = true;
        iframe.focus();
        clearSelection(topMenuItems);
        clearSelection(sideMenuItems);
        console.log("Foco no iframe (botão X pressionado)");
        sendGamepadEventToIframe({ ...gamepadData, initializeSelection: true });
    }

    if (BPressed && !lastBState) {
        sendGamepadEventToIframe({ ...gamepadData, clearSelection: true }); // Envia antes de mudar o estado
        isIframeActive = false;
        window.focus();
        if (isSideMenuActive) {
            updateSideMenuSelection(false);
        } else {
            updateTopMenuSelection(false);
        }
        console.log("Foco retornando para a página principal (botão B pressionado)");
    }

    if (isIframeActive) {
        sendGamepadEventToIframe(gamepadData);
    } else {
        if (selectPressed && !lastSelectState) {
            isSideMenuActive = !isSideMenuActive;
            sessionStorage.setItem('sideMenuActive', isSideMenuActive);
            console.log(`Botão Select pressionado - Navegação lateral: ${isSideMenuActive ? 'ativada' : 'desativada'}`);
            if (isSideMenuActive) {
                sideMenuIndex = 0;
                clearSelection(topMenuItems);
                sideMenuItems = blockHome.querySelectorAll('.block-apps');
                if (sideMenuItems.length > 0) {
                    updateSideMenuSelection();
                } else {
                    console.warn("Nenhum item disponível na barra lateral.");
                }
            } else {
                topMenuIndex = 0;
                clearSelection(sideMenuItems);
                if (topMenuItems.length > 0) {
                    updateTopMenuSelection();
                } else {
                    console.warn("Nenhum item disponível na barra superior.");
                }
            }
        }

        if (!isSideMenuActive) {
            if (LBPressed && !lastLBState && topMenuIndex > 0) {
                topMenuIndex--;
                updateTopMenuSelection();
            } else if (RBPressed && !lastRBState && topMenuIndex < topMenuItems.length - 1) {
                topMenuIndex++;
                updateTopMenuSelection();
            }
        } else if (LBPressed && !lastLBState) {
            isSideMenuActive = false;
            sessionStorage.setItem('sideMenuActive', isSideMenuActive);
            topMenuIndex = 0;
            clearSelection(sideMenuItems);
            updateTopMenuSelection();
        } else if (RBPressed && !lastRBState) {
            isSideMenuActive = false;
            sessionStorage.setItem('sideMenuActive', isSideMenuActive);
            topMenuIndex = 0;
            clearSelection(sideMenuItems);
            updateTopMenuSelection();
        }

        if (isSideMenuActive) {
            if (upPressed && !lastUpState && sideMenuIndex > 0) {
                sideMenuIndex--;
                updateSideMenuSelection();
            } else if (downPressed && !lastDownState && sideMenuIndex < sideMenuItems.length - 1) {
                sideMenuIndex++;
                updateSideMenuSelection();
            }
        }
    }

    lastLBState = LBPressed;
    lastRBState = RBPressed;
    lastUpState = upPressed;
    lastDownState = downPressed;
    lastSelectState = selectPressed;
    lastXState = XPressed;
    lastBState = BPressed;

    requestAnimationFrame(updateGamepad);
}

window.addEventListener("gamepadconnected", connectHandler);
window.addEventListener("gamepaddisconnected", disconnectHandler);

if ("getGamepads" in navigator) {
    console.log("API Gamepad suportada. Aguardando controle...");
    updateGamepad();
}

const style = document.createElement('style');
style.textContent = `
    .top-menu-item.selected, .block-apps.selected {
        background-color: #0078d7;
        color: white;
    }
`;
document.head.appendChild(style);