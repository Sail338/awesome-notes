const electron = require('electron');
var Quill  = require('Quill');
hljs.configure({   // optionally configure hljs
  languages: ['javascript', 'ruby', 'python']
});
console.log(hljs);
var basiceditor  = new Quill('#editor', {
  modules: {
    syntax: true,              // Include syntax module
    toolbar: [['code-block']]  // Include button in toolbar
  },
  theme: 'snow'
});
