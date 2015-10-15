// let THREE = require('../vendors/three.min');
let glslify = require('glslify');
let PERLIN_NOISE = require('../vendors/improved_perlin_noise');


class Terrain {

  constructor(sphere) {

    this.worldWidth           = 256
    this.worldDepth           = 256
    this.worldHalfWidth       = this.worldWidth / 2
    this.worldHalfDepth       = this.worldDepth / 2
    this.opacity              = 0.0;
    this.noiseDisplacementPic = 1.0;
    this.amplitude = 0.0;



    this.clock = new THREE.Clock();

    this.terrain_sphere = sphere

    this.vertexShader   = glslify('../../vertex-shaders/terrain-sombrero.vert');
    this.fragmentShader = glslify('../../fragment-shaders/terrain.frag');
    // this.fragmentShader = glslify('../../fragment-shaders/cloud.frag');

    /* FROM SAMSY */
    this.options = {
      elevation: 1,
      noise_range: 2.14,
      sombrero_amplitude: 0.6,
      sombrero_frequency: 10.0,
      speed: 0.8,
      segments: 332,
      wireframe_color: '#ff0000',
      perlin_passes: 1,
      wireframe: false,
      floor_visible: true,
      transparent: true,
      opacity: 1.0
    };

    this.options2 = {
      elevation: 1,
      noise_range: 2.14,
      sombrero_amplitude: 0.6,
      sombrero_frequency: 10.0,
      speed: 0.8,
      segments: 332,
      wireframe_color: '#000000',
      perlin_passes: 1,
      wireframe: true,
      floor_visible: true,
      transparent: true,
      opacity: 0.0
    };

    this.uniforms = {
      iResolution : { type: "v3", value: new THREE.Vector3(1000,1000,1000) },
      iGlobalTime: { type: "f", value: 1.0 },
      iMouse: { type: "v4", value: new THREE.Vector4(200,200,200,200) },
      R: { type: "v3", value: new THREE.Vector3() },
      L: { type: "v3", value: new THREE.Vector3() },

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
      },
      opacity: {
        type: 'f',
        value: this.options.opacity
      }
    };

    this.uniforms2 = {
      iResolution : { type: "v3", value: new THREE.Vector3(1000,1000,1000) },
      iGlobalTime: { type: "f", value: 1.0 },
      iMouse: { type: "v4", value: new THREE.Vector4(200,200,200,200) },
      R: { type: "v3", value: new THREE.Vector3() },
      L: { type: "v3", value: new THREE.Vector3() },

      time: {
        type: "f",
        value: 0.0
      },
      speed: {
        type: "f",
        value: this.options2.speed
      },
      elevation: {
        type: "f",
        value: this.options2.elevation
      },
      noise_range: {
        type: "f",
        value: this.options2.noise_range
      },
      offset: {
        type: "f",
        value: this.options2.elevation
      },
      perlin_passes: {
        type: "f",
        value: this.options2.perlin_passes
      },
      sombrero_amplitude: {
        type: "f",
        value: this.options2.sombrero_amplitude
      },
      sombrero_frequency: {
        type: "f",
        value: this.options2.sombrero_frequency
      },
      line_color: {
        type: "c",
        value: new THREE.Color(this.options2.wireframe_color)
      },
      opacity: {
        type: 'f',
        value: this.options2.opacity
      }
    };


    this.plane_geometry = new THREE.PlaneBufferGeometry(20, 20, this.options.segments, this.options.segments);
    this.plane_geometry2 = new THREE.PlaneBufferGeometry(20, 20, this.options.segments, this.options.segments);
    
