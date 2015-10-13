import { Test } from './test';

let THREE = require('../vendors/three.min');

class Numbering {

    constructor( scene ) {

    	console.log( scene );
    	this.socket = io.connect( window.location.hostname + ":3000" );

    	this.socket.on('number', this.getNumber.bind( this ) );

    	this.scene = scene;

    }

    getNumber( number ) {

    	console.log( number );

    	if ( parseInt( number ) === 2 ) {

    		let minX = Math.random() > 0.5 ? 40 : -40;
	        let maxX = minX > 0 ? 60 : -60;   
	        let minY = Math.random() > 0.5 ? 40 : -40;
	        let maxY = minY > 0 ? 60 : -60;   

    		let startPoint = new THREE.Vector3(( Math.random() * maxX ) - minX, 
    											( Math.random() * maxY ) - minY, 
    											-(( Math.random() * 160 ) + 120));

	        for(let i = 0; i < 2; i++) {

	            setTimeout( () => {
	                new Test( this.scene, {
	                    startPoint: startPoint
	                } );
	            }, i * 1200);

	        }
    	}
    }

}

export { Numbering };