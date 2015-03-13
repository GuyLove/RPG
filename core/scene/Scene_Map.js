/**
@doc scene_map
@class Scene_Map Scene of the current map
*/
Game.Canvas.Scene.New({
	name: "Scene_Map",
	data: {},
	/*materials: {
		images: {
			//"window": "../materials/Graphics/Windowskins/window.png"
		}
	},*/
	ready: function(stage, el, params) {
		var self = this;
		this.stage = stage;	
		this.params = params;
		Game.Plugin._refreshScene();
		if (CE.io) {
			CE.io.emit("load", params);
			CE.io.on("Scene_Map.load", function(data) {
				global.game_map.load(params, function() {
					self.loadMaterials(data);
				}, self, data);
			});
		}
	},
	load: function(callback) {
		var self = this;
		global.game_map.load(this.params, function(data) {
			self.data = data;
			self.loadMaterials(data, callback);
		}, this);
	},

	loadMaterials: function(data, callback) {
		var images = [], sounds = [], load_i = 0, self = this;
		if (data.graphics.tileset) images.push({tileset: Game.Path.get("tilesets", data.graphics.tileset)});
		if ( data.player.graphic) images.push(Game.Path.get("characters", data.player.graphic, true));
		// images.push({window: "../materials/Graphics/Windowskins/window.png"});
		if (global.materials.windowskins) {
			var win_id = 1;
			for (var id in global.materials.windowskins) {
				win_id = id;
				break;
			}
			images.push({window: Game.Path.get("windowskins", win_id)});
		}
	
		data.autotiles_img = [];
		
		if (data.graphics.autotiles) {
			CE.each(data.graphics.autotiles, function(i, val) {
				var obj = Game.Path.get("autotiles", val, true);
				images.push(obj);
				for (var key in obj) {
					data.autotiles_img.push(key);
					break;
				}
			});
		}
		
		if (data.events) {
			CE.each(data.events, function(i, val) {
				if (+val.graphic) {
					images.push(Game.Path.get("characters", val.graphic, true));
				}
			});
		}
		
		var action;
		for (var id in this.data.actions) {
			action = this.data.actions[id];
			if (action.graphic) {
				images.push(Game.Path.get("characters", action.graphic, true));
			}
		}
		
		images.concat(Game.Plugin.call("Sprite", "mapLoadImages", [images, this]));
		
		if (+data.musics.bgm) {
			sounds.push(Game.Path.get("bgms", data.musics.bgm, true));
		}
		if (+data.musics.bgs) {
			sounds.push(Game.Path.get("bgss", data.musics.bgs, true));
		}
		
		sounds.concat(Game.Plugin.call("Sprite", "mapLoadSounds", [sounds, this]));
		
		function finish() {
			if (load_i){
				self.tilesetLoad(data);
				if (callback) callback();
			}
			load_i++;
		}
		
		Game.Canvas.Materials.load("images", images, function(img) {
			// -- Empty
		}, finish);
		
		Game.Canvas.Materials.load("sounds", sounds, function(snd) {
			// -- Empty
		}, finish);
		
		
	},
	nbKeyPress: 0,
	keysAssign: function() {
		var self = this;
		Game.Canvas.Input.reset();
		
		CanvasEngine.each(["Up", "Right", "Left", "Bottom"], function(i, val) {

			Game.Canvas.Input.press(Input[val], function() {
				if (global.game_player.freeze) return;
				self.nbKeyPress++;
				self.spriteset.player.startMove();
			});
			Game.Canvas.Input.keyUp(Input[val], function() {	
				self.nbKeyPress--;
				if (!Game.Canvas.Input.isPressed([Input.Up, Input.Right, Input.Left, Input.Bottom])) {
					self.spriteset.player.stop();
				}
			});
		});
		
		Game.Canvas.Input.press([Input.Enter, Input.Space], function() {
			Game.Plugin.call("Sprite", "pressAction", [self]);
			global.game_map.execEvent();
		});
		
		Game.Canvas.Input.press([Input.Esc], function() {
			self.pause(true);
			Game.Plugin.call("Sprite", "pressEsc", [self]);
			var menu = Game.scene.call("Scene_Menu", {
				overlay: true
			});
			//menu.zIndex(1); // after scene map
		});
		
		function _action(action, id) {
			if (action.keypress) {
				Game.Canvas.Input.press(Input[action.keypress], function() {
					self.spriteset.player.playAnimationAction(id);
					global.game_map.execAction(id);
				});
			}
		}
		
		var action;
		for (var id in this.data.actions) {
			action = this.data.actions[id];
			_action(action, id);
		}
		
		
	},
	tilesetLoad: function() {
	
		this.spriteset = Class.New("Spriteset_Map", [this, this.stage, this.data, {
			autotiles: this.data.autotiles_img,
			actions: this.data.actions
		}]);
		
		if (+this.data.musics.bgm) {
			global.game_system.bgmPlay(this.data.musics.bgm);
		}
		if (+this.data.musics.bgs) {
			global.game_system.bgsPlay(this.data.musics.bgs);
		}
		
		this.keysAssign();
		
		if (this.data.system.gamepad != "_no" && typeof(Gamepad) !== 'undefined') {
			this.gamepad = Game.Canvas.Input.Gamepad.init();
			this.gamepad.addListener("faceButton0", Input.A);
			this.gamepad.addListener("faceButton1", Input.Esc);
			this.gamepad.addListener("faceButton2", Input.Enter);
			this.gamepad.addListener("dpadLeft", Input.Left);
			this.gamepad.addListener("dpadRight", Input.Right);
			this.gamepad.addListener("dpadDown", Input.Bottom);
			this.gamepad.addListener("dpadUp", Input.Up);
		}
		
		
		Game.Plugin.call("Sprite", "loadMap", [this]);
		

	},
	render: function(stage) {
	
		if (!this.spriteset) {
			return;
		}
	
		var input = {
			"left": [Input.Left, "x"],
			"right": [Input.Right, "x"],
			"bottom": [Input.Bottom, "y"],
			"up": [Input.Up, "y"]
		},
		sprite_player = this.spriteset.player;
		
		var press = 0;
		
		for (var key in input) {
			if (Game.Canvas.Input.isPressed(input[key][0]) && !global.game_player.freeze) {
				press++;
				if (this.data.system.diagonal == 1) {
					 global.game_player.moveDir(key, false, this.nbKeyPress);
				}
				else if (press == 1) {
					global.game_player.moveDir(key, false);
				}
			}
		}
		
		this.spriteset.scrollingUpdate();
		this.updateEvents();
		
		Game.Plugin.call("Sprite", "sceneMapRender", [this]);
		
		stage.refresh();
		if (this.data.system.gamepad != "_no" && typeof(Gamepad) !== 'undefined') this.gamepad.update();

	},
	
/**
@doc scene_map/
@method animation Displays an animation event (http://Canvas.net/doc/?p=extends.animation, image with several sequences)
@params {String} event_id Event ID
@params {Array} animation_id Animation ID
*/	
	animation: function(event_id, animation_id) {
		this.getSpriteset().getEvent(event_id).showAnimation(animation_id);
	},

/**
@doc scene_map/
@method effect Shortcut to `Spriteset_Map.effect()`
@params {String} name
@params {Array} params
@params {Function} finish (optional)
*/		
	effect: function(name, params, finish) {
		this.getSpriteset().effect(name, params, finish);
	},
	
	pictures: function(method, params) {
		var s = this.getSpriteset();
		s[method + "Picture"].apply(s, params);
	},
	
	updateEvents: function() {
		global.game_map.updateEvents();
	},
	
	scrollMap: function(pos, finish) {
		this.getSpriteset().scrollMap(pos, finish);
	},

/**
@doc scene_map/
@method getSpriteset Retrieves sprites and elements
@return {Spriteset_Map}
*/	
	getSpriteset: function() {
		return this.spriteset;
	},
	
	stopEvent: function(id) {
		var spriteset = this.getSpriteset();
		if (spriteset) {
			spriteset.stopEvent(id);
		}
	},
	
	moveEvent: function(id, value, dir, nbDir, params) {
		var spriteset = this.getSpriteset();
		if (spriteset) {
			spriteset.moveEvent(id, value, dir, nbDir, params);
		}
	},
	
	setParameterEvent: function(id, name, val) {
		var spriteset = this.getSpriteset();
		if (spriteset) {
			spriteset.setParameterEvent(id, name, val);
		}
	},
	
	turnEvent: function(id, dir) {
		var spriteset = this.getSpriteset();
		if (spriteset) {
			spriteset.turnEvent(id, dir);
		}
	},
	
	jumpEvent: function(id, x_plus, y_plus, high, callback) {
		var spriteset = this.getSpriteset();
		if (spriteset) {
			this.getSpriteset().getEvent(id).jumpCharacter(x_plus, y_plus, high, callback);
		}
		
		
	},
	
	setEventPosition: function(id, x, y) {
		var spriteset = this.getSpriteset();
		if (spriteset) {
			this.getSpriteset().getEvent(id).setPosition(x, y);
		}
	},
	
	blink: function(event_id, duration, frequence, finish) {
		var event = this.getSpriteset().getEvent(event_id);
		if (event) {
			event = event.getSprite();
			Game.Canvas.Effect.new(this, event).blink(duration, frequence, finish);
		}
	},
	
	removeEvent: function(id) {
		this.getSpriteset().removeCharacter(id);
	},
	
	refreshEvent: function(id, data) {
		this.getSpriteset().refreshCharacter(id, data);
	},
	
	addEvent: function(data) {
		this.getSpriteset().addCharacter(data);
	}
});