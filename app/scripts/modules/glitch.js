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


  update( ts ) {
    // window.requestAnimationFrame( this.update.bind(this) );
  }

  render(){
  	this.composer.render()
  }


}

export { Glitch };