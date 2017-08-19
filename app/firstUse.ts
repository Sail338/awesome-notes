import * as fs from 'fs'
import * as electron from 'electron'

function checkPath(p:string){
   fs.stat('.firstuse.json', function(err, stat) {
    if(err == null) {
        //file DNE
        return;
    } else if(err.code == 'ENOENT') {
        // file does not exist

    } else {
        console.log('Some other error: ', err.code);
    }
    });
}
//open the first use page
function openFirstUseServer(){
    
}