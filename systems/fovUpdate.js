var lightPasses = function(x, y) {
    var key = x + "," + y;
    if (key in Game.map) { 
		return (Game.map[key] == Game.FLOOR); 
	}
    return false;
}

var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
var currentFov;

Game.systems.fovUpdate = function systemFovUpdate ( entities ) {
    var curEnity;
    
    for (var entityId in entities) {
        curEntity = entities[entityId];
        
        if (curEntity.components.fov && curEntity.components.fov.needsUpdate){			
			curEntity.components.fov.needsUpdate = false;
			curEntity.components.fov.id++;
			fov.compute(
				curEntity.components.position.x,
				curEntity.components.position.y,
				curEntity.components.fov.size,
				computeFov.bind(curEntity.components.fov)
			);
        }
    }
};

function computeFov(x, y, r, visibility) {	
	this.map[x + "," +y ] = this.id;	
}