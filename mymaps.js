// custom maps for demo
function createMaps(linka) {
	// overland tileset definition (drawn)
	var tileset1 = new $.Linka.DrawTileset(function(context, x, y, tileId, isForeground) {
		var width = $.Linka.Constants.SPRITE_W;
		var height = $.Linka.Constants.SPRITE_H;
		switch (tileId) {
			case 1: case 4: // bush (fg)
				context.fillStyle = 'green';
				context.beginPath();
				context.arc(x + width / 2, y + height / 2, (width - 6) / 2, 0, Math.PI * 2, false);
				context.fill();
				break;
			case 2: // water
				context.fillStyle = 'blue';
				context.fillRect(x, y, width, height);
				break;
			case 3: // ground
				context.fillStyle = 'tan';
				context.fillRect(x, y, width, height);
				break;
		}
	});
	
	// overland tileset definition (images)
	var tileset2 = new $.Linka.ImageTileset('map-tiles.png', {
		2: { x: 1, y: 0 }, // water
		3: { x: 0, y: 0 } // ground
	}, {
		1: { x: 2, y: 0 }, // bush 1
		4: { x: 3, y: 0 } // bush 2
	});
	
	// MAP1 (SE corner)
	var map1 = new $.Linka.Map('map1', tileset2,
		[ // bg =grnd, 2 = water
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 0
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 1
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 2
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 3
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 4
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 5
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 6
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 7
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 8
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 9
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 10
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 11
		],
		[ // walk 0 = block, 1 = pass
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 0
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 1
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 2
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 3
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 4
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 5
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 6
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 8
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 9
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 10
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 11
		],
		[ // fg 0 = trans, 1 = bush
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // 0
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // 1
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1], // 2
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 3
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 4
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 5
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1], // 6
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 7
			[4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1], // 8
			[1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 9
			[1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1], // 10
			[1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 4, 1, 1], // 11
		],
		function() {
			// set up sprites
			var spr = new mysprite1();
			spr.updateLocation(9*32, 7*32);
			this.owner.addSprite(spr);
		}
	);
	map1.addTransition(new $.Linka.MapTransition(7, 0, 'map2', $.Linka.Constants.DIR_UP));
	map1.addTransition(new $.Linka.MapTransition(8, 0, 'map2', $.Linka.Constants.DIR_UP));
	map1.addTransition(new $.Linka.MapTransition(0, 6, 'map4', $.Linka.Constants.DIR_LEFT));
	map1.addTransition(new $.Linka.MapTransition(0, 7, 'map4', $.Linka.Constants.DIR_LEFT));

	// MAP2 (NE corner)
	var map2 = new $.Linka.Map('map2', tileset2,
		[ // bg 0=grnd, 2 = water
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 0
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 1
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 2
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 3
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 4
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 5
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 6
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 7
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 8
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 9
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 10
			[2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3]  // 11
		],
		[ // walk 0 = block, 1 = pass
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 2
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 3
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 4
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 5
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 6
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 7
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 8
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 9
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 10
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 11
		],
		[ // fg 0 = trans, 1 = bush
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1], // 0
			[1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1], // 1
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1], // 2
			[1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 3
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 4
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 5
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 6
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1], // 7
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 8
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 9
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 1, 1, 1], // 10
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // 11
		],
		function() {
			// set up sprites
			var spr1 = new mysprite2();
			spr1.updateLocation(9*32, 7*32);
			var spr2 = new mysprite2();
			spr2.updateLocation(5*32, 5*32);
			var spr3 = new mysprite2();
			spr3.updateLocation(11*32, 9*32);
			this.owner.addSprite(spr1);
			this.owner.addSprite(spr2);
			this.owner.addSprite(spr3);
		}
	);
	map2.addTransition(new $.Linka.MapTransition(7, 11, 'map1', $.Linka.Constants.DIR_DOWN));
	map2.addTransition(new $.Linka.MapTransition(8, 11, 'map1', $.Linka.Constants.DIR_DOWN));
	map2.addTransition(new $.Linka.MapTransition(0, 4, 'map3', $.Linka.Constants.DIR_LEFT));
	map2.addTransition(new $.Linka.MapTransition(0, 5, 'map3', $.Linka.Constants.DIR_LEFT));
	
	// MAP3 (NW corner)
	var map3 = new $.Linka.Map('map3', tileset2,
		[ // bg 0=grnd, 2 = water
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 0
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 1
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 2
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 3
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 4
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 5
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 6
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 7
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 8
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 9
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 10
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2]  // 11
		],
		[ // walk 0 = block, 1 = pass
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 2
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 3
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 4
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 5
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 6
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 7
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 8
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 9
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 10
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 11
		],
		[ // fg 0 = trans, 1 = bush
			[1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
			[1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1], // 1
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 2
			[1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1], // 3
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
			[1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 9
			[1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 10
			[1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 11
		],
		function() {
			// set up sprites
			var spr1 = new mysprite3();
			spr1.updateLocation(5*32, 4*32);
			var spr2 = new mysprite2();
			spr2.updateLocation(5*32, 8*32);
			var spr3 = new mysprite2();
			spr3.updateLocation(11*32, 3*32);
			this.owner.addSprite(spr1);
			this.owner.addSprite(spr2);
			this.owner.addSprite(spr3);
		}
	);
	map3.addTransition(new $.Linka.MapTransition(15, 4, 'map2', $.Linka.Constants.DIR_RIGHT));
	map3.addTransition(new $.Linka.MapTransition(15, 5, 'map2', $.Linka.Constants.DIR_RIGHT));
	map3.addTransition(new $.Linka.MapTransition(7, 11, 'map4', $.Linka.Constants.DIR_DOWN));
	map3.addTransition(new $.Linka.MapTransition(8, 11, 'map4', $.Linka.Constants.DIR_DOWN));

	// MAP4 (SW corner)
	var map4 = new $.Linka.Map('map4', tileset2,
		[ // bg 0=grnd, 2 = water
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 0
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 1
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 2
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 3
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 4
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2], // 5
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 6
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 7
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 8
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 9
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 10
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 11
		],
		[ // walk 0 = block, 1 = pass
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 0
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 1
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 2
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 3
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 4
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // 5
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 6
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 7
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 8
			[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 9
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 10
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 11
		],
		[ // fg 0 = trans, 1 = bush
			[1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
			[1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
			[1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
			[1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
			[1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 8
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1], // 9
			[1, 1, 1, 1, 1, 1, 4, 1, 4, 1, 1, 1, 1, 1, 1, 4], // 10
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1], // 11
		],
		function() {
			// set up sprites
			var spr1 = new mysprite2();
			spr1.updateLocation(9*32, 7*32);
			var spr2 = new mysprite2();
			spr2.updateLocation(5*32, 5*32);
			var spr3 = new mysprite2();
			spr3.updateLocation(11*32, 9*32);
			this.owner.addSprite(spr1);
			this.owner.addSprite(spr2);
			this.owner.addSprite(spr3);
		}
	);
	map4.addTransition(new $.Linka.MapTransition(7, 0, 'map3', $.Linka.Constants.DIR_UP));
	map4.addTransition(new $.Linka.MapTransition(8, 0, 'map3', $.Linka.Constants.DIR_UP));
	map4.addTransition(new $.Linka.MapTransition(15, 6, 'map1', $.Linka.Constants.DIR_RIGHT));
	map4.addTransition(new $.Linka.MapTransition(15, 7, 'map1', $.Linka.Constants.DIR_RIGHT));

	// add maps and set initial map selection
	linka.addMap(map1);
	linka.addMap(map2);
	linka.addMap(map3);
	linka.addMap(map4);
};