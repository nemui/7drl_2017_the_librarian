Game.init = function() {		
	
	this.mainCanvas = document.createElement('canvas');	
	this.ctx = this.mainCanvas.getContext('2d');	 
	document.body.appendChild(this.mainCanvas);
	
	this.rotDisplayBackground = document.getElementById('scroll');

	var rotDisplay = new ROT.Display({	
		width: this.ROT_CHAR_WIDTH,
		height: this.ROT_CHAR_HEIGHT,
		forceSquareRatio: true,
		fontFamily: 'Tandy',
		fontSize: '12',
		fg: this.DUNGEON_COLOR,
		bg: '#c8d7e3'
	});
	this.rotDisplay = rotDisplay;		
	document.body.appendChild(rotDisplay.getContainer());
	
	this.resize();
	
	this.systems = [     		
		Game.systems.scheduler,
		Game.systems.userInput,		
		Game.systems.ai,	
		Game.systems.movement,		
		Game.systems.fighting,
		Game.systems.reading,
		Game.systems.fovUpdate,
		Game.systems.fog,	
		Game.systems.chronicler,		
        Game.systems.render,		
    ];
	
	this._generateChamber(0, true, false);
	
	var intro = new Game.Assemblages.Chronicle({
		text: "You are the last of the librarians - \"the most fearsome creatures imaginable\". It is your duty to rid Library of the filthy interlopers. Seek out and read books to move between chambers. Knowledge has its price, though."		
	});
	this.entities[intro.id] = intro;
		
    requestAnimationFrame(this.gameLoop.bind(this));
}

Game._generateChamber = function(chamberIndex, placeEnemies, maze) {
	this.rotDisplay.clear();
	this.entities = {};	
	this.map = {};
	this.interlopers = [];
	this.book = null;
	
	var digger;
	if (chamberIndex < this.CHAMBERS) {	
		if (maze) {
			digger = new ROT.Map.EllerMaze(this.ROT_CHAR_WIDTH, this.DUNGEON_HEIGHT);
		}
		else {
			digger = new ROT.Map.Digger(this.ROT_CHAR_WIDTH, this.DUNGEON_HEIGHT, {
				dugPercentage: 0.95,
				timeLimit: 3000
			});
		}
	}
	else {
		digger = new ROT.Map.Arena(this.ROT_CHAR_WIDTH, this.DUNGEON_HEIGHT);
	}
		
	var freeCells = [];
	
	var self = this;
	
	var minX = this.ROT_CHAR_WIDTH;
	var maxX = -1;
		
	var minY = this.DUNGEON_HEIGHT;
	var maxY = -1;
	
    var digCallback = function(x, y, value) {	
        if (value) {
			return;
		}
		
		minX = minX > x ? x : minX;
		maxX = maxX < x ? x : maxX;
		
		minY = minY > y ? y : minY;
		maxY = maxY < y ? y : maxY;
		
		var key = x+","+y;
		freeCells.push(key);
		self.map[key] = Game.FLOOR;
		
		var entity = new Game.Entity();
		entity.addComponent( new Game.Components.Appearance({symbol:this.FLOOR, color:this.DUNGEON_COLOR}));
		entity.addComponent( new Game.Components.FogAppearance({color:this.FOG_COLOR}));
		entity.addComponent( new Game.Components.Position({x:x, y:y}));
		self.entities[entity.id] = entity;
    }
	
	while (minX > 3 || maxX < this.ROT_CHAR_WIDTH - 4) {	    
		digger.create(digCallback.bind(this));
	}	
	
	this._makeWalls(freeCells);	
	
	this._placePlayer(freeCells);
	if (chamberIndex < this.CHAMBERS) {
		this._placeBook(chamberIndex + 1, freeCells);
		if (placeEnemies) {
			this._placeInterlopers(chamberIndex, freeCells);
		}
	}
	else {
		var bossPosition = this._randomPosition(freeCells);
		var boss = new Game.Assemblages.Actor({
			actorName: "Chief Interloper", x: bossPosition.x, y: bossPosition.y, symbol: "I", color: "#ff0000",
			attackTypes: [
				{ damageDie: new Game.Die(2, 3), attackText: "%attacker hits %defender with a book." },
				{ damageDie: new Game.Die(3, 3), attackText: "%attacker flings a heavy stone at the %defender ." },
				{ damageDie: new Game.Die(4, 1), attackText: "%attacker delivers a litany of reasons why books should be accessible to all." },				
				{ damageDie: new Game.Die(2, 2), attackText: "%attacker throws a severed head of another librarian under %defender 's feet." },
			]
		});
		boss.components.health.value = 20;
		boss.addComponent(new Game.Components.Boss());
		this.entities[boss.id] = boss;		
	}
}

