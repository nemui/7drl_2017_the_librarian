Game.systems.fog = function systemFog ( entities ) {
       
	if (Game.player == null) {
		return;
	}
	
	var curEnity;
	
    for (var entityId in entities) {
        curEntity = entities[entityId];
        		
        if (curEntity.components.appearance && curEntity.components.position){	
			var visibility = Game.player.components.fov.getVisibility(
				curEntity.components.position.x + "," + curEntity.components.position.y				
			);
						
			if (visibility == Game.Components.Fov.prototype.FOV_SEE) {		
				curEntity.components.appearance.hidden = false;
				if (curEntity.components.fogAppearance && curEntity.components.fogAppearance.inFog) {
					curEntity.components.fogAppearance.inFog = false;
					curEntity.components.appearance.color = curEntity.components.fogAppearance.originalColor;
				}				
			}
			else if (visibility == Game.Components.Fov.prototype.FOV_SEEN && curEntity.components.fogAppearance) {
				if (!curEntity.components.fogAppearance.inFog) {
					curEntity.components.fogAppearance.inFog = true;
					curEntity.components.fogAppearance.originalColor = curEntity.components.appearance.color;
					curEntity.components.appearance.color = curEntity.components.fogAppearance.color;
				}
			}
			else {
				curEntity.components.appearance.hidden = true;
			}
        }
    }
};