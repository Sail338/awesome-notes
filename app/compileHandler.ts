//Handles the compilation and running of all file
import * as shell from 'shelljs'
import * as fs from 'fs'
import * as Quill from 'Quill'
import * as japa from "java-parser";
exports.compileAndRunPython = function (code: any, notes: HTMLDivElement) {
	fs.writeFile(".python.py", code, (err: any) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
		const child = shell.exec('python .python.py').stdout;
		shell.exec('python .python.py', function (code, stdout: string, stderr) {
			if (stderr) {
				alert("Error Occured:" + stderr);
			}

            appendToStdOut(stdout, notes);
        
		});
	});

}
exports.compileAndRunC = function (code: any, notes: HTMLDivElement) {
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
exports.compileAndRunHaskell = function (code: any, notes: HTMLDivElement) {
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
exports.compileAndRunJava = function (code: any, notes: HTMLDivElement) {
	const jtree = japa.parse(code)
	console.log(jtree)
	const clasname = jtree.types[0].name.identifier;
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
exports.compileAndRunJavaScript = function (code: any, notes: HTMLDivElement) {

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
		const di = document.createElement("div")
		//var hr = document.createElement("hr")
		const out = document.createElement("h1")
		out.innerHTML = "Output:"
		di.appendChild(out);
		const div = document.createElement("div")
		out.appendChild(div)
	
		//di.appendChild(hr)
		notes.appendChild(di)
		
	
		const edit = new Quill(div, {
		theme: 'bubble'
	
		});
		edit.setText(stdout)
		edit.format('code',true)
		edit.format('code-block',true)

		edit.disable()
		notes.focus();

	


	}
		
}