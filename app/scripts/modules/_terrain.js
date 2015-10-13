let THREE = require('../vendors/three.min');
let glslify = require('glslify');


class Terrain {

  constructor(scene) {

    


    this.options = {
      elevation: 1,
      noise_range: 2.14,
      sombrero_amplitude: 0.6,
      sombrero_frequency: 10.0,
      speed: 0.8,
      segments: 324,
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

    this.buildPlanes(this.options.segments);
    this.terrain = new Terrain(scene)
    
    return this;
  }


  buildPlanes(segments) {
    this.vertexShader = glslify('../../vertex-shaders/terrain-sombrero.vert');
    this.fragmentShader = glslify('../../fragment-shaders/terrain.frag');
    
    this.plane_geometry = new THREE.PlaneBufferGeometry(20, 20, segments, segments);
    
    // this.plane_material = new THREE.ShaderMaterial({
    //   vertexShader: this.vertexShader,
    //   fragmentShader: this.fragmentShader,
    //   wireframe: this.options.wireframe,
    //   wireframeLinewidth: 1,
    //   transparent: false,
    //   uniforms: this.uniforms
    // });

    this.plane_material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    
    this.groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x050505
    });

    this.groundMaterial.color.setHSL(0.095, 1, 0.75);
    this.materials = [this.groundMaterial, this.plane_material];
    this.plane_mesh = THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials);
    this.plane_mesh.rotation.x = -Math.PI / 2;
    return this.plane_mesh.position.y = -0.5;
  };



  update( ts ) {

    window.requestAnimationFrame( this.update.bind(this) );
    
    // this.plane_material.uniforms['time'].value = this.clock.getElapsedTime()

    // this.meshMaterial.uniforms[ 'time' ].value = this.speed * ( Date.now() - this.clock );

  }

  // setWeight( _weight ) {
  //   this.weight = _weight;
  // }

  getMesh() {
    return this.mesh;
  }

}

export { Terrain };