Game._makeWalls = function(freeCells) {
	var self = this;
	freeCells.forEach(function(key){
		
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);				
		
		ROT.DIRS[8].forEach(function(dir) {
			var nx = x + dir[0];
			var ny = y + dir[1];
			var newKey = nx + "," + ny;
			if (!(newKey in self.map)) {
				self.map[newKey] = self.WALL;
								
				var entity = new Game.Assemblages.Wall({
					symbol:self.WALL, 
					color:self.DUNGEON_COLOR,
					inFogColor:self.FOG_COLOR,
					x:nx, 
					y:ny
				});				
				self.entities[entity.id] = entity;
			} 			
		});
	});
}

Game._placePlayer = function(freeCells) {
	var playerPos = this._randomPosition(freeCells);
	
	if (this.player == null) {
		var player = new Game.Assemblages.Actor({
			actorName:"librarian", x:playerPos.x, y:playerPos.y, symbol:"@", color:"#ffff00",
			attackTypes: [
				{ damageDie: new Game.Die(3, 2), attackText: "%attacker strangles %defender with its mighty arms." },				
				{ damageDie: new Game.Die(3, 2), attackText: "%attacker bites off one %defender 's limbs." },
			]
		});	
		player.addComponent(new Game.Components.PlayerControlled());		
		player.components.health.value = 50;
		this.player = player;
	}
	else {
		this.player.components.fov.clear();
		this.player.components.position.x = playerPos.x;
		this.player.components.position.y = playerPos.y;
	}
	this.player.components.actor.timeToAct = true;
	this.entities[this.player.id] = this.player;	
}

Game._placeBook = function(chamberIndex, freeCells) {
	
	var bookPos = this._randomPosition(freeCells);
	
	var book = new Game.Assemblages.Book({
		x:bookPos.x, y:bookPos.y, symbol:"?", color:"#ffffff", chamberIndex: chamberIndex		
	});		
	var index = Math.floor(ROT.RNG.getUniform() * Game.books.length);
	
	var bookParams = Game.books.splice(index, 1)[0];
	
	book.components.book.bookText = bookParams.bookText;
	book.components.book.bookEffect = bookParams.bookEffect;
	book.components.book.affectReader = bookParams.affectReader;	
	
	this.book = book;
	
	this.entities[book.id] = book;	
}

Game._placeInterlopers = function(chamberIndex, freeCells) {	

	var interlopers = (chamberIndex + 1) * 5;
	interlopers += Math.floor(ROT.RNG.getUniform() * interlopers);
	
	interlopers = Math.min(interlopers, freeCells.length);	
	
	for (var i = 0; i < interlopers; i++) {
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];        
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);	
		
		var interloper = new Game.Assemblages.Actor({
			actorName:"interloper", x:x, y:y, symbol:"i", color:"#ff0000",
			attackTypes: [
				{ damageDie: new Game.Die(1, 2), attackText: "%attacker punches %defender in the chest." },
				{ damageDie: new Game.Die(1, 2), attackText: "%attacker rips out a chunk of %defender 's fur." },
				{ damageDie: new Game.Die(1, 2), attackText: "%attacker hits %defender with their flashlight." },
				{ damageDie: new Game.Die(0, 0), attackText: "%attacker screams in horror." },
				{ damageDie: new Game.Die(0, 0), attackText: "%attacker flails their limbs helplessly." },
			]
		});		
		this.interlopers.push(interloper.id);
		this.entities[interloper.id] = interloper;
	}	
}

Game._randomPosition = function(freeCells) {
	var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	var key = freeCells.splice(index, 1)[0];        
	var parts = key.split(",");
	return {x: parseInt(parts[0]), y: parseInt(parts[1])};
}

Game.gameLoop = function gameLoop() {
        
	for (var i = 0, len = Game.systems.length; i < len; i++) {		
		Game.systems[i](Game.entities);
	}	
	
	if (Game._running !== false) {
		requestAnimationFrame(Game.gameLoop);
	}
}    

Game.resize = function() {	
	this.mainCanvas.width = window.innerWidth;
	this.mainCanvas.height = window.innerHeight;
	
	var backgroundX = (this.mainCanvas.width - this.BACKGROUND_WIDTH) / 2;
	var backgroundY = (this.mainCanvas.height - this.BACKGROUND_HEIGHT) / 2;	
	this.ctx.drawImage(this.rotDisplayBackground, backgroundX, backgroundY);
		
	this.rotDisplay.getContainer().style.left = backgroundX + this.ROT_DISPLAY_X + "px";
	this.rotDisplay.getContainer().style.top = backgroundY + this.ROT_DISPLAY_Y + "px";
}

document.addEventListener("DOMContentLoaded", function(event) { 
	Game.init();
	window.addEventListener("resize", Game.resize.bind(Game));
});