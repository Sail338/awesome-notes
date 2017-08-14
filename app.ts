const electron = require('electron');
const Quill = require('Quill');
const Mousetrap = require('mousetrap');
const $ = require('jquery');
const fs = require('fs');
const pythonshell = require('python-shell');
const shell = require('shelljs')
declare var hljs: any;
shell.config.execPath = shell.which('node')
var quill_arr: any = [];
console.log(hljs.listLanguages())
hljs.configure({   // optionally configure hljs
	languages: ['java', 'python', 'c','haskell','javascript']
});
function createNewCodeBlock() {

	var div = document.createElement('div');
	var heading = document.createElement('h3');
	var notes = document.createElement('div');



	div.appendChild(notes);
	document.body.appendChild(notes);
	var basiceditor = new Quill(notes, {
		modules: {
			syntax: true             // Include syntax module
		},
		theme: 'bubble'
	});

	basiceditor.format('code-block', 'code-block');
	basiceditor.focus();
	bindKeys(basiceditor);
	bindCode(basiceditor, notes);
	quill_arr.push(basiceditor);
}


function createTextBlock() {

	var div = document.createElement('div');
	var heading = document.createElement('h3');
	var notes = document.createElement('div');



	div.appendChild(notes);
	document.body.appendChild(notes);
	var edit = new Quill(notes, {
		theme: 'bubble'
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
		save();
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
	code = code.replace(/[^\x00-\x7F]/g, "");
	console.log(hljs.highlightAuto(code));
	var lang = hljs.highlightAuto(code).language;
	console.log(lang)
	if (lang === 'python') {
		fs.writeFile(".python.py", code, (err: any) => {
			if (err) {
				console.error(err);
				return;
			};
			console.log("File has been created");
			var child = shell.exec('python .python.py').stdout;
			shell.exec('python .python.py', function (code, stdout, stderr) {


				console.log("reached hard")
				var heading = document.createElement('h1');
				heading.innerHTML = stdout;
				console.log(heading.innerHTML)
				notes.appendChild(heading)
			});
		});

	}
	else if (lang == 'java') {
		fs.writeFile("tmp.java", code, (err: any) => {
			if (err) {
				console.error(err);
				return;
			};

			shell.exec('javac tmp.java', function (code, stdout, stderr) {

				if (stderr) {
					alert("Error Occured: " + stderr)
					return;
				}



				shell.exec('java tmp', function (code, stdout, stderr) {


					console.log("reached hard")
					var heading = document.createElement('h1');
					heading.innerHTML = stdout;
					console.log(stdout)
					console.log(heading.innerHTML)
					notes.appendChild(heading)
				});


			});
		}

		)
	}

		else if (lang == 'haskell') {
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
				if(stdout){
					var heading = document.createElement('h1');
					heading.innerHTML = stdout;
					console.log(stdout)
					console.log(heading.innerHTML)
					notes.appendChild(heading)
				}

					

			});
		}

		)
	}

	
}



function bindCode(edit: any, notes: HTMLDivElement) {
	edit.keyboard.addBinding({
		key: 'j',
		metaKey: true,
		handler: function (range: any) {
			console.log("called")
			compileCode(edit.getText(), notes);
		}
	});

}