    this.plane_material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      wireframe: this.options.wireframe,
      wireframeLinewidth: 1,
      transparent: true,
      uniforms: this.uniforms
    });

    this.plane_material2 = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      wireframe: this.options2.wireframe,
      wireframeLinewidth: 1,
      transparent: true,
      uniforms: this.uniforms2
    });

    this.groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x050505
    });

    this.groundMaterial2 = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x050505
    });

    this.groundMaterial.color.setHSL(0, 0, 0);
    this.groundMaterial2.color.setHSL(0, 0, 0);
    
    this.materials  = [this.groundMaterial, this.plane_material];
    this.materials2 = [this.groundMaterial2, this.plane_material2];
    // this.materials  = [ this.plane_material];
    // this.materials2 = [ this.plane_material2];
    
    this.plane_mesh = new THREE.Object3D()


    this.plane_mesh.add( THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials) );
    this.plane_mesh.add( THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry2, this.materials2) );
    
    // this.plane_mesh.add( new THREE.Mesh(this.plane_geometry, this.plane_material) );
    // this.plane_mesh.add( new THREE.Mesh(this.plane_geometry2, this.plane_material2) );


    this.plane_mesh.rotation.x = -Math.PI / 2;
    this.plane_mesh.position.y = -2;

    this.tick = 0;

    return this;
  }



  update( ts, data) {
    this.tick += 1
    this.plane_material.uniforms['time'].value = this.clock.getElapsedTime();
    this.plane_material2.uniforms['time'].value = this.clock.getElapsedTime();

    if( data && data != "undefined" ){
      // console.log(this.averageData("time" , data, 200, 250))
      if( this.averageData("time" , data, 100, 150) > 130|| this.averageData("time" , data, 100, 150) < 110 ){
        // mesh 1 lower & mesh 2 greater
        if( this.opacity < 1 ){
          this.opacity += 0.01;
        }
      }
      else{
        // mesh 1 greater & mesh 2 lower
        if( this.opacity > 0 ){
          this.opacity -= 0.01;
        }
      }
      // console.log(this.opacity, ": ", 1 - this.opacity)
      this.plane_material.uniforms[ 'opacity' ].value  =  this.opacity;
      this.plane_material2.uniforms[ 'opacity' ].value =  this.opacity;

      // if( data.time[200] > 150 ){
      //   this.plane_material.uniforms['noise_range'].value = this.options.noise_range + ( data.time[200] * 0.004 );
      //   this.plane_material2.uniforms['noise_range'].value = this.options.noise_range + ( data.time[200] * 0.004 );
      // }
      // console.log(this.averageData("time" , data, 0, 20))
      if( this.averageData("time" , data, 0, 20) > 140  || this.averageData("time" , data, 0, 20) < 80 ){
        if( this.options.perlin_passes + Math.sin( data.time[10] ) > 1 ){
          this.noiseDisplacementPic = 2.5
          this.amplitude = 0.008 * (data.time[10] / 10000)
        }
        else{
          this.noiseDisplacementPic = 1
          this.amplitude = -0.2
        }
        // console.log(this.noiseDisplacementPic)

        // this.plane_material.uniforms['sombrero_amplitude'].value = this.options.sombrero_amplitude + this.amplitude;
        // this.plane_material2.uniforms['sombrero_amplitude'].value = this.options.sombrero_amplitude + this.amplitude;

        this.plane_material.uniforms['perlin_passes'].value = this.noiseDisplacementPic ;
        this.plane_material2.uniforms['perlin_passes'].value = this.noiseDisplacementPic ;



        // this.plane_material.uniforms[ 'iGlobalTime' ].value = this.tick / 100;
        // this.plane_material.uniforms[ 'iResolution' ].value = new THREE.Vector3(1,1,1);
        // this.plane_material.uniforms[ 'iMouse' ].value = new THREE.Vector4(1000,1000,100,0);
        // this.plane_material.uniforms[ 'R' ].value = new THREE.Vector3(2.,4.,2.);
        // this.plane_material.uniforms[ 'L' ].value = new THREE.Vector3(-.4,0.,1.);


        // this.plane_material2.uniforms[ 'iGlobalTime' ].value = this.tick / 100;
        // this.plane_material2.uniforms[ 'iResolution' ].value = new THREE.Vector3(1,1,1);
        // this.plane_material2.uniforms[ 'iMouse' ].value = new THREE.Vector4(1000,1000,100,0);
        // this.plane_material2.uniforms[ 'R' ].value = new THREE.Vector3(2.,4.,2.);
        // this.plane_material2.uniforms[ 'L' ].value = new THREE.Vector3(-.4,0.,1.);







      }
    }

  }

  averageData(type, inputData, numberStart, numberAfer){
    var average = 0;
    if(type == "freq"){    
      for(var i = numberStart; i < numberAfer; i++){
        average += inputData.freq[i]
      }
    }
    else{
      for(var i = 0; i < numberAfer; i++){
        average += inputData.time[i]
      }
    }
    return average / numberAfer;
  }

  getMesh() {
    return this.plane_mesh;
  }

}

export { Terrain };