let glslify        = require('glslify');

class Vignette {

  constructor( renderer, scene , camera ) {
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( new THREE.RenderPass( scene, camera ) );

    this.shaderVignette                              = THREE.VignetteShader;
    this.effectVignette                              = new THREE.ShaderPass( this.shaderVignette );
    this.effectVignette.uniforms[ "offset" ].value   = 0.95;
    this.effectVignette.uniforms[ "darkness" ].value = 1.6;

		this.effectVignette.renderToScreen = true;

		this.composer.addPass( this.effectVignette );

    this.glitchPass = new THREE.GlitchPass();
    this.glitchPass.renderToScreen = true;

    this.composer.addPass( this.glitchPass );

    this.offset   = 0.55
    this.darkness = 0.55
    
    this.delta    = 0.01
    return this;
  }

  update( ts, data ) {
    if( window.averageData("freq" , data, 200, 250) > 26.5 ){
      this.glitchPass.renderToScreen = true;
    }
    else{
      this.glitchPass.renderToScreen = false;
    }

    if( window.averageData("freq" , data, 0, 50) > 140 ){
      if( this.offset < 1 && this.darkness < 1 ){
        this.offset   += 0.05
        this.darkness += 0.1
      }
      this.effectVignette.uniforms[ "offset" ].value   = this.offset;
      this.effectVignette.uniforms[ "darkness" ].value = this.darkness;
      this.render()
    }
    if( window.averageData("freq" , data, 0, 50) > 200 ){
      if( this.offset > 0 && this.darkness > 0 ){
        this.offset   -= 0.05
        this.darkness -= 0.1
      }

      this.effectVignette.uniforms[ "offset" ].value   = this.offset;
      this.effectVignette.uniforms[ "darkness" ].value = this.darkness;
      this.render()
    }
  }

  render(){
  	this.composer.render(this.delta)
  }

}

export { Vignette };