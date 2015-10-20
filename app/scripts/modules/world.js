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
import { Intro } from 'modules/intro';

let PERLIN_NOISE = require('../vendors/improved_perlin_noise');

// let OrbitControls = require('three-orbit-controls')(THREE);

class World {

  constructor( _options ) {

    let options    = _options || {};
    
    console.log("options", options)

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

  init(quality) {
    //  true == HIGH QUALITY
    this.quality = quality
    
  	this.scene = new THREE.Scene()
    // this.fog = new THREE.Fog( 0xff00ff, -0.1, 10000 )

    // this.scene.fog = this.fog
  	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100000 )
  	this.camera.position.z = 0
    this.scene.add( this.camera )
    this.addLights()

    this.renderer = new THREE.WebGLRenderer({
        antialias: this.quality
    });

  	this.renderer.setSize( this.params.width, this.params.height )

  	this.container.appendChild( this.renderer.domElement )

  	this.clock = Date.now()

    this.addSphere( this.quality )
    this.addParticles( this.scene, this.sound, this.quality )
    // this.particles.launchSound()
    this.addTerrain( this.quality )
    // this.addGlitch( this.renderer, this.scene, this.camera )
    // this.addDotScreen( this.renderer, this.scene, this.camera )
    // this.addSepia( this.renderer, this.scene, this.camera )
    if(this.quality){
      this.addGround( this.quality )
      this.addVignette( this.renderer, this.scene, this.camera )
    }

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

  addSphere( quality ) {
  	this.sphere = new Sphere( quality )
  	this.scene.add( this.sphere.getMesh() )
  }

  addParticles(scene, sound, particles) {
    this.particles = new Particles(scene, sound, particles)
    this.particles.drop = true
    this.scene.add( this.particles.getMesh() )
  }

  addTerrain( quality ) {
    this.terrain = new Terrain( quality )
    this.scene.add( this.terrain.getMesh() )
  }

  addGround( quality ) {
    this.ground = new Ground( quality )
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


      if(this.particles.opacity < 0.3){
        this.scene.remove( this.particles.particleSystem )
        this.scene.remove( this.particles )
      }
      else{
        this.particles.update();
      }
      
      if(this.quality){
        this.ground.update(ts , this.tmpData);
        this.vignette.update(ts, this.tmpData)
      }
      // console.log(this.sound.getEndEvent())
      if( this.sound.getEndEvent() ){
        this.params.active = false
      
        /* RESTART EVERYTHING */
          let intro = new Intro()

          UIComponents.init('low', 0.75);
          UIComponents.init('high', 0.75);

          var lowButton = document.getElementById('low')
          var highButton = document.getElementById('high')

          lowButton.addEventListener('click', function(){
            intro.startExp( false )
          } )

          highButton.addEventListener('click', function(){
            intro.startExp( true )
          } )
        /* END RESTART */
      }

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
    if(this.quality){
      this.keyboard.addObject( this.ground.getMesh() );
    }
  }

  onWindowResize() {
  	this.params.width = window.innerWidth;
    this.params.height = window.innerHeight;

    this.camera.aspect = this.params.width / this.params.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.params.width, this.params.height );
    // this.composer.setSize( this.params.width, this.params.height );
  }

}

export { World };