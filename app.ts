const electron = require('electron');
var Quill  = require('Quill');
var Mousetrap = require('mousetrap');
hljs.configure({   // optionally configure hljs
  languages: ['javascript', 'ruby', 'python']
});
function createNewCodeBlock(){
	console.log("Caught command");

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
}

function createTextBlock(){
   var div = document.createElement('div');
		    var heading = document.createElement('h3');
		    var notes = document.createElement('div');



		div.appendChild(notes);
		document.body.appendChild(notes);
		    new Quill(notes, {
					      theme: 'snow'
					    });
}

Mousetrap.stopCallback = function () {
		     return false;
}



Mousetrap.bind('command+s', function() { createNewCodeBlock() });
Mousetrap.bind('command+t', function() { createTextBlock() });




