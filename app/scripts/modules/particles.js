// let THREE = require('../vendors/three.min');
let glslify = require('glslify');

class Particles {

  constructor(scene, sound) {

    this.scene = scene
    this.sound = sound

    THREE.ImageUtils.crossOrigin = "anonymous";
    this.uniforms = {
      color:     { type: "c", value: new THREE.Color( 0xffffff ) },
      alpha:     { type: 'f', value: 1.0 } ,
      texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "http://lab.hengpatrick.fr/three-js-audio-experiment/spark1.png" ) }
    };
                  
    this.shaderMaterial2 = new THREE.ShaderMaterial( {
      uniforms:       this.uniforms,
      vertexShader:   glslify('../../vertex-shaders/particles.vert'),
      fragmentShader: glslify('../../fragment-shaders/particles.frag'),
      blending:       THREE.AdditiveBlending,
      depthTest:      false,
      transparent:    true,
      opacity:        1
    });

    this.geom = new THREE.TextGeometry( "ODESZA", {
      size: 10,
      height: 1,
      curveSegments: 4,
      font: 'optimer',
      weight: 'normal',
      style: 'normal',
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelEnabled: true,
      material: 0,
      extrudeMaterial: 1,
    });
    
    this.particles  = 4800;
    this.verticesNb = this.geom.vertices.length;
    this.vertices   = this.geom.vertices;

    let radius = 200;

    this.positions = new Float32Array( this.vertices.length * 3 );
    this.colors    = new Float32Array( this.vertices.length * 3 );
    this.sizes     = new Float32Array( this.vertices.length );
    
    this.color     = new THREE.Color();

    for (let i = 0, l = this.vertices.length; i < l; i++) {
      this.vertex = this.vertices[i];
      this.vertex.toArray(this.positions, i * 3);
      this.color.setHSL(1, 1, 1)
      this.color.toArray(this.colors, i * 3);
      this.sizes[i] = i < this.verticesNb ? 10 : 40;
    }

    this.geometry2 = new THREE.BufferGeometry();

    this.geometry2.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
    this.geometry2.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
    this.geometry2.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );


    this.particleSystem = new THREE.Points(this.geometry2, this.shaderMaterial2);
    this.particleSystem.position.z = -70
    this.particleSystem.position.x = -30

    // console.log("ppt", this.particleSystem)
    
    this.clock   = Date.now()
    this.drop    = true
    this.blocker = true
    this.opacity = 1.0;
    this.launchedSound = true;

    this.particleSystem.name = "particleSystem"

    document.addEventListener("click", 
      function(){
        this.drop = false;
        console.log("click")
        if(this.launchedSound){
          this.launchedSound = false
          var load = document.getElementById("load");
          TweenLite.to(load, 0.5, {autoAlpha: 0});
          this.sound.start()
        }
      }.bind(this)
    );

    return this;
  }

  update() {
    var time = Date.now() * 0.01;

    if(this.drop){
      var sizes = this.geometry2.attributes.size.array;
      for ( var i = 0; i < this.particles; i++ ) {
        sizes[ i ] = 5 * ( 1 + Math.sin(  i + time ) );
      }
      this.geometry2.attributes.size.needsUpdate = true;
    }

    else{
      var positions = this.geometry2.attributes.position.array
      for ( var i = 0; i < positions.length; i+=4 ) {
        positions[ i ] += (5 * ( 1 + (Math.sin(  i + time )) )) * 0.004 ;
      }

      if(this.opacity > 0.3){
        this.opacity -= 0.001
      }

      this.geometry2.attributes.position.needsUpdate = true;
      this.shaderMaterial2.uniforms[ 'alpha' ].value = this.opacity;
    }
  }

  getMesh(){
    return this.particleSystem;
  }


  launchSound(){
    this.sound.start()
  }

}

export { Particles };






