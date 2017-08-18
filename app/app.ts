
import * as electron from 'electron';
import * as Quill from 'Quill'
import * as Mousetrap from 'mousetrap' 
import * as $ from 'jquery'
import * as fs from 'fs'
import * as shell from 'shelljs'
import * as japa from "java-parser";
import * as http from 'http'
const compile = require('./compileHandler')
const langs: string[] = ['java', 'python', 'c', 'haskell', 'javascript']
declare var hljs: any;
shell.config.execPath = shell.which('node')
var quill_arr: any = [];
hljs.configure({   // optionally configure hljs
	languages: langs
});
function createNewCodeBlock() {


	var notes = document.createElement('div');

	//notes.setAttribute("id",'code')


	document.body.appendChild(notes);
	var basiceditor = new Quill(notes, {
		modules: {
			syntax: true ,
			toolbar:false            // Include syntax module
		},
		theme: 'bubble'
	});

	basiceditor.format('code-block', true);
	basiceditor.focus();
	bindKeys(basiceditor);
	bindCode(basiceditor, notes);
	quill_arr.push(basiceditor);
}


function createTextBlock() {



	var notes = document.createElement('div');


	
	
	document.body.appendChild(notes);
	var edit = new Quill(notes, {
		theme: 'snow',
		  "modules": {
     		 "toolbar": false
  		}
	});
	edit.focus();
	bindKeys(edit);

	quill_arr.push(edit);

}

Mousetrap.stopCallback = function () {
	return false;
}



Mousetrap.bind('command+s', function () {
	createNewCodeBlock()
});
Mousetrap.bind('command+t', function () {

	createTextBlock()
});


function bindKeys(edit: any) {
	var timeout;
	edit.keyboard.addBinding({
		key: 'escape',
		handler: function (range: any) {
			console.log("clicking body");
			edit.blur();
		}


	});

	edit.keyboard.addBinding({
		key: 's',
		metaKey: true,
		handler: function (range: any) {
			createNewCodeBlock();
		}


	});

	edit.keyboard.addBinding({
		key: 't',
		metaKey: true,
		handler: function (range) {
			createTextBlock();
		}


	});
	edit.on('text-change', function (delta, source) {
		//call save on a timeout
		 if (timeout) clearTimeout(timeout);
    timeout = setTimeout(function () {
		save();
    }, 750);
		
	});

}
function save() {
	var arrs = []
	for (var i = 0; i < quill_arr.length; i++) {
		var delta = quill_arr[i].getContents();
		arrs.push(delta);
	}
	//push arrs to the server
	//http post
	var options = {
   		hostname: 'localhost',
 		 port:4567,
		  path: '/data',
		  method: 'POST',
 		 headers: {
    'Content-Type': 'application/json',
    	
 	 }
};
var req = http.request(options, (res) => {
  res.setEncoding('utf8');
	console.log("making request")
 
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);

});





// write data to request body
req.write(JSON.stringify(arrs));
req.end();

}
$('#savebutton').on('click', function () {
	save();
});

//this functions compiles a selection of code
function compileCode(code: any, notes: HTMLDivElement) {
	console.log(code)
	var lang = "";

	code = code.replace(/[^\x00-\x7F]/g, "");
	var firstline: string = code.split('\n')[0];
	lang = parseFirstLine(firstline);
	console.log(firstline);

	if (lang === "") {
		lang = hljs.highlightAuto(code).language;
	}
	console.log(lang)
	if (lang === 'python') {
		
		compile.compileAndRunPython(code, notes)

	}
	else if (lang == 'java') {
		//get the word after class
		compile.compileAndRunJava(code, notes)
	}

	else if (lang === 'haskell') {
		compile.compileAndRunHaskell(code, notes)
	}
	else if (lang === 'c') {
		compile.compileAndRunC(code, notes);
	}
	else if (lang === 'javascript') {
		compile.compileAndRunJavaScript(code, notes);

	}


}



function bindCode(edit: any, notes: HTMLDivElement) {
	edit.keyboard.addBinding({
		key: 'j',
		metaKey: true,
		handler: function (range: any) {
			compileCode(edit.getText(), notes);
		}
	});

}

function parseFirstLine(inputStr: string) {
	const comments: string[] = ['\//', '#', '--']
	var doesFirstLineContain: boolean = false;
	for (var j = 0; j < comments.length; j++) {
		console.log(comments[j])
		if (inputStr.includes(comments[j])) {

			doesFirstLineContain = true;
		}
	}
	if (doesFirstLineContain === false) {
		return "";
	}
	console.log("got here")
	for (var i = 0; i < langs.length; i++) {
		if (inputStr.includes(langs[i])) {

			if (inputStr.includes('java') && !inputStr.includes('javascript')) {
				return 'java'
			}
			else if (inputStr.includes('javascript')) {
				console.log("saw js")
				return 'javascript'
			}
			else {
				return langs[i];
			}
		}
	}

	return "";

}


