const electron = require('electron');
var Quill  = require('Quill');
var Mousetrap = require('mousetrap');
var $ = require('jquery');
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
		
		basiceditor.keyboard.addBinding({
			key:'escape',
			handler: function(range) {
				console.log("clicking body");
		    	basiceditor.blur();
		}


		});

		basiceditor.keyboard.addBinding({
		key:'s',
		metaKey:true,
		handler: function(range) {
				createNewCodeBlock();
		}


		});

		basiceditor.keyboard.addBinding({
		key:'t',
		metaKey:true,
		handler: function(range) {
				createTextBlock();
		}


		});
		 
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

Mousetrap.stopCallback = function () {
		     return false;
}



Mousetrap.bind('command+s', function() {
		createNewCodeBlock()
});
Mousetrap.bind('command+t', function() {
		
		createTextBlock() });




