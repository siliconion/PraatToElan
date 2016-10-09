// const fs = require('fs');
// const {dialog} = require('electron').remote;
let inputFiles;
let outputFolder = '$HOME/Desktop/PrattToElan/';
let inputFilesDiv = document.getElementById("importFile");

function onImportFileChange() {
  inputFiles = document.getElementById("importFile").files;
  for(let i = 0; i< inputFiles.length; i++){
    var n = document.createElement("DIV");        // Create a <button> element
    var t = document.createTextNode(inputFiles[i].name);       // Create a text node
    n.appendChild(t);
    document.getElementById("importFiles").appendChild(n);
  }
  // document.getElementById("importFile").files.forEach((file) => {
  //   document.getElementById("importFiles").appendChild(file.name);
  // })
  return false;
}

function getExportDir() {
  alert("get export")
}
function processFile(file) {
  console.log("xxxxxx", file.webkitRelativePath, file.name);
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