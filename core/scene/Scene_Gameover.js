Game.Canvas.Scene.New({
	name: "Scene_Gameover",
	
	materials: {
		images: {
			background: "../materials/Graphics/Gameovers/gameover.jpg"
		}
	},
	
	ready: function(stage) {
	
		var background = this.createElement();
		background.drawImage("background");
		
		stage.append(background);
		
		Game.Canvas.Input.press([Input.Enter, Input.Space], function() {
			Game.scene.call("Scene_Title");
		});
		
		stage.on("touch", function() {
			Game.scene.call("Scene_Title");
		});
		
		Game.Plugin.call("Sprite", "gameover", [this]);
		
	}
});