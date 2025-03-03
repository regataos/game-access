let selectedIndex = 0;
let gameButtonIndex = 0;
let columnsPerRow = 0;
let lastUpState = false;
let lastDownState = false;
let lastLeftState = false;
let lastRightState = false;
let lastXState = false;
let lastSelectState = false;
let lastYState = false;
let isGameButtonSelected = false;
let justInitialized = false;

function getVisibleItems(selector) {
    return Array.from(document.querySelectorAll(selector)).filter(item => {
        let parentHidden = false;
        let parent = item.parentElement;
        while (parent) {
            if (window.getComputedStyle(parent).display === 'none') {
                parentHidden = true;
                break;
            }
            parent = parent.parentElement;
        }
        return !parentHidden && window.getComputedStyle(item).display !== 'none';
    });
}

function calculateColumnsPerRow(visibleAppBlocks) {
    if (visibleAppBlocks.length <= 1) return visibleAppBlocks.length;
    const firstRowY = visibleAppBlocks[0].getBoundingClientRect().top;
    let colCount = 0;
    for (let i = 0; i < visibleAppBlocks.length; i++) {
        if (visibleAppBlocks[i].getBoundingClientRect().top === firstRowY) {
            colCount++;
        } else {
            break;
        }
    }
    return colCount;
}

