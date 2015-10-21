import { Intro } from 'modules/intro';
import { Video } from 'modules/video';

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


// DOM LOADED
document.addEventListener("DOMContentLoaded", function(e){
  let intro = new Intro()

  
  var lowButton    = document.getElementById('low')
  var videoButton  = document.getElementById('video')
  var highButton   = document.getElementById('high')
  var reloadButton = document.getElementById('reload')

  UIComponents.init('low', 0.75);
  UIComponents.init('video', 0.75);
  UIComponents.init('high', 0.75);
  UIComponents.init('reload', 0.75);


  var myVideoPlayer = new Video("video-player")


  lowButton.addEventListener('click', function(){
    intro.startExp( false )
  } )

  highButton.addEventListener('click', function(){
    intro.startExp( true )
  } )

  reloadButton.addEventListener('click', function(){
    setTimeout(function(){
      document.location.reload()
    }, 1000)
  } )

  videoButton.addEventListener('click', function(){
    myVideoPlayer.play()
  } )
  
});



// console.log = function(){}
// console.warn = function(){}


