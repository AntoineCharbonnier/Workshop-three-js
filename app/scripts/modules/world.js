import { Keyboard }  from './keyboard';
import { Sphere }    from './sphere';
import { Terrain }   from './terrain';
import { Ground }    from './ground';
import { Circle }    from './circle';
import { Glitch }    from './glitch';
import { DotScreen } from './dotscreen';
import { Sepia }     from './sepia';
import { Vignette }  from './vignette';
import { Particles } from './particles';
import { Sound }     from './sound';
import { Intro }     from 'modules/intro';
import { Outro }     from 'modules/outro';

// let PERLIN_NOISE = require('../vendors/improved_perlin_noise');

// let OrbitControls = require('three-orbit-controls')(THREE);

class World {

  constructor( _options ) {

    // this.controlsWorld = true

    // if(this.controlsWorld){
    //   this.orbitControls = require('orbit-controls')()
    //   console.log("orbit",this.orbitControls)
    // }

    let options    = _options || {};

    this.scene    = null;
    this.camera   = null;
    this.renderer = null;
    this.composer = null;
    this.keyboard = null;
    this.controls = null;
    this.sphere   = null;
    this.ground   = null;
    this.container = options.container || document.body;

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
    this.sound.load( "mp3/odesza-say-my-name.mp3" )
    // this.sound.load( "mp3/sound-exp/InDaClub-50Cent.mp3" )
    // this.sound.load( "mp3/sound-exp/all-my-love.mp3" )
    // this.sound.load( "mp3/sound-exp/light-it-up.mp3" )
    // this.sound.load( "mp3/sound-exp/ambiant-dark.mp3" )

    this.tmpData = this.sound.getData();
  }

  init(quality) {
    //  true == HIGH QUALITY
    this.quality = quality


    // this.target = new THREE.Vector3(0,0,0)
    // this.target = new THREE.Vector3(0,30,0)
    // this.target = new THREE.Vector3(0.08109186424098777, -0.05447687655938174,  7.599372104290837)



  	this.scene  = new THREE.Scene()

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

    this.addTerrain( this.quality )

    if(this.quality){
      this.addGround( this.quality )
      this.addVignette( this.renderer, this.scene, this.camera )
      this.fog = new THREE.FogExp2(0x000000, 0.055)
      this.scene.fog = this.fog
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
    this.scene.add( this.particles.getMesh() )
    setTimeout(()=>
      this.particles.drop = false
    , 1000)
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

      if( this.sound.getEndEvent() ){
        this.params.active = false
        this.sound.disconnect(this.sound._analyser)
        /*  OUTRO  */
        let outro = new Outro()
        /*  END OUTRO  */
      }
    }
  }

  reset(){
    this.scene     = null;
    this.camera    = null;
    this.renderer  = null;
    this.composer  = null;
    this.keyboard  = null;
    this.clock     = null;
    this.sphere    = null;
    this.ground    = null;
    this.particles = null;
    this.terrain   = null;
  }


  updateControls(){    
    var position = this.camera.position.toArray()
    var direction = this.target.toArray()
    this.orbitControls.update(position, direction)
    this.camera.position.fromArray(position)
    this.camera.lookAt(this.target.fromArray(direction))

  }

  render() {
    if (!this.params.active)
        this.params.active = true;
      this.renderer.render( this.scene, this.camera );
    // if(this.controlsWorld){
      // this.updateControls()
    // }
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
    this.params.width  = window.innerWidth;
    this.params.height = window.innerHeight;

    this.camera.aspect = this.params.width / this.params.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.params.width, this.params.height );
    // this.composer.setSize( this.params.width, this.params.height );
  }

}

export { World };