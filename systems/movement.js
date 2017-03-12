Game.systems.movement = function systemMovement ( entities ) {
    var curEnity;
    
    for (var entityId in entities) {
        curEntity = entities[entityId];
        
        if (curEntity.components.move){			
			var x = curEntity.components.move.x;
			var y = curEntity.components.move.y;
			
			if (!curEntity.components.move.entityId in Game.entities) {
				delete Game.entities[entityId];
				continue;
			}
			
			var movingEntity = Game.entities[curEntity.components.move.entityId];	
			
			var obstacle = null;
			if (movingEntity.components.collision) {
								
				for (var temp in entities) {				
					
					if (temp == movingEntity.id) {
						continue;
					}
					
					var tempEntity = entities[temp];
					
					if (tempEntity.components.collision 
						&& tempEntity.components.position.x == x
						&& tempEntity.components.position.y == y) {
						
						obstacle = tempEntity;
						break;
					}
				}
			}		
			
			if (obstacle != null) {				
				continue;
			}
			
			var position = movingEntity.components.position;
			
			if ((position.x != x || position.y != y) && movingEntity.components.fov) {
				movingEntity.components.fov.needsUpdate = true;
			}
			
			position.x = x;
			position.y = y;
			
			delete Game.entities[entityId];
			Game.advanceActor = true;					
        }
    }
};