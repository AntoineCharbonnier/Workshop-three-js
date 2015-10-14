// let THREE          = require('../vendors/three.min');
let glslify        = require('glslify');


class Glitch {

  constructor( renderer, scene , camera ) {
    
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( new THREE.RenderPass( scene, camera ) );

		this.glitchPass = new THREE.GlitchPass();
		this.glitchPass.renderToScreen = true;
		// this.glitchPass.goWild = true;
		this.composer.addPass( this.glitchPass );

    return this;
  }


  update( ts, data ) {
    // console.log(this.averageData("freq" , data, 200, 250))
    if( this.averageData("freq" , data, 200, 250) > 28 ){
      this.render()
    }
    if(this.averageData("freq" , data, 200, 250) > 30){
      this.glitchPass.goWild = true;
      this.render()
    }
    else{
      this.glitchPass.goWild = false;
    }
  }

  render(){
  	this.composer.render()
  }

  averageData(type, inputData, numberStart, numberAfer){
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


}

export { Glitch };