class Outro {
  constructor(){
    this.dom = document.querySelector('.container')

    this.logo                  = this.dom.querySelectorAll('path')
    
    this.logoATopPath          = this.dom.querySelector('#A-top')
    this.logoOutSideBorderPath = this.dom.querySelector('#outside-border')
    this.logoOutSideCPath      = this.dom.querySelector('#outside-C')
    this.logoInSideCPath       = this.dom.querySelector('#inside-C')
    this.logoABarPath          = this.dom.querySelector('#A-bar')
    
    this.expTitleO             = this.dom.querySelector('.about .name .O')
    this.expTitleD             = this.dom.querySelector('.about .name .D')
    this.expTitleE             = this.dom.querySelector('.about .name .E')
    this.expTitleS             = this.dom.querySelector('.about .name .S')
    this.expTitleZ             = this.dom.querySelector('.about .name .Z')
    this.expTitleA             = this.dom.querySelector('.about .name .A')
    
    this.expSubTitle           = this.dom.querySelector('.about h2')
    this.expSub3Title          = this.dom.querySelector('.about h3')
    this.expHR                 = this.dom.querySelector('.about hr')
    
    this.qualityTitle          = this.dom.querySelector('.select-quality--container h1.exp-quality')
    this.qualityExplaination   = this.dom.querySelector('.select-quality--container h3')
    this.qualityButtonLow      = this.dom.querySelector('#low')
    this.qualityButtonHigh     = this.dom.querySelector('#high')
    
    this.playAgainTitle        = this.dom.querySelector('.select-quality--container h1.play-again-text')
    this.playAgainButton       = this.dom.querySelector('#reload')
    
    this.soundWait             = this.dom.querySelector("#wait")
    this.soundLoaded           = this.dom.querySelector("#load")

    this.qualityExperience = null

    this.init()
  }

  init(){
    this.timeline = new TimelineMax( { paused: true } )

    TweenMax.set( [this.qualityButtonLow, this.qualityButtonHigh, this.qualityTitle, this.qualityExplaination, this.qualityButtonLow, this.qualityButtonHigh, this.soundLoaded, this.soundWait], { className: "+= hide" } )
    TweenMax.set( [this.playAgainTitle, this.playAgainButton], { className: "-= hide" } )

    TweenMax.set( [this.expTitleO, this.expTitleD, this.expTitleE, this.expTitleS, this.expTitleZ, this.expTitleA, this.expSubTitle, this.expSub3Title, this.expHR, this.playAgainButton, this.playAgainTitle] , {autoAlpha: 0} )
    TweenMax.set( [this.expTitleO, this.expTitleD, this.expTitleE, this.expTitleS, this.expTitleZ, this.expTitleA], { y: 30 } )
    TweenMax.set( this.dom, { scaleY: 0.01, scaleX: 0, autoAlpha: 0} )

    TweenMax.set( this.playAgainButton, {y: 200} )

    TweenMax.set( this.expHR, {width: 0} )

    TweenMax.to(this.logo, 1, {drawSVG:"0%",fill:"#fff"});

    this.show()
  }

  show(){
    var time = 0

    this.timeline.to(this.dom, 0.4, {  scaleX: 1, autoAlpha: 1 , ease: Ease.easeIn}, time+= 0.4)
    this.timeline.to(this.dom, 0.3, {  scaleY: 1, ease: Ease.easeIn}, time+= 0.9)

    this.timeline.to( this.expTitleO, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    this.timeline.to( this.expTitleD, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    this.timeline.to( this.expTitleE, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    this.timeline.to( this.expTitleS, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    this.timeline.to( this.expTitleZ, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    this.timeline.to( this.expTitleA, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )

    this.timeline.to( this.expSubTitle, 0.6, { autoAlpha: 1, ease: Ease.easeIn}, time+=0.1 )

    this.timeline.to( this.expHR, 0.5, { width: 100, autoAlpha: 1, ease: Back.easeOut}, time+=0.1 )

    this.timeline.to( this.expSub3Title, 0.6, { autoAlpha: 1, ease: Ease.easeIn}, time+=0.1 )
    
    this.timeline.to( this.playAgainTitle, 0.6, { autoAlpha: 1, ease: Ease.easeIn}, time+=0.1 )

    this.timeline.to( this.playAgainButton, 0.6, { autoAlpha: 1, y:0, ease:   Circ.easeInOut }, time+=0.1 )
    
    this.timeline.staggerTo(this.logo, 0.8, { drawSVG:"100%", ease:Power1.easeInOut }, 0.2, time+=0.1);
    this.timeline.staggerTo(this.logo, 0.8, { fill:"#000000", stroke: "none", ease:Power1.easeInOut }, 0.2, time+=0.1);

    this.timeline.play()
  }
  
}
export { Outro };


