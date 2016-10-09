const fs = require('fs');
const {dialog} = require('electron').remote;
let inputFiles;
let outputFolder = '$HOME/Desktop/PrattToElan/';

function renderInputFiles(files) {
  // innerHTML is slower, see http://stackoverflow.com/questions/3955229
  document.getElementById('inputFiles').innerHTML = '';  
  console.log("here")
  files.forEach(file => {
    var node = document.createElement("DIV");
    var t = document.createTextNode(file); 
    node.appendChild(t);
    document.getElementById('inputFiles').appendChild(node);    
  })
  inputFiles = files;
}

function importFiles() {
  dialog.showOpenDialog({
      filters:[{name: 'csv', extensions: ['csv']},],
      properties: ['openFile','multiSelections']
    }, 
    renderInputFiles
  );
}

function renderOutputDiv(path) {
  console.log('renderOutputDiv', path);
  outputFolder = path;
  document.getElementById("exportDir").value=path;
}

function selectExportDir() {
  console.log('select output folder')
  dialog.showOpenDialog({
      properties: ['openDirectory'],
    },
    renderOutputDiv
  );
}
function processFile(file) {
}
function processFiles() {
  // inputFiles.forEach(file => processFile(file));
  for(let i = 0; i< inputFiles.length; i++){
    processFile(inputFiles[i]);
  }
}
function generateCSV() {
  processFiles();
}

// function generateEAF() {
//   alert("gen eaf")
// }

// FileList.prototype.forEach = (cb) => {
//   console.log("xxxxxx", this)
//   for(let i = 0; i < this.length; i++){
//     console.log("xxxxxx", i);
//     cb(this[i]);
//   }
// };

window.onload = () => {
  document.getElementById("exportDir").value=outputFolder;
}