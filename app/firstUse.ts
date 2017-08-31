import * as fs from 'fs'
import * as electron from 'electron'
import * as http from 'http'
exports.checkPath = function (p: string) {
  fs.stat('.firstuse.json', function (err, stat) {
    if (err == null) {
      
      return;
    } else if (err.code == 'ENOENT') {
      // file does not exist
      openFirstUse();
    } else {
      console.log('Some other error: ', err.code);
    }
  });
}
/**
 * navigates to the sign in page if its first use
 */
//open the first use page
function openFirstUse() {
  let mainWindow;
  createWindow();

}
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
  mainWindow.openDevTools();
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'firstUse.html'),
    protocol: 'file:',
    slashes: true
  }))


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}



function sendLoginForm(event){
    event.preventDefault();
    let form = document.getElementById("loginform");
    electron.ipcRenderer.send('form-submission',form)
}

electron.ipcMain.on('form-submission', function (event, form) {
    //make a post request
    	const options = {
   		hostname: 'localhost',
 		  port:4567,
		  path: '/firstuse',
		  method: 'POST',
 		 headers: {
    'Content-Type': 'multipart/form-data',
    	
 	 }
};
const req = http.request(options, (res) => {
  res.setEncoding('utf8');
	console.log("making request")
 
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);

});





// write data to request body
req.write(form);
req.end();
});