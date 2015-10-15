class Postprocessing {

  constructor( renderer, scene , camera ) {
    
	 console.log(THREE.BloomPass)
    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;
    var effectBloom = new THREE.BloomPass( 0.5 ); 



    var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true };

    var rtWidth  = width / 2;
    var rtHeight = height / 2;
    this.composer = new THREE.EffectComposer( this.renderer, new THREE.WebGLRenderTarget( rtWidth, rtHeight, rtParameters ) );
    this.delta = 0.01
    this.composer.addPass( effectBloom )

    return this;
  }


  update( ts ) {
    // console.log(this.averageData("freq" , data, 200, 250))
    // if( this.averageData("freq" , data, 200, 250) > 28 ){
    //   this.render()
    // }
    // if(this.averageData("freq" , data, 200, 250) > 30){
    //   this.glitchPass.goWild = true;
    //   this.render()
    // }
    // else{
    //   this.glitchPass.goWild = false;
    // }
  }

  render(){
  	this.composer.render( this.delta )
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

export { Postprocessing };