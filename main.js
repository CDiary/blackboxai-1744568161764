const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false // Allow loading local resources
        }
    });

    // Load the login page
    mainWindow.loadFile(path.join(__dirname, 'src', 'pages', 'login.html'));

    // Enable remote module
    require('@electron/remote/main').initialize();
    require('@electron/remote/main').enable(mainWindow.webContents);

    // Open the DevTools in development mode.
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handle any errors that occur
process.on('uncaughtException', (error) => {
    console.error('An error occurred:', error);
});
