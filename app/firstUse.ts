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
/**
 * navigates to the sign in page if its first use
 */
//open the first use page
function openFirstUseServer(){
     
}