
// let THREE = require('../vendors/three.min');
let glslify = require('glslify');




class Sphere {

  constructor() {


    this.vertexShader   = glslify('../../vertex-shaders/ashima.vert');
    this.fragmentShader = glslify('../../fragment-shaders/sphere-color.frag');

    this.meshMaterial = new THREE.ShaderMaterial( {
      uniforms: { 
          time: { type: "f", value: 0 },
          weight: { type: "f", value: 0 },
          opacity: { type: 'f', value: 1.0 } 
        },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        shading: THREE.SmoothShading,
        wireframe: false,
        transparent: true

      } 
    );

    // wireframe
    this.meshMaterial2 = new THREE.ShaderMaterial( {
      uniforms: { 
          time: { type: "f", value: 0 },
          weight: { type: "f", value: 0 },
          opacity: { type: 'f', value: 0.0 } 
        },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        shading: THREE.SmoothShading,
        wireframe: true,
        transparent: true
      } 
    );

    this.waveData = null;
    this.barData  = null;


    this.meshGeometry = new THREE.DodecahedronGeometry( 20, 3 );
    // this.buffergeometry = new THREE.BufferGeometry().fromGeometry(this.meshGeometry);


    // this.mesh   = new THREE.Mesh( this.meshGeometry, this.meshMaterial );

    //  NEW
    this.mesh = new THREE.Object3D()
    this.mesh.add( 
      new THREE.Mesh(
        this.meshGeometry,
        this.meshMaterial2
      )
    );

    this.mesh.add( new THREE.Mesh(
      this.meshGeometry,
      this.meshMaterial
    ));





    this.mesh.position.z = -150;
    
    this.clock           = Date.now();
    
    this.speed           = .0003;
    this.weight          = 5;
    this.opacity         = 0.0;

    // this.update();
    // console.log("nb vertices : ", this.mesh.geometry.attributes.position.array.length / 3)
    // console.log("ff",this.mesh)
    // this.mesh.children[0].geometry.dynamic = true;
    // this.mesh.children[1].geometry.dynamic = true;

    return this;
  }



  update( ts, data ) {
    window.requestAnimationFrame( this.update.bind(this) );

    /* update soudn data for everyone bitch */
    // this.waveData = tmpData.time
    // this.barData  = this.tmpData.freq

      if(data && data != "undefined"){
        if(data.freq[200] > 100 ){
          // mesh 1 lower & mesh 2 greater
          if(this.opacity < 1){
            this.opacity += 0.01;
          }
        }
        else{
          // mesh 1 greater & mesh 2 lower
          if(this.opacity > 0){
            this.opacity -= 0.01;
          }
        }
        this.meshMaterial.uniforms[ 'opacity' ].value  = this.opacity;
        this.meshMaterial2.uniforms[ 'opacity' ].value = this.opacity;
      }

    // this.meshMaterial2.uniforms[ 'opacity' ].value = 0.5;
    // }
    // console.log(this.opacity)

    // this.meshMaterial.uniforms[ 'opacity' ].value  = 0;
    // this.meshMaterial2.uniforms[ 'opacity' ].value = 0;

    this.meshMaterial.uniforms[ 'time' ].value   = this.speed * ( Date.now() - this.clock );
    this.meshMaterial.uniforms[ 'weight' ].value = this.weight;

    this.meshMaterial2.uniforms[ 'time' ].value   = this.speed * ( Date.now() - this.clock );
    this.meshMaterial2.uniforms[ 'weight' ].value = this.weight;

  }

  setWeight( _weight ) {
    this.weight = _weight;
  }

  getSoundDataWave(){
    return this.waveData;
  }

  getSoundDataBar(){
    return this.barData;
  }


  getMesh() {
    return this.mesh;
  }

}

export { Sphere };