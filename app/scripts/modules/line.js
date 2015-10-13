let THREE = require('../vendors/three.min');

class Line {

    constructor() {

        this.radius = 100;
        this.height = 10;
        this.segmentWidth = 16;
        this.segmentHeight = 220;
        this.grid = [];
        this.lastTime = null;

        this.geometry = new THREE.Geometry();
        this.geometry.dynamic = true;

        this.createVertices();
        this.createFaces()


        this.material =  new THREE.MeshPhongMaterial( { 
            opacity: 1, 
            color: 0xff0000, 
            specular: 0xbbbb9b, 
            shininess: 4, 
            shading: THREE.SmoothShading 
        } );

        this.mesh = new THREE.Mesh( this.geometry, this.material );

        this.mesh.frustumCulled = false;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = false;

        this.update();

        return this.mesh;

    }

    createVertices() {

        for (var i = 0; i <= this.segmentHeight; ++i) { 
            var z = -this.height + 2 * this.height * i / this.segmentHeight;

            this.grid[ i ] = new Array(this.segmentWidth);

            for (var j = 0; j < this.segmentWidth; ++j) { 

                var verangle = 2 * j / this.segmentWidth * Math.PI;
                var x = this.radius * Math.sin(verangle);
                var y = this.radius * Math.cos(verangle);
                this.grid[i][j] = this.vert(y, z, x);

            }
        }

    }

    createFaces() {

        for (var i = 1; i <= this.segmentHeight; ++i) { 

            for (var j = 0; j < this.segmentWidth; ++j) { 

                var a = this.grid[ i ][ j ];
                var b = this.grid[ i ][( j - 1 + this.segmentWidth ) % this.segmentWidth ];
                var c = this.grid[i - 1][( j - 1 + this.segmentWidth ) % this.segmentWidth ];
                var d = this.grid[i - 1][ j ];

                var j2 = j;
                if (j == 0) {
                    j2 = this.segmentWidth;
                }
                                    
                var vab = i / this.segmentHeight;
                var vcd = (i - 1) / this.segmentHeight;
                var uad = j2 / this.segmentWidth;
                var ubc = (j2 - 1) / this.segmentWidth;

                var uva = new THREE.Vector2( uad,vab );
                var uvb = new THREE.Vector2( ubc,vab );
                var uvc = new THREE.Vector2( ubc,vcd );
                var uvd = new THREE.Vector2( uad,vcd );

                if (i <= this.segmentHeight) {
                    this.f3(a,b,c,uva,uvb,uvc);
                }
                if (i > 0) {            
                    this.f3(a,c,d,uva,uvc,uvd);
                }
            }
        }

    }

    vert(x, y, z) {

        var i = this.geometry.vertices.push( new THREE.Vector3( x, y, z ) );
        return i - 1;

    }

    f3( a, b, c, uva, uvb, uvc ) {
        this.geometry.faces.push( new THREE.Face3( a, b, c ) );
        this.geometry.faceVertexUvs[ 0 ].push( [uva,uvb,uvc] );
    }

    update( ts ) {

        window.requestAnimationFrame( this.update.bind(this) );

        var time = Date.now();
        var delta = time - this.lastTime;
        this.lastTime = time;

        if (isNaN(delta) || delta > 1000 || delta == 0 ) {
            delta = 1000/60;
        }

        
}

}

export { Line };