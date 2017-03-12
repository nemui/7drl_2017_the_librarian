Game.systems.scheduler = function systemScheduler ( entities ) {
			
	var curEntity;
	var nextActor = false;
	
	while (true) {
		for (var entityId in entities) {
			curEntity = entities[entityId];					
			
			if (curEntity.components.actor) {				
				if (curEntity.components.actor.timeToAct) {					
					if (Game.advanceActor) {
						
						curEntity.components.actor.changeTimeToAct(false);
						
						if (curEntity.components.actor.isDead) {
							delete entities[curEntity.id];
						}
						
						nextActor = true;		
					}
					else {
						return;
					}
				}			
				else if (nextActor) {
					if (curEntity.components.actor.isDead) {
						delete entities[curEntity.id];
						continue;
					}
					
					if (Game.wantsToAct(curEntity)) {
						Game.advanceActor = false;
						curEntity.components.actor.changeTimeToAct(true);
						return;
					}
				}				
			}
		}
	}
};