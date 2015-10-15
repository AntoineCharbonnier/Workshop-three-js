import { Keyboard } from './keyboard';
import { Sphere } from './sphere';
import { Terrain } from './terrain';
import { Ground } from './ground';
import { Circle } from './circle';
import { Glitch } from './glitch';
import { DotScreen } from './dotscreen';
import { Sepia } from './sepia';
import { Vignette } from './vignette';
import { Particles } from './particles';
import { Sound } from './sound';

let PERLIN_NOISE = require('../vendors/improved_perlin_noise');

// let OrbitControls = require('three-orbit-controls')(THREE);

class World {

    constructor( _options ) {

        let options    = _options || {};
        
        this.scene     = null;
        this.camera    = null;
        this.renderer  = null;
        this.composer  = null;
        this.keyboard  = null;
        this.container = options.container || document.body;
        this.controls  = null;
        // this.sound = null;

        this.sphere = null;
        this.ground = null;

      	this.params = {
              active: options.active || true,
              height: options.height || window.innerHeight,
              width:  options.width  || window.innerWidth
      	};

      	this.mouse = {
  	        x: null,
  	        y: null
  	    };

  	    this.clock = null;

        this.sound = new Sound();
        // this.sound.load( "mp3/InDaClub-50Cent.mp3" )
        this.sound.load( "mp3/odesza-say-my-name.mp3" )
        this.tmpData = this.sound.getData();

    }

    init() {
    	this.scene = new THREE.Scene()
      this.fog = new THREE.Fog( 0xff00ff, -0.1, 10000 )
      // this.fog = new THREE.FogExp2( 0xff00ff, 0.1 )
      this.scene.fog = this.fog
    	this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000 )
    	this.camera.position.z = 0
      this.scene.add( this.camera )
      this.addLights()
      // this.addControls();
      this.renderer = new THREE.WebGLRenderer({
	        antialias: true
	    });

	    // this.renderer.setClearColor(  0xffffff, 1 );
    	this.renderer.setSize( this.params.width, this.params.height )

    	this.container.appendChild( this.renderer.domElement )

    	this.clock = Date.now()
      

      // var shaderBleach = THREE.BleachBypassShader;
      // var shaderSepia = THREE.SepiaShader;
      // var shaderVignette = THREE.VignetteShader;
      // // var shaderCopy = THREE.CopyShader;

      // var effectBleach = new THREE.ShaderPass( shaderBleach );
      // var effectSepia = new THREE.ShaderPass( shaderSepia );
      // var effectVignette = new THREE.ShaderPass( shaderVignette );
      // // var effectCopy = new THREE.ShaderPass( shaderCopy );

      // effectBleach.uniforms[ "opacity" ].value = 0.95;

      // effectSepia.uniforms[ "amount" ].value = 0.9;

      // effectVignette.uniforms[ "offset" ].value = 0.05;
      // effectVignette.uniforms[ "darkness" ].value = 0.6;
      // console.log(THREE.BloomPass)
      // var width = window.innerWidth || 2;
      // var height = window.innerHeight || 2;
      // var effectBloom = new THREE.BloomPass( 0.5 ); 
      // // var effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );
      // // var effectFilmBW = new THREE.FilmPass( 0.35, 0.5, 2048, true );
      // // var effectDotScreen = new THREE.DotScreenPass( new THREE.Vector2( 0, 0 ), 0.5, 0.8 );

      // // var effectHBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
      // // var effectVBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
      // // effectHBlur.uniforms[ 'h' ].value = 2 / ( width / 2 );
      // // effectVBlur.uniforms[ 'v' ].value = 2 / ( height / 2 );

      // var effectColorify1 = new THREE.ShaderPass( THREE.ColorifyShader );
      // var effectColorify2 = new THREE.ShaderPass( THREE.ColorifyShader );
      // effectColorify1.uniforms[ 'color' ].value.setRGB( 1, 0.8, 0.8 );
      // effectColorify2.uniforms[ 'color' ].value.setRGB( 1, 0.75, 0.5 );
      
      // var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true };

      // var rtWidth  = width / 2;
      // var rtHeight = height / 2;
      // this.composer = new THREE.EffectComposer( this.renderer, new THREE.WebGLRenderTarget( rtWidth, rtHeight, rtParameters ) );
      // this.delta = 0.1

      // this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );


      // //effectFilm.renderToScreen = true;
      // //effectFilmBW.renderToScreen = true;
      // //effectDotScreen.renderToScreen = true;
      // // effectBleach.renderToScreen = true;
      // effectVignette.renderToScreen = true;
      // //effectCopy.renderToScreen = true;

