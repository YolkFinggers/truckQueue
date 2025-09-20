const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const os = require('os');

let assignWin;
let displayWin;

function createWindows() {
  const displays = screen.getAllDisplays();
  const primary = displays[0];
  let secondary;
  if (displays.length < 2) {
    console.warn('Only one monitor detected. Display window will open on the same monitor as assign window.');
    // Place displayWin offset from assignWin to avoid overlap
    secondary = {
      bounds: {
    webPreferences: { contextIsolation: true, nodeIntegration: false },
        y: primary.bounds.y + 50,
        width: primary.bounds.width,
        height: primary.bounds.height
      }
    };
  } else {
    secondary = displays[1];
  }

  // Assign window (maximized)
  assignWin = new BrowserWindow({
    fullscreen: false,
    show: false,
    webPreferences: { contextIsolation: true },
  });
  assignWin.loadFile(path.join(__dirname, 'src', 'index.html'));
  
  assignWin.once('ready-to-show', () => {
  assignWin.maximize(); // maximize window
  assignWin.show();     // then show it
});

  // Display window (kiosk on second monitor)
  displayWin = new BrowserWindow({
    x: secondary.bounds.x,
    y: secondary.bounds.y,
    width: secondary.bounds.width,
    height: secondary.bounds.height,
    kiosk: true,
    frame: false,
    webPreferences: { contextIsolation: true },
  });
  displayWin.loadFile(path.join(__dirname, 'src', 'display.html'));
}

function enableAutoStart() {
  const platforms = ['win32', 'darwin', 'linux'];
  if (platforms.includes(process.platform)) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: process.execPath, // current Electron executable
    });
  }
}

app.whenReady().then(() => {
  enableAutoStart();
  createWindows();
});

app.setPath('userData', path.join(os.homedir(), 'TruckQueueAppData'));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
