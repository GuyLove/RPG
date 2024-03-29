/*!
 * Role Playing Game JavaScript Library 2.0.0
 * Dependency : CanvasEngine >= 1.3.0 (http://canvasengine.net)
 *
 * Copyright 2013, WebCreative5, Samuel Ronce
 * Licensed under the MIT.
 */
Class.create("Game", {
    _defaultData: function(c) {
        c = c || {};
        var a = {
            actors: {},
            system: {},
            map_infos: {},
            tilesets: {},
            actions: {},
            autotiles: {},
            classes: {},
            items: {},
            weapons: {},
            armors: {},
            variables: {},
            switches: {},
            states: {},
            skills: {},
            elements: {},
            dynamic_events: {},
            common_events: {},
            animations: {}
        };
        for (var b in a) {
            if (!c[b]) {
                c[b] = a[b]
            }
        }
        return c
    },
    maps: {},
    events: {},
    dyn_event: {},
    defines: function(a) {
        this.params = a;
        this.params.autoload = this.params.autoload == undefined ? true : this.params.autoload;
        return this
    },
    loadMaterials: function(a) {
        CE.getJSON("Data/Materials.json", function(b) {
            global.materials = b;
            if (a) {
                a()
            }
        })
    },
    loadDatabase: function(b) {
        var a = this;
        CE.getJSON("Data/Database.json", function(c) {
            global.data = a._defaultData(c);
            if (b) {
                b()
            }
        })
    },
    setData: function(a, c, b) {
        if (typeof c != "number") {
            global.materials[a] = c
        } else {
            if (!global.data[a][c]) {
                global.data[a][c] = {}
            }
            global.data[a][c] = b
        }
    },
    setMaterials: function(a, c, b) {
        if (typeof c != "string") {
            global.materials[a] = c
        }
    },
    setMap: function(b, a) {
        this.maps[b] = a
    },
    setEvent: function(a, b, c) {
        if (!this.events[a]) {
            this.events[a] = {}
        }
        this.events[a][b] = c
    },
    setDynamicEvent: function(a, b) {
        this.dyn_event[a] = b
    },
    getDynamicEvent: function(a) {
        return this.dyn_event[a]
    },
    getGlobalEvent: function(a, b) {
        if (!this.events[a]) {
            return false
        }
        return this.events[a][b]
    },
    load: function(b) {
        var a = this;
        this.Switches = global.game_switches = Class.New("Game_Switches");
        this.Variables = global.game_variables = Class.New("Game_Variables");
        this.SelfSwitches = global.game_selfswitches = Class.New("Game_SelfSwitches");
        this.Map = global.game_map = Class.New("Game_Map");
        this.Actors = global.game_actors = Class.New("Game_Actors");
        this.Player = global.game_player = Class.New("Game_Player");
        this.Scene = this.scene;
        this.scene.load(["Scene_Map", "Scene_Window", "Scene_Title", "Scene_Menu", "Scene_Load", "Scene_Gameover", "Scene_Generated"], function() {
            if (a.params.plugins) {
                a.Plugin.add(a.params.plugins, function() {
                    Game.Plugin.call("Sprite", "loadBeforeGame");
                    if (b) {
                        b.call(a)
                    }
                })
            } else {
                if (b) {
                    b.call(a)
                }
            }
        }, this.params.scene_path)
    },
    ready: function(b) {
        var a = this;
        Game.Canvas = CE.defines(this.params.canvas, this.params).extend([Animation, Input, Spritesheet, Scrolling, Window, Text, Effect]).ready(function() {
            a.System = global.game_system = Class.New("Game_System");
            global.game_save = Class.New("Game_Save");
            if (a.params.autoload) {
                a.loadMaterials(function() {
                    a.loadDatabase(function() {
                        a.load(b)
                    })
                })
            } else {
                global.materials = {};
                global.data = a._defaultData();
                if (a.Database) {
                    global.data = CE.extend(global.data, a.Database)
                }
                if (a.Materials) {
                    global.materials = a.Materials
                }
                a.load(b)
            }
        })
    },
    scene: {
        map: function(a) {
            var b = this.call("Scene_Map");
            b.load(a);
            return b
        },
        call: function(a, b) {
            return Game.Canvas.Scene.call(a, b)
        },
        load: function(a, f, b) {
            var c = 0;
            b = b || "";

            function e() {
                c++;
                if (c == a.length && f) {
                    f()
                }
            }
            for (var d = 0; d < a.length; d++) {
                name = a[d];
                Game.loadScript(b + "core/scene/" + name, function() {
                    e()
                })
            }
        }
    },
    loadScript: function(c, b) {
        var a = document.createElement("script");
        a.type = "text/javascript";
        if (a.readyState) {
            a.onreadystatechange = function() {
                if (a.readyState == "loaded" || a.readyState == "complete") {
                    a.onreadystatechange = null;
                    b()
                }
            }
        } else {
            a.onload = b
        }
        a.src = c + ".js";
        document.getElementsByTagName("head")[0].appendChild(a)
    },
    Plugin: {
        list: [],
        _refreshScene: function() {
            for (var a = 0; a < this.list.length; a++) {
                this.list[a].Sprite.scene = Game.Canvas.Scene.get("Scene_Map")
            }
        },
        add: function(c, g) {
            var b, f, k = this,
                d = 0;
            if (!(c instanceof Array)) {
                c = [c]
            }

            function h(l, u) {
                var q = {},
                    r = 0;
                l = l + ".js";

                function t(w, v) {
                    r++;
                    if (!Class.get(w + "_" + v)) {
                        u();
                        return
                    }
                    q[w] = Class.New(w + "_" + v);
                    q.name = v;
                    if (r == 2 && u) {
                        q.Game._class_ = q.Sprite;
                        q.Sprite._class_ = q.Game;
                        q.Sprite.scene = Game.Canvas.Scene.get("Scene_Map");
                        k.list.push(q);
                        u()
                    }
                }
                var m = Game.Canvas.Materials.getBasePath(l),
                    o = Game.Canvas.Materials.getFilename(l),
                    n = ["", ""];

                function p(x, v, w) {
                    return x + "/" + v + "/" + w + "_" + v
                }
                if (m) {
                    n[0] = p(m, o, "Game");
                    n[1] = p(m, o, "Sprite")
                } else {
                    n[0] = p("plugins", o, "Game");
                    n[1] = p("plugins", o, "Sprite")
                }
                Game.loadScript(n[0], function() {
                    t("Game", o)
                });
                Game.loadScript(n[1], function() {
                    t("Sprite", o)
                })
            }

            function a() {
                d++;
                if (d == c.length && g) {
                    g()
                }
            }
            for (var e = 0; e < c.length; e++) {
                b = c[e];
                h.call(this, b, a)
            }
        },
        call: function(c, a, e) {
            var d;
            if (!(e instanceof Array)) {
                e = [e]
            }
            for (var b = 0; b < this.list.length; b++) {
                d = this.list[b][c];
                if (d[a]) {
                    d[a].apply(d, e)
                }
            }
        }
    },
    Path: {
        tilesets: "Graphics/Tilesets/",
        windowskins: "Graphics/Windowskins/",
        autotiles: "Graphics/Autotiles/",
        characters: "Graphics/Characters/",
        animations: "Graphics/Animations/",
        pictures: "Graphics/Pictures/",
        battlers: "Graphics/Battlers/",
        icons: "Graphics/Icons/",
        tiles: "Graphics/Tiles/",
        faces: "Graphics/Faces/",
        fonts: "Graphics/fonts/",
        gameovers: "Graphics/Gameovers/",
        bgms: "Audio/BGM/",
        bgss: "Audio/BGS/",
        mes: "Audio/ME/",
        ses: "Audio/SE/",
        getFile: function(c, a, b) {
            var e = this[c] + a,
                d = {};
            if (b) {
                d[c + "_" + b] = e;
                return d
            } else {
                return e
            }
        },
        get: function(c, d, b, a) {
            var f = {},
                e;
            if (!global.materials[c]) {
                if (Game.params.ignoreLoadError) {
                    return false
                }
                throw "[Path.get] " + c + " doesn't exist"
            }
            if (!global.materials[c][d]) {
                if (Game.params.ignoreLoadError) {
                    return false
                }
                throw "[Path.get]" + c + " - " + d + " doesn't exist"
            }
            e = (a ? "" : this[c]) + global.materials[c][d];
            if (b) {
                f[c + "_" + d] = e;
                return f
            } else {
                return e
            }
        },
        isSound: function(a) {
            return a == "bgms" || a == "bgss" || a == "mes" || a == "ses"
        },
        loadMaterial: function(b, f, e) {
            var d = {},
                a = this.isSound(b) ? "sounds" : "images";
            var c = this.get(b, f);
            d[b + "_" + f] = c;
            if (Game.Canvas.Materials.sounds[b + "_" + f]) {
                if (e) {
                    e()
                }
            }
            Game.Canvas.Materials.load(a, d, e)
        },
        load: function(c, a, f, e) {
            var d = {},
                b = this.isSound(c) ? "sounds" : "images";
            d[c + "_" + f] = this[c] + a;
            Game.Canvas.Materials.load(b, d, e)
        }
    },
    Assets: {
        characters: "Data/Content/Characters/",
        items:      "Data/Content/Items/",
        weapons:    "Data/Content/Weapons/"
    }
});
var Game = Class.New("Game");
Game.Canvas = {};
Game.Scene = {};
var global = {};
if (typeof exports != "undefined") {
    var CE = require("canvasengine").listen(),
        Class = CE.Class
}
Class.create("Interpreter", {
    currentCmd: null,
    tmpCommands: [],
    indent: 0,
    _conditions: {},
    isRun: false,
    event: null,
    initialize: function(b, a) {
        this.preprogrammedCommands();
        this.event = b;
        if (a) {
            this.assignCommands(a)
        }
    },
    preprogrammedCommands: function() {
        var a = {
            CHANGE_GOLD: "cmdChangeGold",
            SHOW_TEXT: "cmdShowText",
            ERASE_EVENT: "cmdErase",
            TRANSFER_PLAYER: "cmdTransferPlayer",
            BLINK: "cmdBlink",
            CALL: "cmdCall",
            SHOW_ANIMATION: "cmdShowAnimation",
            MOVE_ROUTE: "cmdMoveRoute",
            SELF_SWITCH_ON: "cmdSelfSwitches",
            SELF_SWITCH_OFF: "cmdSelfSwitches",
            SWITCHES_ON: "cmdSwitches",
            SWITCHES_OFF: "cmdSwitches",
            SCREEN_FLASH: "cmdScreenFlash",
            SCREEN_TONE_COLOR: "cmdScreenColorTone",
            SCREEN_SHAKE: "cmdScreenShake",
            VARIABLE: "cmdVariables",
            SET_EVENT_LOCATION: "cmdSetEventLocation",
            SCROLL_MAP: "cmdScrollMap",
            PLAY_BGM: "cmdPlayBGM",
            PLAY_BGS: "cmdPlayBGS",
            PLAY_ME: "cmdPlayME",
            PLAY_SE: "cmdPlaySE",
            STOP_SE: "cmdStopSE",
            FADE_OUT_MUSIC: "cmdFadeOutMusic",
            FADE_OUT_SOUND: "cmdFadeOutSound",
            RESTORE_MUSIC: "cmdRestoreMusic",
            MEMORIZE_MUSIC: "cmdMemorizeMusic",
            CHANGE_ITEMS: "cmdChangeItems",
            CHANGE_WEAPONS: "cmdChangeItems",
            CHANGE_ARMORS: "cmdChangeItems",
            CHANGE_LEVEL: "cmdChangeLevel",
            CHANGE_EXP: "cmdChangeEXP",
            CHANGE_STATE: "cmdChangeState",
            CHANGE_CLASS: "cmdChangeClass",
            CHANGE_SKILLS: "cmdChangeSkills",
            CHANGE_NAME: "cmdChangeName",
            CHANGE_GRAPHIC: "cmdChangeGraphic",
            CHANGE_EQUIPMENT: "cmdChangeEquipment",
            CHANGE_PARAMS: "cmdChangeParams",
            CHANGE_HP: "cmdChangeParamPoints",
            CHANGE_SP: "cmdChangeParamPoints",
            RECOVER_ALL: "cmdRecoverAll",
            SHOW_PICTURE: "cmdShowPicture",
            MOVE_PICTURE: "cmdMovePicture",
            ROTATE_PICTURE: "cmdRotatePicture",
            ERASE_PICTURE: "cmdErasePicture",
            CHANGE_WINDOWSKIN: "cmdChangeWindowskin",
            DETECTION_EVENTS: "cmdDetectionEvents",
            CALL_COMMON_EVENT: "cmdCallCommonEvent",
            CALL_SYSTEM: "cmdCallSystem",
            CALL_SAVE: "cmdCallSave",
            ADD_DYNAMIC_EVENT: "cmdAddDynamicEvent",
            ADD_DYNAMIC_EVENT_RELATIVE: "cmdAddDynamicEventRelative",
            WAIT: "cmdWait",
            SCRIPT: "cmdScript",
            IF: "cmdIf",
            ELSE: "cmdElse",
            ENDIF: "cmdEndif",
            CHOICES: "cmdChoices",
            CHOICE: "cmdChoice",
            ENDCHOICES: "cmdEndChoices"
        };
        for (var b in a) {
            Interpreter.addCommand(b, a[b])
        }
    },
    getNextCommand: function() {
        return this.getCommand(this.getCurrentPos() + 1)
    },
    getPrevCommand: function() {
        return this.getCommand(this.getCurrentPos() - 1)
    },
    getCurrentCommand: function() {
        return this.getCommand(this.getCurrentPos())
    },
    getCurrentPos: function() {
        if (!this.currentCmd) {
            this.setCurrentPos(0)
        }
        return this.currentCmd
    },
    setCurrentPos: function(a) {
        this.currentCmd = a
    },
    getCommand: function(b) {
        var a = this._command(b);
        if (a) {
            return {
                name: a.name,
                params: a.params
            }
        }
        return false
    },
    searchCommand: function(a) {
        var f, d, e = [];
        for (var b = 0; b < this.commands.length; b++) {
            f = this.commands[b];
            d = new RegExp("^" + a);
            if (d.test(f)) {
                e.push(b)
            }
        }
        return e
    },
    _command: function(k) {
        var d = this.tmpCommands.length > 0 ? this.tmpCommands[k] : this.commands[k];
        var b, e, a, h, f, c;
        if (d) {
            try {
                f = /^([^:]+)(:(.+))?$/.exec(d);
                if (f != null) {
                    b = f[1];
                    e = f[3];
                    f = /^([^\(]+)\(([^\)]+)\)$/.exec(b);
                    if (f != null) {
                        c = f[2];
                        b = f[1]
                    }
                    if (/CHOICE_[0-9]+/.test(b)) {
                        h = Interpreter.commandFunction.CHOICE
                    } else {
                        h = Interpreter.commandFunction[b]
                    }
                    if (h) {
                        if (e) {
                            e = e.replace(/'/g, '"');
                            e = e.replace(/&quote;/g, "'");
                            e = JSON.parse(e);
                            return {
                                name: b,
                                id: c,
                                params: e,
                                callback: h
                            }
                        } else {
                            return {
                                name: b,
                                id: c,
                                callback: h
                            }
                        }
                    } else {}
                } else {
                    throw '"' + d + '" => Invalid command'
                }
            } catch (g) {
                if (/ILLEGAL$/.test(g)) {
                    g = '"' + d + '" => Invalid parameters'
                }
                throw g
            }
        }
        return false
    },
    assignCommands: function(a) {
        a = a || [];
        this.commands = CE.clone(a);
        this.parseCommands()
    },
    parseCommands: function() {
        var c, a, f, b, e;
        var h = {},
            g = {},
            k = 0,
            l = 0;
        change = false;
        for (var d = 0; d < this.commands.length; d++) {
            c = this.commands[d];
            f = /(^[^:]+)/.exec(c);
            if (f != null) {
                a = f[1];
                if (a == "IF") {
                    b = CanvasEngine.uniqid();
                    h[k] = b;
                    this._conditions[b] = {
                        "if": d
                    };
                    k++;
                    change = true
                } else {
                    if (a == "ELSE") {
                        b = h[k - 1];
                        this._conditions[b]["else"] = d;
                        change = true
                    } else {
                        if (a == "ENDIF") {
                            k--;
                            b = h[k];
                            this._conditions[b]["endif"] = d;
                            change = true
                        }
                    }
                }
                if (a == "CHOICES") {
                    b = CanvasEngine.uniqid();
                    g[l] = b;
                    this._conditions[b] = {
                        choices: d
                    };
                    l++;
                    change = true
                } else {
                    if (/CHOICE_[0-9]+/.test(a)) {
                        f = /CHOICE_([0-9]+)/.exec(a);
                        b = g[l - 1];
                        this._conditions[b]["choice_" + f[1]] = d;
                        change = true
                    } else {
                        if (a == "ENDCHOICES") {
                            l--;
                            b = g[l];
                            this._conditions[b]["endchoices"] = d;
                            change = true
                        }
                    }
                }
                if (change) {
                    e = a + "(" + b + ")";
                    this.commands[d] = c.replace(a, e)
                }
                change = false
            }
        }
    },
    execCommands: function(a) {
        if (!this._finish) {
            this._finish = a
        }
        var b = this._command(this.getCurrentPos());
        if (b) {
            this.isRun = true;
            var c = this[b.callback].call(this, b.params, b.name, b.id)
        } else {
            this.setCurrentPos(0);
            this.isRun = false;
            this.tmpCommands = [];
            if (this.event) {
                this.event.finishCommands()
            }
            if (this._finish) {
                this._finish.call(this)
            }
        }
    },
    nextCommand: function() {
        this.setCurrentPos(this.getCurrentPos() + 1);
        this.execCommands()
    },
    commandsExit: function(a) {
        this.currentCmd = -2
    },
    cmdShowText: function(g) {
        var a = this;
        var e = this.getPrevCommand();
        var c = this.getNextCommand();
        var f = g.text;
        var d = /%V\[([0-9]+)\]/g;
        var b = d.exec(f);
        while (b != null) {
            f = f.replace(b[0], global.game_variables.get(b[1]));
            b = d.exec(f)
        }
        f = f.replace(/&#39;/g, "'");
        if (!this.scene_window) {
            this.scene_window = Game.Scene.call("Scene_Window", {
                overlay: true
            });
            this.scene_window.box()
        }
        if (c.name != "CHOICES") {
            this.scene_window.onEnterPress(function() {
                if (c.name != "SHOW_TEXT") {
                    Game.Canvas.Scene.exit("Scene_Window");
                    a.scene_window = null
                }
                a.nextCommand()
            })
        } else {
            this.nextCommand()
        }
        this.scene_window.text(f)
    },
    cmdChoice: function(b, a, c) {
        this.setCurrentPos(this._conditions[c]["endchoices"]);
        this.nextCommand()
    },
    cmdChoices: function(f, c, e) {
        var b = [];
        if (!(f instanceof Array)) {
            for (var d in f) {
                if (f[d] != "") {
                    b.push(f[d])
                }
            }
            f = b
        }
        var a = this;
        if (!this.scene_window) {
            this.scene_window = Game.Scene.call("Scene_Window", {
                overlay: true
            })
        }
        this.scene_window.choices(f);
        this.scene_window.onEnterPressChoice(function(g) {
            var h = a._conditions[e];
            a._conditions[e].val = false;
            a.setCurrentPos(h["choice_" + g]);
            Game.Canvas.Scene.exit("Scene_Window");
            a.scene_window = null;
            a.nextCommand()
        })
    },
    cmdEndChoices: function() {
        this.nextCommand()
    },
    cmdErase: function() {
        this.event.remove();
        this.commandsExit();
        this.nextCommand()
    },
    cmdSwitches: function(b, a) {
        var c = b.id;
        if (!c) {
            c = b
        }
        global.game_switches.set(c, a == "SWITCHES_ON");
        this.nextCommand()
    },
    cmdSelfSwitches: function(a, b) {
        var c = a.id;
        if (!c) {
            c = a
        }
        global.game_selfswitches.set(this.event.map_id, this.event.id, c, b == "SELF_SWITCH_ON");
        this.nextCommand()
    },
    cmdVariables: function(c) {
        var a = c.operand;
        var b;
        if (typeof a == "object") {
            if (a instanceof Array) {
                b = Math.floor(Math.random() * (a[1] - a[0])) + a[0]
            } else {
                if (a.variable !== undefined) {
                    b = global.game_variables.get(a.variable)
                }
            }
        } else {
            b = a
        }
        global.game_variables.set(c.id, b, c.operation);
        this.nextCommand()
    },
    cmdChangeGold: function(b) {
        var a = this._getValue(b);
        global.game_player.addGold(a);
        this.nextCommand()
    },
    cmdMoveRoute: function(c) {
        var a = this,
            d = this._target(c.target),
            b = c.options || [],
            e = CE.inArray("wait_end", b) != -1;
        console.log(b);
        d.moveRoute(c.move, function() {
            if (e) {
                a.nextCommand()
            }
        }, {
            repeat: CE.inArray("repeat", b) != -1
        });
        if (!e) {
            this.nextCommand()
        }
    },
    cmdShowAnimation: function(b) {
        var a = this._target(b.target);
        global.game_map.callScene("animation", [a.id, b.name]);
        this.nextCommand()
    },
    cmdTransferPlayer: function(a) {
        var b = this._getPos(a);
        if (a.direction && a.direction != "0") {
            global.game_player.direction = a.direction
        }
        Game.Scene.call("Scene_Map", {
            params: {
                map_id: b.id,
                pos: b
            }
        }).load();
        global.game_player.freeze = false
    },
    cmdBlink: function(c) {
        var a = this;
        var d;

        function b() {
            a.nextCommand()
        }
        switch (c.target) {
            case "this":
                d = this.event.id;
                break;
            case "player":
                d = 0;
                break;
            default:
                d = c.target
        }
        global.game_map.callScene("blink", [d, c.duration, c.frequence, function() {
            if (c.wait != "_no") {
                b()
            }
        }]);
        if (c.wait == "_no") {
            b()
        }
    },
    cmdScreenFlash: function(b) {
        var a = this;

        function c() {
            a.nextCommand()
        }
        var d = [b.color, b.speed],
            e = null;
        if (b.wait == "_no") {
            c()
        } else {
            e = c
        }
        global.game_map._scene.effect("screenFlash", d, e)
    },
    cmdScreenColorTone: function(b) {
        var a = this;

        function c() {
            a.nextCommand()
        }
        b.composite = b.composite || "darker";
        var d = [b.color, b.speed, b.composite, b.opacity],
            e = null;
        if (b.wait == "_no") {
            c()
        } else {
            e = c
        }
        global.game_map._scene.effect("changeScreenColorTone", d, e)
    },
    cmdScreenShake: function(b) {
        var a = this;

        function c() {
            a.nextCommand()
        }
        var d = [b.power[0], b.speed[0], b.duration, b.axis],
            e = null;
        if (b.wait == "_no") {
            c()
        } else {
            e = c
        }
        global.game_map._scene.effect("shake", d, e)
    },
    cmdSetEventLocation: function(e) {
        var d = this._target(e.event);
        var a, f, c = {
            refresh: true
        };
        if (e["position-type"] == "constant" && e.appointement) {
            a = e.appointement.x;
            f = e.appointement.y
        } else {
            if (e["position-type"] == "variables") {
                a = global.game_variables.get(e.x);
                f = global.game_variables.get(e.y)
            } else {
                if (e["position-type"] == "other_event") {
                    var b = this._target(e.other_event);
                    a = b.x;
                    f = b.y;
                    c.tileToPixel = false;
                    b.moveto(d.x, d.y, c)
                }
            }
        }
        if (e.direction) {
            d.direction = e.direction
        }
        d.moveto(a, f, c);
        this.nextCommand()
    },
    cmdScrollMap: function(b) {
        var a = this;
        var c = {
            x: b.x * global.game_map.tile_w,
            y: b.x * global.game_map.tile_h,
        };
        global.game_map.scrollMap(c, function() {
            a.nextCommand()
        })
    },
    cmdWait: function(b) {
        var a = this;
        setTimeout(function() {
            a.nextCommand()
        }, b.frame * 1000 / 60)
    },
    cmdPlayBGM: function(a) {
        global.game_system.bgmPlay(a.id);
        this.nextCommand()
    },
    cmdPlayBGS: function(a) {
        global.game_system.bgsPlay(a.id);
        this.nextCommand()
    },
    cmdPlayME: function(a) {
        global.game_system.mePlay(a.id);
        this.nextCommand()
    },
    cmdPlaySE: function(a) {
        global.game_system.sePlay(a.id);
        this.nextCommand()
    },
    cmdStopSE: function() {
        global.game_system.seStop();
        this.nextCommand()
    },
    cmdFadeOutMusic: function(a) {
        global.game_system.fadeOutMusic(a.frame);
        this.nextCommand()
    },
    cmdFadeOutSound: function() {
        global.game_system.fadeOutSound(params.frame);
        this.nextCommand()
    },
    cmdMemorizeMusic: function() {
        global.game_system.memorizeMusic();
        this.nextCommand()
    },
    cmdRestoreMusic: function() {
        global.game_system.restoreMusic();
        this.nextCommand()
    },
    cmdChangeItems: function(f, d) {
        var a, c, g, e, b;
        a = this._getValue(f);
        switch (d) {
            case "CHANGE_WEAPONS":
                e = "weapons";
                break;
            case "CHANGE_ARMORS":
                e = "armors";
                break;
            default:
                e = "items"
        }
        g = f.id;
        if (a >= 0) {
            global.game_player.addItem(e, g, a)
        } else {
            global.game_player.removeItem(e, g, Math.abs(a))
        }
        this.nextCommand()
    },
    cmdChangeLevel: function(b) {
        var a = this._getValue(b);
        this._execActor(b, function(c) {
            c.setLevel(a)
        });
        this.nextCommand()
    },
    cmdChangeEXP: function(b) {
        var a = this._getValue(b);
        this._execActor(b, function(c) {
            c.addExp(a)
        });
        this.nextCommand()
    },
    cmdChangeParams: function(b) {
        var a = this._getValue(b);
        this._execActor(b, function(c) {
            c.addCurrentParam(b.param, a, c.currentLevel)
        });
        this.nextCommand()
    },
    cmdChangeParamPoints: function(d, b) {
        var a = this._getValue(d),
            c;
        this._execActor(d, function(e) {
            switch (b) {
                case "CHANGE_HP":
                    c = "hp";
                    break;
                case "CHANGE_SP":
                    c = "sp";
                    break
            }
            e.changeParamPoints(c, a)
        });
        this.nextCommand()
    },
    cmdRecoverAll: function(c) {
        var b = [
                ["hp", "maxhp"],
                ["sp", "maxsp"]
            ],
            a;
        this._execActor(c, function(e) {
            for (var d = 0; d < b.length; d++) {
                a = e.getCurrentParam(b[d][1]);
                e.changeParamPoints(b[d][0], a, "set")
            }
        });
        this.nextCommand()
    },
    cmdChangeSkills: function(a) {
        this._execActor(a, function(b) {
            if (a.operation == "increase") {
                b.learnSkill(a.skill)
            } else {
                b.removeSkill(a.skill)
            }
        });
        this.nextCommand()
    },
    cmdChangeName: function(a) {
        this._execActor(a, function(b) {
            b.name = a.name
        });
        this.nextCommand()
    },
    cmdChangeClass: function(a) {
        this._execActor(a, function(b) {
            b.setClass(a["class"])
        });
        this.nextCommand()
    },
    cmdChangeGraphic: function(a) {
        global.game_player.graphic = a.graphic;
        global.game_map.refreshPlayer();
        this.nextCommand()
    },
    cmdChangeEquipment: function(c) {
        var a = c["operand-type"],
            b;
        if (a == "weapon") {
            b = "weapons"
        } else {
            b = "armors"
        }
        this._execActor(c, function(d) {
            var e = d.getItemsEquipedByType(b);
            d.removeItemEquiped(b, e);
            d.equipItem(b, c.operand)
        });
        this.nextCommand()
    },
    cmdChangeState: function(a) {
        this._execActor(a, function(b) {
            if (a.operation == "increase") {
                b.addState(a.state)
            } else {
                b.removeState(a.state)
            }
        });
        this.nextCommand()
    },
    _valuePicture: function(a) {
        if (a["operand-type"] == "variables" || a.variables) {
            a.x = global_game_variables.get(a.x);
            a.y = global_game_variables.get(a.y)
        }
        return a
    },
    cmdShowPicture: function(b) {
        var a = this;
        b = this._valuePicture(b);
        b.filename = Game.Path.get("pictures", b.filename, false, true);
        global.game_map.callScene("pictures", ["add", [b.id, b, function() {
            a.nextCommand()
        }]])
    },
    cmdMovePicture: function(a) {
        a = this._valuePicture(a);
        global.game_map.callScene("pictures", ["move", [a.id, a.duration, a]]);
        this.nextCommand()
    },
    cmdRotatePicture: function(a) {
        global.game_map.callScene("pictures", ["rotate", [a.id, a.speed]]);
        this.nextCommand()
    },
    cmdErasePicture: function(a) {
        global.game_map.callScene("pictures", ["erase", [a.id]]);
        this.nextCommand()
    },
    cmdDetectionEvents: function(a) {
        this.event.detectionEvents(a.area * global.game_map.tile_w, a.id);
        this.nextCommand()
    },
    cmdCallCommonEvent: function(b) {
        var a = this;
        Class.New("Game_CommonEvents", [b.name]).exec(this.event, function() {
            a.nextCommand()
        })
    },
    cmdAddDynamicEvent: function(b) {
        var a = this;
        var c = this._getPos(b);
        global.game_map.addDynamicEvent("dynamic_events", b.name, {
            x: c.x,
            y: c.y
        }, function(e, d) {
            a.nextCommand()
        }, {
            add: true,
            direction: b.direction != "0" ? b.direction : false
        })
    },
    cmdAddDynamicEventRelative: function(d) {
        var m = this;
        var c = global.game_player.direction,
            n = global.game_map.tile_w,
            g = global.game_map.tile_h,
            l = global.game_player.x / n,
            k = global.game_player.y / g,
            h, f;
        if (+d.move) {
            var b = [];
            for (var e = 0; e < +d.dir - 1; e++) {
                b.push(c)
            }
            var a = +d.dir;
            h = l;
            f = k;
            switch (c) {
                case "left":
                    h = l - a;
                    break;
                case "right":
                    h = l + a;
                    break;
                case "up":
                    f = k - a;
                    break;
                case "bottom":
                    f = k + a;
                    break
            }
            global.game_map.addDynamicEvent("dynamic_events", d.name, {
                x: h,
                y: f
            }, function(p, o) {
                o.moveTilePath(b);
                m.nextCommand()
            }, {
                add: true
            })
        } else {
            h = l;
            f = k;
            var a = +d.dir;
            switch (c) {
                case "left":
                    h = l - a;
                    break;
                case "right":
                    h = l + a;
                    break;
                case "up":
                    f = k - a;
                    break;
                case "bottom":
                    f = k + a;
                    break
            }
            global.game_map.addDynamicEvent("dynamic_events", d.name, {
                x: h,
                y: f
            }, function(p, o) {
                m.nextCommand()
            }, {
                add: true
            })
        }
    },
    cmdCallSystem: function(b) {
        for (var a = 0; a < Menu_Generated.scenes.length; a++) {
            s = Menu_Generated.scenes[a];
            if (s.id == b.menus) {
                scene = Game.Scene.call(s.menu_id, {
                    overlay: true
                })
            }
        }
        this.nextCommand()
    },
    cmdCallSave: function() {
        var a = Game.Scene.call("Scene_Load");
        a.refresh("save")
    },
    cmdScript: function(params) {
        var t = params.text.replace(/&#34;/g, '"');
        eval(t);
        this.nextCommand()
    },
    cmdIf: function(params, name, id) {
        var this_event = this.event;
        if (params.command) {
            params = params.command
        }

        function actor(id, method, params) {
            var _actor = global.game_actors.getById(id);
            if (_actor) {
                if (params == "isParameter") {
                    return _actor[method]
                } else {
                    if (!(params instanceof Array)) {
                        params = [params]
                    }
                    return _actor[method].apply(_actor, params)
                }
            }
        }

        function event(id) {
            if (id === undefined || id == "NULL") {
                return this_event
            }
            if (id == 0) {
                return global.game_player
            } else {
                return global.game_map.getEvent(id)
            }
        }
        var _var = {
                "switch[%1]": "global.game_switches.get(%1)",
                "self_switch[%1]": 'global.game_selfswitches.get(this_event.map_id, this_event.id, "%1")',
                "variable[%1]": "global.game_variables.get(%1)",
                "actor_in_party[%1]": "global.game_actors.getById(%1)",
                "actor_name[%1]": 'actor(%1, "name", "isParameter")',
                "actor_skill_learned[%1,%2]": 'actor(%1, "getSkill", %2)',
                "actor_state_inflicted[%1,%2]": 'actor(%1, "stateInflicted", %2)',
                "actor_weapon_equiped[%1,%2]": 'actor(%1, "itemIsEquiped", ["weapons", %2])',
                "actor_armor_equiped[%1,%2]": 'actor(%1, "itemIsEquiped", ["armors", %2])',
                "character_facing[%1]": "event(%1).direction",
                gold: "global.game_player.gold",
                "item_possessed[%1]": 'global.game_player.getItem("items", %1)',
                "weapon_possessed[%1]": 'global.game_player.getItem("weapons", %1)',
                "armor_possessed[%1]": 'global.game_player.getItem("armors", %1)'
            },
            patt, new_key, n;
        for (var key in _var) {
            new_key = key.replace(/\[/g, "\\[");
            new_key = new_key.replace(/\]/g, "\\]");
            new_key = new_key.replace(/%[0-9]+/g, "([0-9A-Z]+)");
            patt = new RegExp(new_key, "gi");
            n = patt.exec(params);
            params = params.replace(patt, _var[key]);
            if (n) {
                for (var i = 1; i <= 10; i++) {
                    if (n[i]) {
                        params = params.replace("%" + i, n[i])
                    }
                }
            }
        }
        var e = eval(params),
            c;
        c = this._conditions[id];
        if (!e) {
            c.val = false;
            if (c["else"]) {
                this.setCurrentPos(c["else"])
            } else {
                this.setCurrentPos(c.endif)
            }
        }
        this.nextCommand()
    },
    cmdElse: function(b, a, c) {
        this.setCurrentPos(this._conditions[c]["endif"]);
        this.nextCommand()
    },
    cmdEndif: function() {
        this.nextCommand()
    },
    _nextRealPos: function() {
        var d = self.currentCmd + 1;
        var b = true;
        var c, a = self.indent
    },
    _execActor: function(c, d) {
        var b = [];
        if (c.actor == undefined) {
            c.actor = 0
        }
        if (c.actor == "all") {
            b = global.game_actors.get()
        } else {
            b = [global.game_actors.getById(c.actor)]
        }
        for (var a = 0; a < b.length; a++) {
            if (d) {
                if (b[a]) {
                    d.call(this, b[a])
                }
            }
        }
        return b
    },
    _getValue: function(c) {
        var a, b;
        if (c.variable || c["operand-type"] == "variables") {
            b = c.variable || c.operand;
            a = global.game_variables.get(b)
        } else {
            a = c.constant || c.operand
        }
        return a * (c.operation == "decrease" ? -1 : 1)
    },
    _getPos: function(a) {
        var b = {
            x: a.x,
            y: a.y,
            id: a.name
        };
        if (a["position-type"] == "constant") {
            b = {
                x: a.appointement.x,
                y: a.appointement.y,
                id: a.appointement.id
            }
        } else {
            if (a["position-type"] == "variables") {
                b.id = global.game_variables.get(b.id);
                b.x = global.game_variables.get(b.x);
                b.y = global.game_variables.get(b.y)
            }
        }
        return b
    },
    _actor: function(b, a) {
        return a.getDatabase("actors", b)
    },
    _target: function(a) {
        if (a == "this" || a === undefined) {
            return this.event
        } else {
            if (a == "player" || a == 0) {
                return global.game_player
            }
        }
        return global.game_map.getEvent(a)
    }
});
Interpreter = {};
Interpreter.commandFunction = {};
Interpreter.setCommand = function(b, a) {
    Interpreter.commandFunction[b] = a
};
Interpreter.addCommand = Interpreter.setCommand;
Class.create("Game_Plugin", {
    _class_: null,
    callSprite: function(b, a) {
        b = "_" + b;
        if (this._class_ && this._class_[b]) {
            return this._class_[b].apply(this._class_, a)
        }
    }
});
Class.create("Game_System", {
    _current: {
        bgm: null,
        bgs: null,
        se: null,
        me: null
    },
    _memorize: {
        bgm: null,
        bgs: null
    },
    bgmPlay: function(a) {
        this._playAudio(a, "bgm")
    },
    bgsPlay: function(a) {
        this._playAudio(a, "bgs")
    },
    mePlay: function(a) {
        this._playAudio(a, "me")
    },
    sePlay: function(a) {
        this._playAudio(a, "se")
    },
    seStop: function() {
        if (!this._current.se) {
            return false
        }
        this._stopAudio(this._current.se, "se")
    },
    memorizeMusic: function() {
        this._memorize.bgm = this._current.bgm;
        this._memorize.bgs = this._current.bgs
    },
    restoreMusic: function() {
        this._stopAudio(this._current.bgm, "bgm");
        this._stopAudio(this._current.bgs, "bgs");
        this._playAudio(this._memorize.bgm, "bgm");
        this._playAudio(this._memorize.bgs, "bgs")
    },
    fadeOutMusic: function(b) {
        var a = this;
        if (this._current.bgm) {
            Game.Canvas.Sound.fadeOut("bgms_" + this._current.bgm, b, function() {
                a._stopAudio(a._current.bgm, "bgm")
            })
        }
        if (this._current.bgs) {
            Game.Canvas.Sound.fadeOut("bgss_" + this._current.bgs, b, function() {
                a._stopAudio(a._current.bgs, "bgs")
            })
        }
    },
    fadeOutSound: function(b) {
        var a = this;
        if (this._current.me) {
            Game.Canvas.Sound.fadeOut("mes_" + this._current.me, b, function() {
                a._stopAudio(a._current.me, "me")
            })
        }
        if (this._current.se) {
            Game.Canvas.Sound.fadeOut("ses_" + this._current.se, b, function() {
                a._stopAudio(a._current.se, "se")
            })
        }
    },
    _playAudio: function(b, a) {
        if (this._current[a] == b) {
            return
        }
        if (this._current[a]) {
            this._stopAudio(this._current[a], a)
        }
        this._current[a] = b;
        Game.Path.loadMaterial(a + "s", b, function() {
            Game.Canvas.Sound.playLoop(a + "s_" + b)
        })
    },
    _stopAudio: function(b, a) {
        this._current[a] = null;
        Game.Canvas.Sound.stop(a + "s_" + b)
    }
});
Class.create("Game_Switches", {
    initialize: function() {
        this.data = {}
    },
    get: function(a) {
        if (this.data[a] != null) {
            return this.data[a]
        } else {
            return false
        }
    },
    set: function(b, c) {
        if (!(b instanceof Array)) {
            b = [b]
        }
        for (var a = 0; a < b.length; a++) {
            this.data[b[a]] = c
        }
        Game.Plugin.call("Game", "switches", [b, c, this]);
        global.game_map.refreshEvents()
    }
});
Class.create("Game_Variables", {
    initialize: function() {
        this.data = {}
    },
    get: function(a) {
        if (this.data[a] != null) {
            return this.data[a]
        } else {
            return 0
        }
    },
    set: function(c, a, b) {
        if (typeof c == "number") {
            c = [c]
        }
        if (typeof a == "object") {
            if (a instanceof Array) {
                a = CE.random(a[0], a[1])
            } else {
                if (a.variable !== undefined) {
                    a = global.game_variables.get(a.variable)
                }
            }
        }
        for (i = 0; i < c.length; i++) {
            _var = this.get(c[i]);
            switch (b) {
                case "add":
                    _var += +a;
                    break;
                case "sub":
                    _var -= a;
                    break;
                case "mul":
                    _var *= a;
                    break;
                case "div":
                    _var /= a;
                    break;
                case "mod":
                    _var %= a;
                    break;
                default:
                    _var = a
            }
            this.data[c[i]] = _var
        }
        Game.Plugin.call("Game", "variable", [c, a, b, this]);
        global.game_map.refreshEvents()
    }
});
Class.create("Game_SelfSwitches", {
    initialize: function() {
        this.data = {}
    },
    get: function(a, c, b) {
        if (this.data[a] && this.data[a][c]) {
            return this.data[a][c][b]
        }
        return false
    },
    set: function(a, d, b, c) {
        if (!this.data[a]) {
            this.data[a] = {}
        }
        if (!this.data[a][d]) {
            this.data[a][d] = {}
        }
        this.data[a][d][b] = c;
        Game.Plugin.call("Game", "selfswitch", [a, d, b, c, this]);
        global.game_map.refreshEvents()
    }
});
Class.create("Game_CommonEvents", {
    initialize: function(a) {
        this.id = a
    },
    exec: function(e, d) {
        var b = global.data.common_events[this.id],
            a;
        if (typeof e == "function") {
            d = e;
            e = false
        }
        if (!e) {
            e = global.game_player
        }
        if (b) {
            for (var c = 0; c < b.commands.length; c++) {
                b.commands[c] = b.commands[c].replace(/&apos;/g, "'")
            }
            Game.Plugin.call("Game", "commonEvents", [e, this]);
            a = Class.New("Interpreter", [this.event, b.commands]);
            a.execCommands(d)
        }
    }
});
var is_server = false;
if (typeof exports != "undefined") {
    var CE = require("canvasengine").listen(),
        Class = CE.Class;
    var Game = {
        Plugin: {
            call: function() {}
        },
        maps: {},
        getGlobalEvent: function() {}
    };
    is_server = true
}
var _class = {
    grid: null,
    nb_autotiles_max: 64,
    events: {},
    tile_w: 32,
    tile_h: 32,
    _scene: null,
    _callback: null,
    _tick: {},
    initialize: function() {
        this.tick()
    },
    transfer_player: function(a, b) {
        global.game_player.moveto(a, b)
    },
    load: function(f, h, e) {
        this.tileset_data = global.data.tilesets;
        this.actions_data = global.data.actions;
        this.autotiles_data = global.data.autotiles;
        f = f || {};
        var b = this,
            c, a = f.map_id;
        if (typeof a == "function") {
            c = h;
            h = a;
            e = c;
            a = false
        }
        if (a) {
            this.map_id = a
        } else {
            this.map_id = global.data.system ? global.data.system.start.id : 0
        }
        global.game_player.map_id = this.map_id;
        if (f.pos) {
            global.game_player.x = f.pos.x;
            global.game_player.y = f.pos.y
        }
        this.map = global.data.map_infos[this.map_id];
        if (!this.map) {
            this.map = {}
        }
        if (h) {
            this._callback = h
        }
        if (e) {
            this._scene = e
        }

        function g(k) {
            b.map.data = k;
            b.grid = Class.New("Grid", [k.map.length, k.map[0].length]);
            b.grid.setCellSize(b.tile_w, b.tile_h);
            b.grid.setPropertyCell(k.map);
            b._setup()
        }
        var d = Game.maps[this.map_id];
        if (d) {
            g({
                map: d
            })
        } else {
            (CE.Core || CE).getJSON("Data/Maps/MAP-" + this.map_id + ".json", g)
        }
    },
    scrollMap: function(a) {
        this.callScene("scrollMap", [a])
    },
    passable: function(m, u, t, l, h, D) {
        m.savePosition();
        m.position(l, h);
        var F = this.grid.getEntityCells(m),
            a, w, q, r;
        var c;
        var o = this;

        function E(e) {
            var d, H, y;
            for (var p = 0; p < e.length; p++) {
                d = e[p];
                if (d[0] != undefined) {
                    H = d[0].sides;
                    var x = (p == 0 || p == 2) && H != p,
                        k = (p == 1 || p == 3) && H != p;
                    if (D == "left" && ((H == 3 && p == 1) || x)) {
                        return true
                    } else {
                        if (D == "right" && ((H == 1 && p == 3) || x)) {
                            return true
                        } else {
                            if (D == "bottom" && ((H == 2 && p == 0) || k)) {
                                return true
                            } else {
                                if (D == "up" && ((H == 0 && p == 2) || k)) {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            return false
        }

        function f(x) {
            var d, H, y = m.getPolygon().points,
                k = l,
                e = h;

            function p(J, K) {
                return {
                    x: J * o.tile_w,
                    y: K * o.tile_h
                }
            }
            if (!(x instanceof Class)) {
                d = [p(x.col, x.row), p(x.col + 1, x.row), p(x.col + 1, x.row + 1), p(x.col, x.row + 1)]
            } else {
                var I = x.getPolygon().points;
                d = [{
                    x: x.x + I[0].x,
                    y: x.y + I[0].y
                }, {
                    x: x.x + I[1].x,
                    y: x.y + I[1].y
                }, {
                    x: x.x + I[2].x,
                    y: x.y + I[2].y
                }, {
                    x: x.x + I[3].x,
                    y: x.y + I[3].y
                }]
            }
            switch (D) {
                case "left":
                    H = Math.abs(d[1].x - (u + y[0].x));
                    k = u - H;
                    break;
                case "right":
                    H = Math.abs(d[0].x - (u + y[1].x));
                    k = u + H;
                    break;
                case "up":
                    H = Math.abs(d[3].y - (t + y[0].y));
                    e = t - H;
                    break;
                case "bottom":
                    H = Math.abs(d[0].y - (t + y[2].y));
                    e = t + H;
                    break
            }
            return {
                passable: false,
                x: k,
                y: e
            }
        }
        var b = F.cells,
            v = true,
            G = true;
        for (var A = 0; A < b.length; A++) {
            a = this.grid.getPropertyByCell(b[A].col, b[A].row);
            if (!a) {
                m.restorePosition();
                return {
                    passable: false,
                    x: u,
                    y: t
                }
            }
            var g = 1;
            for (var z = a.length - 1; z >= 0; z--) {
                if (a[z] || a[z] == 0) {
                    if (this.isAutotile(a[z])) {
                        r = this.getPropAutotile(a[z])
                    } else {
                        r = this.getPropTile(a[z])
                    }
                    if (!r) {
                        g &= 1
                    } else {
                        g &= !(r[1] !== undefined && r[1] > 0)
                    }
                }
            }
            if (!g) {
                G = E(this.grid.testCell(b[A], m, {
                    ignoreTypeLine: true
                }));
                if (!G) {
                    m.restorePosition();
                    var n = f.call(this, b[A]);
                    return n
                }
            }
        }
        var C, B;
        for (var q in this.events) {
            C = this.events[q];
            if (!C || (!C.exist || q == m.id)) {
                continue
            }
            c = m.hit(C);
            if (c.over >= 1) {
                if (!E(c.result.coincident)) {
                    C._hit = true;
                    m.restorePosition();
                    if (c.over == 1) {
                        if (C.trigger == "contact") {
                            B = C.execTrigger();
                            if (!B) {
                                return {
                                    passable: true
                                }
                            }
                        } else {
                            Game.Plugin.call("Game", "eventContact", [C, this])
                        }
                    }
                    if (C.through) {
                        return f.call(this, C)
                    }
                } else {
                    C._hit = false
                }
            } else {
                C._hit = false
            }
        }
        if (m.id != 0) {
            c = m.hit(global.game_player);
            if (c.over >= 1 && !E(c.result.coincident)) {
                Game.Plugin.call("Game", "contactPlayer", [m, this]);
                return {
                    passable: false,
                    x: u,
                    y: t
                }
            }
        }
        m.restorePosition();
        return {
            passable: true,
            x: l,
            y: h
        }
    },
    getEvent: function(a) {
        return this.events[a]
    },
    execEvent: function() {
        var a;
        for (var b in this.events) {
            a = this.events[b];
            if (a && a._hit && a.trigger == "action_button") {
                Game.Plugin.call("Game", "execEvent", [a, this]);
                a.execTrigger()
            }
        }
    },
    updateEvents: function() {
        var a;
        for (var b in this.events) {
            this.events[b].update()
        }
    },
    refreshEvents: function() {
        var a;
        for (var b in this.events) {
            a = this.events[b].refresh();
            this.callScene("refreshEvent", [b, a])
        }
    },
    refreshPlayer: function() {
        var a = global.game_player.serialize();
        this.callScene("refreshEvent", [0, a])
    },
    isAutotile: function(a) {
        return a < this.nb_autotiles_max * 48
    },
    getPropAutotile: function(b) {
        if (!this._autotiles) {
            return true
        }
        var a = Math.floor(b / 48);
        return this._autotiles[a]
    },
    getPropTile: function(b) {
        if (!this._priorities) {
            return true
        }
        var a = b - this.nb_autotiles_max * 48;
        return this._priorities[a]
    },
    _setup: function() {
        if (!this.map.events) {
            this.map.events = []
        }
        if (!this.map.dynamic_event) {
            this.map.dynamic_event = []
        }
        var h, c = 0,
            g = this.map.events.length,
            f = this.map.dynamic_event.length + g,
            m = this,
            b = this.tileset_data[this.map.tileset_id],
            k = this.autotiles_data[this.map.autotiles_id],
            l = [],
            o = [];
        if (!b) {
            b = {
                name: "",
                propreties: {},
                graphic: null
            }
        }
        this._tileset_name = b.name;
        this._priorities = b.propreties;
        this._autotiles = k ? k.propreties : {};

        function n(q, e) {
            c++;
            if (e) {
                l.push(e.serialize());
                if (c != f) {
                    return
                }
            }
            var p = {
                data: m.map.data,
                propreties: m._priorities,
                musics: {
                    bgm: m.map.bgm,
                    bgs: m.map.bgs
                },
                graphics: {
                    tileset: b.graphic,
                    autotiles: k ? k.autotiles : {},
                },
                autotiles: m._autotiles,
                player: global.game_player.serialize(),
                events: l,
                system: global.data.system,
                actions: m.actionSerialize()
            };
            if (is_server) {
                m.callScene("load", p)
            } else {
                m._callback(p)
            }
        }
        global.game_player.start();
        if (this.events) {
            for (var a in this.events) {
                this.events[a].killIntervalMove()
            }
        }
        this.events = {};
        for (var d = 0; d < g; d++) {
            h = this.map.events[d];
            this.loadEvent(h, n)
        }
        for (var d = 0; d < this.map.dynamic_event.length; d++) {
            h = this.map.dynamic_event[d];
            this.addDynamicEvent(h.name, h.id, h, n, {
                refresh: false
            })
        }
        if (f == 0) {
            n()
        }
        Game.Plugin.call("Game", "loadMap", [this])
    },
    getSize: function() {
        return this.grid.getNbCell() * this.tile_w * this.tile_h
    },
    getTileSize: function() {
        return {
            width: this.tile_w,
            height: this.tile_h,
        }
    },
    tileToPixel: function(a, b) {
        return {
            x: a * this.tile_w,
            y: b * this.tile_h
        }
    },
    loadEvent: function(c, f, g) {
        var b = this;
        if (typeof f == "function") {
            g = f;
            f = false
        }
        var e = "Data/Events/" + (!f ? "MAP-" + this.map_id + "/" : "") + c + ".json";

        function d(h) {
            var k = CanvasEngine.uniqid();
            if (!(h instanceof Array)) {
                k = CanvasEngine.uniqid();
                if (!h.pages) {
                    h.pages = [h]
                }
                h = [{
                    id: k,
                    name: c + "-" + k
                }, h.pages]
            } else {
                if (h[0].id) {
                    k = h[0].id
                } else {
                    h[0].id = k
                }
            }
            b.events[k] = Class.New("Game_Event", [b.map_id, h]);
            b.events[k].refresh();
            Game.Plugin.call("Game", "addEvent", [b.events[k], b.map_id, h, f, this]);
            if (g) {
                g.call(this, k, b.events[k], h)
            }
        }
        var a = f ? global.data[c][f] : Game.getGlobalEvent(this.map_id, c);
        if (a) {
            d(a)
        } else {
            (CE.Core || CE).getJSON(e, d)
        }
    },
    createEvent: function(d, a, c, b) {
        b = b || {};
        b.id = d;
        b.x = a;
        b.y = c;
        return this.events[d] = Class.New("Game_Event", [this.map_id, [b]])
    },
    displayEvent: function(b) {
        var a = this.getEvent(b);
        this.callScene("addEvent", [a.serialize()])
    },
    addDynamicEvent: function(b, c, f, e, d) {
        var a = this;
        d = d || {};
        this.loadEvent(b, c, function(k, g, h) {
            if (d.direction) {
                g.direction = d.direction
            }
            g.moveto(f.x, f.y, d);
            if (d.add) {
                a.callScene("addEvent", [g.serialize()])
            }
            if (e) {
                e.call(this, k, g, h)
            }
        })
    },
    removeEvent: function(a) {
        Game.Plugin.call("Game", "removeEvent", [this.events[a], this]);
        this.callScene("removeEvent", [a]);
        delete this.events[a]
    },
    callScene: function(b, a) {
        if (is_server) {
            this.scene.emit("Scene_Map." + b, a)
        } else {
            this._scene[b].apply(this._scene, a)
        }
    },
    actionSerialize: function() {
        var e = {},
            b, d = {
                keypress: "",
                animation_up: "",
                animation_bottom: "",
                animation_right: "",
                animation_left: "",
                animation_finish: "",
                graphic: "",
                "graphic-params": "",
                speed: ""
            };
        for (var f in this.actions_data) {
            b = this.actions_data[f];
            e[f] = {};
            for (var c in b) {
                if (c in d) {
                    e[f][c] = b[c]
                }
            }
        }
        return e
    },
    execAction: function(a) {
        Game.Plugin.call("Game", "action", [this.actions_data[a], a, this])
    },
    tick: function() {
        var a = this;
        setInterval(function() {
            Game.Plugin.call("Game", "tick", [a])
        }, 1000 / 60)
    },
    clear: function() {
        for (var a in this._tick) {
            clearTimeout(this._tick[a])
        }
    },
};
if (typeof exports == "undefined") {
    Class.create("Game_Map", _class)
} else {
    CE.Model.create("Game_Map", ["load"], _class);
    exports.New = function() {
        return CE.Model.New("Game_Map")
    }
}
if (typeof exports != "undefined") {
    var CE = require("canvasengine").listen(),
        Class = CE.Class;
    var Game = {
        Plugin: {
            call: function() {}
        }
    }
}
Class.create("Game_Character", {
    entity: null,
    _z: null,
    exp: [],
    exist: true,
    currentLevel: 1,
    maxLevel: 99,
    currentExp: 0,
    skillsByLevel: [],
    params: {},
    itemEquiped: {},
    className: "",
    states: {},
    skills: [],
    defstates: {},
    hp: 0,
    sp: 0,
    items: {},
    paramPoints: {},
    typeMove: [],
    removeMove: {},
    _timeMove: "",
    _tick: {},
    initialize: function() {
        this.id = 0;
        this.position(0, 0);
        this.rect(4, 16, 32 - 8, 16);
        if (this._initialize) {
            this._initialize.apply(this, arguments)
        }
    },
    setProperties: function(b) {
        b = b || {};
        if (b.options) {
            for (var a = 0; a < b.options.length; a++) {
                b[b.options[a]] = true
            }
        }
        this.trigger = b.trigger;
        this.direction_fix = b.direction_fix;
        this.no_animation = b.no_animation;
        this.stop_animation = b.stop_animation;
        this.speed = b.speed === undefined ? 3 : b.speed;
        this.type = b.type || "fixed";
        this.frequence = (b.frequence || 0) * 5;
        this.nbSequenceX = b.nbSequenceX || 4;
        this.nbSequenceY = b.nbSequenceY || 4;
        this.speedAnimation = b.speedAnimation || 5;
        this.graphic_pattern = b.pattern === undefined ? 0 : b.pattern;
        this.through = !+b.graphic ? b.through : true;
        this.alwaysOnTop = b.alwaysOnTop !== undefined ? b.alwaysOnTop : false;
        this.alwaysOnBottom = b.alwaysOnBottom !== undefined ? b.alwaysOnBottom : false;
        this.regX = b.regX !== undefined ? b.regX : 0;
        this.regY = b.regY !== undefined ? b.regY : 0;
        if (this.alwaysOnBottom) {
            this._z = 0
        }
        if (this.alwaysOnTop) {
            this._z = global.game_map.getSize() + 1
        }
        this.direction = b.direction || "bottom";
        this.graphic = +b.graphic;
        this.graphic_params = b["graphic-params"];
        this.moveStart()
    },
    moveto: function(a, d, b) {
        b = b || {};
        if (b.tileToPixel === undefined) {
            b.tileToPixel = true
        }
        var c = b.tileToPixel ? global.game_map.tileToPixel(a, d) : {
            x: a,
            y: d
        };
        this.position(c.x, c.y);
        if (b.refresh) {
            global.game_map.callScene("setEventPosition", [this.id, c.x, c.y])
        }
    },
    lastTypeMove: function() {
        return this.typeMove[this.typeMove.length - 1]
    },
    removeTypeMove: function(b) {
        for (var a = 0; a < this.typeMove.length; a++) {
            if (this.typeMove[a] == b) {
                this.removeTypeMove[b] = true;
                delete this.typeMove[a]
            }
        }
        var c = this.lastTypeMove();
        if (c) {
            switch (c) {
                case "random":
                    this.moveRandom();
                    break;
                case "approach":
                    this.approachPlayer();
                    break
            }
        }
    },
    approachPlayer: function() {
        var a = this;
        b();

        function b() {
            if (a.removeTypeMove.approach) {
                a.removeTypeMove.approach = false;
                return
            }
            if (!global.game_map.getEvent(a.id)) {
                return
            }
            var c = a.directionRelativeToPlayer();
            if (c) {
                a.moveOneTile(c, function() {
                    if (a.frequence != 0) {
                        global.game_map.callScene("stopEvent", [a.id])
                    }
                    a._tick = setTimeout(b, a.frequence * 60)
                })
            }
        }
    },
    directionRelativeToPlayer: function() {
        var a = global.game_player;
        if (!a) {
            return false
        }

        function c() {
            if (a.x > this.x) {
                return "right"
            }
            if (a.x < this.x) {
                return "left"
            }
        }

        function b() {
            if (a.y < this.y) {
                return "up"
            }
            if (a.y > this.y) {
                return "bottom"
            }
        }
        if (Math.abs(a.x - this.x) < Math.abs(a.y - this.y)) {
            return b.call(this)
        } else {
            return c.call(this)
        }
    },
    turn: function(a) {
        this.direction = a;
        global.game_map.callScene("turnEvent", [this.id, a])
    },
    moveRoute: function(d, h, e) {
        var c = -1,
            b = this;
        e = e || {};
        f();

        function a(k) {
            if (!k) {
                k = 1
            }
            setTimeout(f, 1000 / 60 * k)
        }

        function g(k) {
            if (k == "left" || k == "right") {
                return k == "left" ? "right" : "left"
            }
            return k == "up" ? "bottom" : "up"
        }

        function f() {
            var o, k;
            c++;
            o = d[c];
            if (o !== undefined) {
                if (/speed_[0-9]+/.test(o)) {
                    k = /speed_([0-9]+)/.exec(o);
                    b.speed = k[1];
                    a();
                    return
                }
                if (/frequence_[0-9]+/.test(o)) {
                    k = /frequence_([0-9]+)/.exec(o);
                    b.setParameter("frequence", k[1]);
                    a();
                    return
                }
                if (/wait_[0-9]+/.test(o)) {
                    k = /wait_([0-9]+)/.exec(o);
                    a(k[1]);
                    return
                }
                if (/graphic_[0-9]+/.test(o)) {
                    k = /graphic_([0-9]+)/.exec(o);
                    b.setParameter("graphic", k[1]);
                    a();
                    return
                }
                if (/opacity_[0-9]+/.test(o)) {
                    k = /opacity_([0-9]+)/.exec(o);
                    b.setParameter("opacity", k[1]);
                    a();
                    return
                }
                if (/switch_(ON|OFF)_[0-9]+/.test(o)) {
                    k = /switch_(ON|OFF)_([0-9]+)/.exec(o);
                    global.game_switches.set(k[2], k[1] == "ON");
                    a();
                    return
                }
                switch (o) {
                    case 2:
                    case 4:
                    case 6:
                    case 8:
                    case "up":
                    case "left":
                    case "right":
                    case "bottom":
                    case "random":
                    case "lower_left":
                    case "lower_right":
                    case "upper_left":
                    case "upper_right":
                        if (o == "random") {
                            var n = CE.random(0, 4);
                            switch (n) {
                                case 0:
                                    o = "left";
                                    break;
                                case 1:
                                    o = "right";
                                    break;
                                case 2:
                                    o = "up";
                                    break;
                                case 3:
                                    o = "bottom";
                                    break
                            }
                        }
                        b.moveOneTile(o, function() {
                            f()
                        });
                        break;
                    case "turn_right":
                    case "turn_left":
                    case "turn_up":
                    case "turn_bottom":
                        k = /turn_(.+)/.exec(o);
                        b.turn(k[1]);
                        a();
                        break;
                    case "turn_90d_right":
                    case "turn_90d_left":
                    case "turn_90d_right_or_left":
                        if (o == "turn_90d_right_or_left") {
                            o = CE.random(1, 2) == 1 ? "turn_90d_right" : "turn_90d_left"
                        }
                        var r = ["up", "right", "bottom", "left"];
                        var q = CE.inArray(b.direction, r) + (o == "turn_90d_right" ? -1 : 1);
                        if (q > r.length - 1) {
                            q = 0
                        } else {
                            if (q < 0) {
                                q = r.length - 1
                            }
                        }
                        b.turn(r[q]);
                        a();
                        break;
                    case "turn_180d":
                        k = g(b.direction);
                        b.turn(k);
                        a();
                        break;
                    case "turn_at_random":
                        var n = CE.random(0, 4);
                        switch (n) {
                            case 0:
                                o = "left";
                                break;
                            case 1:
                                o = "right";
                                break;
                            case 2:
                                o = "up";
                                break;
                            case 3:
                                o = "bottom";
                                break
                        }
                        b.turn(o);
                        a();
                        break;
                    case "turn_toward":
                    case "turn_away":
                        k = global.game_player.direction;
                        if (o == "turn_toward") {
                            k = g(k)
                        }
                        b.turn(k);
                        a();
                        break;
                    case "step_forward":
                    case "step_backward":
                    case "move_toward":
                    case "move_away":
                        k = global.game_player.direction;
                        var l = false,
                            p;
                        if (o == "step_forward" || o == "move_toward") {
                            k = g(k)
                        }
                        p = g(k);
                        if (o != "move_toward" && o != "move_away") {
                            l = {
                                direction: p
                            }
                        }
                        b.moveOneTile(k, function() {
                            if (l) {
                                b.direction = p
                            }
                            f()
                        }, l);
                        break;
                    case "direction_fix_ON":
                    case "no_animation_ON":
                    case "stop_animation_ON":
                    case "through_ON":
                    case "alwaysOnTop_ON":
                    case "alwaysOnBottom_ON":
                    case "direction_fix_OFF":
                    case "no_animation_OFF":
                    case "stop_animation_OFF":
                    case "through_OFF":
                    case "alwaysOnTop_OFF":
                    case "alwaysOnBottom_OFF":
                        k = /(.+)_(ON|OFF)/.exec(o);
                        b.setParameter(k[1], k[2] == "ON");
                        a();
                        break
                }
            } else {
                if (e.repeat) {
                    c = -1;
                    a()
                } else {
                    global.game_map.callScene("stopEvent", [b.id]);
                    if (h) {
                        h.call(b)
                    }
                }
            }
        }
    },
    setParameter: function(a, b) {
        this[a] = b;
        global.game_map.callScene("setParameterEvent", [this.id, a, b])
    },
    moveRandom: function() {
        var a = this;
        if (this._tick) {
            clearTimeout(this._tick)
        }
        b();

        function b() {
            var e;
            if (a.removeTypeMove.random) {
                a.removeTypeMove.random = false;
                return
            }
            if (!global.game_map.getEvent(a.id)) {
                return
            }
            var d = CE.random(0, 4),
                c;
            switch (d) {
                case 0:
                    c = "left";
                    break;
                case 1:
                    c = "right";
                    break;
                case 2:
                    c = "up";
                    break;
                case 3:
                    c = "bottom";
                    break
            }
            a.moveOneTile(c, function(f) {
                if (f) {
                    return
                }
                if (a.frequence != 0) {
                    global.game_map.callScene("stopEvent", [a.id])
                }
                a._tick = setTimeout(b, a.frequence * 60)
            })
        }
    },
    movePause: function() {
        if (this._tick) {
            clearTimeout(this._tick)
        }
    },
    moveStart: function() {
        switch (this.type) {
            case "random":
                this.moveRandom();
                break;
            case "approach":
                this.approachPlayer();
                break
        }
    },
    moveTilePath: function(a) {
        var b = this,
            c = 0;
        d();

        function d() {
            var e = a[c];
            if (!e) {
                return
            }
            b.moveOneTile(e, function() {
                if (b.frequence != 0) {
                    global.game_map._scene.stopEvent(b.id)
                }
                c++;
                setTimeout(d, b.frequence * 60)
            })
        }
    },
    moveOneTile: function(c, h, d) {
        var a = global.game_map.tile_w / this.speed,
            e = 0,
            k = this,
            b = this.frequence;

        function g(l) {
            clearInterval(k._timeMove);
            k._timeMove = null
        }
        if (this._timeMove) {
            g()
        }
        this.callbackMove = h;
        this._timeMove = setInterval(function f() {
            if (k.id != 0 && !global.game_map.getEvent(k.id)) {
                return
            }
            k.moveDir(c, false, false, d);
            e++;
            if (e >= a) {
                g();
                if (k.callbackMove) {
                    k.callbackMove.call(k)
                }
            }
        }, 1000 / 60)
    },
    killIntervalMove: function() {
        clearInterval(this._timeMove);
        clearTimeout(this._tick)
    },
    moveDir: function(d, f, b, e) {
        e = e || {};
        var l;
        var c = this.speed,
            k = 0,
            h = 0,
            g;
        if (!e.direction) {
            this.direction = d
        }
        if (d == "lower_left" || d == "upper_left" || d == "left") {
            k = -c
        }
        if (d == "lower_right" || d == "upper_right" || d == "right") {
            k = +c
        }
        if (d == "upper_left" || d == "upper_right" || d == "up") {
            h = -c
        }
        if (d == "lower_right" || d == "lower_left" || d == "bottom") {
            h = +c
        }
        if (/^lower/.test(d) || /^upper/.test(d)) {
            b = 2;
            d = /.+_(.+)/.exec(d)[1]
        }
        var a = global.game_map.passable(this, this.x, this.y, k + this.x, h + this.y, d);
        if (a.passable || this.alwaysOnTop) {
            l = true
        } else {
            l = false
        }
        g = this.position(a.x, a.y, true);
        global.game_map.callScene("moveEvent", [this.id, g, d, b, e]);
        if (f) {
            return {
                pos: g,
                passable: l
            }
        }
        return g
    },
    detectionEvents: function(c, a) {
        var b = global.game_map.events;
        var d = [];
        for (var e in b) {
            ev = b[e];
            if (ev.x <= this.x + c && ev.x >= this.x - c && ev.y <= this.y + c && ev.y >= this.y - c && ev.id != this.id) {
                global.game_selfswitches.set(ev.map_id, ev.id, a, true);
                d.push(ev)
            }
        }
        Game.Plugin.call("Game", "eventDetected", [d, this]);
        return d
    },
    jumpa: function(a, h, e, g) {
        var b, d, c, f;
        if (a != 0 || h != 0) {
            if (Math.abs(a) > Math.abs(h)) {
                a < 0 ? b = "left" : b = "right"
            } else {
                h < 0 ? b = "up" : b = "down"
            }
        }
        d = this.x + a;
        c = this.y + h;
        if ((a == 0 && h == 0) || global.game_map.passable(this, this.x, this.y, d, c, b)) {
            this.position(d, c);
            console.log(d, c);
            this.removeTypeMove("approach");
            this.removeTypeMove("random");
            global.game_map.callScene("jumpEvent", [this.id, a, h, e, g])
        }
    },
    serialize: function() {
        var b = ["id", "x", "y", "nbSequenceX", "nbSequenceY", "speedAnimation", "graphic_pattern", "graphic", "graphic_params", "direction", "direction_fix", "no_animation", "stop_animation", "frequence", "speed", "regX", "regY", "alwaysOnBottom", "alwaysOnTop", "exist", "is_start"];
        var c = {};
        for (var a = 0; a < b.length; a++) {
            c[b[a]] = this[b[a]]
        }
        Game.Plugin.call("Game", "serializeCharacter", [c, this]);
        return c
    },
    makeExpList: function(e, d, a) {
        a = a || this.maxLevel;
        if (e instanceof Array) {
            this.exp = e
        } else {
            this.exp[0] = this.exp[1] = 0;
            var b = 2.4 + d / 100;
            var f;
            for (var c = 2; c <= a; c++) {
                f = e * (Math.pow((c + 3), b)) / (Math.pow(5, b));
                this.exp[c] = this.exp[c - 1] + parseInt(f)
            }
        }
        return this.exp
    },
    addExp: function(a) {
        return this.setExp(this.currentExp + a)
    },
    setExp: function(e) {
        if (this.exp.length == 0) {
            throw "makeExpList() must be called before setExp()";
            return false
        }
        var d;
        var c = this.currentLevel;
        this.currentExp = e;
        for (var b = 0; b < this.exp.length; b++) {
            if (this.exp[b] > e) {
                d = b - 1;
                break
            }
        }
        if (!d) {
            d = this.maxLevel;
            this.currentExp = this.exp[this.exp.length - 1]
        }
        this.currentLevel = d;
        var a = d - c;
        if (a != 0) {
            this._changeSkills()
        }
        return a
    },
    setLevel: function(b) {
        var a = this.currentLevel;
        this.currentLevel = b;
        if (this.exp.length > 0) {
            this.currentExp = this.exp[b]
        }
        this._changeSkills();
        return b - a
    },
    nextExp: function() {
        return this.exp[+this.currentLevel + 1]
    },
    _changeSkills: function() {
        var b;
        for (var a = 0; a <= this.currentLevel; a++) {
            b = this.skillsByLevel[a];
            if (b) {
                this.learnSkill(b)
            }
        }
    },
    setParam: function(a, c, e, f) {
        if (!this.params[a]) {
            this.params[a] = [0]
        }
        if (c instanceof Array) {
            this.params[a] = c
        } else {
            var d;
            if (f == "proportional") {
                d = (e - c) / (this.maxLevel - 1)
            }
            for (var b = 1; b <= this.maxLevel; b++) {
                this.params[a][b] = Math.ceil(c + (b - 1) * d)
            }
            this.params[a].push(e)
        }
        return this.params[a]
    },
    getCurrentParam: function(a) {
        if (!a) {
            return this.params
        }
        if (!this.params[a]) {
            throw "getCurrentParam - parameter " + a + " doesn't exist"
        }
        return this.params[a][this.currentLevel]
    },
    setParamLevel: function(a, c, b) {
        if (!this.params[a]) {
            throw "setParamLevel - parameter " + a + " doesn't exist"
        }
        if (this.params[a][c]) {
            this.params[a][c] = b
        }
    },
    addCurrentParam: function(a, b, d) {
        var c = this.getCurrentParam(a);
        if (this.params[a][d]) {
            this.params[a][this.currentLevel] = c + b
        }
    },
    initParamPoints: function(c, e, b, a, d) {
        this.paramPoints[c] = {
            current: e,
            min: b,
            max: a,
            callbacks: d || {}
        }
    },
    getParamPoint: function(a) {
        if (!this.paramPoints[a]) {
            throw "Call the 'initParamPoints' before"
        }
        return this.paramPoints[a].current
    },
    getAllParamsPoint: function() {
        return this.paramPoints
    },
    setMaxParamPoint: function(a) {
        if (!this.paramPoints[type]) {
            console.log("Call the 'initParamPoints' before");
            return false
        }
        this.paramPoints[type].max = a
    },
    changeParamPoints: function(e, b, c) {
        c = c || "add";
        if (!this.paramPoints[e]) {
            console.log("Call the 'initParamPoints' before");
            return false
        }
        var g = this.paramPoints[e].current,
            a = this.paramPoints[e].max,
            d = this.paramPoints[e].min,
            f = this.paramPoints[e].callbacks;
        if (typeof a === "string") {
            a = this.getCurrentParam(a)
        }
        if (/%$/.test(b)) {
            g = g + (g * parseInt(b) / 100)
        } else {
            if (c == "add") {
                g += +b
            } else {
                if (c == "sub") {
                    g -= +b
                } else {
                    g = +b
                }
            }
        }
        if (g <= d) {
            g = d;
            if (f.onMin) {
                f.onMin.call(this)
            }
        } else {
            if (g >= a) {
                g = a;
                if (f.onMax) {
                    f.onMax.call(this)
                }
            }
        }
        this.paramPoints[e].current = g;
        Game.Plugin.call("Game", "changeParamPoints", [e, b, c, this]);
        return g
    },
    equipItem: function(a, d) {
        var b = this.removeItem(a, d);
        if (!b) {
            return false
        }
        if (!this.itemEquiped[a]) {
            this.itemEquiped[a] = []
        }
        var c = global.data[a][d];
        if (!c) {
            return
        }
        if (c.atk) {
            this.changeParamPoints("atk", c.atk)
        }
        if (c.pdef) {
            this.changeParamPoints("pdef", c.pdef)
        }
        if (c.mdef) {
            this.changeParamPoints("mdef", c.mdef)
        }
        this.itemEquiped[a].push(d);
        c = global.data[a][d];
        this._setState(c.states)
    },
    itemIsEquiped: function(b, a) {
        if (this.itemEquiped[b][a]) {
            return true
        } else {
            return false
        }
    },
    removeItemEquiped: function(b, d) {
        if (!this.itemEquiped[b]) {
            return false
        }
        var c = global.data[b][d],
            a;
        if (!c) {
            return
        }
        if (c.atk) {
            this.changeParamPoints("atk", -c.atk)
        }
        if (c.pdef) {
            this.changeParamPoints("pdef", -c.pdef)
        }
        if (c.mdef) {
            this.changeParamPoints("mdef", -c.mdef)
        }
        a = this.getIndexEquipedById(b, d);
        if (a !== false) {
            this.addItem(b, d);
            this.itemEquiped[b].splice(a, 1)
        }
        return true
    },
    getItemsEquipedByType: function(a) {
        if (!this.itemEquiped[a]) {
            return false
        }
        return this.itemEquiped[a]
    },
    getIndexEquipedById: function(b, c) {
        if (!this.itemEquiped[b]) {
            return false
        }
        for (var a = 0; a < this.itemEquiped[b].length; a++) {
            if (this.itemEquiped[b][a] == c) {
                return a
            }
        }
        return false
    },
    getItemsEquipedByAttr: function(c, a, e) {
        var f;
        if (!this.itemEquiped[c]) {
            return false
        }
        var d = global.data[c];
        if (!d) {
            return false
        }
        for (var b = 0; b < this.itemEquiped[c].length; b++) {
            f = this.itemEquiped[c][b];
            if (d[f] && d[f][a] == e) {
                return f
            }
        }
        return false
    },
    skillsToLearn: function(a) {
        this.skillsByLevel = a
    },
    setSkillToLearn: function(b, a) {
        this.skillsByLevel[b] = a
    },
    setClass: function(b) {
        var a = global.data.classes[b];
        if (a) {
            this.className = a.name;
            this.classId = b;
            if (a.skills) {
                this.skillsToLearn(a.skills)
            }
            if (a.elements) {
                this.setElements(a._elements)
            }
            if (a.states) {
                this.setDefStates(a.states)
            }
            return true
        }
        return false
    },
    setElements: function(b) {
        var c = {};
        if (b instanceof Array) {
            for (var a = 0; a < b.length; a++) {
                c[b[a][0]] = b[a][1]
            }
        } else {
            c = b
        }
        this.elements = c
    },
    getElement: function(a) {
        return this.elements[a]
    },
    setDefStates: function(a) {
        var c = {};
        for (var b = 0; b < a.length; b++) {
            c[a[b][0]] = a[b][1]
        }
        this.defstates = c
    },
    learnSkill: function(d) {
        var a, c;
        if (!(d instanceof Array)) {
            d = [d]
        }
        for (var b = 0; b < d.length; b++) {
            a = this.getSkill(d[b]);
            if (!a) {
                this.skills.push(d[b]);
                c = global.data.skills[d[b]];
                if (c) {
                    this._setState(c.states)
                }
            }
        }
    },
    removeSkill: function(a) {
        delete this.getSkill(a)
    },
    getSkill: function(b) {
        if (!b) {
            return this.skills
        }
        for (var a = 0; a < this.skills.length; a++) {
            if (this.skills[a] == b) {
                return this.skills[a]
            }
        }
        return false
    },
    addState: function(f) {
        var b, a, d = 1;
        if (this.defstates[f]) {
            switch (this.defstates[f]) {
                case -100:
                    d = 1;
                    break;
                case 0:
                    d = 1.2;
                    break;
                case 50:
                    d = 1.5;
                    break;
                case 100:
                    d = 2;
                    break;
                case 150:
                    d = 10;
                    break;
                case 200:
                    d = 20;
                    break
            }
            b = CanvasEngine.random(0, 100);
            a = CanvasEngine.random(0, Math.round(100 / d));
            if (b <= a) {
                return false
            }
        }
        var e = {},
            c;
        e.duringTime = 0;
        this.states[f] = e;
        c = global.data.states[f];
        if (c.on_start) {
            Class.New("Game_CommonEvents", [c.on_start]).exec()
        }
        if (c.on_during) {
            this.states[f].interval = setInterval(function() {
                Class.New("Game_CommonEvents", [c.on_during]).exec()
            }, 3000)
        }
        this.states[f];
        this._setState(c.states);
        return true
    },
    removeState: function(b) {
        if (!this.states[b]) {
            return false
        }
        var a = global.data.states[b];
        if (a.on_release) {
            Class.New("Game_CommonEvents", [a.on_release]).exec()
        }
        if (this.states[b].interval) {
            clearInterval(this.states[b].interval)
        }
        delete this.states[b]
    },
    _setState: function(c) {
        var b;
        for (var a = 0; a < c.length; a++) {
            b = c[a];
            if (+b[1] == -1) {
                this.removeState(b[0])
            } else {
                if (+b[1] == 1) {
                    this.addState(b[0])
                }
            }
        }
    },
    stateInflicted: function(a) {
        return this.states[a]
    },
    addItem: function(b, d, a) {
        if (+d == 0) {
            return false
        }
        if (!a) {
            a = 1
        }
        if (!this.items[b]) {
            this.items[b] = {}
        }
        if (!this.items[b][d]) {
            this.items[b][d] = 0
        }
        this.items[b][d] += a;
        var c = global.data.items[d];
        if (c) {
            this._setState(c.states)
        }
        Game.Plugin.call("Game", "addItem", [b, d, a, this])
    },
    removeItem: function(b, c, a) {
        if (!a) {
            a = 1
        }
        if (!this.items[b]) {
            return false
        }
        if (!this.items[b][c]) {
            return false
        }
        this.items[b][c] -= a;
        if (this.items[b][c] <= 0) {
            delete this.items[b][c]
        }
        return true
    },
    useItem: function(a, c) {
        var b = global.data[a][c];
        if (b && +b.consumable) {
            if (b.hit_rate) {
                this.changeParamPoints("hp", b.recvr_hp_pourcent + "%");
                this.changeParamPoints("hp", b.recvr_hp);
                this.changeParamPoints("sp", b.recvr_sp_pourcent + "%");
                this.changeParamPoints("sp", b.recvr_sp);
                if (b.parameter != "0") {
                    this.addCurrentParam(b.parameter, b.parameter_inc)
                }
                this.removeItem(a, c);
                return true
            }
            return false
        }
    },
    getItem: function(a, b) {
        return this.items[a][b] ? this.items[a][b] : false
    },
    getItems: function(a) {
        if (a) {
            return this.items[a]
        }
        return this.items
    },
}).attr_reader(["x", "y", "real_x", "real_y", "character_name", "direction"]).extend("EntityModel");
if (typeof exports != "undefined") {
    var CE = require("canvasengine").listen(),
        Class = CE.Class
}
var _class = {
    freeze: false,
    gold: 0,
    step: 0,
    time: 0,
    map_id: 0,
    init: function(a) {
        this._initialize(a)
    },
    _initialize: function(b) {
        if (!b && !global.data.system.start) {
            return
        }
        if (!global.data.system.start) {
            global.data.system = b
        }
        if (!global.data.system.start) {
            global.data.system.start = {
                x: 0,
                y: 0,
                id: 1
            }
        }
        if (!global.data.system.actor) {
            global.data.system.actor = 1
        }
        var c = global.data.system;
        var a = global.data.actors[c.actor];
        if (a) {
            this.x = c.start.x;
            this.y = c.start.y;
            this.setProperties({
                graphic: a.graphic,
                "graphic-params": a["graphic-params"]
            });
            global.game_actors.add(c.actor, this)
        }
        this.startTime()
    },
    start: function() {
        this.is_start = this.map_id == global.data.system.start.id;
        this.moveto(this.x, this.y)
    },
    startTime: function() {
        var a = this;
        setInterval(function() {
            a.time++
        }, 1000)
    },
    addGold: function(a) {
        this.gold += +a;
        if (this.gold < 0) {
            this.gold = 0
        }
        Game.Plugin.call("Game", "changeGold", [a, this])
    }
};
if (typeof exports == "undefined") {
    Class.create("Game_Player", _class).extend("Game_Character")
} else {
    CE.Model.create("Game_Player", _class).extend("Game_Character");
    exports.New = function() {
        return CE.Model.New("Game_Player")
    }
}
if (typeof exports != "undefined") {
    var CE = require("canvasengine").listen(),
        Class = CE.Class
}
Class.create("Game_Event", {
    currentPage: -1,
    pages: [],
    auto: null,
    _initialize: function(a, c) {
        this.map_id = a;
        this.pages = c[1] || [];
        for (var b in c[0]) {
            this[b] = c[0][b]
        }
        this.moveto(this.x, this.y);
        this.interpreter = Class.New("Interpreter", [this])
    },
    addPage: function(b, a) {
        b.commands = a;
        this.pages.push(b);
        return this
    },
    display: function() {
        this.refresh();
        global.game_map.displayEvent(this.id)
    },
    refresh: function() {
        this.setPage();
        if (this.currentPage == -1) {
            this.exist = false
        } else {
            this.exist = true;
            var a = this.pages[this.currentPage];
            this.setProperties(a);
            this.interpreter.assignCommands(a.commands)
        }
        return this.serialize()
    },
    update: function() {
        if (!this.interpreter.isRun) {
            if ((this.trigger == "auto" || this.trigger == "parallel_process")) {
                this.execTrigger()
            }
            if (this.trigger == "auto_one_time" && this.auto != this.currentPage) {
                this.auto = this.currentPage;
                this.execTrigger()
            }
        }
    },
    setPage: function() {
        var f = false;
        this.currentPage = -1;
        for (var d = this.pages.length - 1; d >= 0; d--) {
            if (!f) {
                if (!this.pages[d].conditions) {
                    this.currentPage = d;
                    f = true
                } else {
                    var e = true;
                    var g = this.pages[d].conditions;
                    for (var b = 1; b <= 3; b++) {
                        if (g["switch_" + b] !== undefined && g["switch_" + b] != "0") {
                            e &= global.game_switches.get(g["switch_" + b])
                        }
                    }
                    if (g.self_switch !== undefined && g.self_switch != "0") {
                        e &= global.game_selfswitches.get(this.map_id, this.id, g.self_switch)
                    }
                    if (g.variable !== undefined && g.variable != "0") {
                        var c = global.game_variables.get(g.variable);
                        var a = g.variable_value;
                        e &= c >= a
                    }
                    if (e) {
                        this.currentPage = d;
                        f = true
                    }
                }
            }
        }
        return f
    },
    execTrigger: function() {
        if (this.trigger == "action_button") {
            this.directionRelativeToPlayer()
        } else {
            if (this.trigger == "auto") {
                global.game_player.freeze = true
            }
        }
        this.execCommands();
        if (this.interpreter.searchCommand("TRANSFER_PLAYER").length > 0) {
            return false
        }
        return true
    },
    execCommands: function() {
        global.game_player.freeze = true;
        var a = this.interpreter.getCurrentCommand();
        if (CE.inArray(a.name, ["MOVE_ROUTE"]) == -1) {
            this.old_direction = this.direction;
            this.direction = this.directionRelativeToPlayer()
        }
        this.movePause();
        global.game_map.callScene("refreshEvent", [this.id, this.serialize()]);
        this.interpreter.execCommands()
    },
    finishCommands: function() {
        var a = this;
        global.game_player.freeze = false;
        if (this.type != "fixed" && this.old_direction) {
            this.direction = this.old_direction
        }
        this.moveStart();
        Game.Plugin.call("Game", "eventCommandsFinish", [this]);
        global.game_map.callScene("refreshEvent", [this.id, this.serialize()])
    },
    remove: function() {
        global.game_map.removeEvent(this.id)
    },
    detectionPlayer: function(b) {
        var a = global.game_player;
        if (a.x <= this.x + b && a.x >= this.x - b && a.y <= this.y + b && a.y >= this.y - b) {
            return true
        }
        return false
    },
}).attr_reader(["trigger", "list", "starting"]).extend("Game_Character");
if (typeof exports != "undefined") {
    var CE = require("canvasengine").listen(),
        Class = CE.Class
}
var _class = {
    actors: [],
    add: function(a, d) {
        var e = global.data.actors[a],
            b = global.data.classes[e["class"]];
        d.name = e.name;
        d._id = a;
        d.maxLevel = e.level_max;
        e.params = e.params || {};
        if (e.params.exp) {
            d.makeExpList(e.params.exp)
        } else {
            d.makeExpList(25, 30)
        }
        var k = {
            maxhp: [741, 7467],
            maxsp: [534, 5500],
            str: [67, 635],
            dex: [54, 564],
            agi: [58, 582],
            "int": [36, 349]
        };
        var h = ["maxhp", "maxsp", "str", "dex", "agi", "int"];
        for (var f = 0; f < h.length; f++) {
            type = h[f];
            if (e.params[type]) {
                d.setParam(type, e.params[type])
            } else {
                d.setParam(type, k[type][0], k[type][1], "proportional")
            }
        }
        d.setClass(e["class"]);
        d.setLevel(e.level_min);
        var c = d.getCurrentParam("maxhp");
        d.initParamPoints("hp", c, 0, "maxhp");
        var g = d.getCurrentParam("maxsp");
        d.initParamPoints("sp", g, 0, "maxsp");
        d.initParamPoints("atk", 0, 0, 99999);
        d.initParamPoints("pdef", 0, 0, 99999);
        d.initParamPoints("mdef", 0, 0, 99999);
        d.addItem("weapons", e.weapon);
        d.addItem("armors", e.shield);
        d.addItem("armors", e.helmet);
        d.addItem("armors", e.body_armor);
        d.addItem("armors", e.accessory);
        d.equipItem("weapons", e.weapon);
        d.equipItem("armors", e.shield);
        d.equipItem("armors", e.helmet);
        d.equipItem("armors", e.body_armor);
        d.equipItem("armors", e.accessory);
        this.actors.push(d)
    },
    get: function(a) {
        if (a == undefined) {
            return this.actors
        }
        return this.actors[a]
    },
    getById: function(b) {
        for (var a = 0; a < this.actors.length; a++) {
            if (this.actors[a]._id == b) {
                return this.actors[a]
            }
        }
        return false
    }
};
if (typeof exports == "undefined") {
    Class.create("Game_Actors", _class)
} else {
    CE.Model.create("Game_Actors", _class);
    exports.New = function() {
        return CE.Model.New("Game_Actors")
    }
}
Class.create("Game_Save", {
    data: [],
    set: function(a, b) {
        this.data[a] = b
    },
    get: function(a) {
        return this.data[a]
    }
});
Class.create("Sprite", {
    showAnimation: function(c) {
        if (!global.data.animations) {
            return
        }
        var b = global.data.animations[c],
            a = this;
        if (!b) {
            return
        }
        Game.Path.loadMaterial("animations", b.graphic, function(e) {
            b.pattern_w = b.pattern_w || 5;
            b.pattern_h = b.pattern_h || 3;
            var d = e.width / b.pattern_w,
                f = e.height / b.pattern_h;
            var g = Game.Canvas.Animation.New({
                images: "animations_" + b.graphic,
                addIn: a.entity.el,
                animations: {
                    _default: {
                        frequence: +b.frequence,
                        position: {
                            top: a.height / 2,
                            left: a.width / 2
                        },
                        frames: b.frames,
                        size: {
                            width: d,
                            height: f
                        }
                    }
                }
            });
            g.play("_default", "remove")
        })
    }
});
Class.create("Sprite_Plugin", {
    _class_: null,
    callModel: function(b, a) {
        b = "_" + b;
        if (this._class_ && this._class_[b]) {
            return this._class_[b].apply(this._class_, a)
        }
    }
});
Class.create("Spriteset_Map", {
    stage: null,
    scene: null,
    data: null,
    tile_w: 32,
    tile_h: 32,
    width: 0,
    height: 0,
    nb_layer: 3,
    nb_autotiles_max: 64,
    autotiles: [],
    events: {},
    layer: [],
    picture_layer: null,
    map: null,
    pictures: {},
    initialize: function(d, b, c, e) {
        var a = this;
        this.scene = d;
        this.stage = b;
        this.data = c;
        this.params = e;
        this.map = this.scene.createElement();
        this.nb_layer = this.nb_layer * 2 + 1;
        CE.each(this.nb_layer, function(f) {
            a.layer[f] = d.createElement();
            a.map.append(a.layer[f])
        });
        this.picture_layer = this.scene.createElement();
        this.stage.append(this.map, this.picture_layer);
        this.tilemap({})
    },
    tilemap: function(p) {
        Game.Plugin.call("Sprite", "drawMapBegin", [this]);
        var r = this,
            c = [];

        function a(B, A, w) {
            var z, E, D;
            var C = r.tile_h / 2;
            var v = w / C;
            var u = document.createElement("canvas");
            var F = u.getContext("2d"),
                h;
            for (z = 0; z < 4; z++) {
                E = 0, D = 0;
                h = B.getImageData(A[z][0] * 16, A[z][1] * 16, C, C);
                switch (z) {
                    case 1:
                        E = C;
                        break;
                    case 2:
                        E = C;
                        D = C;
                        break;
                    case 3:
                        D = C;
                        break
                }
                F.putImageData(h, E, D)
            }
            c.push(u)
        }

        function e(h, w) {
            var u = 0;
            h = (h - 1) * 2;
            w = (w - 1) * 2;
            var v = [];
            for (u = 0; u < 4; u++) {
                switch (u) {
                    case 1:
                        h++;
                        break;
                    case 2:
                        w++;
                        break;
                    case 3:
                        h--;
                        break
                }
                v.push([h, w])
            }
            return v
        }

        function d(H, y, A, v) {
            var x, w, u;
            switch (H) {
                case 0:
                    a(y, A.center, v);
                    break;
                case 1:
                    var z = [];
                    var F = [];
                    var B;
                    for (x = 1; x <= 4; x++) {
                        for (w = 0; w <= z.length; w++) {
                            F.push((w != 0 ? z[w - 1] : "") + x + ";")
                        }
                        for (w = 0; w < F.length; w++) {
                            z.push(F[w]);
                            B = F[w].split(";");
                            B.pop();
                            var E = [];
                            for (u = 1; u <= 4; u++) {
                                if (CE.inArray(u, B) != -1) {
                                    E.push(A.corner[u - 1])
                                } else {
                                    E.push(A.center[u - 1])
                                }
                            }
                            a(y, E, v)
                        }
                        F = []
                    }
                    break;
                case 2:
                    var h = [A.left, A.top, A.right, A.bottom];
                    var G;
                    var D = [2, 3];
                    var C;
                    for (x = 0; x < 4; x++) {
                        for (w = 0; w < 4; w++) {
                            G = CE.clone(h[x]);
                            if (w == 1 || w == 3) {
                                C = D[0] - 1;
                                G[C] = A.corner[C]
                            }
                            if (w == 2 || w == 3) {
                                C = D[1] - 1;
                                G[C] = A.corner[C]
                            }
                            a(y, G, v)
                        }
                        D[0]++;
                        D[1]++;
                        if (D[0] > 4) {
                            D[0] = 1
                        }
                        if (D[1] > 4) {
                            D[1] = 1
                        }
                    }
                    break;
                case 3:
                    a(y, [A.left[0], A.right[1], A.right[2], A.left[3]], v);
                    a(y, [A.top[0], A.top[1], A.bottom[2], A.bottom[3]], v);
                    break;
                case 4:
                    var h = [A.top_left, A.top_right, A.bottom_right, A.bottom_left];
                    var G;
                    var C = 3;
                    for (x = 0; x < h.length; x++) {
                        for (w = 0; w < 2; w++) {
                            G = CE.clone(h[x]);
                            if (w == 1) {
                                G[C - 1] = A.corner[C - 1]
                            }
                            a(y, G, v)
                        }
                        C++;
                        if (C > 4) {
                            C = 1
                        }
                    }
                    break;
                case 5:
                    var h = [
                        [A.top_left[0], A.top_right[1], A.right[2], A.left[3]],
                        [A.top_left[0], A.top[1], A.bottom[2], A.bottom_left[3]],
                        [A.left[0], A.right[1], A.bottom_right[2], A.bottom_left[3]],
                        [A.top[0], A.top_right[1], A.bottom_right[2], A.bottom[3]]
                    ];
                    for (x = 0; x < h.length; x++) {
                        a(y, h[x], v)
                    }
                    break;
                case 6:
                    a(y, A.full, v);
                    a(y, A.full, v);
                    break
            }
        }
        if (this.params.autotiles) {
            var l = {
                center: e(2, 3),
                full: e(1, 1),
                corner: e(3, 1),
                left: e(1, 3),
                right: e(3, 3),
                top: e(2, 2),
                bottom: e(2, 4),
                top_left: e(1, 2),
                top_right: e(3, 2),
                bottom_left: e(1, 4),
                bottom_right: e(3, 4)
            };
            CE.each(this.params.autotiles, function(v, x) {
                var u = document.createElement("canvas");
                var h = u.getContext("2d");
                var w = Game.Canvas.Materials.images[x];
                u.width = w.width;
                u.height = w.height;
                h.drawImage(w, 0, 0);
                for (j = 0; j < 7; j++) {
                    d(j, h, l, false)
                }
            })
        }
        var n = this.data.data.map,
            o = this.data.autotiles || {},
            f = this.data.propreties || {},
            g = Game.Canvas.Materials.get("tileset"),
            t, m, b;
        this.width = n.length;
        this.height = n[0].length;
        CE.benchmark("draw map");
        CE.each(n, function(u, h) {
            CE.each(n[u], function(v, w) {
                CE.each(n[u][v], function(y, B) {
                    if (n[u][v][y] === undefined || n[u][v][y] == null) {
                        return
                    }
                    var A = r.scene.createElement();
                    if (r.nb_autotiles_max * 48 <= B) {
                        B -= (r.nb_autotiles_max * 48);
                        var x = parseInt(B / (256 / r.tile_h)) * r.tile_h;
                        var z = (B % (256 / r.tile_w)) * r.tile_w;
                        if (r.data.graphics && r.data.graphics.tileset) {
                            t = r.tile_w;
                            if (z + r.tile_w > g.width) {
                                t -= (z + r.tile_w) - g.width
                            }
                            m = r.tile_h;
                            if (x + r.tile_h > g.height) {
                                m -= (x + r.tile_h) - g.height
                            }
                            A.drawImage("tileset", z, x, t, m, 0, 0, t, m)
                        }
                        b = f[B]
                    } else {
                        if (c[B]) {
                            A.drawImage(c[B]);
                            b = o[Math.floor(B / 48)]
                        }
                    }
                    A.x = u * r.tile_w;
                    A.y = v * r.tile_h;
                    if (!b) {
                        b = [0, 0]
                    }
                    if (b.length == 0) {
                        b = [0, 0]
                    }
                    r.layer[((b[0] > 0 ? 1 : 0) * 4)].append(A)
                })
            })
        });
        var q = this.getWidthPixel(),
            k = this.getHeightPixel();
        this.layer[0].pack(q, k);
        this.layer[4].pack(q, k);
        Game.Plugin.call("Sprite", "drawMapEnd", [this]);
        this.characters(this.layer[3])
    },
    characters: function(c) {
        var d, b;
        for (var a = 0; a < this.data.events.length; a++) {
            d = this.data.events[a];
            this.addCharacter(d)
        }
        this.player = Class.New("Sprite_Character", [this.scene, this.data.player, c, global.game_player]);
        this.player.initAnimationActions(this.data.actions);
        this.scrolling = Game.Canvas.Scrolling.New(this.scene, this.tile_w, this.tile_h);
        this.scrolling.setMainElement(this.player.getSprite());
        this.scrolling.addScroll({
            element: this.map,
            speed: global.game_player.speed,
            block: true,
            width: this.getWidthPixel(),
            height: this.getHeightPixel()
        });
        Game.Plugin.call("Sprite", "drawCharactersEnd", [this])
    },
    addCharacter: function(b) {
        var a = Class.New("Sprite_Character", [this.scene, b, this.layer[3], global.game_map.getEvent(b.id)]);
        this.events[b.id] = a;
        Game.Plugin.call("Sprite", "addCharacter", [a, b, this])
    },
    addPicture: function(d, c, b) {
        var a = this;
        c.opacity = c.opacity || 255;
        c.zoom_x = c.zoom_x || 100;
        c.zoom_y = c.zoom_y || 100;
        Game.Path.load("pictures", c.filename, d, function(e) {
            var f = a.scene.createElement();
            f.drawImage("pictures_" + d);
            f.x = c.x;
            f.y = c.y;
            f.width = e.width;
            f.height = e.height;
            if (c.origin == "center") {
                f.setPositionOrigin("middle")
            }
            f.scaleX = c.zoom_x / 100;
            f.scaleY = c.zoom_y / 100;
            f.opacity = c.opacity / 255;
            a.picture_layer.append(f);
            a.pictures[d] = f;
            if (b) {
                b()
            }
        })
    },
    movePicture: function(f, d, e, b) {
        var c = this.pictures[f];
        if (!c) {
            return false
        }
        if (e.origin == "center") {
            c.setPositionOrigin("middle")
        }
        var a = Game.Canvas.Timeline.New(c);
        e.opacity = e.opacity || 255;
        e.zoom_x = e.zoom_x || 100;
        e.zoom_y = e.zoom_y || 100;
        a.to({
            x: e.x,
            y: e.y,
            opacity: e.opacity / 255,
            scaleX: e.zoom_x / 100,
            scaleY: e.zoom_y / 100
        }, d).call(b)
    },
    rotatePicture: function(d, c) {
        var b = this.pictures[d];
        if (!b) {
            return false
        }
        var a = Game.Canvas.Timeline.New(b);
        a.to({
            rotation: 360
        }, c).call(function() {
            b.rotation = 0
        })
    },
    erasePicture: function(b) {
        var a = this.pictures[b];
        if (!a) {
            return false
        }
        a.remove();
        delete this.pictures[b]
    },
    effect: function(b, e, c) {
        var a = this;
        var d = Game.Canvas.Effect.New(this.scene, this.map);
        this.scrolling.freeze = true;

        function f() {
            a.scrolling.freeze = false;
            if (c) {
                c()
            }
        }
        e.push(f);
        d[b].apply(d, e)
    },
    scrollMap: function(c, b) {
        var a = this;
        this.scrolling.freeze = true;
        Game.Canvas.Timeline.New(this.map).to({
            x: -c.x,
            y: -c.y
        }, 120).call(function() {
            a.scrolling.freeze = false;
            if (b) {
                b()
            }
        })
    },
    refreshCharacter: function(c, b) {
        var a = this.getEvent(c);
        if (a) {
            a.refresh(b)
        }
    },
    removeCharacter: function(a) {
        this.getEvent(a).remove();
        delete this.events[a]
    },
    moveEvent: function(f, d, b, a, e) {
        var c = b == "left" || b == "right" ? "x" : "y";
        this.getEvent(f).move(c, d, b, a, e);
        this.layer[3].children().sort(function(h, g) {
            var l = h._z ? h._z : h.y;
            var k = g._z ? g._z : g.y;
            return l - k
        })
    },
    setParameterEvent: function(c, a, b) {
        this.getEvent(c).setParameter(a, b)
    },
    turnEvent: function(b, a) {
        this.getEvent(b).turn(a)
    },
    stopEvent: function(a) {
        this.getEvent(a).stop()
    },
    getEvent: function(a) {
        if (a == 0) {
            return this.player
        }
        return this.events[a]
    },
    scrollingUpdate: function() {
        this.scrolling.update()
    },
    getWidthPixel: function() {
        return this.width * this.tile_w
    },
    getHeightPixel: function() {
        return this.height * this.tile_h
    }
});
Class.create("Sprite_Character", {
    el: null,
    scene: null,
    old_direction: "",
    direction: "bottom",
    initial_dir: null,
    width: 0,
    height: 0,
    _actions: {},
    initialize: function(d, c, b, a) {
        this.scene = d;
        this.entity = Class.New("Entity", [d.getStage(), {}, false]);
        this.entity.setModel(a);
        this.refresh(c);
        this.setPosition(this.x, this.y);
        b.append(this.entity.el)
    },
    remove: function() {
        this.entity.el.remove()
    },
    refresh: function(d) {
        var a = this;
        if (d) {
            for (var b in d) {
                this[b] = d[b]
            }
            this.graphic_params = this.graphic_params || {};
            for (var b in this.graphic_params) {
                this[b] = this.graphic_params[b] != "" ? this.graphic_params[b] : this[b]
            }
            if (!this.is_start) {
                this.direction = d.direction
            }
        }
        if (this.regY) {
            this.regY = +this.regY
        }
        if (this.regX) {
            this.regX = +this.regX
        }
        if (!this.pattern) {
            this.pattern = 0
        }
        if (!this.exist) {
            this.entity.el.removeCmd("drawImage");
            return
        }
        if (!this.initial_dir) {
            this.initial_dir = this.direction
        }
        if (+this.graphic) {
            function c() {
                if (!a.graphic) {
                    return
                }
                var e = Game.Canvas.Materials.get("characters_" + a.graphic);
                a.width = e.width / a.nbSequenceX;
                a.height = e.height / a.nbSequenceY;
                a.setAnimation();
                a.setSpritesheet();
                a.stop();
                if (a.stop_animation) {
                    a.startMove()
                }
            }
            if (this.id != 0) {
                Game.Path.loadMaterial("characters", this.graphic, c)
            } else {
                c()
            }
        } else {
            this.stop();
            this.entity.el.removeCmd("drawImage")
        }
        if (this.opacity != undefined) {
            this.entity.el.opacity = this.opacity / 255
        }
        this.entity.el.regX = this.regX;
        this.entity.el.regY = this.regY
    },
    getSprite: function() {
        return this.entity.el
    },
    setSpritesheet: function() {
        var d = [],
            c;
        for (var b = 0; b < this.nbSequenceY; b++) {
            for (var a = 0; a < this.nbSequenceX; a++) {
                c = "";
                switch (b) {
                    case 0:
                        c = "bottom";
                        break;
                    case 1:
                        c = "left";
                        break;
                    case 2:
                        c = "right";
                        break;
                    case 3:
                        c = "up";
                        break
                }
                c += "_" + a;
                d.push(c)
            }
        }
        this.spritesheet = Game.Canvas.Spritesheet.New("characters_" + this.graphic, {
            grid: [{
                size: [this.nbSequenceX, this.nbSequenceY],
                tile: [this.width, this.height],
                set: d,
                reg: [0 + this.regX, this.height - global.game_map.tile_h + this.regY]
            }]
        })
    },
    setAnimation: function() {
        var c = this.nbSequenceX - 1,
            b = this.nbSequenceY - 1;
        var d = Math.abs(-18 + (this.speed * 4));
        var a = {
            left: 0 - this.regX,
            top: -(this.height - global.game_map.tile_h) - this.regY
        };
        this.animation = Game.Canvas.Animation.New({
            images: "characters_" + this.graphic,
            animations: {
                bottom: {
                    frames: [1, c],
                    size: {
                        width: this.width,
                        height: this.height
                    },
                    position: a,
                    frequence: d
                },
                left: {
                    frames: [c + 1, c * 2 + 1],
                    size: {
                        width: this.width,
                        height: this.height
                    },
                    position: a,
                    frequence: d
                },
                right: {
                    frames: [c * 2 + 2, c * 3 + 2],
                    size: {
                        width: this.width,
                        height: this.height
                    },
                    position: a,
                    frequence: d
                },
                up: {
                    frames: [c * 3 + 3, c * 4 + 3],
                    size: {
                        width: this.width,
                        height: this.height
                    },
                    position: a,
                    frequence: d
                }
            }
        });
        this.animation.add(this.entity.el, true)
    },
    initAnimationActions: function(e) {
        var m, k, g, f, b, n = this,
            c, d, l;

        function h(p) {
            function o() {
                Game.Canvas.Scene.get("Scene_Map").animation(0, e[p]["animation_finish"]);
                n.stop()
            }
            c = e[p];
            if (!c.graphic) {
                return
            }
            if (!c["graphic-params"]) {
                c["graphic-params"] = {}
            }
            if (!c["graphic-params"].nbSequenceX) {
                c["graphic-params"].nbSequenceX = 4
            }
            if (!c["graphic-params"].nbSequenceY) {
                c["graphic-params"].nbSequenceY = 4
            }
            if (!c["graphic-params"].regX) {
                c["graphic-params"].regX = 0
            }
            if (!c["graphic-params"].regY) {
                c["graphic-params"].regY = 0
            }
            d = Game.Canvas.Materials.get("characters_" + c.graphic);
            l = {
                width: d.width / c["graphic-params"].nbSequenceX,
                height: d.height / c["graphic-params"].nbSequenceY,
            };
            m = c["graphic-params"].nbSequenceX - 1;
            k = c["graphic-params"].nbSequenceY - 1;
            g = c.speed;
            f = {
                left: 0 - c["graphic-params"].regX,
                top: -18 - c["graphic-params"].regY
            };
            b = {};
            b[p + "_bottom"] = {
                frames: [0, m],
                size: l,
                position: f,
                frequence: g,
                finish: o
            };
            b[p + "_left"] = {
                frames: [m + 1, m * 2 + 1],
                size: l,
                position: f,
                frequence: g,
                finish: o
            };
            b[p + "_right"] = {
                frames: [m * 2 + 2, m * 3 + 2],
                size: l,
                position: f,
                frequence: g,
                finish: o
            };
            b[p + "_up"] = {
                frames: [m * 3 + 3, m * 4 + 3],
                size: l,
                position: f,
                frequence: g,
                finish: o
            };
            this.action_animation = Game.Canvas.Animation.New({
                images: "characters_" + c.graphic,
                animations: b
            });
            this.action_animation.add(this.entity.el);
            this._actions = e
        }
        for (var a in e) {
            h.call(this, a)
        }
    },
    playAnimationAction: function(b) {
        var a;
        if (this._actions[b]) {
            a = this.getDisplayDirection();
            this.action_animation.play(b + "_" + a, "stop");
            Game.Canvas.Scene.get("Scene_Map").animation(0, this._actions[b]["animation_" + a])
        }
    },
    setParameter: function(a, b) {
        this[a] = b;
        this.refresh()
    },
    setPosition: function(a, b) {
        this.entity.position(a, b)
    },
    jumpCharacter: function(a, h, g, f) {
        this.jumping = true;
        var e = Math.sqrt(a * a + h * h),
            b = this;
        this.stop();
        var c = 1,
            d = function() {
                var k = b.speed * 4;
                if ((a != 0 && Math.abs(a) / k) < c || (h != 0 && Math.abs(h) / k)) {
                    b.getSprite().off("canvas:render", d);
                    b.jumping = false;
                    b.startMove();
                    if (f) {
                        f()
                    }
                } else {
                    if (a != 0) {
                        b.entity.el.x += a < 0 ? -k : k
                    }
                    if (h != 0) {
                        b.entity.el.y += h < 0 ? -k : k
                    }
                }
                c++
            };
        this.getSprite().on("canvas:render", d)
    },
    stop: function() {
        var a = this;
        if (!this.animation) {
            return
        }
        var b = this.getDisplayDirection() + "_" + this.pattern;
        a.animation.stop();
        if (a.spritesheet._set[b]) {
            a.spritesheet.draw(a.entity.el, b)
        }
    },
    startMove: function() {
        if (!this.animation) {
            return
        }
        this.animation.play(this.getDisplayDirection(), "loop")
    },
    move: function(c, e, b, a, d) {
        if (this.jumping) {
            return
        }
        if (!a || a != 2) {
            this.turn(d.direction || b)
        }
        this.entity.el.x = e.x;
        this.entity.el.y = e.y
    },
    turn: function(a) {
        this.direction = a;
        this.changeDirection()
    },
    changeDirection: function() {
        var a = this.getDisplayDirection();
        if (this.spritesheet && (this.direction != this.old_direction || this.animation.isStopped()) && this.graphic) {
            if (this.spritesheet.exist(a + "_0")) {
                this.spritesheet.draw(this.entity.el, a + "_0")
            }
            if (!this.no_animation) {
                this.animation.play(a, "loop")
            }
            this.old_direction = this.direction
        }
    },
    getDisplayDirection: function() {
        return this.direction_fix ? this.initial_dir : this.direction
    }
}).extend("Sprite");