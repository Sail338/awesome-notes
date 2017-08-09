const electron = require('electron');
var Quill  = require('Quill');
var Mousetrap = require('mousetrap');
var $ = require('jquery');
const fs = require('fs');
var quill_arr = [];
function createNewCodeBlock(){
	
   var div = document.createElement('div');
		    var heading = document.createElement('h3');
		    var notes = document.createElement('div');



		div.appendChild(notes);
		document.body.appendChild(notes);
	var basiceditor  = new Quill(notes, {
 	 modules: {
   	 syntax: true             // Include syntax module
 	 },
 	 theme: 'bubble'
	});
	basiceditor.format('code-block','code-block');
	basiceditor.focus();
	bindKeys( basiceditor);		
	quill_arr.push(basiceditor);
}


function createTextBlock(){
	
		    var div = document.createElement('div');
		    var heading = document.createElement('h3');
		    var notes = document.createElement('div');



		div.appendChild(notes);
		document.body.appendChild(notes);
		  var edit =   new Quill(notes, {
					      theme: 'bubble'
		  });
		edit.focus();
		bindKeys(edit);
		quill_arr.push(edit);
		 
}

Mousetrap.stopCallback = function () {
		     return false;
}



Mousetrap.bind('command+s', function() {
		createNewCodeBlock()
});
Mousetrap.bind('command+t', function() {
		
		createTextBlock() });


function bindKeys(edit){
	 
		edit.keyboard.addBinding({
			key:'escape',
			handler: function(range) {
				console.log("clicking body");
		    	edit.blur();
		}


		});

		edit.keyboard.addBinding({
		key:'s',
		metaKey:true,
		handler: function(range) {
				createNewCodeBlock();
		}


		});

		edit.keyboard.addBinding({
		key:'t',
		metaKey:true,
		handler: function(range) {
				createTextBlock();
		}


		});

}
function save(){
		var arrs = []
		for(var i=0; i<quill_arr.length;i++){
			var delta = quill_arr[i].getContents();
			arrs.push(delta);
			fs.writeFile("./object.json", JSON.stringify(arrs), (err) => {
		    if (err) {
        		console.error(err);
        		return;
    		};
  		  	console.log("File has been created");
			});



		}


}
$('#savebutton').on('click', function() {
		save();
});
