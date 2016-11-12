const fs = require('fs');
const readline = require('readline');

let File = {};
let outputFolder;
let threshold;
let buffer;
let averageSize;
let averageSpan;
let variant;
let participant;

File.getSettings = function(input){
  outputFolder = input.outputFolder;
  threshold = input.threshold;
  buffer = input.buffer;
  averageSize = input.averageSize;
  averageSpan = (averageSize - 1) / 2;
  if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
  }
  variant = input.variant;
  participant = input.participant;
}

File.processFile = function processFile(file) {
  console.log('process one file', file);
  const lineReader = readline.createInterface({
    input: fs.createReadStream(file, {autoClose:true}),
  });
  let lineIndex = 0;
  let valCache = [0];
  let valTotal = 0;
  let timeCache = [];
  let currentStart = 0;
  let prevStart = 0;
  let prevEnd = 0;
  let average = 0;
  let lineVal = null;
  let speech = false;
  let regex = new RegExp(/\\|\//);
  let outputFile = outputFolder + file.split(regex).pop().split(".").shift() + "_output.csv";
  lineReader.on('line', line => {
    lineVal = line.split(",");
    if(lineIndex === 0){
      // generate output file with header
      fs.appendFileSync(outputFile, "Tier, Annotation, Begin_Time, End_Time\n")
    } else {

      timeCache.push(+lineVal[0]);
      valCache.push(+lineVal[1]);

      if(lineIndex <= averageSize) {
        average = +lineVal[1];
        valTotal += +lineVal[1];
        if(!speech && average > threshold ) {
          speech = true;
          currentStart = Math.max(0,+lineVal[0]-buffer);
        }
        if( speech && average <= threshold) {
          prevEnd = +lineVal[0] + buffer;
          speech = false;
        }
      }
      // for n >= averageSpan
      if(lineIndex >= averageSize) {
        average = valTotal/averageSize;
        valTotal = valTotal - valCache.shift() + +lineVal[1];

        if(!speech && average > threshold ) {
          // start of a speech
          speech = true;
          // check previous end
          currentStart = Math.max(0,timeCache[(averageSize-1)/2]-buffer);
          if(currentStart>prevEnd){
            // not overlap, write the privous end and this start to result
            if(prevStart !== 0 && prevEnd !== 0){
              let writeString = participant + "_Transcripción-txt-" + variant +",," + prevStart +","+ prevEnd +"\n";
              fs.appendFileSync(outputFile, writeString);
            }
            prevStart = currentStart;
          }
        }
        if( speech && average <= threshold) {
          // end of a speech
          prevEnd = timeCache[(averageSize-1)/2] + buffer;
          speech = false;
        }
        timeCache.shift();
      }
    }
    lineIndex ++;
  })
  lineReader.on('close', data => {
    let endTime = timeCache.pop();
    if(prevEnd < endTime && speech === true){
      prevEnd = endTime;
    }
    let writeString = participant + "_Transcripción-txt-" + variant +",," + prevStart +","+ prevEnd +"\n";
    fs.appendFileSync(outputFile, writeString);
    return true;
  });
}

module.exports = File;
