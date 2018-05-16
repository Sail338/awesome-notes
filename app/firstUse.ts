import * as fs from 'fs'
import * as electron from 'electron'
import * as http from 'http'
import * as Store from 'electron-store'
import * as $ from 'jquery'
import {remote} from "electron"
var dialog = remote.dialog
function setCurrLanuage(lang:String){
    // set curr lanhuage equal to whatver we set
     let store = new Store();
     store.set('lang',lang)


    }

 $('#java').on('click', function () {
       setCurrLanuage("java")
       console.log(dialog.showSaveDialog({}))
    })
