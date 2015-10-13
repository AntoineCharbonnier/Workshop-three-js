import { World } from 'modules/world';
// import { Numbering } from 'modules/numbering';

let world = new World();

world.init();

console.log( world.getScene() );

// let number = new Numbering( world.getScene() );
