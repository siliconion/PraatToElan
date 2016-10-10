const fs = require('fs');
const readline = require('readline');
const {dialog} = require('electron').remote;
// const DATA = require('./data');
let inputFiles;
let outputFolder = '$HOME/Desktop/PrattToElan/';
let threshold = 58;
let buffer = 0.35;
let averageSize = 11;
let averageSpan = 5;

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
  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });
  let lineIndex = 0;
  let avergeCache = Array(averageSize);
  let dataCache = Array(averageSize);
  let currentStart = 0;
  let lastEnd = 0;
  let average = 0;
  let lineVal = null;
  let speech = false;
  lineReader.on('line', line => {
    console.log(totalLines, line);
    lineVal = line.split(",");
    if(lineIndex === 0){
      // generate output file with header
    } else {
      /*
        average of n:
          n < averageSpan: self
          n >= averageSpan: average of n-span to n+span
        To get average of n, need to be at n+span
      */
      timeCache.shift();
      valCache.shift();
      timeCache.push(+lineVal[0]);
      valCache.push(+lineVal[1]);
      // for n < averageSpan
      if(lineIndex <= averageSpan) {
        average = +lineVal[1];
        if(!speech && average > threshold ) {
          // start of a speech
          speech = true;
          // check previous end
          currentStart = Math.max(0,+lineVal[0]-buffer);
        }
        if( speech && average <= threshold) {
          // end of a speech
          lastEnd = +lineVal[0] + buffer;
        }
      }
      // for n >= averageSpan
      if(lineIndex >= averageSize) {
        average = valCache.average();
        if(!speech && average > threshold ) {
          // start of a speech
          speech = true;
          // check previous end
          currentStart = Math.max(0,timeCache[(averageSize-1)/2]-buffer);
        }
        if( speech && average <= threshold) {
          // end of a speech
          lastEnd = timeCache[(averageSize-1)/2] + buffer;
        }
      }
      if(currentStart>lastEnd){
        // not overlap, write the privous end and this start to result
        console.log("no overlap, write to file", currentStart, lastEnd)
      }
    }
    lineIndex ++;
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