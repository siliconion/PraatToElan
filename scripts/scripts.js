const readline = require('readline');
const {dialog} = require('electron').remote;
const File = require(__dirname+'/scripts/File');
const Lang = require(__dirname+'/scripts/Language');

let inputFiles;
let outputFolder = __dirname;
let threshold = 58;
let buffer = 0.35;
let averageSize = 11;
let fileInfo = "";  //B_Transcripción-txt-ixi
let participant = null;
let participants = [
  {name: 1, code: "A"},
  {name: 2, code: "B"},
  {name: 3, code: "C"},
  {name: 4, code: "D"}
];
let variant = null;
let variants = [
  {name: "Chajul", code: "ixj"}, 
  {name: "Nebaj", code: "ixi"},
  {name: "Cotzal", code: "ixl"}
];
function renderInputFiles(files) {
  // innerHTML is slower, see http://stackoverflow.com/questions/3955229
  document.getElementById('inputFiles').innerHTML = '';
  inputFiles = files;
  console.log('input files', files, inputFiles)
  inputFiles.forEach(file => {
    var node = document.createElement("DIV");
    var t = document.createTextNode(file); 
    node.appendChild(t);
    document.getElementById('inputFiles').appendChild(node);
  })
}

function setLang() {
  let lan = document.querySelector('input[name="language"]:checked').value;
  var resources = Lang[lan];
  document.getElementsByClassName('lan-inputFiles')[0].innerHTML = resources.inputFiles;
  document.getElementsByClassName('lan-selectInput')[0].innerHTML = resources.selectInput;
  document.getElementsByClassName('lan-outputFolder')[0].innerHTML = resources.outputFolder;
  let select = document.getElementsByClassName('lan-select');
  for(key in select){
    select[key].innerHTML = resources.select;
  }
  document.getElementsByClassName('lan-intensityThresold')[0].innerHTML = resources.intensityThreshold;
  document.getElementsByClassName('lan-boundryBuffer')[0].innerHTML = resources.boundryBuffer;
  document.getElementsByClassName('lan-generateCsv')[0].innerHTML = resources.generateCsv;
  document.getElementsByClassName('lan-participant')[0].innerHTML = resources.participant;
  document.getElementsByClassName('lan-variant')[0].innerHTML = resources.variant;
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
  renderInputFiles([]);
}
function generateCSV() {
  File.getSettings({
    outputFolder : outputFolder,
    threshold : threshold,
    buffer : buffer,
    averageSize : averageSize,
    participant: participant,
    variant: variant,
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

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropDownParticipant() {
    document.getElementById("participantDropdown").classList.toggle("show");
}
function dropDownVariant() {
    document.getElementById("variantDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

window.onload = () => {
  renderOutputDiv(outputFolder);
  setLang();
  document.getElementById("threshold").value = threshold;
  document.getElementById("buffer").value = buffer;
  participants.forEach(obj => {
    let node = document.createElement("div"); 
    let newContent = document.createTextNode(obj.name); 
    node.appendChild(newContent);
    node.addEventListener("click", ()=>{
      console.log("onclick", obj.name);
      document.getElementById("participantDropdownText").textContent = obj.name;
      document.getElementById("participantDropdownText").classList.remove("lan-select");
      participant = obj.code;
    })
    console.log("par", obj.name, obj.code);
    document.getElementById("participantDropdown").appendChild(node);
  })
  variants.forEach(obj => {
    let node = document.createElement("div");
    let newContent = document.createTextNode(obj.name); 
    node.appendChild(newContent);
    node.addEventListener("click", ()=>{
      console.log("onclick", obj.name);
      document.getElementById("variantDropdownText").textContent = obj.name;
      document.getElementById("variantDropdownText").classList.remove("lan-select");
      variant = obj.code;
    })
    
    // node.className = "";
    console.log("var", obj.name, obj.code);
    document.getElementById("variantDropdown").appendChild(node);
  })
}