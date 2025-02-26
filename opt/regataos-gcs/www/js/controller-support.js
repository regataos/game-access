// Global Variables
let loopStarted = false;
let buttonsState = [];
let axesState = [false, false];

// Starting listeners to get when gamepad is connected or disconnected
window.addEventListener('gamepaddisconnected', () => {
  console.info("Gamepad Disconnected");
  loopStarted = false;
})

window.addEventListener('gamepadconnected', () => {
  console.info("Gamepad Connected");

  if (!loopStarted) {
    const gamepad = navigator.getGamepads()[0];

    if (buttonsState.length === 0) {
      axesState = [false, false];
      buttonsState = new Array(gamepad.buttons.length).fill(false);
    }

    requestAnimationFrame(startGamepadSupport)
    loopStarted = true;
  }
})

// Functions to handle gamepad behaviour, such as button pressing
function startGamepadSupport() {
  const gamepad = navigator.getGamepads()[0];

  if (!gamepad) {
    loopStarted = false;
    return;
  }

  for (const [i, button] of gamepad.buttons.entries()) {
    if (button.pressed && !buttonsState[i]) {
      handleButtonPress(getPressedButton(i));
      buttonsState[i] = true;
    } else if (!button.pressed && buttonsState[i]) {
      buttonsState[i] = false;
    }
  }

  const xAxis = gamepad.axes[0];
  const yAxis = gamepad.axes[1];

  if (!axesState[0] && (xAxis > 0.5 || xAxis < -0.5)) {
    // If the axis is being used, mimic a button press
    const mimicButton = getPressedButton(xAxis > 0.5 ? 15 : 14); // 15 = D-Right, 14 = D-Left
    handleButtonPress(mimicButton);
    axesState[0] = true;
  } else if (axesState[0] && (xAxis >= -0.5 && xAxis <= 0.5)) {
    axesState[0] = false;
  }

  // Handle Y-axis (up/down)
  if (!axesState[1] && (yAxis > 0.5 || yAxis < -0.5)) {
    // If the axis is being used, mimic a button press
    const mimicButton = getPressedButton(yAxis > 0.5 ? 13 : 12); // 13 = D-Down, 12 = D-Up
    handleButtonPress(mimicButton);
    axesState[1] = true;
  } else if (axesState[1] && (yAxis >= -0.5 && yAxis <= 0.5)) {
    axesState[1] = false;
  }

  if (loopStarted) {
    requestAnimationFrame(startGamepadSupport)
  }
}

function getPressedButton(indexButton) {
  // Dpad Buttons
  if (indexButton === 12) return 'D-Up';
  if (indexButton === 13) return 'D-Down';
  if (indexButton === 14) return 'D-Left';
  if (indexButton === 15) return 'D-Right';

  // Action Buttons
  if (indexButton === 0) return 'A';
  if (indexButton === 1) return 'B';
  if (indexButton === 2) return 'X';
  if (indexButton === 3) return 'Y';

  // Triggers
  if (indexButton === 4) return 'LB';
  if (indexButton === 5) return 'RB';
  if (indexButton === 6) return 'LT';
  if (indexButton === 7) return 'RT';

  return ''
}

function handleButtonPress(pressedButton) {
  if (pressedButton === 'LB' || pressedButton === 'RB') changeTab(pressedButton);
}

// Functions to make the buttons do something
function changeTab(pressedButton) {
  const topMenu = document.querySelector('#top-menu');
  const currentPage = topMenu.querySelector('.current');
  const currentTab = currentPage.parentNode;

  let targetTab = pressedButton === 'LB' ? currentTab.previousElementSibling : currentTab.nextElementSibling;
  if (!targetTab) return;

  while (targetTab.style.display === 'none') {
    targetTab = pressedButton === 'LB' ? targetTab.previousElementSibling : targetTab.nextElementSibling;
  }

  targetTab.querySelector('a').click();
}