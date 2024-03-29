Game.Canvas.Scene.New({
	name: "Scene_Title",
	materials: {
		images: {
			cursor_on: "Graphics/Pictures/Mn_Sel.png",
			cursor_off: "Graphics/Pictures/Mn_Sel_Off.png"
		}
	},
	
	ready: function(stage) {
	
		var background = this.createElement();
		background.drawImage("background");
		
		var box = Game.Canvas.Window.new(this);
			content = box.getContent();
			
		box.open(stage);
		
		var choice = {
			new_game: "New Game", 
			load_game: "Load"
		},
			btns_set = this.createElement(),
			btn, text,
			btns = [],
			cursor,
			cursors = [],
			i = 0,
			self = this;
		
		for (var id in choice) {
			btn = this.createElement(300, 70);
			cursor = this.createElement("cursor");
			
			var text = Game.Canvas.Text.New(this, choice[id]);
			text.style({
				size: "25px",
				color: "white",
				textBaseline: "top",
				family: "Megadeth",
				shadow: "1 1 10 #DBD862"
			}).draw(btn, 0, 0);
			
			btn.y = i * 60;
			btn.attr('index', i);
			btn.attr('id', id);
			
			if (id == "load_game" && !this.existSaves()) {
				btn.opacity = 0.4;
				btn.attr('enable', false);
			}
			else {
				btn.attr('enable', true);
			}
			
			cursor.drawImage("cursor_off", -75, 10);
			btn.append(cursor);
			cursors.push(cursor);
			
			btns.push(btn);
			btns_set.append(btn);
			
			i++;
		}
		btns_set.x = 350;
		btns_set.y = 300;
		
		stage.append(background, btns_set);
		
		box.cursor.init(btns);
		
		box.cursor.select(function(el) {
			var id = el.attr('id');
			if (el.attr('enable')) {
				self[id].call(self);
				// global.game_system.sePlay("cursor_select");
			}
			else {
				// global.game_system.sePlay("cursor_disable");
			}
		});
		
		box.cursor.change(function(el) {
			var index = el.attr('index');
			for (var i=0 ; i < cursors.length ; i++) {
				cursors[i].drawImage("cursor_off", -75, 10);
			}
			cursors[index].drawImage("cursor_on", -75, 10);
			// global.game_system.sePlay("cursor");
		});
		
		box.cursor.enable(true);
		
		box.cursor.setIndex(0, true);
			
	},
	new_game: function() {
		if (CE.io) {
			Game.scene.call("Scene_Map");
		}
		else {
			Game.scene.call("Scene_Map").load();
		}
	},
	load_game: function() {
		var scene = Game.scene.call("Scene_Load");
		scene.refresh("load");
	},
	existSaves: function() {
		for (var i=1 ; i <= 4 ; i++) {
			if (Marshal.exist("rpg_slot" + i)) {
				return true;
			}
		}
		return false;
	}
});