import { Keyboard } from './keyboard';
import { Sphere } from './sphere';
import { Terrain } from './terrain';
import { Circle } from './circle';
import { Glitch } from './glitch';
import { Particles } from './particles';
import { Sound } from './sound';
// import { Test } from './test';

// let THREE        = require('../vendors/three.min');
let PERLIN_NOISE = require('../vendors/improved_perlin_noise');
// let EffectComposer = require('three-effectcomposer')(THREE);

// require('../vendors/RenderPass')(THREE)








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
    	this.scene = new THREE.Scene();
    	this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000 );
    	
      this.scene.add( this.camera );
      this.addLights();
      // this.addControls();
      this.renderer = new THREE.WebGLRenderer({
	        antialias: true
	    });

	    // this.renderer.setClearColor(  0xffffff, 1 );
    	this.renderer.setSize( this.params.width, this.params.height );

    	this.container.appendChild( this.renderer.domElement );

    	this.clock = Date.now();


      this.addSphere();
      this.addParticles(this.scene, this.sound);
      this.addTerrain( this.sphere );
      this.addGlitch( this.renderer, this.scene, this.camera )

      this.addListeners();
    	
      this.animate();
    }

    addLights() {
        var ambient = new THREE.AmbientLight( 0x777777 );
        this.scene.add( ambient );

        // var ambientWhiteLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        // this.scene.add( ambientWhiteLight );

        var directionalLight = new THREE.DirectionalLight( 0xe2ffaa );
        directionalLight.position.x = 0;
        directionalLight.position.y = -1;
        directionalLight.position.z = -1;
        directionalLight.position.normalize();
        this.scene.add( directionalLight );


        var light = new THREE.SpotLight( 0x999999, 2, 0 );
        light.position.set( -500, 9500, -12000 );
        light.target.position.set( 0, 0, -11990 );
        light.castShadow = true;
        this.scene.add( light );
    }

    addSphere() {
    	this.sphere = new Sphere();
    	this.scene.add( this.sphere.getMesh() );
    }

    addParticles(scene, sound) {
      this.particles = new Particles(scene, sound);
      this.scene.add( this.particles.getMesh() );
      console.log("mesh text : ", this.particles.getMesh())
    }

    addTerrain( sphere ) {
      this.terrain = new Terrain( sphere );
      this.scene.add( this.terrain.getMesh() );
    }

    /* POSTPROCESSING */
    addGlitch( renderer, scene, camera ){
      this.glitch = new Glitch( renderer, scene, camera );
      this.glitch.render();  
    }

    // addPostProcess(){
    //   // postprocessing

    //     var renderModel = new THREE.RenderPass( scene, camera );
    //     var effectBloom = new THREE.BloomPass( 0.75 );
    //     var effectFilm = new THREE.FilmPass( 0.5, 0.5, 1448, false );

    //     effectFocus = new THREE.ShaderPass( THREE.FocusShader );

    //     effectFocus.uniforms[ "screenWidth" ].value = window.innerWidth;
    //     effectFocus.uniforms[ "screenHeight" ].value = window.innerHeight;

    //     effectFocus.renderToScreen = true;

    //     composer = new THREE.EffectComposer( renderer );

    //     composer.addPass( renderModel );
    //     composer.addPass( effectBloom );
    //     composer.addPass( effectFilm );
    //     composer.addPass( effectFocus );
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
          this.particles.update();

          this.glitch.update(ts, this.tmpData)
          // this.glitch.render();
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
    }

    onWindowResize() {
    	this.params.width = window.innerWidth;
	    this.params.height = window.innerHeight;

	    this.camera.aspect = this.params.width / this.params.height;
	    this.camera.updateProjectionMatrix();

	    this.renderer.setSize( this.params.width, this.params.height );
    }

}

export { World };