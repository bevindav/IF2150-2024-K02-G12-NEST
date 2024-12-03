const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sayHello: () => console.log('Hello from Electron!'),
});
