const electron = require('electron');
const Quill = require('quill')

let basicEditor = new Quill('#editor', {
  theme: 'snow',
  modules: {
	syntax:true
	}
});
