const readline = require('readline');
const {dialog} = require('electron').remote;
const File = require(__dirname+'/scripts/File');

let inputFiles;
let outputFolder = __dirname;
let threshold = 58;
let buffer = 0.35;
let averageSize = 11;

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
  if (outputFolder[outputFolder.length-1] !== '/') {
    outputFolder += '/';
  }
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
  File.processFile(file);
}
function processFiles() {
  console.log('process files', inputFiles)
  inputFiles.forEach(processFile);
  files = [];
  renderInputFiles();
}
function generateCSV() {
  File.getSettings({
    outputFolder : outputFolder,
    threshold : threshold,
    buffer : buffer,
    averageSize : averageSize,
  })
  return processFiles();
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