let glslify = require('glslify');

class Sphere {

  constructor( quality ) {
    this.quality = quality
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

    if(this.quality){
      this.meshGeometry = new THREE.DodecahedronGeometry( 20, 4 );
    }
    else{
      this.meshGeometry = new THREE.SphereGeometry( 20, 32, 32, 0, 6.3, 0, 3.1 );
    }

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

    // this.mesh.position.z = -150;
    this.mesh.position.z = -104;
    this.mesh.position.y = 18;

    
    this.clock           = Date.now();
    
    this.speed           = .0003;
    this.weight          = 5;
    this.opacity         = 0.0;
    
    this.redValue        = 0;
    this.greenValue      = 0;
    this.blueValue       = 0;
    
    this.stepRed         = 0.001
    this.stepGreen       = 0.01
    this.stepBlue        = 0.005

    return this;
  }

  update( ts, data ) {
    if(data && data != "undefined"){
      if(data.freq[200] > 100 ){
        // mesh 1 lower & mesh 2 greater
        if(this.opacity < 1){
          this.opacity += 0.1;
        }
        if(this.opacity < 0.9){
          if(data.freq[200] > 140){
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
          this.opacity -= 0.05;
        }
      }

      //  voice with color
      if(window.averageData("fred" , data, 0, 80) > 100){
        this.redValue   += this.stepRed
      }
      else{
        this.redValue   -= this.stepRed
      }
      if(window.averageData("fred" , data, 80, 160) > 100){
        this.greenValue += this.stepGreen
      }
      else{
        this.greenValue -= this.stepGreen
      }
      if(window.averageData("fred" , data, 160, 255) > 100){
        this.blueValue  += this.stepBlue
      }
      else{
        this.blueValue  -= this.stepBlue
      }

      if((this.redValue >= 1 || this.greenValue >= 1 || this.blueValue >= 1) || (this.redValue <= 0.2 || this.greenValue <= 0.2 || this.blueValue <= 0.2) ){
        this.stepRed   = (this.stepRed) * -1
        this.stepGreen = (this.stepGreen) * -1
        this.stepBlue  = (this.stepBlue) * -1
      }

      this.meshMaterial.uniforms[ 'opacity' ].value  = this.opacity;
      this.meshMaterial2.uniforms[ 'opacity' ].value = this.opacity;
    }


    this.meshMaterial.uniforms[ 'time' ].value        = this.speed * ( Date.now() - this.clock );
    this.meshMaterial.uniforms[ 'weight' ].value      = this.weight;
    
    this.meshMaterial2.uniforms[ 'time' ].value       = this.speed * ( Date.now() - this.clock );
    this.meshMaterial2.uniforms[ 'weight' ].value     = this.weight;
    
    this.meshMaterial2.uniforms[ 'redValue' ].value   = this.redValue;
    this.meshMaterial2.uniforms[ 'greenValue' ].value = this.greenValue;
    this.meshMaterial2.uniforms[ 'blueValue' ].value  = this.blueValue;

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