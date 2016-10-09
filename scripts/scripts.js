const fs = require('fs');
const {dialog} = require('electron').remote;
console.log(dialog);

function getImportDir() {
  alert(`get import {$importDir}`);
}

function getExportDir() {
  alert("get export")
}
function processFile() {

}
function processFiles() {
  let inputFiles = document.getElementById("importFile").files;
  inputFiles.forEach(file => processFile(file));
}
function generateCSV() {
  alert("gen csv")
}

function generateEAF() {
  alert("gen eaf")
}