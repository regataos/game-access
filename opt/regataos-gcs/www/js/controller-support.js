// Estado inicial
let gamepadState = {
    connected: false,
    index: null
   };
   let topMenuIndex = 0;
   let sideMenuIndex = 0;
   let confirmButtonIndex = 0;
   const topBar = document.querySelector('.top-bar');
   const blockHome = document.getElementById('block-home');
   const topMenuItems = topBar.querySelectorAll('.top-menu-item');
   let sideMenuItems = blockHome.querySelectorAll('.block-apps');
   let lastLBState = false;
   let lastRBState = false;
   let lastUpState = false;
   let lastDownState = false;
   let lastLeftState = false;
   let lastRightState = false;
   let lastSelectState = false;
   let lastXState = false;
   let lastBState = false;
   let isFirstConfirmationSelection = true; // Nova variável para controlar a primeira seleção na confirmation-box
   
   let isSideMenuActive = sessionStorage.getItem('sideMenuActive') === 'true' || false;
   sessionStorage.setItem('sideMenuActive', isSideMenuActive);
   
   const iframe = document.getElementById('iframegcs');
   let isIframeActive = false;
   
   window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data.type === 'selectedIndexResponse') {
    sessionStorage.setItem('lastAppBlockIndex', event.data.data.selectedAppBlockIndex || 0);
    sessionStorage.setItem('lastGameButtonIndex', event.data.data.selectedGameButtonIndex || 0);
    sessionStorage.setItem('isGameButtonSelected', event.data.data.isGameButtonSelected ? 'true' : 'false');
    console.log(`Índices recebidos do iframe - .app-block: ${event.data.data.selectedAppBlockIndex}, .game-page-action-button: ${event.data.data.selectedGameButtonIndex}, isGameButtonSelected: ${event.data.data.isGameButtonSelected}`);
    }
   });
   
   function getVisibleItems(selectorOrItems) {
    const items = typeof selectorOrItems === 'string' ? document.querySelectorAll(selectorOrItems) : selectorOrItems;
    return Array.from(items).filter(item => window.getComputedStyle(item).display !== 'none');
   }
   
   function updateTopMenuSelection(triggerClick = true) {
    const visibleTopMenuItems = getVisibleItems(topMenuItems);
    visibleTopMenuItems.forEach((item, index) => {
    item.classList.toggle('selected', index === topMenuIndex);
    });
    if (triggerClick && visibleTopMenuItems[topMenuIndex]) {
    visibleTopMenuItems[topMenuIndex].click();
    }
    console.log(`Seleção na barra superior (.top-bar), item ${topMenuIndex}`);
   }
   
   function updateSideMenuSelection(triggerClick = true) {
    const visibleSideMenuItems = getVisibleItems(sideMenuItems);
    visibleSideMenuItems.forEach((item, index) => {
    item.classList.toggle('selected', index === sideMenuIndex);
    });
    if (triggerClick && visibleSideMenuItems[sideMenuIndex]) {
    visibleSideMenuItems[sideMenuIndex].click();
    }
    console.log(`Seleção na barra lateral (#block-home), item ${sideMenuIndex}`);
   }
   
   function updateConfirmButtonSelection() {
    const confirmationBoxes = document.querySelectorAll('.confirmation-box');
    let activeConfirmationBox = null;
    confirmationBoxes.forEach(box => {
    if (window.getComputedStyle(box).display === 'block') {
    activeConfirmationBox = box;
    }
    });
   
    if (activeConfirmationBox) {
    const visibleConfirmButtons = getVisibleItems(activeConfirmationBox.querySelectorAll('.confirm-button'));
    if (isFirstConfirmationSelection && visibleConfirmButtons.length > 0) {
    const falseButtonIndex = visibleConfirmButtons.findIndex(button => button.classList.contains('false-button'));
    confirmButtonIndex = falseButtonIndex !== -1 ? falseButtonIndex : 0;
    isFirstConfirmationSelection = false; // Desativa após a primeira seleção
    } else if (confirmButtonIndex >= visibleConfirmButtons.length) {
    confirmButtonIndex = 0; // Garante que o índice não ultrapasse os limites
    } else if (confirmButtonIndex < 0) {
    confirmButtonIndex = visibleConfirmButtons.length - 1; // Volta ao último se for negativo
    }
   
    visibleConfirmButtons.forEach((button, index) => {
    button.classList.toggle('selected', index === confirmButtonIndex);
    });
    if (visibleConfirmButtons[confirmButtonIndex]) {
    visibleConfirmButtons[confirmButtonIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
    });
    }
    console.log(`Seleção em .confirm-button ${confirmButtonIndex} na confirmation-box ativa`);
    return true;
    } else {
    isFirstConfirmationSelection = true; // Reseta quando a confirmation-box sai
    }
    return false;
   }
   
   function clearSelection(items) {
    items.forEach(item => item.classList.remove('selected'));
   }
   
   function sendGamepadEventToIframe(eventData) {
    if (iframe.contentWindow) {
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
    const YPressed = gamepad.buttons[3].pressed;
    const selectPressed = gamepad.buttons[8].pressed;
    const verticalAxis = gamepad.axes[1];
    const upPressed = verticalAxis < -0.5;
    const downPressed = verticalAxis > 0.5;
    const horizontalAxis = gamepad.axes[0];
    const leftPressed = horizontalAxis < -0.5;
    const rightPressed = horizontalAxis > 0.5;
   
    const gamepadData = {
    LBPressed,
    RBPressed,
    XPressed,
    BPressed,
    YPressed,
    selectPressed,
    upPressed,
    downPressed,
    verticalAxis,
    horizontalAxis
    };
   
    const confirmationBoxes = document.querySelectorAll('.confirmation-box');
    let anyConfirmationBoxVisible = false;
    confirmationBoxes.forEach(box => {
    if (window.getComputedStyle(box).display === 'block') {
    anyConfirmationBoxVisible = true;
    if (isIframeActive) {
    sendGamepadEventToIframe({ ...gamepadData, clearSelection: true });
    isIframeActive = false;
    window.focus();
    console.log("Foco retornado à página principal devido a .confirmation-box visível");
    updateConfirmButtonSelection();
    }
    }
    });
   
    if (XPressed && !lastXState) {
    if (!isIframeActive && !anyConfirmationBoxVisible) {
    isIframeActive = true;
    iframe.focus();
    clearSelection(topMenuItems);
    clearSelection(sideMenuItems);
    console.log("Foco no iframe (botão X pressionado vindo da barra lateral)");
    sendGamepadEventToIframe({ 
    ...gamepadData, 
    XPressed: true, 
    initializeSelection: true
    });
    }
    }
   
    if (BPressed && !lastBState) {
    if (isIframeActive) {
    iframe.contentWindow.postMessage({
    type: 'gamepadEvent',
    data: { getSelectedIndex: true }
    }, window.location.origin);
    }
    sendGamepadEventToIframe({ ...gamepadData, clearSelection: true });
    isIframeActive = false;
    window.focus();
    const confirmationBox = document.querySelector('.confirmation-box');
    if (confirmationBox) confirmationBox.style.display = 'none';
    console.log("Foco retornando para a página principal (botão B pressionado)");
    if (!updateConfirmButtonSelection()) {
    if (isSideMenuActive) {
    updateSideMenuSelection(false);
    } else {
    updateTopMenuSelection(false);
    }
    }
    }
   
    if (isIframeActive) {
    sendGamepadEventToIframe(gamepadData);
    console.log("Enviando para iframe - Vertical:", verticalAxis, "Horizontal:", horizontalAxis);
    if (selectPressed && !lastSelectState) {
    sendGamepadEventToIframe({ ...gamepadData, SelectPressed: true });
    console.log("Botão Select pressionado, evento enviado para iframe");
    }
    } else if (anyConfirmationBoxVisible) {
    const activeConfirmationBox = Array.from(confirmationBoxes).find(box => window.getComputedStyle(box).display === 'block');
    if (activeConfirmationBox) {
    const visibleConfirmButtons = getVisibleItems(activeConfirmationBox.querySelectorAll('.confirm-button'));
    if (leftPressed && !lastLeftState && confirmButtonIndex > 0) {
    confirmButtonIndex--;
    updateConfirmButtonSelection();
    }
    if (rightPressed && !lastRightState && confirmButtonIndex < visibleConfirmButtons.length - 1) {
    confirmButtonIndex++;
    updateConfirmButtonSelection();
    }
   
    if (XPressed && !lastXState && visibleConfirmButtons[confirmButtonIndex]) {
    const rect = visibleConfirmButtons[confirmButtonIndex].getBoundingClientRect();
    console.log(`Botão X pressionado - Simulando clique em .confirm-button ${confirmButtonIndex}`);
    const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
    button: 0,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
    });
    visibleConfirmButtons[confirmButtonIndex].dispatchEvent(clickEvent);
   
    isIframeActive = true;
    iframe.focus();
    const restoreAppBlockIndex = sessionStorage.getItem('lastAppBlockIndex') ? parseInt(sessionStorage.getItem('lastAppBlockIndex')) : 0;
    const restoreGameButtonIndex = sessionStorage.getItem('lastGameButtonIndex') ? parseInt(sessionStorage.getItem('lastGameButtonIndex')) : 0;
    const restoreIsGameButtonSelected = sessionStorage.getItem('isGameButtonSelected') === 'true';
    sendGamepadEventToIframe({
    ...gamepadData,
    XPressed: true,
    initializeSelection: true,
    restoreAppBlockIndex: restoreAppBlockIndex,
    restoreGameButtonIndex: restoreGameButtonIndex,
    restoreIsGameButtonSelected: restoreIsGameButtonSelected
    });
    console.log(`Foco retornado ao iframe após clique em .confirm-button, restaurando ${restoreIsGameButtonSelected ? `.game-page-action-button ${restoreGameButtonIndex}` : `.app-block ${restoreAppBlockIndex}`}`);
    }
    }
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
    while (sideMenuIndex < sideMenuItems.length && window.getComputedStyle(sideMenuItems[sideMenuIndex]).display === 'none') {
    sideMenuIndex++;
    }
    if (sideMenuIndex < sideMenuItems.length) {
    updateSideMenuSelection();
    } else {
    console.warn("Nenhum item visível na barra lateral.");
    }
    } else {
    console.warn("Nenhum item disponível na barra lateral.");
    }
    } else {
    topMenuIndex = 0;
    clearSelection(sideMenuItems);
    if (topMenuItems.length > 0) {
    while (topMenuIndex < topMenuItems.length && window.getComputedStyle(topMenuItems[topMenuIndex]).display === 'none') {
    topMenuIndex++;
    }
    const visibleTopMenuItems = getVisibleItems(topMenuItems);
    topMenuIndex = visibleTopMenuItems.findIndex(item => item === topMenuItems[topMenuIndex]);
    if (topMenuIndex >= 0) {
    updateTopMenuSelection();
    } else {
    console.warn("Nenhum item visível na barra superior.");
    }
    } else {
    console.warn("Nenhum item disponível na barra superior.");
    }
    }
    }
   
    const visibleTopMenuItems = getVisibleItems(topMenuItems);
    const totalVisibleTopItems = visibleTopMenuItems.length;
   
    if (!isSideMenuActive) {
    if (LBPressed && !lastLBState && topMenuIndex > 0) {
    topMenuIndex--;
    updateTopMenuSelection();
    } else if (RBPressed && !lastRBState && topMenuIndex < totalVisibleTopItems - 1) {
    topMenuIndex++;
    updateTopMenuSelection();
    }
    } else if (LBPressed && !lastLBState) {
    isSideMenuActive = false;
    sessionStorage.setItem('sideMenuActive', isSideMenuActive);
    topMenuIndex = 0;
    clearSelection(sideMenuItems);
    const visibleTopMenuItems = getVisibleItems(topMenuItems);
    if (visibleTopMenuItems.length > 0) {
    updateTopMenuSelection();
    }
    } else if (RBPressed && !lastRBState) {
    isSideMenuActive = false;
    sessionStorage.setItem('sideMenuActive', isSideMenuActive);
    topMenuIndex = 0;
    clearSelection(sideMenuItems);
    const visibleTopMenuItems = getVisibleItems(topMenuItems);
    if (visibleTopMenuItems.length > 0) {
    updateTopMenuSelection();
    }
    }
   
    if (isSideMenuActive) {
    if (upPressed && !lastUpState && sideMenuIndex > 0) {
    sideMenuIndex--;
    while (sideMenuIndex >= 0 && window.getComputedStyle(sideMenuItems[sideMenuIndex]).display === 'none') {
    sideMenuIndex--;
    }
    if (sideMenuIndex >= 0) {
    updateSideMenuSelection();
    }
    } else if (downPressed && !lastDownState && sideMenuIndex < sideMenuItems.length - 1) {
    sideMenuIndex++;
    while (sideMenuIndex < sideMenuItems.length && window.getComputedStyle(sideMenuItems[sideMenuIndex]).display === 'none') {
    sideMenuIndex++;
    }
    if (sideMenuIndex < sideMenuItems.length) {
    updateSideMenuSelection();
    }
    }
    }
    }
   
    lastLBState = LBPressed;
    lastRBState = RBPressed;
    lastUpState = upPressed;
    lastDownState = downPressed;
    lastLeftState = leftPressed;
    lastRightState = rightPressed;
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
    .top-menu-item.selected, .block-apps.selected, .confirm-button.selected {
    background-color: #0078d7;
    color: white;
    outline: 2px solid yellow;
    }
   `;
   document.head.appendChild(style);