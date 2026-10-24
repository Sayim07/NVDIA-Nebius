const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hermesDesktop', {
  selectDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  saveReport: (payload) => ipcRenderer.invoke('dialog:saveReport', payload),
});
