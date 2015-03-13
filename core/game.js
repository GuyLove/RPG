/**
 * Main Game Class
 */

// Initialize the game
Game.init = function() {
  var gameElem = document.getElementById("game");
  gameElem.width = 800;
  gameElem.height = 600;
  
  this.defines({
    canvas: "game"
  }).ready(function() {
    Game.Scene.map();
  });
};