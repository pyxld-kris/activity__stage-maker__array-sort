/**** WELCOME! *********************************************/
/**
 * Modify the stage, using an array, to allow your character
 * to reach the goal!
 * 
 * Change the 'stageArray' variable to alter the level!
 *    Possible array entry values:
 *      * 1: Solid Block
 *      * 0: Empty Space
 * 
 * ----------------------------------------------------------
 * After making a change: save this file, then press the refresh
 * button above the game window!
 * ----------------------------------------------------------
 */
/**************** Start Modifying Here! *********************/

var stageArray = [1,1,1,1,1,1,1,1,1,1,1,1];


/**** GOODBYE! ************************************************/
/**** Stop Modifying Here! (Unless you want to experiment!) ***/

/*/
/*/
/*/
/*/
/*/
/*/
/*/
/*/
/*/
/*/
/*/

/* eslint-disable */ // Stops codesandbox from giving us annoying errors

var scene = this;
let gameWidth = scene.game.config.width; // easy access and readability
let gameHeight = scene.game.config.height; // easy access and readability
let blockSize = parseInt(gameWidth/stageArray.length);
scene.solidBlocks = [];
for (let i=0; i<stageArray.length; i++) {
  if (stageArray[i] === 1) {
    // Create a block
    let newBlock = scene.physics.add.staticSprite(
        blockSize/2+blockSize*i+2,
        100,
        this.generateRectangleSprite(blockSize-4, blockSize-4)
      )
    scene.solidBlocks.push(newBlock);
  }
}
