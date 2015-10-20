import { Intro } from 'modules/intro';
// import { World } from 'modules/world';

//  average method with data from sound
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



let intro = new Intro()

// DOM LOADED
document.addEventListener("DOMContentLoaded", function(e){

  //  create world
  // let world = new World();
  // world.init();


  UIComponents.init('low', 0.75);
  UIComponents.init('high', 0.75);

  var lowButton = document.getElementById('low')
  var highButton = document.getElementById('high')

  lowButton.addEventListener('click', function(){
    intro.startExp( false )
  } )

  highButton.addEventListener('click', function(){
    intro.startExp( true )
  } )


});



// console.log = function(){}
// console.warn = function(){}


