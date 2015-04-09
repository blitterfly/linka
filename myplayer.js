// custom player object for demo
var myplayer = function() {
	this.init();
	this.painter = new $.Linka.TilePainter('bard.png', 32, 32);
	this.lastWalkFrame = 0;
	this.hp = 50;
	this.nextattack = null;
	this.money = 0;
};

myplayer.prototype = new $.Linka.Player();
myplayer.prototype.addMoney = function(amount) {
	this.owner.debug('Received $' + amount);
	this.money += amount;	
};
myplayer.prototype.ondamage = function(sprite, damage) {
	this.owner.debug('Ouch! I took ' + damage + ' damage');
	this.hp -= damage;
	if (this.hp < 1) {
		this.owner.debug('Uh oh I\'m dead');
		this.owner.restart();
	} else {
		this.animations.push(new DamageAnimation(7, 7, 7, 255, 0, 0));
	}
};

myplayer.prototype.onframe = function(frameCount) {
	if (this.nextattack) {
		var pt = this.getPositionForMovement(this.nextattack);
		var attacked = this.owner.findSpriteAt(pt.x, pt.y);
		if (attacked && attacked != this) {
			attacked.ondamage.call(attacked, this, this.owner.getRandomInt(1, 3));
		}
		this.animations.push(new SwordAnimation());
		this.nextattack = null;
	}	
};

myplayer.prototype.onkeypress = function(keycode) {
	switch(keycode) {
		case 37: // left
			window.keyp = '[LEFT]';
			this.requestMove($.Linka.Constants.DIR_LEFT);
			break;
		case 38: // up
			window.keyp = '[UP]';
			this.requestMove($.Linka.Constants.DIR_UP);
			break;
		case 39: // right
			window.keyp = '[RIGHT]';
			this.requestMove($.Linka.Constants.DIR_RIGHT);
			break;
		case 40: // down
			window.keyp = '[DOWN]';
			this.requestMove($.Linka.Constants.DIR_DOWN);
			break;
		case 32: // space
			window.keyp = '[SPACE]';
			this.requestAttack(this.facing);
			break;
		default:
			window.keyp = '';
			break;
	}
	this.owner.hideText();
};

myplayer.prototype.onpaint = function(context) {
	var tileX = 1, tileY = 0;
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
		tileX = this.lastWalkFrame == 0 ? 2 : 0;
		this.lastWalkFrame = tileX;
	}
	this.painter.paint(this, context, tileX, tileY);
};

myplayer.prototype.requestAttack = function(direction) {
	switch (direction) {
		case $.Linka.Constants.DIR_DOWN:
		case $.Linka.Constants.DIR_UP:
		case $.Linka.Constants.DIR_LEFT:
		case $.Linka.Constants.DIR_RIGHT:
			this.nextattack = direction;
			break;
	}	
};

// custom hit animation
var DamageAnimation = function(r1, g1, b1, r2, g2, b2) {
	this.r1 = r1;
	this.r2 = r2;
	this.g1 = g1;
	this.g2 = g2;
	this.b1 = b1;
	this.b2 = b2;
};
DamageAnimation.prototype = new $.Linka.Animation();
DamageAnimation.prototype.animate = function(sprite) {
	if (typeof this.framesleft === 'undefined') {
		this.framesleft = Math.round(500 / sprite.owner.getFrameSlice());
		if (this.framesleft < 1) {
			this.framesleft = 1;
		}
	}
	return this.framesleft < 1;
};
DamageAnimation.prototype.paint = function(sprite, context) {
	if (this.framesleft % 4 == 0) {
		color_transposer(sprite.owner.getContext(), sprite.x, sprite.y, sprite.width, sprite.height, this.r1, this.g1, this.b1, this.r2, this.g2, this.b2);
	}
	this.framesleft--;
}

function color_transposer(context, x, y, width, height, r1, g1, b1, r2, g2, b2) {
	var imgd = context.getImageData(x, y, width, height);
	for (var i = 0; i < imgd.data.length; i += 4) {
		if (imgd.data[i] == r1 && imgd.data[i + 1] == g1 && imgd.data[i + 2] == b1) {
			imgd.data[i] = r2;
			imgd.data[i + 1] = g2;
			imgd.data[i + 2] = b2;
		}
	};
	context.putImageData(imgd, x, y);
};

// player sword animation
var SwordAnimation = function() {	
};
SwordAnimation.prototype = new $.Linka.Animation();
SwordAnimation.prototype.animate = function(sprite) {
	if (typeof this.framesleft === 'undefined') {
		this.framesleft = Math.round(250 / sprite.owner.getFrameSlice());
		if (this.framesleft < 1) {
			this.framesleft = 1;
		}
		this.frames_step = 2.0 / this.framesleft;
		this.frames_offset = -1.0;
		this.length = 0;
	}
	// parabolic equation to represent extending and retracting the sword by arcing the sword length
	this.length = Math.round((-(this.frames_offset * this.frames_offset) + 1.0) * sprite.width * 0.5);
	this.frames_offset += this.frames_step;
	return this.framesleft < 1;
};
SwordAnimation.prototype.paint = function(sprite, context) {
	context.save();
	context.fillStyle = 'darkgray';
	context.beginPath();
	switch (sprite.facing) {
		case $.Linka.Constants.DIR_DOWN:
			context.translate(sprite.x, sprite.y + sprite.height);
			context.moveTo(Math.round(sprite.width * 0.33), 0);
			context.lineTo(Math.round(sprite.width * 0.33), this.length);
			context.lineTo(Math.round(sprite.width * 0.5), this.length + 5);
			context.lineTo(Math.round(sprite.width * 0.66), this.length);
			context.lineTo(Math.round(sprite.width * 0.66), 0);
			break;
		case $.Linka.Constants.DIR_UP:
			context.translate(sprite.x, sprite.y);
			context.moveTo(Math.round(sprite.width * 0.33), 0);
			context.lineTo(Math.round(sprite.width * 0.33), -this.length);
			context.lineTo(Math.round(sprite.width * 0.5), -this.length - 5);
			context.lineTo(Math.round(sprite.width * 0.66), -this.length);
			context.lineTo(Math.round(sprite.width * 0.66), 0);
			break;
		case $.Linka.Constants.DIR_LEFT:
			context.translate(sprite.x + 8, sprite.y);
			context.moveTo(0, Math.round(sprite.height * 0.33));
			context.lineTo(-this.length, Math.round(sprite.height * 0.33));
			context.lineTo(-this.length - 5, Math.round(sprite.height * 0.5));
			context.lineTo(-this.length, Math.round(sprite.height * 0.66));
			context.lineTo(0, Math.round(sprite.height * 0.66));
			break;
		case $.Linka.Constants.DIR_RIGHT:
			context.translate(sprite.x + sprite.width - 8, sprite.y);
			context.moveTo(0, Math.round(sprite.height * 0.33));
			context.lineTo(this.length, Math.round(sprite.height * 0.33));
			context.lineTo(this.length + 5, Math.round(sprite.height * 0.5));
			context.lineTo(this.length, Math.round(sprite.height * 0.66));
			context.lineTo(0, Math.round(sprite.height * 0.66));
			break;		
	}
	context.fill();
	context.restore();
	this.framesleft--;
};
