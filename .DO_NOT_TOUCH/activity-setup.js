import Phaser from "phaser";
import DevLaunchers from "./classes/dev-launchers";
import PlayerCharacter from "./classes/PlayerCharacter.js";
import Goal from "./classes/Goal.js";
import FloatingPlatform from "./classes/FloatingPlatform.js";
import CenteredTimedText from "./classes/CenteredTimedText.js";

// Load specific game stuff here that will be used in
// this file, or in 'modify.mjs'

/* Lift classes to global scope */
(function() {
  // We have to lift classes we need access to into the
  //   global scope (stupid module scoping issue)
  // This is done so students can code in a clean script file (without
  //    having to use imports/exports, etc.)
  //
  // ie. window.Animal = Animal;
})();

// TODO: set up as async/await so we can rely on variables set in modify to be avaialbe after calling loadModifyCode()
export function setupActivity(scene) {
  /* Any pre setup code (additional from the game code) or
   * scene injection code needed to run this activity
   * should be executed here */
  let gameWidth = scene.game.config.width;
  let gameHeight = scene.game.config.height;
  let halfGameWidth = gameWidth / 2;
  let halfGameHeight = gameHeight / 2;

  new CenteredTimedText(scene, "Modify\nthe stage\nto win!", {}, 1500, () => {
    scene.goal = new Goal(scene, 380, 20, 30, 30, 0x00dd00);

    // Create randomized array
    let nums = [1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < nums.length * 2; i++) {
      let randIndex = parseInt(Math.random() * nums.length);
      nums.push(nums.splice(randIndex, 1)[0]);
    }
    scene.stageArray = nums;

    // Now load the modify code, and then continue activity setup afterward in the callback
    loadModifyCode(scene, function() {
      let gameWidth = scene.game.config.width; // easy access and readability
      let gameHeight = scene.game.config.height; // easy access and readability
      let blockWidth = parseInt(gameWidth / scene.stageArray.length);
      scene.floatingPlatforms = [];
      for (let i = 0; i < scene.stageArray.length; i++) {
        if (scene.stageArray[i] != 0) {
          // Create a block
          let blockHeight = scene.stageArray[i] * 25;
          let thisPlatform = new FloatingPlatform(
            scene,
            blockWidth / 2 + blockWidth * i + 2,
            gameHeight - 10,
            blockWidth - 4,
            blockHeight - 8,
            scene.stageArray[i]
          );
          scene.floatingPlatforms.push(thisPlatform.platform);
        }
      }

      scene.player = new PlayerCharacter(scene, 10, 10);
      scene.physics.add.collider(scene.player, scene.floatingPlatforms);
      scene.physics.add.collider(scene.player, scene.ground);
      scene.physics.add.collider(scene.player, scene.goal, () => {
        new DevLaunchers.Activities.Success.Noise(scene);
        new DevLaunchers.Activities.Info.Text(
          scene,
          halfGameWidth,
          10,
          "You did it!",
          { fontSize: "32px" }
        );
      });
    });
  });
}

/***************************/
/* HELPER FUNCTIONS FOLLOW */
/***************************/

/*
 * evalWithinContext()
 * Allows a string of javascript code to be executed within the given scope/context
 * Used after fetching student code in order to run it within the current Phaser scene
 *     (Keeps student coding interface clean)
 */
var evalWithinContext = function(context, code) {
  (function(code) {
    eval(code);
  }.apply(context, [code]));
};

/*
 * loadModifyCode()
 * Loads the 'modify.mjs' file students will be making changes in, and executes it in the
 * current module's scope. We're using this method instead of import to maintain scene scope
 * and keep import/export out of the modify.js script. This makes it more simple for the
 * students to work with.
 */
// Let's load the modify.js script and run it in this scope!
// using this method instead of import to maintain scene scope and keep import/export
//    out of the modify.js script. More simple for students to work with
function loadModifyCode(scene, callback) {
  loadScriptWithinContext("../modify.mjs", scene, callback);
}
function loadScriptWithinContext(path, context, callback) {
  /* eslint-disable */
  let codeText = fetch(path)
    .then(function(response) {
      return response.text();
    })
    .then(function(textString) {
      evalWithinContext(context, textString);
      callback();
    });
  /* eslint-enable */
}
