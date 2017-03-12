Game.wantsToAct = function(entity) {	
	if (entity.components.actor.isDead) {
		return false;
	}

	if (entity.components.playerControlled) {
		return true;
	}
	
	var posX = entity.components.position.x;
	var posY = entity.components.position.y;
	var fov = entity.components.fov;
	var fovSize = fov.size;
	
	if (Game.player == null) {			
		return true;
	}
	
	var playerPosX = Game.player.components.position.x;
	var playerPosY = Game.player.components.position.y;
	
	if (fov.getVisibility(playerPosX + "," + playerPosY) != Game.Components.Fov.prototype.FOV_SEE) {			
		return false;		
	}		
	
	return true;	
}

Game.systems.ai = function systemAi ( entities ) {
    
	var curEnity;	
		
	for (var entityId in entities) {
		curEntity = entities[entityId];		
		
		if (curEntity.components.actor 
			&& !curEntity.components.actor.isDead
			&& !curEntity.components.playerControlled 				
			&& curEntity.components.actor.timeToAct) {				
			
			var posX = curEntity.components.position.x;
			var posY = curEntity.components.position.y;
			var fov = curEntity.components.fov;
			var fovSize = fov.size;
			
			if (Game.player == null) {	
				Game.advanceActor = true;
				return;
			}
			
			var playerPosX = Game.player.components.position.x;
			var playerPosY = Game.player.components.position.y;
			
			if (fov.getVisibility(playerPosX + "," + playerPosY) != Game.Components.Fov.prototype.FOV_SEE) {
				Game.advanceActor = true;
				
				continue;
			}			
			
			var passableCallback = function(x, y) {
				
				
				if (Game.book != null 
					&& Game.book.components.position.x == x
					&& Game.book.components.position.y == y) {
					
					return false;
				}
				
				var key = x + "," + y;
	
				for (var i = 0; i < Game.interlopers.length; i++) {
					var id = Game.interlopers[i];
					if (id != entityId
						&& id in Game.entities 
						&& Game.entities[id].components.position.x == x
						&& Game.entities[id].components.position.y == y) {
						
						return false;			
					}
				}	
				
				return (key in Game.map) && Game.map[key] != Game.WALL;
			}
			
			var astar = new ROT.Path.AStar(playerPosX, playerPosY, passableCallback, {topology:8});
		 
			var path = [];
			var pathCallback = function(x, y) {
				path.push([x, y]);
			}
			astar.compute(posX, posY, pathCallback);
			
			path.shift();
			
			if (path.length == 0) {
				Game.advanceActor = true;
				
				continue;
			}
			
			var moveEventEntity = new Game.Assemblages.Move({
				entityId:curEntity.id, 
				x:path[0][0], 
				y:path[0][1]
			});
			
			Game.entities[moveEventEntity.id] = moveEventEntity;
			
			return;
		}		
	}
};