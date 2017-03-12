Game.CHRONICLE_X = 0;
Game.CHRONICLE_Y = Game.DUNGEON_HEIGHT + 2;
Game.CHARS_PER_PAGE = Game.ROT_CHAR_WIDTH * (Game.ROT_CHAR_HEIGHT - Game.CHRONICLE_Y - 1);

Game.currentPage = "";
Game.currentPagePlain = "";
Game.previousPage = "";

Game.systems.chronicler = function systemChronicler ( entities ) {
			
	var curEntity;	
	
	for (var entityId in entities) {
		curEntity = entities[entityId];					
		
		if (curEntity.components.chronicle) {				
			
			var plainText = curEntity.components.chronicle.plainText;			
			var currentPagePlain = Game.currentPagePlain + " " + plainText;
			
			if (currentPagePlain.length > Game.CHARS_PER_PAGE) {
				Game.previousPage = Game.currentPagePlain;
				Game.currentPagePlain = plainText;				
				Game.currentPage = curEntity.components.chronicle.fancyText;
			}
			else {
				Game.currentPagePlain = currentPagePlain;
				Game.currentPage += " " + curEntity.components.chronicle.fancyText;
			}
			
			delete entities[entityId];
			
			Game.rotDisplay.setOptions({fg: Game.FOG_COLOR});
			Game.rotDisplay.drawText(Game.CHRONICLE_X, Game.CHRONICLE_Y, Game.previousPage);
			Game.rotDisplay.setOptions({fg: Game.DUNGEON_COLOR});
			
			
			Game.rotDisplay.drawText(Game.CHRONICLE_X, Game.CHRONICLE_Y, Game.currentPage);
		}
	}
};