function updateSelection() {
    const visibleAppBlocks = getVisibleItems('.app-block');
    const visibleGameButtons = getVisibleItems('.game-page-action-button');

    visibleAppBlocks.forEach(block => {
        block.classList.remove('selected');
        const children = block.querySelectorAll('.block-play, .play-box-universal, .install-box-universal');
        children.forEach(child => {
            child.style.opacity = '';
        });
    });
    visibleGameButtons.forEach(button => button.classList.remove('selected'));

    let selectedElement = isGameButtonSelected ? visibleGameButtons[gameButtonIndex] : visibleAppBlocks[selectedIndex];
    if (selectedElement) {
        selectedElement.classList.add('selected');
        if (!isGameButtonSelected) {
            const children = selectedElement.querySelectorAll('.block-play, .play-box-universal, .install-box-universal');
            children.forEach(child => {
                child.style.opacity = '1';
            });
            sessionStorage.setItem('lastAppBlockIndex', selectedIndex);
        } else {
            sessionStorage.setItem('lastGameButtonIndex', gameButtonIndex);
        }
        sessionStorage.setItem('isGameButtonSelected', isGameButtonSelected.toString());
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    console.log(`Item selecionado no iframe: ${isGameButtonSelected ? `.game-page-action-button ${gameButtonIndex}` : `app-block ${selectedIndex}`}`);
}

function clearSelection() {
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    console.log("Seleção removida ao perder o foco");
}

// Limpa o sessionStorage ao mudar de página
window.addEventListener('unload', () => {
    sessionStorage.clear();
    console.log("SessionStorage limpo ao mudar de página (evento unload)");
});

// Define o estado inicial ao carregar a página
window.addEventListener('load', () => {
    if (!sessionStorage.getItem('lastAppBlockIndex')) {
        selectedIndex = 0;
        isGameButtonSelected = false;
        gameButtonIndex = 0;
        justInitialized = true;
        updateSelection();
        console.log("Página carregada com sessionStorage vazio: Selecionado o primeiro .app-block (índice 0)");
    }
});

window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'gamepadEvent') {
        const { upPressed, downPressed, XPressed, SelectPressed, horizontalAxis, verticalAxis, initializeSelection, clearSelection: clearSignal, YPressed, getSelectedIndex, restoreAppBlockIndex, restoreGameButtonIndex, restoreIsGameButtonSelected } = event.data.data;

        console.log("Evento recebido no iframe:", { initializeSelection, clearSignal, SelectPressed, YPressed, getSelectedIndex, restoreAppBlockIndex, restoreGameButtonIndex, restoreIsGameButtonSelected });

        const visibleAppBlocks = getVisibleItems('.app-block');
        const visibleGameButtons = getVisibleItems('.game-page-action-button');
        columnsPerRow = calculateColumnsPerRow(visibleAppBlocks);

        if (getSelectedIndex) {
            const lastAppBlockIndex = sessionStorage.getItem('lastAppBlockIndex') || selectedIndex;
            const lastGameButtonIndex = sessionStorage.getItem('lastGameButtonIndex') || gameButtonIndex;
            const lastIsGameButtonSelected = sessionStorage.getItem('isGameButtonSelected') === 'true';
            window.parent.postMessage({
                type: 'selectedIndexResponse',
                data: { 
                    selectedAppBlockIndex: parseInt(lastAppBlockIndex),
                    selectedGameButtonIndex: parseInt(lastGameButtonIndex),
                    isGameButtonSelected: lastIsGameButtonSelected
                }
            }, window.location.origin);
            console.log(`Enviando índices ao sair - .app-block: ${lastAppBlockIndex}, .game-page-action-button: ${lastGameButtonIndex}, isGameButtonSelected: ${lastIsGameButtonSelected}`);
            return;
        }

        if (initializeSelection && visibleAppBlocks.length > 0) {
            // Sempre prioriza o último .app-block selecionado ao entrar em foco, a menos que o sessionStorage esteja vazio
            const lastAppBlockIndex = sessionStorage.getItem('lastAppBlockIndex') ? parseInt(sessionStorage.getItem('lastAppBlockIndex')) : 0;
            selectedIndex = lastAppBlockIndex < visibleAppBlocks.length ? lastAppBlockIndex : 0;
            gameButtonIndex = restoreGameButtonIndex !== undefined && restoreGameButtonIndex < visibleGameButtons.length ? restoreGameButtonIndex : 0;
            isGameButtonSelected = false; // Força a navegação para começar em .app-block
            justInitialized = true;
            updateSelection();
            console.log(`Foco recebido no iframe: Seleção restaurada para .app-block ${selectedIndex} (prioridade máxima)`);
            return;
        }

        if (clearSignal) {
            clearSelection();
            console.log("Seleção limpa ao perder o foco, mantendo sessionStorage intacto");
            justInitialized = false;
            return;
        }

        const leftPressed = horizontalAxis < -0.5;
        const rightPressed = horizontalAxis > 0.5;
        const upPressedAdjusted = verticalAxis < -0.5;
        const downPressedAdjusted = verticalAxis > 0.5;

        if (SelectPressed && !lastSelectState) {
            if (visibleGameButtons.length > 0) {
                isGameButtonSelected = !isGameButtonSelected;
                sessionStorage.setItem('isGameButtonSelected', isGameButtonSelected.toString());
                updateSelection();
            } else {
                console.log("Botão Select ignorado: Nenhum .game-page-action-button visível encontrado.");
            }
        }

        if (isGameButtonSelected) {
            if (leftPressed && !lastLeftState && gameButtonIndex > 0) {
                gameButtonIndex--;
                updateSelection();
            }
            if (rightPressed && !lastRightState && gameButtonIndex < visibleGameButtons.length - 1) {
                gameButtonIndex++;
                updateSelection();
            }
        } else {
            if (upPressedAdjusted && !lastUpState && selectedIndex > 0) {
                const currentRect = visibleAppBlocks[selectedIndex].getBoundingClientRect();
                let closestAbove = null;
                let minDistance = Infinity;
                for (let i = 0; i < selectedIndex; i++) {
                    const rect = visibleAppBlocks[i].getBoundingClientRect();
                    if (rect.bottom <= currentRect.top) {
                        const distance = Math.abs(rect.left - currentRect.left) + (currentRect.top - rect.bottom);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestAbove = i;
                        }
                    }
                }
                if (closestAbove !== null) {
                    selectedIndex = closestAbove;
                    updateSelection();
                }
            }
            if (downPressedAdjusted && !lastDownState && selectedIndex < visibleAppBlocks.length - 1) {
                const currentRect = visibleAppBlocks[selectedIndex].getBoundingClientRect();
                let closestBelow = null;
                let minDistance = Infinity;
                for (let i = selectedIndex + 1; i < visibleAppBlocks.length; i++) {
                    const rect = visibleAppBlocks[i].getBoundingClientRect();
                    if (rect.top >= currentRect.bottom) {
                        const distance = Math.abs(rect.left - currentRect.left) + (rect.top - currentRect.bottom);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestBelow = i;
                        }
                    }
                }
                if (closestBelow !== null) {
                    selectedIndex = closestBelow;
                    updateSelection();
                }
            }
            if (leftPressed && !lastLeftState && selectedIndex > 0) {
                selectedIndex--;
                updateSelection();
            }
            if (rightPressed && !lastRightState && selectedIndex < visibleAppBlocks.length - 1) {
                selectedIndex++;
                updateSelection();
            }

            if (YPressed && !lastYState && visibleAppBlocks[selectedIndex]) {
                const appBlock = visibleAppBlocks[selectedIndex];
                const removeButton = appBlock.querySelector('.remove-game-button');
                const moreButton = appBlock.querySelector('.morefor-game-button');
                let targetButton = removeButton || moreButton;
                if (targetButton) {
                    const rect = targetButton.getBoundingClientRect();
                    console.log(`Botão Y pressionado - Simulando clique em ${removeButton ? '.remove-game-button' : '.morefor-game-button'} no app-block ${selectedIndex}`);
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 0,
                        clientX: rect.left + rect.width / 2,
                        clientY: rect.top + rect.height / 2
                    });
                    targetButton.dispatchEvent(clickEvent);
                }
            }
        }

        if (XPressed && !lastXState) {
            let targetElement;
            if (isGameButtonSelected) {
                targetElement = visibleGameButtons[gameButtonIndex];
            } else {
                const appBlock = visibleAppBlocks[selectedIndex];
                if (!justInitialized) {
                    const installBox = appBlock.querySelector('.install-box-universal');
                    const playBox = appBlock.querySelector('.play-box-universal');
                    targetElement = installBox || playBox;
                    if (!targetElement) {
                        targetElement = appBlock;
                        console.log(`Botão X pressionado - Nenhum .install-box-universal ou .play-box-universal encontrado, clicando no app-block ${selectedIndex}`);
                    }
                } else {
                    targetElement = null;
                    console.log(`Botão X ignorado na inicialização do iframe`);
                }
            }

            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                console.log(`Botão X pressionado - Simulando clique em ${isGameButtonSelected ? '.game-page-action-button' : (targetElement.classList.contains('install-box-universal') ? '.install-box-universal' : targetElement.classList.contains('play-box-universal') ? '.play-box-universal' : '.app-block')} ${isGameButtonSelected ? gameButtonIndex : selectedIndex}`);
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                });
                targetElement.dispatchEvent(clickEvent);
            }
            justInitialized = false;
        }

        lastUpState = upPressedAdjusted;
        lastDownState = downPressedAdjusted;
        lastLeftState = leftPressed;
        lastRightState = rightPressed;
        lastXState = XPressed;
        lastSelectState = SelectPressed;
        lastYState = YPressed;
    }
});

document.head.insertAdjacentHTML('beforeend', `
    <style>
        .app-block.selected, .game-page-action-button.selected {
            background-color: #0078d7;
            color: white;
            outline: 2px solid yellow;
        }
    </style>
`);