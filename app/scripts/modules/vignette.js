let glslify        = require('glslify');

class Vignette {

  constructor( renderer, scene , camera ) {
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( new THREE.RenderPass( scene, camera ) );

    this.shaderVignette                         = THREE.VignetteShader;
    this.effectVignette                         = new THREE.ShaderPass( this.shaderVignette );
    this.effectVignette.uniforms[ "offset" ].value   = 0.95;
    this.effectVignette.uniforms[ "darkness" ].value = 1.6;

		this.effectVignette.renderToScreen = true;

		this.composer.addPass( this.effectVignette );
    this.delta = 0.01
    return this;
  }

  update( ts, data ) {
    if( this.averageData("freq" , data, 0, 50) > 140 ){
      this.effectVignette.uniforms[ "offset" ].value   = 0.55;
      this.effectVignette.uniforms[ "darkness" ].value = 0.6;
      this.render()
    }
    if( this.averageData("freq" , data, 0, 50) > 200 ){
      this.effectVignette.uniforms[ "offset" ].value   = 1.5;
      this.effectVignette.uniforms[ "darkness" ].value = 2.6;
      this.render()
    }
  }

  render(){
  	this.composer.render(this.delta)
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

export { Vignette };