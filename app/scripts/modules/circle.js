let THREE = require('../vendors/three.min');
let glslify = require('glslify');

class Circle {

    constructor( scene, options = {} ) {

        this.scene = scene;

        this.length = 10000;

        this.radius = options.isMini ? 1 : 30;

        this.geometry = new THREE.BufferGeometry();

        this.vertexShader = glslify('../../vertex-shaders/circle.vert');

        this.fragmentShader = glslify('../../fragment-shaders/simple.frag');

        this.material = new THREE.ShaderMaterial({
            uniforms: { 
                time: { type: "f", value: 0 }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            shading: THREE.SmoothShading,
            wireframe: false
        });

        this.vertices = new Float32Array( this.length * 3 );

        this.size = new Float32Array(  this.length );

        for ( let i = 0; i < this.vertices.length; i+=3 ) {
            // create a tirgonometric circle 
            let theta = (i / this.length) * Math.PI * 2;
            //  position points on this circle
            let x = Math.cos(theta) * this.radius;

            let y = Math.sin(theta) * this.radius; 

            let z = 0 ;

            this.vertices[ i ] = x;

            this.vertices[ i + 1 ] = y;

            this.vertices[ i + 2 ] = z;


            // this.vertices[ i * 6 ] = x;
            // this.vertices[ i * 6 + 1 ] = y;
            // this.vertices[ i * 6 + 2] = z;
            // this.vertices[ i * 6 + 3] = x + 0.1;
            // this.vertices[ i * 6 + 4] = y + 0.1;
            // this.vertices[ i * 6 + 5] = z;

        }

        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );

        // this.geometry.addAttribute( 'size', new THREE.BufferAttribute( this.size, 1 ) );

        let mesh = new THREE.Points( this.geometry, this.material );

        mesh.position.z = -146;
        mesh.rotation.x = 7.7;
        mesh.rotation.y = 0.1;
        mesh.rotation.z = 152;

        this.scene.add( mesh );

        this.meshes = [];

        this.meshes.push( mesh );

        this.clock = Date.now();

        this.update();

        return mesh;
    }

    createMesh() {
        
        let mesh = new THREE.Mesh( geometry, material );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;
        mesh.rotation.x = rx;
        mesh.rotation.y = ry;
        mesh.rotation.z = rz;
        mesh.overdraw = true;
        mesh.doubleSided = true;
        mesh.updateMatrix();
        this.scene.add(mesh);
        
        return mesh;
    }

    update( ts ) {

        window.requestAnimationFrame( this.update.bind(this) );

        for ( let i = 0; i < this.meshes.length; i++ ) {

            this.meshes[ i ].material.uniforms[ 'time' ].value = Date.now() - this.clock;

        }
    }

}

export { Circle };