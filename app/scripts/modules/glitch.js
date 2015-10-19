let glslify        = require('glslify');

class Glitch {

  constructor( renderer, scene , camera ) {
    
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( new THREE.RenderPass( scene, camera ) );

		this.glitchPass = new THREE.GlitchPass();
    this.glitchPass.renderToScreen = true;

    this.composer.addPass( this.glitchPass );

    return this;
  }


  update( ts, data ) {
    if( window.averageData("freq" , data, 200, 250) > 28 ){
		  this.glitchPass.renderToScreen = true;
      this.render()
    }
    if(window.averageData("freq" , data, 200, 250) > 30){
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

}

export { Glitch };