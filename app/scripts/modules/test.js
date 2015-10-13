let THREE = require('../vendors/three.min');
let glslify = require('glslify');

class Test {

    constructor( scene, options = {} ) {

    	this.scene = scene;

        this.length = 25;

        this.max = this.length + 25;

        this.width = 10;

        this.separation = 0.4;

        this.segmentCount = 0;

        this.active = true;

        this.clock = Date.now();

        this.vertexShader = glslify('../../vertex-shaders/simple.vert');

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

        this.segments = [];

        let minX = Math.random() > 0.5 ? 20 : -20;
        let maxX = minX > 0 ? 40 : -40;   
        let minY = Math.random() > 0.5 ? 20 : -20;
        let maxY = minY > 0 ? 40 : -40;   

        // this.startPoint = this.controlPoint = this.endPoint = new THREE.Vector3();
        if ( options.startPoint ) {

            this.startPoint = options.startPoint;
            
        } else {
            this.startPoint = new THREE.Vector3();
            this.startPoint.x = ( Math.random() * maxX ) - minX;
            this.startPoint.y = ( Math.random() * maxY ) - minY;
            this.startPoint.z = -100;
        }

        this.controlPoint = new THREE.Vector3(( Math.random() * maxX ) - minX, 
                                                ( Math.random() * maxY ) - minY,
                                                this.startPoint.z - 60);
        this.endPoint = new THREE.Vector3(( Math.random() * maxX ) - minX,
                                            ( Math.random() * maxY ) - minY, 
                                            this.startPoint.z - 60);

        this.update();

    }

    addSegment() {

        let geometry = new THREE.BufferGeometry();

        let sphere = new THREE.CircleGeometry( 1, 32 );

        geometry.fromGeometry( sphere );

        let mesh = new THREE.Mesh(geometry, this.material);

        let t = this.segmentCount / this.max;

        let p0 = this.getOffsetPoint(t, 0);

        mesh.position.x = p0.x;
        mesh.position.y = p0.y;
        mesh.position.z = p0.z;

        this.segments.push( mesh );

        this.segmentCount = this.segments.length;

        this.scene.add( mesh );

    }

    getOffsetPoint(t, k) {
        let p0 = this.startPoint;
        let p1 = this.controlPoint;
        let p2 = this.endPoint;

        let xt = (1 - t ) * (1 - t ) * p0.x + 2 * t * (1 - t ) * p1.x + t * t * p2.x;
        let yt = (1 - t ) * (1 - t ) * p0.y + 2 * t * (1 - t ) * p1.y + t * t * p2.y;
        let zt = (1 - t ) * (1 - t ) * p0.z + 2 * t * (1 - t ) * p1.z + t * t * p2.z;

        let xd = t * (p0.x - 2 * p1.x + p2.x) - p0.x + p1.x;
        let yd = t * (p0.y - 2 * p1.y + p2.y) - p0.y + p1.y;
        let zd = t * (p0.z - 2 * p1.z + p2.z) - p0.z + p1.z;
        let dd = Math.pow(xd * xd + yd * yd + zd * zd, 1 / 3);

        return new THREE.Vector3(xt + (k * yd ) / dd, yt - (k * xd ) / dd, zt - (k * xd ) / dd);

    }

    removeSegment() {

        let mesh = this.segments.shift();

        this.scene.remove( mesh );

    }

    update() {

        if ( this.active ) {

            window.requestAnimationFrame( this.update.bind(this) );

            if ( this.segmentCount < this.max ) {
                this.addSegment();
            } else {
                this.removeSegment();
                if ( this.segments.length == 0 ) {
                    this.active = false;
                }
            }
        }
    }


}

export { Test };