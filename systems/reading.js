Game.systems.reading = function systemReading ( entities ) {
    var curEnity;
    
    for (var entityId in entities) {
        curEntity = entities[entityId];
        
        if (curEntity.components.move) {
			
			var movingEntity = entities[curEntity.components.move.entityId];

			if (!movingEntity.components.playerControlled) {
				continue;
			}
			
			var x = curEntity.components.move.x;
			var y = curEntity.components.move.y;			
			
			var obstacle = null;			
			
			for (var temp in entities) {
				
				var tempEntity = entities[temp];
				
				if (tempEntity.components.book					
					&& tempEntity.components.position.x == x
					&& tempEntity.components.position.y == y) {
					
					obstacle = tempEntity;
					break;
				}
			}			
			
			if (obstacle == null) {				
				continue;
			}
			
			obstacle.components.book.affectReader(movingEntity);
			movingEntity.components.fov.size -= 2;
			
			Game._generateChamber(
				obstacle.components.book.chamberIndex, 
				obstacle.components.book.bookText != "\"One Hundred Years of Solitude\".",
				obstacle.components.book.bookText == "\"The Trial\"."
			);
			
			var chronicleBookText = new Game.Assemblages.Chronicle({
				text: "You read a book titled " + obstacle.components.book.bookText,				
			});			
			
			var chronicleBookEffect = new Game.Assemblages.Chronicle({
				text: obstacle.components.book.bookEffect,
				textColor: "green"
			});			
			
			var chronicleVision = new Game.Assemblages.Chronicle({
				text: "Your eyes get worse.",
				textColor: "grey"
			});
			
			var combinedChronicle = new Game.Assemblages.Chronicle({
				plainText: chronicleBookText.components.chronicle.plainText + " " + chronicleBookEffect.components.chronicle.plainText + " " + chronicleVision.components.chronicle.plainText,
				fancyText: chronicleBookText.components.chronicle.fancyText + " " + chronicleBookEffect.components.chronicle.fancyText + " " + chronicleVision.components.chronicle.fancyText,
			}); 
			Game.entities[combinedChronicle.id] = combinedChronicle;
        }
    }
};