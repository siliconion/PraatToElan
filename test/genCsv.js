const fs = require('fs');

let timeStep = 0.01;
let repeat = 3;
let period = 100;
let file = __dirname + "/start100.csv";
let data = "time_S,Intensity_dB\n";
fs.appendFileSync(file, data);
let time = 0;
let timeDiv = 100;
for(let i = 1; i < repeat; i++) {
  for(let j=period-1; j>=0; j--){
    time++;
    data = time/timeDiv +","+ j +"\n";
    fs.appendFileSync(file, data)
  }
  for(let j=1; j<=period; j++){
    time++;
    data = time/timeDiv +","+ j +"\n";
    fs.appendFileSync(file, data)
  }
}
