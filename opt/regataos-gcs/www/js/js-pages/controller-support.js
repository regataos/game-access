let selectedIndex = 0;
let appBlocks = document.querySelectorAll('.app-block');
let columnsPerRow = 0;
let lastUpState = false;
let lastDownState = false;
let lastLeftState = false;
let lastRightState = false;
let lastXState = false;

function calculateColumnsPerRow() {
    if (appBlocks.length <= 1) return appBlocks.length;

    const firstRowY = appBlocks[0].getBoundingClientRect().top;
    let colCount = 0;
    for (let i = 0; i < appBlocks.length; i++) {
        if (appBlocks[i].getBoundingClientRect().top === firstRowY) {
            colCount++;
        } else {
            break;
        }
    }
    return colCount;
}

function updateSelection() {
    appBlocks.forEach((block, index) => {
        block.classList.toggle('selected', index === selectedIndex);
    });
    if (appBlocks[selectedIndex]) {
        appBlocks[selectedIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
    console.log(`Item selecionado no iframe: ${selectedIndex} (Linha: ${Math.floor(selectedIndex / columnsPerRow)}, Coluna: ${selectedIndex % columnsPerRow})`);
}

function clearSelection() {
    appBlocks.forEach(block => block.classList.remove('selected'));
    console.log("Seleção removida no iframe ao perder o foco");
}

window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'gamepadEvent') {
        const { upPressed, downPressed, XPressed, horizontalAxis, verticalAxis, initializeSelection, clearSelection: clearSignal } = event.data.data;

        console.log("Evento recebido no iframe:", { initializeSelection, clearSignal }); // Log para depuração

        appBlocks = document.querySelectorAll('.app-block');
        columnsPerRow = calculateColumnsPerRow();

        if (initializeSelection && appBlocks.length > 0) {
            selectedIndex = 0;
            updateSelection();
            console.log("Foco inicial no primeiro item do iframe");
        }

        if (clearSignal) {
            clearSelection();
            return;
        }

        const leftPressed = horizontalAxis < -0.5;
        const rightPressed = horizontalAxis > 0.5;
        const upPressedAdjusted = verticalAxis < -0.5;
        const downPressedAdjusted = verticalAxis > 0.5;

        if (upPressedAdjusted && !lastUpState && selectedIndex >= columnsPerRow) {
            selectedIndex -= columnsPerRow;
            updateSelection();
        }
        if (downPressedAdjusted && !lastDownState && selectedIndex < appBlocks.length - columnsPerRow) {
            selectedIndex += columnsPerRow;
            if (selectedIndex >= appBlocks.length) selectedIndex = appBlocks.length - 1;
            updateSelection();
        }
        if (leftPressed && !lastLeftState && selectedIndex > 0) {
            selectedIndex--;
            updateSelection();
        }
        if (rightPressed && !lastRightState && selectedIndex < appBlocks.length - 1) {
            selectedIndex++;
            updateSelection();
        }

        if (XPressed && !lastXState && appBlocks.length > 0) {
            console.log(`Botão X pressionado - Clicando no item ${selectedIndex}`);
            appBlocks[selectedIndex].click();
        }

        lastUpState = upPressedAdjusted;
        lastDownState = downPressedAdjusted;
        lastLeftState = leftPressed;
        lastRightState = rightPressed;
        lastXState = XPressed;
    }
});

const style = document.createElement('style');
style.textContent = `
    .app-block.selected {
        background-color: #0078d7;
        color: white;
        outline: 2px solid yellow;
    }
`;
document.head.appendChild(style);

if (appBlocks.length > 0) {
    columnsPerRow = calculateColumnsPerRow();
    updateSelection();
}