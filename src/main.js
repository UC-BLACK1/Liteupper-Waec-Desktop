const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require("electron-updater");

let mainWindow;
let splashScreen;

app.on('ready', () => {
  // Create the splash screen window
  splashScreen = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    icon: path.join(app.getAppPath(), 'icon.png') // Ensure icon path is correct
  });

  splashScreen.loadFile(path.join(__dirname, 'splash.html'));

  // Create the main window but keep it hidden
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    icon: path.join(app.getAppPath(), 'icon.png'), // Ensure icon path is correct
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'Subjects.html'));

  autoUpdater.checkForUpdatesAndNotify();

  // Wait for the main window to finish loading before hiding splash
  mainWindow.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      splashScreen.close();
      mainWindow.show();
    }, 2000); // Ensures splash is visible for at least 2s
  });
});

autoUpdater.on("update-available", () => {
  console.log("Update available! Downloading...");
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded. Installing...");
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
