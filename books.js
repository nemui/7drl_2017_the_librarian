Game.books = [
	{
		bookText: "\"The Executioner's Song\".",	
		bookEffect: "Your get an additional attack per turn.",
		affectReader: function (reader) {
			reader.components.attack.attacksPerTurn += 1;
		}
	},
	
	{
		bookText: "\"The Plague\".",
		bookEffect: "You get +10 hp.",
		affectReader: function (reader) {
			reader.components.health.value += 10;
		}
	},
	
	{
		bookText: "\"The Good Soldier\".",	
		bookEffect: "You are less succeptable to damage.",
		affectReader: function (reader) {
			reader.components.defense.value += 1;
		}
	},
	
	{
		bookText: "\"The Picture of Dorian Gray\".",	
		bookEffect: "There is a 50% chance to reflect damage.",
		affectReader: function (reader) {
			reader.addComponent(new Game.Components.Dorian({chance:0.5}));
		}
	},
	
	{
		bookText: "\"Anna Karenina\".",	
		bookEffect: "You learn to throw your enemies under imaginary trains.",
		affectReader: function (reader) {
			reader.components.attack.attackTypes.push({
				damageDie: new Game.Die(3, 4), attackText: "%attacker throws %defender under an imaginary train." 
			});
		}
	},
	
	{
		bookText: "\"The Unbearable Lightness of Being\".",	
		bookEffect: "You learn to crush your enemies with existential dread.",
		affectReader: function (reader) {
			reader.components.attack.attackTypes.push({
				damageDie: new Game.Die(3, 4), attackText: "%attacker crushes %defender with existential dread." 
			});
		}
	},
	
	{
		bookText: "\"Dorohedoro\".",	
		bookEffect: "You learn to handle a knife. Too bad you don't have one.",
		affectReader: function (reader) {
			//
		}
	},
	
	{
		bookText: "\"Moby-Dick\".",	
		bookEffect: "You suddenly look different.",
		affectReader: function (reader) {
			reader.components.appearance.symbol = "W";
			reader.components.appearance.color = "white";
		}
	},
	
	{
		bookText: "\"One Hundred Years of Solitude\".",	
		bookEffect: "Next chamber contains no enemies (unless it's a final chamber).",
		affectReader: function (reader) {
			//
		}
	},	
	
	{
		bookText: "\"The Trial\".",	
		bookEffect: "Next chamber is a maze (unless it's a final chamber).",
		affectReader: function (reader) {
			//
		}
	}
];