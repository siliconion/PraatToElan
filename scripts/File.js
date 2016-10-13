const fs = require('fs');
const readline = require('readline');

let File = {};
let outputFolder;
let threshold;
let buffer;
let averageSize;
let averageSpan;

File.getSettings = function(input){
  outputFolder = input.outputFolder;
  threshold = input.threshold;
  buffer = input.buffer;
  averageSize = input.averageSize;
  averageSpan = (averageSize -1)/2;
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
  let outputFile = outputFolder + file.split("/").pop();
  console.log("output File", outputFile);
  lineReader.on('line', line => {
    lineVal = line.split(",");
    if(lineIndex === 0){
      // generate output file with header
      fs.appendFileSync(file, "start, end\n")
    } else {

      timeCache.push(+lineVal[0]);
      valCache.push(+lineVal[1]);

      if(lineIndex <= averageSize) {
        average = +lineVal[1];
        valTotal += +lineVal[1];
        if(!speech && average > threshold ) {
          // start of a speech
          speech = true;
          // check previous end
          currentStart = Math.max(0,+lineVal[0]-buffer);
        }
        if( speech && average <= threshold) {
          // end of a speech
          prevEnd = +lineVal[0] + buffer;
          speech = false;
        }
      }
      // for n >= averageSpan
      if(lineIndex >= averageSize) {
        
        average = valTotal/averageSize;
        valTotal = valTotal - valCache.shift() + +lineVal[1];
        // console.log("X", lineIndex, average);

        if(!speech && average > threshold ) {
          // start of a speech
          speech = true;
          // check previous end
          currentStart = Math.max(0,timeCache[(averageSize-1)/2]-buffer);
          console.log("start of speech", timeCache[(averageSize-1)/2], prevStart, prevEnd, currentStart, timeCache)
          if(currentStart>prevEnd){
            // not overlap, write the privous end and this start to result
            console.log("no overlap, write to file!!!!", prevStart, prevEnd)
            fs.appendFileSync(outputFile, prevStart +","+ prevEnd +"\n");
            prevStart = currentStart;
          }
        }
        if( speech && average <= threshold) {
          // end of a speech
          prevEnd = timeCache[(averageSize-1)/2] + buffer;
          speech = false;
          console.log("end of speech", timeCache[(averageSize-1)/2]);
        }
        timeCache.shift();
      }
    }
    lineIndex ++;
  })
  lineReader.on('close', data => {
    console.log("closing!", prevStart, prevEnd);
    fs.appendFileSync(outputFile, prevStart +","+ prevEnd +"\n");
  });
}

module.exports = File;