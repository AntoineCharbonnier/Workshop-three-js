let glslify = require('glslify');
let PERLIN_NOISE = require('../vendors/improved_perlin_noise');

class Ground {

  constructor(sphere) {

    this.worldWidth           = 256
    this.worldDepth           = 256
    this.worldHalfWidth       = this.worldWidth / 2
    this.worldHalfDepth       = this.worldDepth / 2
    this.opacity              = 0.0;
    this.noiseDisplacementPic = 1.0;
    this.amplitude = 0.0;

    this.clock = new THREE.Clock();

    this.ground_sphere = sphere

    this.vertexShader   = glslify('../../vertex-shaders/simple.vert');
    this.fragmentShader = glslify('../../fragment-shaders/cloud.frag');

    /* FROM SAMSY */
    this.options = {
      segments: 500,
      wireframeColor: '#ff0000',
      wireframe: false,
      transparent: true,
      color: 0xffffff,
      opacity: 0.0
    };

    this.uniforms = {
      iResolution : { type: "v3", value: new THREE.Vector3(100,100,100) },
      iGlobalTime: { type: "f", value: 1.0 },
      iMouse: { type: "v4", value: new THREE.Vector4(200,200,200,200) },
      R: { type: "v3", value: new THREE.Vector3() },
      L: { type: "v3", value: new THREE.Vector3() },
      time: { type: "f", value: 0 },
      weight: { type: "f", value: 0 },
      opacity: { type: 'f', value: 0.0 },
      resolution: { type: "v2", value: new THREE.Vector2(100,100) }
    };

    this.ground_material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      wireframe: this.options.wireframe,
      uniforms: this.uniforms
    });

    this.ground_geometry = new THREE.PlaneBufferGeometry(500,500, this.options.segments, this.options.segments);
    this.ground_mesh = new THREE.Mesh(
          this.ground_geometry,
          this.ground_material        
        );
    this.ground_mesh.position.z = -100
    this.ground_mesh.position.y = 30
    this.ground_mesh.position.x = 50

    this.tick   = 0;
    this.speed  = .3;
    this.weight = 5;
    this.opacity = 0.0;
    this.light = 0.0
    this.ambientLuminosity = 0.0

    return this;
  }

  update( ts, data) {
    this.tick += 1
    this.light = this.tick
    this.ground_material.uniforms[ 'resolution' ].value  = new THREE.Vector2(1,1);
    this.ground_material.uniforms[ 'iGlobalTime' ].value = this.tick / 100;
    this.ground_material.uniforms[ 'iResolution' ].value = new THREE.Vector3(1,1,1);
    this.ground_material.uniforms[ 'iMouse' ].value      = new THREE.Vector4(10,10,10,0);
    this.ground_material.uniforms[ 'R' ].value           = new THREE.Vector3( 2.,4.,2.);
    this.ground_material.uniforms[ 'L' ].value           = new THREE.Vector3(-.4,0.,1.);
    
    if( data && data != "undefined" ){
      if( (140 < window.averageData("freq", data, 0, 20))  && (window.averageData("freq", data, 0, 20) < 155) ){ // && (this.averageData("freq", data, 0, 20) < 155)
        if(this.opacity < 1){
          this.opacity += 0.01
        }
      }
      else{
        if(this.opacity > 0){
          this.opacity -= 0.01
        }
      }
    }
    
    this.ground_material.uniforms[ 'opacity' ].value     = this.opacity;
  }

  getMesh() {
    return this.ground_mesh;
  }

}

export { Ground };