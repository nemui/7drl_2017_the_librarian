Game.Components.Appearance = function ComponentAppearance(params) {
    
    params = params || {};
	
	this.symbol = params.symbol || "~";

    this.color = params.color;
    if(!this.color){        
        this.color = "#ffffff";
    }
	
	this.hidden = false;

    return this;
};
Game.Components.Appearance.prototype.name = 'appearance';


Game.Components.FogAppearance = function ComponentFogAppearance(params) {        		
    	
	this.color = params.inFogColor;
	this.originalColor = this.color;
	this.inFog = false;

    return this;
};
Game.Components.FogAppearance.prototype.name = 'fogAppearance';


Game.Die = function(times, sides) {

    this.sides = sides;
	this.times = times;
	
	return this;
};
Game.Die.prototype.roll = function() {
	
	var result = 0;
	for (var i = 0; i < this.times; i++) {
		result += Math.floor(ROT.RNG.getUniform() * this.sides) + 1;    
	}
    
	return result;
}

Game.AttackType = function (params) {
	this.damageDie = params.damageDie || new Game.Die(1, 2);
	this.attackText = params.attackText || "%attacker hits %defender.";	
    
	return this;
};

Game.Components.Attack = function ComponentAttack(params) {    
    
	this.attackTypes = params.attackTypes || [new Game.AttackType(params)];	
	this.attacksPerTurn = params.attacksPerTurn || 1;
    
	return this;
};
Game.Components.Attack.prototype.name = 'attack';

Game.Components.Defense = function ComponentAttack(params) {    
    
	this.value = params.defense || 0;		
    
	return this;
};
Game.Components.Defense.prototype.name = 'defense';


Game.Components.Health = function ComponentHealth(params) {    
    
	this.value = params.value || 5;
    
	return this;
};
Game.Components.Health.prototype.name = 'health';


Game.Components.Position = function ComponentPosition(params) {
        
    this.x = params.x || 0;
    this.y = params.y || 0;

    return this;
};
Game.Components.Position.prototype.name = 'position';


Game.Components.Fov = function ComponentFov(params) {
    
	this.size = 6;
	this.clear();

    return this;
};
Game.Components.Fov.prototype.name = 'fov';
Game.Components.Fov.prototype.FOV_SEE = 2;
Game.Components.Fov.prototype.FOV_SEEN = 1;
Game.Components.Fov.prototype.FOV_NOPE = 0;
Game.Components.Fov.prototype.clear = function() {
	
	this.id = this.FOV_NOPE;
	this.map = {};	
	this.needsUpdate = true;
}
Game.Components.Fov.prototype.getVisibility = function(key) {
	
	if (this.map.hasOwnProperty(key)) {
		
		if (this.map[key] == this.id) {
			return this.FOV_SEE;
		}
		else {
			return this.FOV_SEEN;
		}
	}
	
	return this.FOV_NOPE;
}


Game.Components.Actor = function ComponentActor(params) {    
	var self = this;
	this.timeToAct = false;
	this.actorName = params.actorName;
	this.changeTimeToAct = function(on) {
		self.timeToAct = on;
		//console.log(self.actorName +": time to act " + on);
	};	
	this.isDead = false;	
    return this;
};
Game.Components.Actor.prototype.name = 'actor';


Game.Components.PlayerControlled = function ComponentPlayerControlled(params) {
    this.pc = true;
    return this;
};
Game.Components.PlayerControlled.prototype.name = 'playerControlled';


Game.Components.Move = function ComponentMove(params) {    
	this.entityId = params.entityId;
	this.x = params.x;
	this.y = params.y;
    return this;
};
Game.Components.Move.prototype.name = 'move';


Game.Components.Collision = function ComponentCollision(params) {
    this.collides = true;
    return this;
};
Game.Components.Collision.prototype.name = 'collision';

Game.Components.Chronicle = function ComponentChronicle(params) {
	if ("plainText" in params) {
		this.plainText = params.plainText;
		this.fancyText = params.fancyText;
	}
	else {
		this.parseChronicle(params);		
	}
    return this;
};
Game.Components.Chronicle.prototype.name = 'chronicle';
Game.Components.Chronicle.prototype.parseChronicle = function(params) {

	this.plainText = "";
	this.fancyText = "";	
	
	var parts = params.text.split(" ");
	
	for (var i = 0; i < parts.length; i++) {
		var part = parts[i];
		
		if (part.startsWith("%")) {
			var key = part.substring(1);
			var value = params[key];
			
			if (i == 0) {
				value = value.charAt(0).toUpperCase() + value.slice(1);
			}
			
			this.plainText += value;
			
			var colorKey = key + "Color";
			if (colorKey in params) {
				this.fancyText += "%c{" + params[colorKey] + "}" + value + "%c{}";
			}
			else {
				this.fancyText += value;
			}
		}
		else {
			this.plainText += part;
			this.fancyText += part;
		}
		
		if (i < parts.length - 1 && parts[i + 1] != "'s" && parts[i + 1] != ".") {
			this.plainText += " ";
			this.fancyText += " ";
		}
	}
	
	var textColor = "textColor";
	if (textColor in params) {		
		this.fancyText = "%c{" + params[textColor] + "}" + this.fancyText + "%c{}";		
	}
}


Game.Components.Book = function ComponentBook(params) {
    this.chamberIndex = params.chamberIndex;	
	this.bookText = params.bookText || "\"Default book text\".";	
	this.bookEffect = params.bookEffect || "Default book effect.";
	this.affectReader = params.affectReader;
    return this;
};
Game.Components.Book.prototype.name = 'book';

Game.Components.Boss = function ComponentBoss(params) {
    this.isBoss = true;
    return this;
};
Game.Components.Boss.prototype.name = 'boss';

Game.Components.Dorian = function ComponentDorian(params) {
    this.chance = params.chance || 0.5;
    return this;
};
Game.Components.Dorian.prototype.name = 'dorian';