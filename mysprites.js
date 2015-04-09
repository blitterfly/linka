// mysprite1 - non-combat NPC on map1
var mysprite1 = function() {
	this.init();
	this.painter = new $.Linka.TilePainter('bard.png', 32, 32);
	this.lastWalkFrame = 0;
	this.walkDuration = 350;
};
mysprite1.prototype = new $.Linka.Sprite();
mysprite1.prototype.oncollide = function(sprite) {
	if (sprite instanceof $.Linka.Player) {
		this.owner.debug('Player touched me ' + this.x + ',' + this.y);
		this.suspend();
		this.faceSprite(sprite);
		var self = this;
		this.owner.showText({
			text: ['Hello... !','','You\'re in my demo world. Walk around and do stuff!'],
			onclose: function() { self.resume(); }
		});
	}
};
mysprite1.prototype.ondamage = function(sprite, damage) {
	// just ignore attacks
};
mysprite1.prototype.onframe = function() {
	// go somewhere random every 2-5 secs
	this.wander(2000, 5000);
};
mysprite1.prototype.onpaint = function(context) {
	var tileX = 10, tileY = 0;
	switch (this.facing) {
		case $.Linka.Constants.DIR_LEFT:
			tileY = 1;
			break;
		case $.Linka.Constants.DIR_UP:
			tileY = 3;
			break;
		case $.Linka.Constants.DIR_RIGHT:
			tileY = 2;
			break;
	}
	if (this.isMoving) {
		// we're walking
		tileX = this.lastWalkFrame % 10 == 0 ? 11 : 9;
		this.lastWalkFrame++;
		if (this.lastWalkFrame > 100) {
			this.lastWalkFrame = 0;
		}
	}
	this.painter.paint(this, context, tileX, tileY);
};

// mysprite2 - example combat NPC
var mysprite2 = function() {
	this.init();
	this.painter = new $.Linka.TilePainter('creature.png', 32, 36);
	this.lastWalkFrame = 0;
	this.reverseCollide = true;
	this.hp = 3;
	this.walkDuration = 800;
};
mysprite2.prototype = new $.Linka.Sprite();
mysprite2.prototype.oncollide = function(sprite) {
	if (sprite instanceof $.Linka.Player) {
		sprite.ondamage.call(sprite, this, this.owner.getRandomInt(1, 3));
	}
};
mysprite2.prototype.ondamage = function(sprite, damage) {
	if (this.hp > 0) {
		this.owner.debug('Ouch! Player hit me for ' + damage + ' damage');
		this.hp -= damage;
		if (this.hp < 1) {
			this.owner.debug('Player killed me :(');
			var self = this;
			this.animations.push(new Sprite2DeathAnimation(function() {
				// drop money and die
				var money = new mysprite4();
				self.owner.addSprite(money);
				money.updateLocation(self.x, self.y);
				self.detach();
			}));
		} else {
			this.animations.push(new HitAnimation());
		}
	}
};
mysprite2.prototype.onframe = function() {
	// go somewhere random near constantly
	if (this.hp > 0) {
		this.wander(1000);
	}
};
mysprite2.prototype.onpaint = function(context) {
	var tileX = 1, tileY = 2;
	switch (this.facing) {
		case $.Linka.Constants.DIR_LEFT:
			tileY = 3;
			break;
		case $.Linka.Constants.DIR_UP:
			tileY = 0;
			break;
		case $.Linka.Constants.DIR_RIGHT:
			tileY = 1;
			break;
	}
	if (this.isMoving) {
		// we're walking
		tileX = this.lastWalkFrame % 10 > 0 && this.lastWalkFrame % 10 < 5 ? 2 : 0;
		this.lastWalkFrame++;
		if (this.lastWalkFrame > 100) {
			this.lastWalkFrame = 0;
		}
	}
	this.painter.paint(this, context, tileX, tileY);
};

