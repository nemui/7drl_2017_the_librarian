var bufferedInput = [];
window.addEventListener("keydown", handleUserInput);

Game.systems.userInput = function systemUserInput(entities) {
    
    var curEntity; 
    
    for (var entityId in entities){
        curEntity = entities[entityId];
        
        if (curEntity.components.playerControlled) {
			
			if (curEntity.components.actor.timeToAct) {								
								
				if (bufferedInput.length > 0) {
					var input = bufferedInput.pop();
					
					if ("rest" in input) {
						Game.advanceActor = true;	
						
					}
					else {
						var x = curEntity.components.position.x + input.x;
						var y = curEntity.components.position.y + input.y;					
						
						var action = new Game.Assemblages.Move({entityId:entityId, x:x, y:y})
						
						Game.entities[action.id] = action;					
					}
					
					bufferedInput = [];
				}
			}					
			
			return;			
        }		
    }
};

function handleUserInput(e) {

	var code = e.keyCode;
	
    if (code == 12 || code == 32) { 
		bufferedInput.push({rest: true});			
    }	
	else {	
		var keyMap = {};
		keyMap[38] = 0;
		keyMap[33] = 1;
		keyMap[39] = 2;
		keyMap[34] = 3;
		keyMap[40] = 4;
		keyMap[35] = 5;
		keyMap[37] = 6;
		keyMap[36] = 7; 
			
		if (!(code in keyMap)) { return; }
	 
		var diff = ROT.DIRS[8][keyMap[code]];		
		
		bufferedInput.push({x: diff[0], y: diff[1]});
	}	
}

