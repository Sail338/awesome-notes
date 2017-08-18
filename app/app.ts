
import * as electron from 'electron';
import * as Quill from 'Quill'
import * as Mousetrap from 'mousetrap' 
import * as $ from 'jquery'
import * as fs from 'fs'
import * as shell from 'shelljs'
import * as japa from "java-parser";
const langs: string[] = ['java', 'python', 'c', 'haskell', 'javascript']
declare var hljs: any;
shell.config.execPath = shell.which('node')
var quill_arr: any = [];


function compileAndRunPython(code: any, notes: HTMLDivElement) {
	fs.writeFile(".python.py", code, (err: any) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
		var child = shell.exec('python .python.py').stdout;
		shell.exec('python .python.py', function (code, stdout: string, stderr) {
			if (stderr) {
				alert("Error Occured:" + stderr);
			}

			appendToStdOut(stdout, notes);
		});
	});

}
function compileAndRunC(code: any, notes: HTMLDivElement) {
	fs.writeFile(".tmp.c", code, (err: any) => {
		if (err) {
			console.error(err);
			return;
		};


		shell.exec('gcc .tmp.c', function (code, stdout, stderr) {

			if (stderr) {
				alert("Error Occured: " + stderr)
				return;
			}



			shell.exec('./a.out', function (code, stdout, stderr) {


				appendToStdOut(stdout, notes);
			});


		});
	}

	)
}
function compileAndRunHaskell(code: any, notes: HTMLDivElement) {
	fs.writeFile(".tmp.hs", code, (err: any) => {
		if (err) {
			console.error(err);
			return;
		};

		shell.exec('runhaskell .tmp.hs', function (code, stdout, stderr) {

			if (stderr) {
				alert("Error Occured: " + stderr)
				return;
			}
			if (stdout) {
				appendToStdOut(stdout, notes);
			}



		});
	}

	)

}
function compileAndRunJava(code: any, notes: HTMLDivElement) {
	var jtree = japa.parse(code)
	console.log(jtree)
	var clasname = jtree.types[0].name.identifier;
	if (clasname === null) {
		alert("Invalid ClassName try again")
		return;
	}
	fs.writeFile(clasname + ".java", code, (err: any) => {
		if (err) {
			console.error(err);
			return;
		};


		shell.exec('javac ' + clasname + '.java', function (code, stdout, stderr) {

			if (stderr) {
				alert("Error Occured: " + stderr)
				return;
			}



			shell.exec('java ' + clasname, function (code, stdout, stderr) {


				appendToStdOut(stdout, notes);
			});


		});
	}

	)
}
function compileAndRunJavaScript(code: any, notes: HTMLDivElement) {

	fs.writeFile(".tmp.js", code, (err: any) => {
		if (err) {
			console.error(err);
			return;
		};

		shell.exec('node  .tmp.js', function (code, stdout, stderr) {

			if (stderr) {
				alert("Error Occured: " + stderr)
				return;
			}
			if (stdout) {
				appendToStdOut(stdout, notes);
			}



		});
	}

	)

}
function appendToStdOut(stdout: string, notes: HTMLDivElement) {
	if (stdout) {
				
		console.log("reached hard")
		var di = document.createElement("div")
		//var hr = document.createElement("hr")
		var out = document.createElement("h1")
		out.innerHTML = "Output:"
		di.appendChild(out);
		var div = document.createElement("div")
		out.appendChild(div)
	
		//di.appendChild(hr)
		notes.appendChild(di)
		
	
		var edit = new Quill(div, {
		theme: 'bubble'
	
		});
		edit.setText(stdout)
		edit.format('code',true)
		edit.format('code-block',true)

		edit.disable()
		notes.focus();

	


	}
		
}

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
		//save();
	});

}
function save() {
	var arrs = []
	for (var i = 0; i < quill_arr.length; i++) {
		var delta = quill_arr[i].getContents();
		arrs.push(delta);
		fs.writeFile("./.save.json", JSON.stringify(arrs), (err) => {
			if (err) {
				console.error(err);
				return;
			};
			console.log("File has been created");
		});



	}


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
		compileAndRunPython(code, notes)

	}
	else if (lang == 'java') {
		//get the word after class
		compileAndRunJava(code, notes)
	}

	else if (lang === 'haskell') {
		compileAndRunHaskell(code, notes)
	}
	else if (lang === 'c') {
		compileAndRunC(code, notes);
	}
	else if (lang === 'javascript') {
		compileAndRunJavaScript(code, notes);

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


