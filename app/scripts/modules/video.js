class Video{
  constructor(myVideo){
    this.myVideo        = document.getElementById(myVideo)  
    this.myVideo.addEventListener('ended',this.end,false)
    this.myVideo.addEventListener('webkitendfullscreen', this.onVideoEndsFullScreen, false);
  }
  
  play(){
    this.myVideo.currentTime = '0'
    this.myVideo.play()
  }
  onVideoEndsFullScreen(){
    console.log("sortie du fullscreen ios")
  }
}

export {Video};