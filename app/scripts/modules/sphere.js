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
          opacity: { type: 'f', value: 1.0 } ,
          redValue: { type: 'f', value: 0.0 }, 
          greenValue: { type: 'f', value: 0.0 },
          blueValue: { type: 'f', value: 0.0 } 
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
          opacity: { type: 'f', value: 0.0 },
          redValue: { type: 'f', value: 0.0 },
          greenValue: { type: 'f', value: 0.0 },
          blueValue: { type: 'f', value: 0.0 }
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

    this.meshGeometry = new THREE.DodecahedronGeometry( 20, 5 );
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
    
    this.redValue        = 0;
    this.greenValue      = 0;
    this.blueValue       = 0;

    this.step = 0.001

    return this;
  }

  update( ts, data ) {
    // window.requestAnimationFrame( this.update.bind(this) );

    /* update soudn data for everyone bitch */
    // this.waveData = tmpData.time
    // this.barData  = this.tmpData.freq

    if(data && data != "undefined"){
      if(data.freq[200] > 100 ){
        // mesh 1 lower & mesh 2 greater
        if(this.opacity < 1){
          this.opacity += 0.01;
        }
        if(this.opacity < 0.9){
          if(data.freq[200] > 140){
            // console.log(data.freq[200])
            this.weight += 0.1
          }
          else{
            if(this.weight > 5){
              this.weight -= 0.1
            }
          }
        }
      }
      else{
        // mesh 1 greater & mesh 2 lower
        if(this.opacity > 0){
          this.opacity -= 0.01;
        }
      }

      //  voice ? with color
      console.log( this.averageData("fred" , data, 80, 170) )
      if(this.averageData("fred" , data, 0, 80) > 100){
        this.redValue   += this.step 
      }
      else{
        this.redValue   -= this.step
      }
      if(this.averageData("fred" , data, 80, 160) > 100){
        this.greenValue += this.step 
      }
      else{
        this.greenValue -= this.step
      }
      if(this.averageData("fred" , data, 160, 255) > 100){
        this.blueValue  += this.step 
      }
      else{
        this.blueValue  -= this.step
      }

      console.log(this.redValue,this.greenValue,this.blueValue)

      // if(this.redValue >= 1 || this.greenValue >= 1 || this.blueValue >= 1 ){
      //   // this.blueValue = this.greenValue = this.redValue = 
      // }

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
    
    this.meshMaterial2.uniforms[ 'redValue' ].value = this.redValue;
    this.meshMaterial2.uniforms[ 'greenValue' ].value = this.greenValue;
    this.meshMaterial2.uniforms[ 'blueValue' ].value = this.blueValue;

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