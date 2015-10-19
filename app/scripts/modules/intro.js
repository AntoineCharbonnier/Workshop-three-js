class Intro {
  constructor(){
    this.dom = document.querySelector('.container')
    // this.expTitle = this.dom.querySelector('.about h1')
    this.expTitleO           = this.dom.querySelector('.about .name .O')
    this.expTitleD           = this.dom.querySelector('.about .name .D')
    this.expTitleE           = this.dom.querySelector('.about .name .E')
    this.expTitleS           = this.dom.querySelector('.about .name .S')
    this.expTitleZ           = this.dom.querySelector('.about .name .Z')
    this.expTitleA           = this.dom.querySelector('.about .name .A')
    
    this.expSubTitle         = this.dom.querySelector('.about h2')
    this.expHR               = this.dom.querySelector('.about hr')
    
    this.qualityTitle        = this.dom.querySelector('.select-quality--container h1')
    this.qualityExplaination = this.dom.querySelector('.select-quality--container h3')
    this.qualityButtonLow    = this.dom.querySelector('#low')
    this.qualityButtonHigh   = this.dom.querySelector('#high')

    this.init()
  }

  init(){
    console.log("init")
    TweenMax.set( [this.expTitleO, this.expTitleD, this.expTitleE, this.expTitleS, this.expTitleZ, this.expTitleA, this.expSubTitle, this.expHR, this.qualityTitle, this.qualityExplaination, this.qualityButtonLow, this.qualityButtonHigh] , {autoAlpha: 0} )
    TweenMax.set( [this.expTitleO, this.expTitleD, this.expTitleE, this.expTitleS, this.expTitleZ, this.expTitleA], { y: 30 } )
    TweenMax.set( this.dom, { scaleY: 0.01, scaleX: 0, autoAlpha: 0} )

    TweenMax.set( this.qualityButtonLow, { x: -500} )
    TweenMax.set( this.qualityButtonHigh, { x: 500} )

    TweenMax.set( this.expHR, {width: 0} )

    this.show()
  }

  show(){
    console.log("show")
    var time = 0
    var timeline = new TimelineMax( { paused: true } )

    // var titleSplit = new SplitText( this.expTitle, { type: "words,chars" } )
    // var charsTitle = titleSplit.chars
    // console.log(charsTitle)

    timeline.to(this.dom, 0.4, {  scaleX: 1, autoAlpha: 1 , ease: Ease.easeIn}, time+= 0.4)
    timeline.to(this.dom, 0.3, {  scaleY: 1, ease: Ease.easeIn}, time+= 0.9)
    // timeline.staggerFrom( charsTitle, 0.5, {autoAlpha: 1, ease: Ease.easeOut}, 0.01, time+= 0.2 )
    timeline.to( this.expTitleO, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    timeline.to( this.expTitleD, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    timeline.to( this.expTitleE, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    timeline.to( this.expTitleS, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    timeline.to( this.expTitleZ, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )
    timeline.to( this.expTitleA, 0.6, { autoAlpha: 1, y:0, ease: Ease.easeIn}, time+=0.1 )

    timeline.to( this.expSubTitle, 0.6, { autoAlpha: 1, ease: Ease.easeIn}, time+=0.1 )

    timeline.to( this.expHR, 0.5, { width: 100, autoAlpha: 1, ease: Back.easeOut}, time+=0.1 )

    timeline.to( [this.qualityTitle, this.qualityExplaination], 0.6, { autoAlpha: 1, ease: Ease.easeIn}, time+=0.1 )

    timeline.to( [this.qualityButtonLow, this.qualityButtonHigh], 0.6, { autoAlpha: 1, x:0, ease: Ease.easeOut }, time+=0.1 )

    timeline.play()
  }

}
export { Intro };


