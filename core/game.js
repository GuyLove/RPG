/**
 * Main Game Class
 */

// Initialize the game
Game.init = function() {
  // set this to false to hide all messages
  Game.debugMode = true;
  
  var gameElem = document.getElementById("game");
  gameElem.width = 800;
  gameElem.height = 600;
  
  this.defines({
    canvas: "game"
  }).ready(function() {
    // Assets to load
    var characters = [
      "Player.json" // Load the player
    ];
    
    var items = [
      "HealthPotion.json" // Load the health potion in
    ];
    
    CE.each(characters, function(i, character) {
      // for each character, load the json in
      CE.getJSON(Game.Assets.characters + character, function(d) {
         global.data.actors[d.id] = d.data;
        // Game.Actors.add(d);
      });
    });
    
    // Game.Actors.actors = actors;
    
    Game.Scene.map();
  });
};