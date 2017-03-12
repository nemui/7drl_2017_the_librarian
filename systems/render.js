Game.systems.render = function systemRender ( entities ) {
    var curEnity;
    
    for (var entityId in entities) {
        curEntity = entities[entityId];		
        
        if (curEntity.components.appearance && curEntity.components.position) {
			if (curEntity.components.appearance.hidden) {
				continue;
			}
			
			Game.rotDisplay.draw(
				curEntity.components.position.x, 
				curEntity.components.position.y, 
				curEntity.components.appearance.symbol,
				curEntity.components.appearance.color);
        }
    }
};