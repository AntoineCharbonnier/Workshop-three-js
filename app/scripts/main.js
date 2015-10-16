import { World } from 'modules/world';
window.averageData = function(type, inputData, numberStart, numberAfer){
  var average = 0;
  if(type == "freq"){    
    for(var i = numberStart; i < numberAfer; i++){
      average += inputData.freq[i]
    }
  }
  else{
    for(var i = 0; i < numberAfer; i++){
      average += inputData.time[i]
    }
  }
  return average / numberAfer;
}
let world = new World();
world.init();

// console.log = function(){}
// console.warn = function(){}