      // // this.composer.addPass( effectBloom )
      // // this.composer.addPass( effectSepia )
      // // this.composer.addPass( effectBleach )
      // this.composer.addPass( effectVignette )



      this.addSphere()
      this.addParticles(this.scene, this.sound)
      this.addTerrain( this.sphere )
      this.addGround()
      this.addGlitch( this.renderer, this.scene, this.camera )
      this.addDotScreen( this.renderer, this.scene, this.camera )
      this.addSepia( this.renderer, this.scene, this.camera )
      this.addVignette( this.renderer, this.scene, this.camera )

      this.addListeners()
    	
      this.animate()
    }

    addLights() {
        var ambient = new THREE.AmbientLight( 0x777777 )
        this.scene.add( ambient )

        // var ambientWhiteLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        // this.scene.add( ambientWhiteLight );

        var directionalLight = new THREE.DirectionalLight( 0xe2ffaa )
        directionalLight.position.x = 0
        directionalLight.position.y = -1
        directionalLight.position.z = -1
        directionalLight.position.normalize()
        this.scene.add( directionalLight )


        var light = new THREE.SpotLight( 0x999999, 2, 0 )
        light.position.set( -500, 9500, -12000 )
        light.target.position.set( 0, 0, -11990 )
        light.castShadow = true
        this.scene.add( light )
    }

    addSphere() {
    	this.sphere = new Sphere()
    	this.scene.add( this.sphere.getMesh() )
    }

    addParticles(scene, sound) {
      this.particles = new Particles(scene, sound)
      this.scene.add( this.particles.getMesh() )
    }

    addTerrain( sphere ) {
      this.terrain = new Terrain( sphere )
      this.scene.add( this.terrain.getMesh() )
    }

    addGround() {
      this.ground = new Ground()
      this.scene.add( this.ground.getMesh() )
    }

    /* POSTPROCESSING */
    addGlitch( renderer, scene, camera ){
      this.glitch = new Glitch( renderer, scene, camera )
      this.glitch.render()
    }

    addDotScreen( renderer, scene, camera ){
      this.dotscreen = new DotScreen( renderer, scene, camera )
    }

    addSepia( renderer, scene, camera ){
      this.sepia = new Sepia( renderer, scene, camera )
    }

    addVignette( renderer, scene, camera ){
      this.vignette = new Vignette( renderer, scene, camera )
    }
    // addPostProcess(){
    //   // postprocessing

        // var renderModel = new THREE.RenderPass( scene, camera );
        // var effectBloom = new THREE.BloomPass( 0.75 );
        // var effectFilm = new THREE.FilmPass( 0.5, 0.5, 1448, false );

        // effectFocus = new THREE.ShaderPass( THREE.FocusShader );

        // effectFocus.uniforms[ "screenWidth" ].value = window.innerWidth;
        // effectFocus.uniforms[ "screenHeight" ].value = window.innerHeight;

        // effectFocus.renderToScreen = true;

        // composer = new THREE.EffectComposer( renderer );

        // composer.addPass( renderModel );
        // composer.addPass( effectBloom );
        // composer.addPass( effectFilm );
        // composer.addPass( effectFocus );
    // }




    getScene() {
      return this.scene;
    }

    animate( ts ) {
      if (this.params.active) {
          window.requestAnimationFrame( this.animate.bind(this) );

          this.render( ts );
          this.tmpData = this.sound.getData();
          this.sphere.update(ts , this.tmpData);
          this.terrain.update(ts , this.tmpData);
          this.ground.update(ts , this.tmpData);
          this.particles.update();

          this.glitch.update(ts, this.tmpData)
          this.dotscreen.update(ts, this.tmpData)
          this.sepia.update(ts, this.tmpData)
          this.vignette.update(ts, this.tmpData)
      }
    }

    render() {
    	if (!this.params.active)
        	this.params.active = true;
        this.renderer.render( this.scene, this.camera );	
    }

    addListeners() {
    	window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
    	this.keyboard = new Keyboard();	
      this.keyboard.addObject( this.sphere.getMesh() );
      this.keyboard.addObject( this.particles.getMesh() );
      this.keyboard.addObject( this.terrain.getMesh() );
      this.keyboard.addObject( this.ground.getMesh() );
    }

    onWindowResize() {
    	this.params.width = window.innerWidth;
	    this.params.height = window.innerHeight;

	    this.camera.aspect = this.params.width / this.params.height;
	    this.camera.updateProjectionMatrix();

      this.renderer.setSize( this.params.width, this.params.height );
	    this.composer.setSize( this.params.width, this.params.height );
    }

}

export { World };