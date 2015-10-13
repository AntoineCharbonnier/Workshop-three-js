// let THREE = require('../vendors/three.min');
let glslify = require('glslify');
let PERLIN_NOISE = require('../vendors/improved_perlin_noise');


class Terrain {

  constructor(sphere) {

    this.worldWidth     = 256
    this.worldDepth     = 256
    this.worldHalfWidth = this.worldWidth / 2
    this.worldHalfDepth = this.worldDepth / 2


    this.clock = new THREE.Clock();

    this.terrain_sphere = sphere

    this.plane_material = new THREE.MeshBasicMaterial( 
      {
        color: 0xffff00, 
        side: THREE.DoubleSide,
        wireframe: false
      } 
    );



    this.vertexShader   = glslify('../../vertex-shaders/terrain-sombrero.vert');
    this.fragmentShader = glslify('../../fragment-shaders/terrain.frag');

    /* FROM SAMSY */
    this.options = {
      elevation: 1,
      noise_range: 2.14,
      sombrero_amplitude: 0.6,
      sombrero_frequency: 10.0,
      speed: 0.8,
      segments: 166,
      wireframe_color: '#e25cfe',
      perlin_passes: 1,
      wireframe: true,
      floor_visible: true
    };
    
    this.uniforms = {
      time: {
        type: "f",
        value: 0.0
      },
      speed: {
        type: "f",
        value: this.options.speed
      },
      elevation: {
        type: "f",
        value: this.options.elevation
      },
      noise_range: {
        type: "f",
        value: this.options.noise_range
      },
      offset: {
        type: "f",
        value: this.options.elevation
      },
      perlin_passes: {
        type: "f",
        value: this.options.perlin_passes
      },
      sombrero_amplitude: {
        type: "f",
        value: this.options.sombrero_amplitude
      },
      sombrero_frequency: {
        type: "f",
        value: this.options.sombrero_frequency
      },
      line_color: {
        type: "c",
        value: new THREE.Color(this.options.wireframe_color)
      }
    };


    this.plane_geometry = new THREE.PlaneBufferGeometry(10, 10, this.options.segments, this.options.segments);
    
    this.plane_material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      wireframe: this.options.wireframe,
      wireframeLinewidth: 1,
      transparent: true,
      uniforms: this.uniforms
    });

    this.groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x050505
    });

    this.groundMaterial.color.setHSL(0, 0, 0);
    
    this.materials = [this.groundMaterial, this.plane_material];
    
    this.plane_mesh = THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials);
    
    this.plane_mesh.rotation.x = -Math.PI / 2;
    this.plane_mesh.position.y = -2;
    // this.plane_mesh.position.y = -64;
    // return this.plane_mesh.position.y = -0.5;

    return this;
  }



  update( ts, noise_range) {
    window.requestAnimationFrame( this.update.bind(this) );
    this.plane_material.uniforms['time'].value = this.clock.getElapsedTime();
    // console.log(this.terrain_sphere.getSoundDataWave())
    // this.plane_material.uniforms['noise_range'].value = noise_range;
    //  noise range 
    // perlin passes
  }

  getMesh() {
    return this.plane_mesh;
  }

  // generateHeight( width, height ) {
  //   var size = width * height, data = new Uint8Array( size ),
  //   perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
  //   for ( var j = 0; j < 4; j ++ ) {
  //     for ( var i = 0; i < size; i ++ ) {
  //       var x = i % width, y = ~~ ( i / width );
  //       data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
  //     }
  //     quality *= 5;
  //   }
  //   return data;
  // }


}

export { Terrain };