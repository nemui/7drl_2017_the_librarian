Game.systems.fighting = function systemFighting ( entities ) {
    var curEnity;
    
    for (var entityId in entities) {
        curEntity = entities[entityId];
        
        if (curEntity.components.move) {
			
			var movingEntity = entities[curEntity.components.move.entityId];

			if (!movingEntity.components.attack) {
				continue;
			}
			
			var x = curEntity.components.move.x;
			var y = curEntity.components.move.y;			
			
			var obstacle = null;			
			
			for (var temp in entities) {
				
				var tempEntity = entities[temp];
				
				if (tempEntity.components.health
					&& tempEntity.components.collision 
					&& tempEntity.components.position.x == x
					&& tempEntity.components.position.y == y) {
					
					obstacle = tempEntity;
					break;
				}
			}			
			
			if (obstacle == null) {				
				continue;
			}
					
			var usedAttackTypes = [];
			var attackTypes = movingEntity.components.attack.attackTypes;
			for (var i = 0; i < movingEntity.components.attack.attacksPerTurn; i++) {
				var attackType = attackTypes[Math.floor(ROT.RNG.getUniform() * attackTypes.length)];
				if (usedAttackTypes.indexOf(attackType) == -1 || usedAttackTypes.length == attackTypes.length) {
					
					usedAttackTypes.push(attackType);
					
					var originalObstacle = null;
					if (obstacle.components.dorian && ROT.RNG.getUniform() < obstacle.components.dorian.chance) {
						originalObstacle = obstacle;
						obstacle 
					}
					
					var baseDamage = attackType.damageDie.roll();
					var defense = obstacle.components.defense.value;
					var damage = Math.max(baseDamage - defense, 0);
					
					var chronicle = new Game.Assemblages.Chronicle({
						text: attackType.attackText,
						attacker: movingEntity.components.actor.actorName,
						//attackerColor: movingEntity.components.appearance.color,
						defender: obstacle.components.actor.actorName,
						//defenderColor: obstacle.components.appearance.color
					});
					Game.entities[chronicle.id] = chronicle;
					
					if (damage == 0) {
						continue;
					}
					
					if (Game.takeDamage(entities, obstacle, damage)) {
						if (obstacle.components.dorian && ROT.RNG.getUniform() <= obstacle.components.dorian.chance) {
							
							var chronicle = new Game.Assemblages.Chronicle({
								text: "Damage is reflected back at the %attacker .",
								textColor: "blue",
								attacker: movingEntity.components.actor.actorName,								
							});
							Game.entities[chronicle.id] = chronicle;
							
							Game.takeDamage(entities, movingEntity, damage);
						}
					}
					else {
						break;
					}
				}
			}									
			
			delete Game.entities[entityId];
			
			Game.advanceActor = true;								
        }
    }
};

Game.takeDamage = function(entities, obstacle, damage) {
	obstacle.components.health.value -= damage;					
	
	if (obstacle.components.health.value <= 0) {
		obstacle.components.actor.isDead = true;		

		var chronicle = new Game.Assemblages.Chronicle({
			text: "%defender dies.",							
			textColor: "black",
			defender: obstacle.components.actor.actorName
		});
		Game.entities[chronicle.id] = chronicle;
		
		if (obstacle.components.boss) {
			var chronicle = new Game.Assemblages.Chronicle({
				text: "\nYou have protected the Library, even if it meant losing your sight and being destined to wander its halls for all eternity.\nThe End.",
				textColor: "black"
			});
			Game.entities[chronicle.id] = chronicle;
			return;
		}
		else if (obstacle.components.playerControlled) {
			var chronicle = new Game.Assemblages.Chronicle({
				text: "\nYou were defeated, and the Library is now open to the public.\nThe End.",
				textColor: "black"
			});
			Game.entities[chronicle.id] = chronicle;
			Game.player = null;
			return;
		}
		
		return false;
	}
	else if (damage > 0 && obstacle.components.playerControlled) {
		var chronicle = new Game.Assemblages.Chronicle({
			text: "%hp hp left.",														
			hp: obstacle.components.health.value.toString(),
			hpColor: "green"
		});
		Game.entities[chronicle.id] = chronicle;						
	}
	
	return true;
}