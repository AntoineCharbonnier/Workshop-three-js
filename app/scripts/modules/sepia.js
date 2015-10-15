let glslify        = require('glslify');

class Sepia {

  constructor( renderer, scene , camera ) {
    
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( new THREE.RenderPass( scene, camera ) );
    
    this.shaderSepia                            = THREE.SepiaShader;
    this.effectSepia                            = new THREE.ShaderPass( this.shaderSepia );
    this.effectSepia.uniforms[ "amount" ].value = 1;
    
    this.renderToScreen = true;
		this.composer.addPass( this.effectSepia );
    this.delta = 0.1;

    return this;
  }

  update( ts, data ) {
    if( data && data != "undefined" ){
      if( (180 < this.averageData("freq", data, 0, 20))  && (this.averageData("freq", data, 0, 20) < 200) ){ 
        this.render()
      }
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

export { Sepia };