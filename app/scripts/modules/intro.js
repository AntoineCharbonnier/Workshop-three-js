import { World } from 'modules/world';
class Intro {
  constructor(){
    this.world = new World()
    this.dom = document.querySelector('.container')

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

    this.soundWait = this.dom.querySelector("#wait")
    this.soundLoaded = this.dom.querySelector("#load")

    this.qualityExperience = null

    this.init()
  }

  init(){
    console.log("init")
    this.timeline = new TimelineMax( { paused: true } ) // , onComplete : this.start, onCompleteScope: this, onCompleteParams: ["{self}"] 


    TweenMax.set( [this.expTitleO, this.expTitleD, this.expTitleE, this.expTitleS, this.expTitleZ, this.expTitleA, this.expSubTitle, this.expHR, this.qualityTitle, this.qualityExplaination, this.qualityButtonLow, this.qualityButtonHigh, this.soundWait, this.soundLoaded] , {autoAlpha: 0} )
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

    this.timeline.to( [this.qualityTitle, this.qualityExplaination], 0.6, { autoAlpha: 1, ease: Ease.easeIn}, time+=0.1 )

    this.timeline.to( [this.qualityButtonLow, this.qualityButtonHigh], 0.6, { autoAlpha: 1, x:0, ease: Ease.easeOut }, time+=0.1 )

    this.timeline.play()
  }

  startExp(quality){
    console.log("startExp :", quality)
    this.qualityExperience = quality

    this.hideIntro()
    this.initExp(this.qualityExperience)

  }

  hideIntro(){
    var time = 1
    this.timelineReversed = new TimelineMax( { paused: true } )

    this.timelineReversed.to( this.qualityButtonLow, 0.6, { autoAlpha: 0, x:-500, ease: Ease.easeOut }, time+=0.1 )
    this.timelineReversed.to( this.qualityButtonHigh, 0.6, { autoAlpha: 0, x:500, ease: Ease.easeOut }, time+=0.1 )

    this.timelineReversed.to( [this.qualityTitle, this.qualityExplaination], 0.6, { autoAlpha: 0, ease: Ease.easeIn}, time+=0.1 )
    this.timelineReversed.to( this.expHR, 0.5, { width: 0, autoAlpha: 1, ease: Back.easeOut}, time+=0.1 )
    this.timelineReversed.to( this.expSubTitle, 0.6, { autoAlpha: 0, ease: Ease.easeIn}, time+=0.1 )
    this.timelineReversed.to( this.expTitleA, 0.6, { autoAlpha: 0, y:30, ease: Ease.easeIn}, time+=0.1 )
    this.timelineReversed.to( this.expTitleS, 0.6, { autoAlpha: 0, y:30, ease: Ease.easeIn}, time+=0.1 )
    this.timelineReversed.to( this.expTitleZ, 0.6, { autoAlpha: 0, y:30, ease: Ease.easeIn}, time+=0.1 )
    this.timelineReversed.to( this.expTitleE, 0.6, { autoAlpha: 0, y:30, ease: Ease.easeIn}, time+=0.1 )
    this.timelineReversed.to( this.expTitleD, 0.6, { autoAlpha: 0, y:30, ease: Ease.easeIn}, time+=0.1 )
    this.timelineReversed.to( this.expTitleO, 0.6, { autoAlpha: 0, y:30, ease: Ease.easeIn}, time+=0.1 )

    this.timelineReversed.to(this.dom, 0.4, {  scaleY: 0.01, ease: Ease.easeIn}, time+= 0.9)
    this.timelineReversed.to(this.dom, 0.3, {  scaleX: 0, autoAlpha: 0 , ease: Ease.easeIn}, time+= 0.4)

    this.timelineReversed.play()
  }

  initExp(quality){
    this.world.init(this.qualityExperience)
    setTimeout(function(){
      this.world.particles.launchSound()
    }.bind(this), 3000)
  }

}
export { Intro };


