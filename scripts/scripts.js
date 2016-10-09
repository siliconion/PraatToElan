const fs = require('fs');
const readline = require('readline');
const {dialog} = require('electron').remote;
let inputFiles;
let outputFolder = '$HOME/Desktop/PrattToElan/';
let threshold = 58;
let buffer = 0.35;

function renderInputFiles(files) {
  // innerHTML is slower, see http://stackoverflow.com/questions/3955229
  document.getElementById('inputFiles').innerHTML = '';
  inputFiles = files;
  inputFiles.forEach(file => {
    var node = document.createElement("DIV");
    var t = document.createTextNode(file); 
    node.appendChild(t);
    document.getElementById('inputFiles').appendChild(node);
  })
  
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
  outputFolder = path;
  document.getElementById("exportDir").value = outputFolder;
}

function selectExportDir() {
  dialog.showOpenDialog({
      properties: ['openDirectory'],
    },
    renderOutputDiv
  );
}
function processFile(file) {
  console.log('process one file', file);
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  })
}
function processFiles() {
  console.log('process files', inputFiles)
  inputFiles.forEach(processFile);
}
function generateCSV() {
  processFiles();
}

function setThreshold(input) {
  threshold = input;
  console.log("threshold", threshold);
}

function setBuffer(input) {
  let inputN = +input;
  if(typeof(buffer)==='number' && inputN > 0) {
    buffer = +input;
    console.log("buffer", buffer);
  }
}

window.onload = () => {
  renderOutputDiv(outputFolder);
  document.getElementById("threshold").value = threshold;
  document.getElementById("buffer").value = buffer;
}