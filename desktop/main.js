const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#18181b', // Clean dark VS Code / Zinc
    title: 'HermesShield — DevSecOps Copilot',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#18181b',
      symbolColor: '#a1a1aa',
      height: 36,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC: Select project folder from host OS
ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Project Directory to Audit',
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const folderPath = result.filePaths[0];
  const folderName = path.basename(folderPath);

  // Scan folder (and immediate subdirectories like backend/frontend) for manifests
  const manifestNames = [
    'requirements.txt',
    'package.json',
    'Pipfile',
    'pyproject.toml',
    'go.mod',
    'pom.xml',
    'Cargo.toml',
    'project_titan_manifest.json',
    'apollo_service_manifest.json',
  ];

  const ignoreDirs = ['node_modules', '.git', '.venv', 'venv', 'dist', 'build', '.next', '.idea', '.vscode'];

  let detectedFiles = [];
  let combinedContext = `Project Name: ${folderName}\nProject Path: ${folderPath}\n`;

  function scanDir(dir, depth = 0) {
    if (depth > 2) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!ignoreDirs.includes(entry.name)) {
            scanDir(path.join(dir, entry.name), depth + 1);
          }
        } else if (entry.isFile() && manifestNames.includes(entry.name)) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.relative(folderPath, fullPath);
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            detectedFiles.push({ name: relPath, path: fullPath, size: content.length });
            combinedContext += `\n--- [FILE: ${relPath}] ---\n${content.slice(0, 5000)}\n`;
          } catch (readErr) {
            console.warn(`Could not read ${relPath}:`, readErr.message);
          }
        }
      }
    } catch (err) {
      console.warn('Scan error in', dir, err.message);
    }
  }

  scanDir(folderPath, 0);

  return {
    folderPath,
    folderName,
    detectedFiles,
    combinedContext: combinedContext.trim() || `Project Directory: ${folderPath}`,
  };
});

// IPC: Save report to disk
ipcMain.handle('dialog:saveReport', async (event, { content, defaultName }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName || 'security-briefing.md',
    filters: [{ name: 'Markdown', extensions: ['md'] }, { name: 'Text', extensions: ['txt'] }],
  });

  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content, 'utf8');
    return { success: true, filePath: result.filePath };
  }
  return { success: false };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
