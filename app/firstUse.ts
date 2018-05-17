import * as fs from 'fs'
import * as electron from 'electron'
import * as http from 'http'
import * as Store from 'electron-store'
import * as $ from 'jquery'
import {remote} from "electron"
import * as url from 'url'
import * as path from 'path'
var dialog = remote.dialog
function setCurrLanuage(lang:String){
    // set curr lanhuage equal to whatver we set
     let store = new Store();
     store.set('lang',lang)


    }
function showDialogAndSave(){

       let options = {
       }
       dialog.showSaveDialog(options, (filename) =>{
                console.log(filename);
                
                let store = new Store()
                store.set("currfile",filename)
                remote.getCurrentWindow().loadURL(url.format({
                    pathname: path.join(__dirname, 'index.html'),
                    protocol: 'file:',
                    slashes: true
                  }))
       
    })
}

 $('#java').on('click', function () {
       setCurrLanuage("java")
       showDialogAndSave()
       
        
 })
