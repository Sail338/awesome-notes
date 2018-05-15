import * as fs from 'fs'
import * as electron from 'electron'
import * as http from 'http'
import * as Store from 'electron-store'
function setCurrLanuage(lang:String){
    // set curr lanhuage equal to whatver we set
     const store = new Store();
     store.set('lang',lang)

}
