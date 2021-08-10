// Get the current window
var win = nw.Window.get();

// Listen to the minimize event
win.on('minimize', function() {
  console.log('Window is minimized');
});

// Minimize the window
win.minimize();

// Unlisten the minimize event
win.removeAllListeners('minimize');