// mysprite3 - non-combat NPC on map3
var mysprite3 = function() {
	this.init();
	this.painter = new $.Linka.TilePainter('bard.png', 32, 32);
	this.lastWalkFrame = 0;
	this.walkDuration = 350;
};
mysprite3.prototype = new $.Linka.Sprite();
mysprite3.prototype.oncollide = function(sprite) {
	if (sprite instanceof $.Linka.Player) {
		this.owner.debug('Player touched me ' + this.x + ',' + this.y);
		this.suspend();
		this.faceSprite(sprite);
		var self = this;
		this.owner.showText({
			text: ['The best place to hide is with the monsters!'],
			onclose: function() { self.resume(); }
		});
	}
};
mysprite3.prototype.ondamage = function(sprite, damage) {
	if (sprite instanceof $.Linka.Player) {
		this.owner.debug('Player attacked me ' + this.x + ',' + this.y);
		var self = this;
		this.animations.push(new HitAnimation(function() {
			self.suspend();
			self.faceSprite(sprite);
			self.owner.showText({
				text: ['Ouch! Why did you stab me?!'],
				onclose: function() { self.resume(); }
			});
		}));
	}
};
mysprite3.prototype.onframe = function() {
	// go somewhere random every 2-5 secs
	this.wander(2000, 5000);
};
mysprite3.prototype.onpaint = function(context) {
	var tileX = 7, tileY = 4;
	switch (this.facing) {
		case $.Linka.Constants.DIR_LEFT:
			tileY = 5;
			break;
		case $.Linka.Constants.DIR_UP:
			tileY = 7;
			break;
		case $.Linka.Constants.DIR_RIGHT:
			tileY = 6;
			break;
	}
	if (this.isMoving) {
		// we're walking
		tileX = this.lastWalkFrame % 10 == 0 ? 6 : 8;
		this.lastWalkFrame++;
		if (this.lastWalkFrame > 100) {
			this.lastWalkFrame = 0;
		}
	}
	this.painter.paint(this, context, tileX, tileY);
};

// mysprite4 - gold coin treasure
var mysprite4 = function() {
	this.init();
	this.painter = new $.Linka.TilePainter('gold-coin.png', 32, 32);
	this.blocking = false;
	this.spinFrame = 0;
	this.tileX = 4;
};
mysprite4.prototype = new $.Linka.Sprite();
mysprite4.prototype.oncollide = function(sprite) {
	if (sprite instanceof $.Linka.Player) {
		sprite.addMoney(1);
		this.detach();
	}
};
mysprite4.prototype.onpaint = function(context) {
	var tileY = 0;
	if (this.spinFrame % 5 == 0) {
		this.tileX++;
	}
	if (this.tileX > 8) {
		this.tileX = 0;
	}
	this.spinFrame++;
	if (this.spinFrame > 100) {
		this.spinFrame = 0;
	}
	this.painter.paint(this, context, this.tileX, tileY);	
};

// used for monsters getting hit
var HitAnimation = function(onanimatecomplete) {
	this.painter = new $.Linka.TilePainter('hit-anim.png', 32, 32);
	this.onanimatecomplete = onanimatecomplete;
};
HitAnimation.prototype = new $.Linka.Animation();
HitAnimation.prototype.animate = function(sprite) {
	if (typeof this.framesleft === 'undefined') {
		this.framesleft = Math.round(500 / sprite.owner.getFrameSlice());
		if (this.framesleft < 1) {
			this.framesleft = 1;
		}
	}
	if (this.framesleft < 1) {
		return true;
	}
	return false;
};
HitAnimation.prototype.paint = function(sprite, context) {
	var tileX = this.framesleft % 3;
	var tileY = 0;
	this.painter.paint(sprite, context, tileX, tileY);
	this.framesleft--;
}

// used when sprite 2 dies
var Sprite2DeathAnimation = function(onanimatecomplete) {
	this.onanimatecomplete = onanimatecomplete;
};
Sprite2DeathAnimation.prototype = new $.Linka.Animation();
Sprite2DeathAnimation.prototype.animate = function(sprite) {
	if (typeof this.framesleft === 'undefined') {
		this.framesleft = Math.round(750 / sprite.owner.getFrameSlice());
		if (this.framesleft < 1) {
			this.framesleft = 1;
		}
	}
	if (this.framesleft < 1) {
		return true;
	}
	if (this.framesleft % 2 == 0) {
		sprite.facing++;
		if (sprite.facing > $.Linka.Constants.DIR_RIGHT) {
			sprite.facing = $.Linka.Constants.DIR_DOWN;
		}
	}
	this.framesleft--;
	return false;	
};
