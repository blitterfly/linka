/*
 * Linka game engine
 * Simple 2D game engine for generic adventure game
 * by Havi Sullivan - public domain, do what you will with this code
 * http://havisullivan.com
 */
(function(window, $) {
	if (typeof $.Linka !== 'undefined') {
		return;
	}
	
	// PRIVATE FUNCTIONS
	
	// default functions for animating sprites
	function animate_default_sprite() {
		if (this.animations && this.animations.length && this.owner) {
			// run all animations
			for (var i = 0; i < this.animations.length; i++) {
				var anim = this.animations[i];
				if (typeof anim.running === 'undefined') {
					anim.running = true;
					if (anim.onanimatebegin && $.isFunction(anim.onanimatebegin)) {
						anim.onanimatebegin.call(anim, this);
					}
				}
				if (anim.running && anim.animate(this)) {
					anim.running = false;
					if (anim.onanimatecomplete && $.isFunction(anim.onanimatecomplete)) {
						anim.onanimatecomplete.call(anim, this);
					}
				}
			}
			// remove dead animations
			while (true) {
				var r_index = -1;
				for (var i = 0; i < this.animations.length; i++) {
					var anim = this.animations[i];
					if (anim.running === false) {
						r_index = i;
						break;
					}
				}
				if (r_index > -1) {
					this.animations.splice(r_index, 1);
				} else {
					break;
				}
			}
		}	
	};
	
	function animatepaint_default_sprite(context) {
		if (this.animations && this.animations.length && this.owner) {
			// paint all animations
			for (var i = 0; i < this.animations.length; i++) {
				var anim = this.animations[i];
				if (anim.running === true) {
					anim.paint(this, context);
				}
			}
		}
	}
	
	// initializes the canvas' 2D API, if possible
	function context_init(canvas) {
		if (canvas) {
			var context = canvas.getContext && canvas.getContext('2d');
			if (context) {
				return context;
			}
		}
		throw new Error('Unable to initialize 2D context');
	};
	
	// processes each frame of the game, executing logic & painting
	function frame_loop() {
		// get cached objects
		frame_loop.cache = frame_loop.cache || [];
		frame_loop.cache[this] = frame_loop.cache[this] || { first: new Date().getTime(), count: 0 };
		var cache = frame_loop.cache[this];
		var start = new Date().getTime();
		
		if (!this.isSuspended()) {
			// call built-in functions
			this.processSprites();
			this.processMovement();
			this.paintBackground();
			this.paintSprites();
			this.paintForeground();
			var textopt = this.getCurrentText();
			if (textopt) {
				paint_text(this, textopt, cache.count);
			}
			this.processInput();
			
			// call user-defined function
			var onframe = this.getOptions().onframe;
			if (onframe && $.isFunction(onframe)) {
				safe_execute(this, $.Linka.Constants.ERROR_RUNTIME, function() { onframe.call(this, cache.count); });
			};

			// process map transitions last since they subvert the frame loop
			this.processMapTransitions();
		}
		
		// calculate timing for next frame
		var finish = new Date().getTime();
		var time_for_this_frame = finish - start;
		var delay_for_next_frame = this.getFrameSlice() - time_for_this_frame;
		if (delay_for_next_frame < 0) {
			delay_for_next_frame = 0;
		}
		//this.debug('Start: ' + start + ' - Finish: ' + finish + ' - Next frame in: ' + delay_for_next_frame);

		// update actual framerate		
		cache.count++;
		var fps = cache.count / ((finish - cache.first) / 1000);
		this.setActualFramerate(fps);
		//this.debug('FPS: ' + fps); 
		
		// if we're still active, jump back into the frame loop
		if (this.isActive()) {
			var self = this;
			window.setTimeout(function() { frame_loop.call(self); }, delay_for_next_frame);
		}
	};
	
	// utility function for generating random integers
	function get_random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	// initializes Linka
	function linka_init() {
		var self = this;
		
		// hook into keypress routines
		$(document).keydown(function(evt) {
			//self.debug('Pressed ' + evt.which);
			self.setLastKeyPressed(evt.which);
		}).keyup(function(evt) {
			self.setLastKeyPressed(null);
		});
		
		// call user-defined function
		var oninit = this.getOptions().oninit;
		if (oninit && $.isFunction(oninit)) {
			safe_execute(this, $.Linka.Constants.ERROR_RUNTIME, function() { oninit.call(self); });
		}
	};
	
	// default routine for painting sprites that don't have a specific graphic (draws a placeholder graphic)
	function paint_default_sprite(context) {
		var x = this.x || 0;
		var y = this.y || 0;
		var width = this.width || SPW;
		var height = this.height || SPH;
		
		context.strokeStyle = 'red';
		context.lineWidth = 3;
		context.beginPath();
		context.arc(x + width / 2, y + height / 2, (width - 6) / 2, 0, Math.PI * 2, false);
		context.moveTo(x + width - 6, y + 6);
		context.lineTo(x + 6, y + height - 6);
		context.stroke();
		context.closePath();
		context.fillStyle = 'black';
		context.font = '6pt Arial';
		var nom = context.measureText('NO');
		context.fillText('NO', x + (width / 2 - nom.width / 2), y + height / 2 - 2);
		var sprm = context.measureText('SPRITE');
		context.fillText('SPRITE', x + (width / 2 - sprm.width / 2), y + height / 2 + 6);
	};
	
	// paints text dialogs on the screen
	function paint_text(linka, options, frameCount) {
		options = options || {};
		var text = options.text && $.isArray(options.text) ? options.text : [options.text];
		var bkg = options.background || 'rgba(0, 0, 0, 0.75)';
		var fg = options.foreground || '#FFFFFF';
		var cw = linka.getCanvasWidth();
		var ch = linka.getCanvasHeight();
		var width = Math.round(cw * 0.8);
		var height = text.length * 14 + 20;
		
		var cxt = linka.getContext();
		cxt.save();
		cxt.translate(Math.round(cw * 0.1), Math.round(ch * 0.1));
		cxt.strokeStyle = fg;
		cxt.lineWidth = 2;
		cxt.strokeRect(-1, -1, width + 2, height + 2);
		cxt.fillStyle = bkg;
		cxt.fillRect(0, 0, width, height);
		cxt.fillStyle = fg;
		cxt.font = 'bold 12px/14px Arial';
		for (var i = 0; i < text.length; i++) {
			cxt.fillText(text[i], 5, 15 + i * 14, width - 10);
		}
		if (frameCount % 50 > 0 && frameCount % 50 < 25) {
			cxt.fillStyle = fg;
			cxt.beginPath();
			cxt.moveTo(width / 2 - 8, height - 15);
			cxt.lineTo(width / 2 + 8, height - 15);
			cxt.lineTo(width / 2, height - 5);
			cxt.lineTo(width / 2 - 8, height - 15);
			cxt.fill();
		}
		
		cxt.restore();
	};
	
	// used when calling user-defined functions to protect the main engine from runtime errors
	function safe_execute(linka, failcode, callback) {
		var prevhandler = window.onerror;
		try {
			window.onerror = function(errorMsg, url, lineNumber) {
				if (linka && linka.getOptions && $.isFunction(linka.getOptions().onerror)) {
					linka.getOptions().onerror.call(linka, failcode, errorMsg)
				} else {
					console.log(errorMsg);
				}				
			};
			if ($.isFunction(callback)) {
				callback.call(linka);
			}
		} catch (e) {
			e.linkaFailCode = failcode;
			if (linka && linka.getOptions && $.isFunction(linka.getOptions().onerror)) {
				linka.getOptions().onerror.call(linka, failcode, e)
			} else {
				console.log(e);
			}
		} finally {
			window.onerror = prevhandler;
		}
	};

	// LINKA OBJECT PROTOTYPE
	$.Linka = function(options, canvas, context) {
		var _options = options;
		var _canvas = canvas;
		var _context = context;
		var _active = false;
		var _lastkeypress = null;
		var _inputEnabled = true;
		var _player = null;
		var _maps = {};
		var _currentMap = null;
		var _suspended = false;
		var _queuedMap = null;
		var _currentSprites = [];
		var _currentText = null;
		
		// normalize framerate
		_options.framerate = _options.framerate || $.Linka.Constants.DEFAULT_FRAMERATE;
		if (_options.framerate < $.Linka.Constants.MIN_FRAMERATE || _options.framerate > $.Linka.Constants.MAX_FRAMERATE) {
			_options.framerate = $.Linka.Constants.DEFAULT_FRAMERATE;
		};
		
		var _fps = options.framerate;
		
		// make sure we have a map height/width
		_options.mapHeight = Math.abs(_options.mapHeight || 8);
		_options.mapWidth = Math.abs(_options.mapWidth || 8);
		
		// map functions
		this.addMap = function(map) {
			if (map && map instanceof $.Linka.Map && typeof _maps[map.getMapID()] === 'undefined') {
				map.owner = this;
				_maps[map.getMapID()] = map;
			}
		};
		
		this.getMapByID = function(mapID) {
			if (typeof _maps[mapID] !== 'undefined') {
				return _maps[mapID];
			}	
		};
		
		this.getCurrentMap = function() {
			return _currentMap;
		};
		
		this.setCurrentMap = function(mapID) {
			if (typeof _maps[mapID] !== 'undefined') {
				_currentMap = _maps[mapID];
				this.clearSprites();
				_currentMap.oninit.call(_currentMap);
			}
		};
		
		this.queueMapTransition = function(mapTransition) {
			if (mapTransition instanceof $.Linka.MapTransition)	{
				_queuedMap = mapTransition;
			}
		};
		
		this.unqueueMapTransition = function() {
			var qmap = _queuedMap;
			_queuedMap = null;
			return qmap;	
		};
		
		// sprite functions
		this.addSprite = function(sprite) {
			if (sprite && sprite instanceof $.Linka.Sprite) {
				sprite.owner = this;
				_currentSprites.push(sprite);
			}
		};
		
		this.clearSprites = function() {
			_currentSprites = [];
		};
		
		this.getSprites = function() {
			return _currentSprites;
		};
		
		this.removeSprite = function(sprite) {
			if (sprite && sprite instanceof $.Linka.Sprite) {
				for (var i = 0; i < _currentSprites.length; i++) {
					if (_currentSprites[i] === sprite) {
						_currentSprites.splice(i, 1);
					}
				}
			}
		};
		
		// getters and setters
		this.disableInput = function() {
			_lastkeypress = null;
			_inputEnabled = false;
		};
		
		this.enableInput = function() {
			//_lastkeypress = null;
			_inputEnabled = true;
		};
		
		this.getActualFramerate = function() {
			if (_active) {
				return _fps;
			}	
			return 0;
		};
		
		this.getCanvas = function() {
			return _canvas;	
		};
		
		this.getContext = function() {
			return _context;
		};
		
		this.getCurrentText = function() {
			return _currentText;
		};
		
		this.getLastKeyPressed = function() {
			return _lastkeypress;
		};
		
		this.getOptions = function() {
			return _options;
		};
		
		this.getPlayerObject = function() {
			return _player;
		}
		
		this.isActive = function() {
			return _active;
		};
		
		this.isInputEnabled = function() {
			return _inputEnabled;
		};
		
		this.setActive = function(value) {
			_active = !!value;
		};
		
		this.setActualFramerate = function(value) {
			if ($.isNumeric(value)) {
				_fps = value;
			}
		};
		
		this.setCurrentText = function(value) {
			if (typeof value === 'string') {
				_currentText = { text: value };
			} else if (typeof value === 'object' && value !== null) {
				_currentText = value;
			} else {
				if (_currentText && _currentText.onclose && $.isFunction(_currentText.onclose)) {
					safe_execute(this, $.Linka.Constants.ERROR_RUNTIME, function() { _currentText.onclose.call(this); });
				}
				_currentText = null;
			}
		};
				
		this.setLastKeyPressed = function(value) {
			_lastkeypress = value;
		};
		
		this.setPlayerObject = function(value) {
			if (value && value instanceof $.Linka.Player) {
				_player = value;
				_player.owner = this;
			}	
		};
		
		this.isSuspended = function() {
			return _suspended;
		};
		
		this.suspend = function() {
			_suspended = true;
		};
		
		this.resume = function() {
			_suspended = false;
		};

		// init
		linka_init.call(this);
	};
	var _fn = $.Linka.prototype;
	
	// CONSTANTS
	$.Linka.Constants = {
		DEFAULT_FRAMERATE: 30,
		DIR_DOWN: 1,
		DIR_UP: 2,
		DIR_LEFT: 3,
		DIR_RIGHT: 4,
		ERROR_RUNTIME: 0x1000,
		ERROR_2D_INIT_FAIL: 0x1001,
		ERROR_SPRITE_RUNTIME: 0x1002,
		ERROR_SPRITE_INPUT: 0x1003,
		ERROR_SPRITE_PAINT: 0x1004,
		ERROR_MAP_PAINT: 0x1005,
		MAX_FRAMERATE: 60,
		MIN_FRAMERATE: 10,
		SPRITE_H: 32,
		SPRITE_W: 32
	};
	// shortcuts since I use these a lot
	var SPH = $.Linka.Constants.SPRITE_H;
	var SPW = $.Linka.Constants.SPRITE_W;
	
	// ANIMATION OBJECT
	$.Linka.Animation = function(onanimatebegin, onanimatecomplete) {
		this.onanimatebegin = onanimatebegin;
		this.onanimatecomplete = onanimatecomplete;
	};
	$.Linka.Animation.prototype.animate = function(sprite) {
		// null animation, always complete
		return true;
	};
	$.Linka.Animation.prototype.paint = function(sprite, context) {	
	};
	
	$.Linka.TransformAnimation = function(fromX, fromY, toX, toY, duration, onanimatebegin, onanimatecomplete) {
		this.fromX = fromX || 0;
		this.fromY = fromY || 0;
		this.toX = toX || 0;
		this.toY = toY || 0;
		this.duration = duration || 100;
		this.onanimatebegin = onanimatebegin;
		this.onanimatecomplete = onanimatecomplete;
	};
	$.Linka.TransformAnimation.prototype = new $.Linka.Animation();
	$.Linka.TransformAnimation.prototype.animate = function(sprite) {
		// simple step transformation between two sets of coordinates
		if (typeof this.framesleft === 'undefined') {
			this.framesleft = Math.round(this.duration / sprite.owner.getFrameSlice());
			if (this.framesleft < 1) {
				this.framesleft = 1;
			}
			var x_dist = this.toX - this.fromX;
			var y_dist = this.toY - this.fromY;
			this.x_step = Math.round(x_dist / this.framesleft);
			this.y_step = Math.round(y_dist / this.framesleft);
		}
		if ((this.x_step > 0 && sprite.x < this.toX) ||
			(this.x_step < 0 && sprite.x > this.toX)) {
			sprite.x += this.x_step;
		}
		if ((this.y_step > 0 && sprite.y < this.toY) ||
			(this.y_step < 0 && sprite.y > this.toY)) {
			sprite.y += this.y_step;
		}
		return --this.framesleft < 1;
	};
	
	// TILE PAINTER OBJECT
	$.Linka.TilePainter = function(src, tileWidth, tileHeight) {
		var _src = src;
		var _tileWidth = tileWidth || SPW;
		var _tileHeight = tileHeight || SPH;
		var _isLoaded = false;
		var _image = null;
		
		this.getSource = function() {
			return _image;	
		};
		
		this.getSourceUrl = function() {
			return _src;
		};

		this.getTileHeight = function() {
			return _tileHeight;	
		};
			
		this.getTileWidth = function() {
			return _tileWidth;
		};
		
		this.isLoaded = function() {
			return _isLoaded;	
		};
		
		// load remote image
		$.Linka.TilePainter._cache = $.Linka.TilePainter._cache || {};
		var cache = $.Linka.TilePainter._cache;
		if (typeof cache[_src] !== 'undefined') {
			_image = cache[_src];
			_isLoaded = true;
		} else {
			_image = new Image();
			$(_image).load(function() { _isLoaded = true; });
			_image.src = _src;
			cache[_src] = _image;
		}
	};
	var _tpfn = $.Linka.TilePainter.prototype;
	_tpfn.paint = function(sprite, context, tileX, tileY) {
		if (sprite && context) {
			if (this.isLoaded()) {
				var sw = this.getTileWidth();
				var sh = this.getTileHeight();
				var sx = tileX * sw;
				var sy = tileY * sh;
				context.drawImage(this.getSource(), sx, sy, sw, sh, sprite.x, sprite.y, SPW, SPH);
			} else {
				paint_default_sprite.call(sprite, context);
			}
		}
	}

	// SPRITE OBJECT
	$.Linka.Sprite = function() {
		this.init();
	};
	
	var _sfn = $.Linka.Sprite.prototype;
	_sfn.animateTo = function(newX, newY) {
		var self = this;
		this.animations.push(new $.Linka.TransformAnimation(this.x, this.y, newX, newY, this.walkDuration,
			function() {
				self.isMoving = true;
				// here we include some logic to increase the size of the hit box momentarily to include both locations while moving
				var curH = self.height;
				var curW = self.width;
				var curX = self.x;
				var curY = self.y;
				if (self.x < newX) {
					curW *= 2;
				} else if (self.x > newX) {
					curW *= 2;
					curX = newX;
				}
				if (self.y < newY) {
					curH *= 2;
				} else if (self.y > newY) {
					curH *= 2;
					curY = newY;
				}
				self.updateHitBox(curX, curY, curW, curH);
			},
			function() {
				self.isMoving = false;
				self.updateLocation(newX, newY);
			}));
	};
	_sfn.detach = function() {
		this.owner.removeSprite(this);	
	};
	_sfn.faceSprite = function(sprite) {
		if (sprite) {
			var direction = this.facing;
			if (this.x > sprite.x) {
				direction = $.Linka.Constants.DIR_LEFT;
			} else if (this.x < sprite.x) {
				direction = $.Linka.Constants.DIR_RIGHT;
			} else if (this.y > sprite.y) {
				direction = $.Linka.Constants.DIR_UP;
			} else if (this.y < sprite.y) {
				direction = $.Linka.Constants.DIR_DOWN;
			}
			this.facing = direction;
		}	
	};
	_sfn.getPositionForMovement = function(direction) {
		var x = this.x || 0;
		var y = this.y || 0;
		switch (direction) {
			case $.Linka.Constants.DIR_DOWN:
				y += SPH;
				break;
			case $.Linka.Constants.DIR_UP:
				y -= SPH;
				break;
			case $.Linka.Constants.DIR_LEFT:
				x -= SPW;
				break;
			case $.Linka.Constants.DIR_RIGHT:
				x += SPW;
				break;
		}
		return { x: x, y: y };
	};
	_sfn.init = function() {
		this.animations = [];
		this.facing = $.Linka.Constants.DIR_DOWN;
		this.blocking = true;
		this.nextmove = null;
		this.x = 0;
		this.y = 0;
		this.width = SPW;
		this.height = SPH;
		this.suspended = false;
		this.reverseCollide = false;
		this.isMoving = false;
		this.walkDuration = 80;
		this.updateHitBox(0, 0, SPW, SPH);
	};
	_sfn.isInHitBox = function(x, y) {
		var tx = this.hitBox.x;
		var ty = this.hitBox.y;	
		var tw = this.hitBox.width;
		var th = this.hitBox.height;
		if (x >= tx && x < (tx + tw) &&
			y >= ty && y < (ty + th)) {
			return true;	
		}
		return false;
	};
	_sfn.isSuspended = function() { 
		return this.suspended === true;
	};
	_sfn.onanimate = function() {
		animate_default_sprite.call(this);	
	};
	_sfn.onanimatepaint = function(context) {
		animatepaint_default_sprite.call(this, context);
	};
	_sfn.oncollide = function(sprite) {
	};
	_sfn.onframe = function() {	
	};
	_sfn.onpaint = function(context) {
		paint_default_sprite.call(this, context);
	};
	_sfn.requestMove = function(direction) {
		switch (direction) {
			case $.Linka.Constants.DIR_DOWN:
			case $.Linka.Constants.DIR_UP:
			case $.Linka.Constants.DIR_LEFT:
			case $.Linka.Constants.DIR_RIGHT:
				this.nextmove = direction;
				break;
		}
	};
	_sfn.resume = function() {
		this.suspended = false;
	};
	_sfn.suspend = function() {
		this.suspended = true;
	};
	_sfn.updateHitBox = function(x, y, width, height) {
		this.hitBox = { x: x, y: y, width: width, height: height };
	};
	_sfn.updateLocation = function(x, y) {
		this.x = x;
		this.y = y;
		this.updateHitBox(x, y, this.width, this.height);	
	};
	_sfn.wander = function(delayMin, delayMax) {
		// this is a shorthand function to tell a sprite to wander in random directions based on a random or specific delay... call from onframe
		delayMin = delayMin || (this.owner.getFrameSlice() * this.owner.getActualFramerate());
		if (!!this.nextWander === false) {
			this.nextWander = new Date().getTime() + this.owner.getRandomInt(delayMin, delayMax || delayMin);
		}
		if (!!this.isMoving === false) {
			var wanderDelay = this.nextWander - new Date().getTime();
			if (wanderDelay < 1) {
				var direction = this.owner.getRandomDirection();
				this.requestMove(direction);
				this.nextWander = new Date().getTime() + this.owner.getRandomInt(delayMin, delayMax || delayMin);
			}
		}
	};
	
	// PLAYER OBJECT
	$.Linka.Player = function() {
		this.init();
	};
	$.Linka.Player.prototype = new $.Linka.Sprite();
	
	var _pfn = $.Linka.Player.prototype;
	_pfn.animateTo = function(newX, newY) {
		var self = this;
		this.animations.push(new $.Linka.TransformAnimation(this.x, this.y, newX, newY, 80,
			function() {
				self.isMoving = true;
				self.owner.disableInput();
				// here we include some logic to increase the size of the hit box momentarily to include both locations while moving
				var curH = self.height;
				var curW = self.width;
				var curX = self.x;
				var curY = self.y;
				if (self.x < newX) {
					curW *= 2;
				} else if (self.x > newX) {
					curW *= 2;
					curX = newX;
				}
				if (self.y < newY) {
					curH *= 2;
				} else if (self.y > newY) {
					curH *= 2;
					curY = newY;
				}
				self.updateHitBox(curX, curY, curW, curH);
			},
			function() {
				self.isMoving = false;
				self.owner.enableInput();
				self.updateLocation(newX, newY);
			}));
	};
	_pfn.detach = function() {	
	};
	_pfn.oncollide = function(sprite) {	
		if (sprite.reverseCollide) {
			// enables reverse-collision notification, typically for "hostile" sprites
			sprite.oncollide.call(sprite, this);
		}
	};
	_pfn.onkeypress = function(keycode) {
	};
	
	// TILESET OBJECT
	$.Linka.Tileset = function() {	
	};
	$.Linka.Tileset.prototype.drawTileAt = function(context, x, y, tileId, isForeground) { };
	
	$.Linka.DrawTileset = function(drawFunction) {
		this.drawTileAt = drawFunction;
	};
	$.Linka.DrawTileset.prototype = new $.Linka.Tileset();
	
	$.Linka.ImageTileset = function(src, bgMapping, fgMapping) {
		var _src = src;
		var _bgMapping = bgMapping;
		var _fgMapping = fgMapping;
		var _image = null;
		var _isLoaded = false;

		this.getBackgroundMapping = function() {
			return _bgMapping;
		};
		
		this.getForegroundMapping = function() {
			return _fgMapping;
		};
		
		this.getSource = function() {
			return _image;	
		};
		
		this.getSourceUrl = function() {
			return _src;
		};
		
		this.isLoaded = function() {
			return _isLoaded;	
		};
		
		// load remote image
		$.Linka.ImageTileset._cache = $.Linka.ImageTileset._cache || {};
		var cache = $.Linka.ImageTileset._cache;
		if (typeof cache[_src] !== 'undefined') {
			_image = cache[_src];
			_isLoaded = true;
		} else {
			_image = new Image();
			$(_image).load(function() { _isLoaded = true; });
			_image.src = _src;
			cache[_src] = _image;
		}
	};
	$.Linka.ImageTileset.prototype = new $.Linka.Tileset();
	$.Linka.ImageTileset.prototype.drawTileAt = function(context, x, y, tileId, isForeground) {
		var mapping = isForeground ? this.getForegroundMapping() : this.getBackgroundMapping();
		if (tileId === 0) {
			// 0 is always transparent, skip through
		} else if (this.isLoaded() && mapping && typeof mapping[tileId] !== 'undefined') {
			var sx = mapping[tileId].x * SPW;
			var sy = mapping[tileId].y * SPH;
			context.drawImage(this.getSource(), sx, sy, SPW, SPH, x, y, SPW, SPH);
		} else {
			context.fillStyle = 'red';
			context.fillRect(x, y, SPW, SPH);
		}
	};
	
	// MAPTRANSITION OBJECT
	$.Linka.MapTransition = function(x, y, mapId, direction) {
		var _x = x;
		var _y = y;
		var _mapId = mapId;
		var _direction = direction;
		
		this.getTransitionDirection = function() {
			return _direction;
		};
		
		this.getTransitionMapID = function() {
			return _mapId;
		};
		
		this.getX = function() {
			return _x;
		};
		
		this.getY = function() {
			return _y;
		};
	};
	$.Linka.MapTransition.prototype.checkTrigger = function(sprite) {
		var tileX = Math.round(sprite.x / SPW);
		var tileY = Math.round(sprite.y / SPH);
		return tileX == this.getX() && tileY == this.getY();
	};
	
	// MAP OBJECT
	$.Linka.Map = function(id, tileset, bkg, walk, fg, initcallback) {
		if (!!id === false || !!tileset === false || !(tileset instanceof $.Linka.Tileset) ||
			!$.isArray(bkg) || !$.isArray(walk) || !$.isArray(fg))
			throw new Error('Incorrect map parameters');
		
		var _mapid = id;
		var _tileset = tileset;
		var _layers = [bkg, walk, fg];
		var _trans = [];
		var _initCallback = initcallback;
		
		this.addTransition = function(trans) {
			if (trans && trans instanceof $.Linka.MapTransition) {
				_trans.push(trans);
			}
		};
		
		this.getMapID = function() {
			return _mapid;	
		};
		
		this.getBackground = function() {
			return _layers[0];
		};
		
		this.getWalkMap = function() {
			return _layers[1];
		};
		
		this.getForeground = function() {
			return _layers[2];
		};
		
		this.getTileset = function() {
			return _tileset;
		};
		
		this.getTransitions = function() {
			return _trans;
		};
		
		this.oninit = function() {
			if (_initCallback && $.isFunction(_initCallback)) {
				var self = this;
				safe_execute(self.owner, $.Linka.Constants.ERROR_RUNTIME, function() { _initCallback.call(self); });
			}
		};
	};
	var _mfn = $.Linka.Map.prototype;
	_mfn.checkTransitions = function(sprite) {
		var trans = this.getTransitions();
		for (var i = 0; i < trans.length; i++) {
			if (trans[i].checkTrigger(sprite)) {
				return trans[i];
			}
		} 
		return null;
	};
	_mfn.drawBackground = function(context, tilesX, tilesY, offsetX, offsetY) {
		var bkg = this.getBackground();
		var set = this.getTileset();
		for (var y = 0; y < tilesY; y++) {
			for (var x = 0; x < tilesX; x++) {
				var tile = bkg[y][x];
				set.drawTileAt(context, x * SPW + offsetX, y * SPH + offsetY, tile, false);
			}
		}
	};
	_mfn.drawForeground = function(context, tilesX, tilesY, offsetX, offsetY) {
		var fg = this.getForeground();
		var set = this.getTileset();
		for (var y = 0; y < tilesY; y++) {
			for (var x = 0; x < tilesX; x++) {
				var tile = fg[y][x];
				set.drawTileAt(context, x * SPW + offsetX, y * SPH + offsetY, tile, true);
			}
		}		
	};
		
	// PUBLIC FUNCTION DECLARATIONS
	_fn.checkForCollision = function(sprite, newX, newY) {
		// kinda backwards... this will return TRUE if the movement can proceed, FALSE otherwise (despite naming)
		var map = this.getCurrentMap();
		
		// basic map boundary check
		if (newX < 0 || newY < 0 ||
			(newX + SPW) > this.getCanvasWidth() ||
			(newY + SPH) > this.getCanvasHeight()) {
			// if we're trying to walk off the map and we're the player, see if we're on a transition
			if (map && sprite === this.getPlayerObject()) {
				var trans = map.checkTransitions(sprite);
				if (trans) {
					this.queueMapTransition(trans);
				}
			}
			return false;
		}
		
		// check walk map
		if (map) {
			var walk = map.getWalkMap();
			var mapX = Math.round(newX / SPW);
			var mapY = Math.round(newY / SPH);
			if (walk[mapY][mapX] === 0) {
				return false;
			}
		};
		
		// check for collision with other sprites
		var sprites = this.getSpritesAndPlayer();
		for (var i = 0; i < sprites.length; i++) {
			var spr = sprites[i];
			if (spr !== sprite) {
				if (spr.isInHitBox(newX, newY)) {
					spr.oncollide(sprite);
					if (!!spr.blocking) {
						return false; // only block movement if sprite is blocking
					}
				}
			}
		}
		
		// free to move!
		return true;
	};
	_fn.debug = function(message) {
		if (this.getOptions().debug) {
			if (message) {
				console.log(message);
			}
			return true;
		}
		return false;
	};
	_fn.findSpriteAt = function(x, y) {
		var sprites = this.getSprites();
		for (var i = 0; i < sprites.length; i++) {
			var spr = sprites[i];
			if (spr.isInHitBox(x, y)) {
				return spr;
			}
		}
		return null;
	};
	_fn.getCanvasHeight = function() {
		return this.getCanvas().height;
	};
	_fn.getCanvasWidth = function() {
		return this.getCanvas().width;
	};
	_fn.getFrameSlice = function() {
		// returns the expected duration of a single frame
		return Math.round(1000 / this.getOptions().framerate);
	};
	_fn.getRandomDirection = function() {
		// return a random direction
		return get_random($.Linka.Constants.DIR_DOWN, $.Linka.Constants.DIR_RIGHT);	
	};
	_fn.getRandomInt = function(min, max) {
		// return a random integer from min..max
		// if just min is specified, it's 0..min
		if (arguments.length > 1) {
			return get_random(min, max);
		} else if (arguments.length == 1) {
			return get_random(0, min);
		} else { 
			return 0;
		}
	};
	_fn.getSpritesAndPlayer = function() {
		var sprites = this.getSprites().slice();
		sprites.push(this.getPlayerObject());
		return sprites;
	}
	_fn.paintBackground = function() {
		// first clear everything
		var cxt = this.getContext();
		cxt.fillStyle = 'white';
		cxt.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
		
		// draw map background
		var map = this.getCurrentMap();
		if (map) {
			var mph = this.getOptions().mapHeight;
			var mpw = this.getOptions().mapWidth;
			safe_execute(this, $.Linka.Constants.ERROR_MAP_PAINT, function() {
				map.drawBackground(cxt, mpw, mph, 0, 0);
			});
		}
	};
	_fn.paintForeground = function() {
		// draw map foreground
		var cxt = this.getContext();
		var map = this.getCurrentMap();
		if (map) {
			var mph = this.getOptions().mapHeight;
			var mpw = this.getOptions().mapWidth;
			safe_execute(this, $.Linka.Constants.ERROR_MAP_PAINT, function() {
				map.drawForeground(cxt, mpw, mph, 0, 0);
			});
		}	
	};
	_fn.paintSprites = function() {
		// tell all spites to paint
		var sprites = this.getSpritesAndPlayer();
		var cxt = this.getContext();
		var drawHitBoxes = this.debug() && this.getOptions().drawHitBoxes;
		for (var i = 0; i < sprites.length; i++) {
			var spr = sprites[i];
			safe_execute(this, $.Linka.Constants.ERROR_SPRITE_PAINT, function() {
				spr.onanimate.call(spr);
				spr.onpaint.call(spr, cxt);
				spr.onanimatepaint.call(spr, cxt);
				
				if (drawHitBoxes) {
					cxt.strokeStyle = '#00FF00';
					cxt.lineWidth = 1;
					cxt.strokeRect(spr.hitBox.x, spr.hitBox.y, spr.hitBox.width, spr.hitBox.height);					
				}
			});
		}
	};
	_fn.processInput = function() {
		// if a key is depressed, send it to the player object
		var keycode = this.getLastKeyPressed();
		var player = this.getPlayerObject();
		if (keycode && this.isInputEnabled() && player) {
			safe_execute(this, $.Linka.Constants.ERROR_SPRITE_INPUT, function() { player.onkeypress.call(player, keycode); });
			this.setLastKeyPressed(null);
		};
	};
	_fn.processMapTransitions = function() {
		var trans = this.unqueueMapTransition();
		if (trans) {
			this.transitionToMap(trans.getTransitionMapID(), trans.getTransitionDirection());
		}
	};
	_fn.processMovement = function() {
		// check to see if sprites want to move
		var sprites = this.getSpritesAndPlayer();
		for (var i = 0; i < sprites.length; i++) {
			var spr = sprites[i];
			if (spr && spr.nextmove) {
				safe_execute(this, $.Linka.Constants.ERROR_SPRITE_RUNTIME, function() {
					var pt = spr.getPositionForMovement(spr.nextmove);
					spr.facing = spr.nextmove;
					if (this.checkForCollision(spr, pt.x, pt.y)) {
						// if we're clear to move, update sprite X/Y with new values
						spr.animateTo(pt.x, pt.y);
					}
				});
				spr.nextmove = null;
			}
		}
	};
	_fn.processSprites = function() {
		// call frame loop functon for each sprite
		var sprites = this.getSpritesAndPlayer();
		for (var i = 0; i < sprites.length; i++) {
			if (!sprites[i].isSuspended()) {
				safe_execute(this, $.Linka.Constants.ERROR_SPRITE_RUNTIME, function() { sprites[i].onframe.call(sprites[i]); });
			}
		}	
	};
	_fn.hideText = function() {
		this.setCurrentText(null);	
	};
	_fn.showText = function(options) {
		this.setCurrentText(options || 'NO TEXT');
	};
	_fn.restart = function() {
		var self = this;
		self.setActive(false);
		window.setTimeout(function() {
			self.start();
		}, this.getFrameSlice() * 3);	
	};
	_fn.start = function() {
		var self = this;
		self.setActive(true);
		var onstart = self.getOptions().onstart;
		if (onstart && $.isFunction(onstart)) {
			safe_execute(self, $.Linka.Constants.ERROR_RUNTIME, function() { onstart.call(self); });
		}
		window.setTimeout(function() { frame_loop.call(self); }, 0);	
	};
	_fn.stop = function() {
		var self = this;
		self.setActive(false);
		var onstop = self.getOptions().onstop;
		if ($.isFunction(onstop)) {
			safe_execute(self, $.Linka.Constants.ERROR_RUNTIME, function() { onstop.call(self); });
		}
	};
	_fn.transitionToMap = function(mapId, direction) {
		var map = this.getMapByID(mapId);
		var omap = this.getCurrentMap();
		var player = this.getPlayerObject();
		if (map && omap) {
			// suspend frame activity
			this.suspend();
			
			// determine off-screen location of new map
			var drawX = 0;
			var drawY = 0;
			var mapW = this.getOptions().mapWidth;
			var mapH = this.getOptions().mapHeight;
			var playerX = player ? player.x / player.width : 0;
			var playerY = player ? player.y / player.height : 0;
			var adj = 1;
			switch (direction) {
				case $.Linka.Constants.DIR_DOWN:
					drawY += player.height * mapH;
					playerY = 0;
					break;
				case $.Linka.Constants.DIR_UP:
					drawY -= player.height * mapH;
					playerY = mapH - 1;
					break;
				case $.Linka.Constants.DIR_LEFT:
					drawX -= player.width * mapW;
					playerX = mapW - 1;
					break;
				case $.Linka.Constants.DIR_RIGHT:
					drawX += player.width * mapW;
					playerX = 0;
					break;
			}
			var newX = -drawX;
			var newY = -drawY;
									
			// go ahead and set this as the new map
			this.setCurrentMap(mapId);
			
			// now translate entire screen to new map
			// (we save beforehand to avoid having to do a reverse translation... drawBackground will overwrite in time)
			var curX = 0;
			var curY = 0;
			var cxt = this.getContext();
			cxt.save();
			
			// some copy+pasta work from TransformAnimation
			var x_step = Math.round(newX / mapW);
			var y_step = Math.round(newY / mapH);
			var x_going = true;
			var y_going = true;

			var self = this;
			window.setTimeout(function translateMap() {
				if (x_going || y_going) {
					safe_execute(this, $.Linka.Constants.ERROR_MAP_PAINT, function() {
						// draw new map off-screen
						map.drawBackground(cxt, mapW, mapH, drawX, drawY);
						map.drawForeground(cxt, mapW, mapH, drawX, drawY);
						// and old map on-screen
						omap.drawBackground(cxt, mapW, mapH, 0, 0);
						omap.drawForeground(cxt, mapW, mapH, 0, 0);
					});
					if (player) {
						safe_execute(this, $.Linka.Constants.ERROR_SPRITE_PAINT, function() {
							// draw player
							player.onpaint.call(player, cxt);
						});
					}
	
					if ((x_step > 0 && curX < newX) ||
						(x_step < 0 && curX > newX)) {
						curX += x_step;
					} else {
						x_going = false;
					}
					if ((y_step > 0 && curY < newY) ||
						(y_step < 0 && curY > newY)) {
						curY += y_step;
					} else {
						y_going = false;
					}
					
					// use translate to shift our origin
					cxt.translate(x_going ? x_step : 0, y_going ? y_step : 0);
					
					// jump back in!
					window.setTimeout(translateMap, 30);
				} else {
					cxt.restore(); // clear translations caused by map transition

					// adjust player position to mirror location on new map
					if (player) {
						player.updateLocation(playerX * player.height, playerY * player.height);
					}

					// resume the game
					self.resume();
				}
			}, 30);
		}		
	};
	
	// JQUERY PLUGIN
	$.fn.linka = function(options) {
		options = options || {};
		
		var canvas = this.get(0);
		var cxt = null;
		safe_execute(this, $.Linka.Constants.ERROR_2D_INIT_FAIL, function() {
			cxt = context_init(canvas);
		});
		if (cxt) {
			var linka_obj = new $.Linka(options, canvas, cxt);
			linka_obj.start();
		}
		return this;
	};
})(this, jQuery);