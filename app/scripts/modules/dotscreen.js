let glslify        = require('glslify');

class DotScreen {

  constructor( renderer, scene , camera ) {
    
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( new THREE.RenderPass( scene, camera ) );

		this.dotScreen = new THREE.DotScreenPass( new THREE.Vector2( 0, 0 ), 0.5, 0.8 );
		this.dotScreen.renderToScreen = true;
		this.composer.addPass( this.dotScreen );

    return this;
  }


  update( ts, data ) {
    if( data && data != "undefined" ){
      if( (155 < this.averageData("freq", data, 0, 20))  && (this.averageData("freq", data, 0, 20) < 180) ){ // && (this.averageData("freq", data, 0, 20) < 155)
        this.render()
      }
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

export { DotScreen };