Game.Assemblages = {

	Wall: function Wall(params) {
		var entity = new Game.Entity();
		entity.addComponent( new Game.Components.Appearance(params));
		entity.addComponent( new Game.Components.FogAppearance(params));
		entity.addComponent( new Game.Components.Position(params));
		entity.addComponent( new Game.Components.Collision());
		return entity;
	},
 
    Actor: function Actor(params) {        
        var entity = new Game.Entity();
		entity.addComponent( new Game.Components.Appearance(params));
		entity.addComponent( new Game.Components.Position(params));
		entity.addComponent( new Game.Components.Actor(params));
		entity.addComponent( new Game.Components.Fov(params));
		entity.addComponent( new Game.Components.Collision());
		entity.addComponent( new Game.Components.Health(params));
		entity.addComponent( new Game.Components.Attack(params));
		entity.addComponent( new Game.Components.Defense(params));
		return entity;
    },
	
	Book: function Book(params) {        
        var entity = new Game.Entity();				
		entity.addComponent( new Game.Components.Appearance(params));
		entity.addComponent( new Game.Components.Position(params));			
		entity.addComponent( new Game.Components.Collision());
		entity.addComponent( new Game.Components.Book(params));
		return entity;
    },
	
	Move: function Move(entityId, x, y) {        
        var entity = new Game.Entity();				
		entity.addComponent(new Game.Components.Move(entityId, x, y));
		return entity;
    },
	
	Chronicle: function Chronicle(params) {        
        var entity = new Game.Entity();				
		entity.addComponent(new Game.Components.Chronicle(params));
		return entity;
    }
};