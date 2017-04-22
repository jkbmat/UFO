// objekty

var bg_obj = object.extend({
	constructor: function()
	{
		this.base('Background');
				
		this.frames = {
			'main': {'type': 'image', 'name': 'black.png', 'width': 166 * _posun, 'height': 133 * _posun},
			'newgame': {'type': 'image', 'name': 'black.png', 'width': 166 * _posun, 'height': 133 * _posun},
			'game': {'type': 'image', 'name': 'Background.png', 'width': 166 * _posun, 'height': 133 * _posun},
			'help': {'type': 'image', 'name': 'help.png', 'width': 166 * _posun, 'height': 133 * _posun},
			'hiscore': {'type': 'image', 'name': 'black.png', 'width': 166 * _posun, 'height': 133 * _posun},
			'options': {'type': 'image', 'name': 'black.png', 'width': 166 * _posun, 'height': 133 * _posun},
			'recap': {'type': 'image', 'name': 'black.png', 'width': 166 * _posun, 'height': 133 * _posun},
			'sethiscore': {'type': 'image', 'name': 'black.png', 'width': 166 * _posun, 'height': 133 * _posun},
		};
		
		this.alpha = 1;
		
		_allObjects.splice(_allObjects.indexOf(this), 1);
		
		this.animations = {
			'default': [['default', 1]]
		};
		
		this.frame = 'main';
		
		this.width = 166 * _posun;
		this.height = 133 * _posun;
		
		this.setX(0);
		this.setY(0);
		
		this.menurunning = 'none';
		this.menuitemsel = 0;
		this.lastmenu = 0;
		this.menuitems = new Array;
		this.writehiscore = [];
		
		this.setZindex(0);
				
		this.boundsAction = {'top': 0, 'right': 0, 'bottom': 0, 'left': 0, 'run': ''};
	},
	pohyb: function()
	{
		if(this.menurunning != this.lastmenu)
		{
			this.menuitemsel = 0;
			this.lastmenu = this.menurunning;
		}
		
		if(this.menurunning != 'none')
		{
			var leftAlien = getObjectById('leftalien');
			var rightAlien = getObjectById('rightalien');
			
			if(this.menurunning != 'sethiscore')
			{
				if(leftAlien.getY() != this.items[this.menuitemsel]['top'] && rightAlien.getY() != this.items[this.menuitemsel]['top'])
				{
					leftAlien.setX(this.items[this.menuitemsel]['left']);
					leftAlien.setY(this.items[this.menuitemsel]['top']);
					
					rightAlien.setX(this.items[this.menuitemsel]['right']);
					rightAlien.setY(this.items[this.menuitemsel]['top']);
				}
				
				if(_Key['up'].length && this.menurunning == 'help')
				{
					_Key['up'] = new Array
					eval(this.items[this.menuitemsel]['action']);
				}
			
				if(_Key['up'].indexOf(13) >= 0) // enter
				{
					_Key['up'] = new Array
					eval(this.items[this.menuitemsel]['action']);
				}
				if(_Key['up'].indexOf(40) >= 0 && this.items.length > 1) // dole
				{
					this.menuitemsel += 1;
					
					if(this.items.length == this.menuitemsel)
						this.menuitemsel = 0;
						
				}
				if(_Key['up'].indexOf(38) >= 0 && this.items.length > 1) // hore
				{
					this.menuitemsel -= 1;
					
					if(this.menuitemsel == -1)
						this.menuitemsel = this.items.length - 1;
				}
			}
			else if(document.getElementById('zadavaj'))
			{
				document.getElementById('zadavaj').focus();
				document.getElementById('zadavaj').value = document.getElementById('zadavaj').value.replace("\\", '').replace("\'", '').replace("\"", '');
				document.getElementById('zadavaj').value = document.getElementById('zadavaj').value;
				getObjectById('sempis').frames[getObjectById('sempis').frame].text = document.getElementById('zadavaj').value;
			}
		}
		
		this.base();
	}
});

var flash_obj = object.extend({
	constructor: function()
	{
		this.base('_Flash');
		_allObjects.splice(_allObjects.indexOf(this), 1);
				
		this.frames = {
			'default': {'type': 'blank', 'color': 'ffffff', 'width': _plocha_px_width, 'height': _plocha_px_height},
		};
		
		this.alpha = 1;
				
		this.animations = {
			'default': [['default', 1]]
		};
		
		this.frame = 'default';
		
		this.width = _plocha_px_width;
		this.height =  _plocha_px_height;
		
		this.overridehide = false;
		
		this.setX(0);
		this.setY(0);
	},
	pohyb: function()
	{
		if(this.events.length == 0 && this.overridehide == false && this.frames[this.frame].type != 'blank')
		{
			this.frames[this.frame].type = 'blank';
		}
		
		this.base();
	}
});

var _Flash = new flash_obj;
var _Background = new bg_obj();



var player_obj = object.extend
({
	constructor: function()
	{
		this.base('player');
		
		this.addClass('player');
		
		this.maxSpeed = 10;
		this.accHelper = 0.0;
		this.zrychlenie = 1;
		this.bombload = 1000;
		this.lastPlant = 0;
		this.dead = false;
		this.controlable = true;
		this.vystrelenych = 0;
		
		this.overlay = ['ff0000', 0];
		
		this.max_health = 100;
		this.health = 100;
		
		this.max_y = 259;
		this.min_x = - 8 * _posun;
		this.max_x = this.max_x + 8 * _posun;
		
		this.boundsAction = {'top': 3, 'bottom': 3, 'left': 1, 'right': 1, 'run': 'this.bounce(triggered)'};
		
		this.frames = {
			'default': {'type': 'image', 'name': 'Saucer.png', 'width': 13 * _posun, 'height': 10 * _posun},
			'dead': {'type': 'image', 'name': 'Saucerdead.png', 'width': 13 * _posun, 'height': 10 * _posun},
			'el1': {'type': 'image', 'name': 'Saucer-el1.png', 'width': 13 * _posun, 'height': 10 * _posun},
			'el2': {'type': 'image', 'name': 'Saucer-el2.png', 'width': 13 * _posun, 'height': 10 * _posun},
			'el3': {'type': 'image', 'name': 'Saucer-el3.png', 'width': 13 * _posun, 'height': 10 * _posun},
		}
		
		this.animations = {
			'default': [['default', 1]],
			'dead': [['dead', 1]],
			'el': [['el1', 100], ['el2', 100], ['el3', 100]]
		};

		this.frame = 'default';
		this.width = 13 * _posun;
		this.height = 10 * _posun;
		
		this.setZindex(10);
	},
	pohyb: function()
	{
		if(this.overlay[1] > 0)
			this.overlay[1] += -0.1;
		if(this.overlay[1] < 0)
			this.overlay = 0;
		
		if(isDown(37) && this.controlable) // left
		{
			this.setSpeedX(Math.max(this.getSpeedX() - this.zrychlenie, this.maxSpeed * -1));
		}
		else if(isDown(39) && this.controlable) // right
		{
			this.setSpeedX(Math.min(this.getSpeedX() + this.zrychlenie, this.maxSpeed));
		}
		if(isDown(38) && this.controlable) // up
		{
			this.setSpeedY(Math.max(this.getSpeedY() - this.zrychlenie, this.maxSpeed * -1));
		}
		if(isDown(32) && this.controlable) // space
		{
			this.plantBomb();
		}
		if((this.getSpeedX() != 0 && !isDown(39) && !isDown(37)) || this.controlable == false)
		{
			if(this.getSpeedX() > 0)
				this.setSpeedX(Math.max(this.getSpeedX() - this.zrychlenie / 15, 0));
			if(this.getSpeedX() < 0)
			{
				this.setSpeedX(Math.min(this.getSpeedX() + this.zrychlenie / 15, 0));
			}
		}
	
		if(!isDown(38) || this.controlable == false)
		{
			if(this.getSpeedY() < 0)
				this.setSpeedY(Math.min(this.getSpeedY() + this.zrychlenie, 0));
			
			if(this.getY() < _plocha_px_height - this.height - 1)
			{
				this.accHelper += this.zrychlenie;
				if(this.accHelper > 1)
				{
					this.setSpeedY(Math.min(this.getSpeedY() + 1, this.maxSpeed));
					this.accHelper = 0.0;
				}
			}
		}
		
		healthBar.width = Math.max((((this.health / this.max_health) * _plocha_px_width) - ((this.health / this.max_health) * _plocha_px_width) % _posun), 0);
		
		if(this.health <= 0)
		{
			if(!this.dead)
			{
				this.die();
			}
			
		}
		
		if(numClass('tank') == 0 && this.dead == false)
		{
			if(stage < (stages.length - 1))
			{
				stage++;
				novaHra(stage);
			}
			else
				menuinit('recap');
			
			return 0;
		}

		
		this.base();
	},
	plantBomb: function()
	{
		var date = new Date;
		if(date.getTime() < this.lastPlant + this.bombload)
			return 0;
			
		this.lastPlant = date.getTime();
		
		var nova_bomba = new bomba_obj();
		nova_bomba.width = 4 * _posun;
		nova_bomba.height = 4 * _posun;
		nova_bomba.setX(this.getX() + 4 * _posun);
		nova_bomba.setY(this.getY() + 10 * _posun);
		nova_bomba.setSpeedY(5);
		
		vystrelenych ++;
		
		_Background.playSound('bomba.mp3');
	},
	pridajHP: function(hp)
	{
		if(this.health > 0)
		{
			if(this.health >= hp)
			{
				this.health += hp;
				healthLost -= hp;
			}
			else
			{
				healthLost += this.health;
				this.health = 0;
			}
		}	
	},
	bounce: function(strana)
	{
		if(strana == "top")
		{
			if(Math.abs(this.getSpeedY()) > (_posun * 3))
			{
				this.pridajHP(-25);
				_Background.playSound('naraz.mp3');
				soundManager.setVolume('narazsound',75);
			}
		}
		if(strana == "bottom" && this.dead == false)
		{
			_Background.playSound('zzap.mp3');
			this.pridajHP(-25);
			this.setSpeedY(-20);
			flash(5, 20, ['39cfea', 'blank']);
			earthquake(5, 20, 2, 5);
			
			this.runAnim('el', 5, 'if(!this.dead && !this.getRunningAnim())this.frame="default"');
		}
	},
	die: function()
	{
		if(this.dead == false)
		{
			lifes --;
			
			this.runAnim();
			
			if(lifes == 0)
			{
				var gameOver = new object('gameover');
				gameOver.frames = {'default': {'type': 'image', 'name': 'gameover.png', 'width': _plocha_px_width, 'height': _plocha_px_height}};
				gameOver.width = _plocha_px_width;
				gameOver.height = _plocha_px_height;
				gameOver.frame = 'default';
				gameOver.setY(0);
				gameOver.setX(0);
				gameOver.setZindex(51);
			}
			
			this.removeEvents();
			
			if(lifes)
				this.registerEvent(5000, "novaHra(stage);", false, "respawn");
			else
				this.registerEvent(5000, "deleteSounds();menuinit('main');", false, "respawn");
		
			this.controlable = false;
			this.dead = true;
			this.zrychlenie = 0.5;
			this.max_y = _plocha_px_height - 9;
			this.frame = 'dead';
			flash(30, 20, ['black', 'red', 'ffa500', 'blank', 'red']);
			_Background.playSound('dead.mp3');
			earthquake(80, 20, 5, 10);
		}
	}
});

var tank_obj = object.extend
({
	constructor: function()
	{
		this.base('tank' + numClass('tank'));
		this.addClass('tank');
		
		this.lastShot = 0;
		this.loadTime = 1000;
		this.boundsAction['left'] = 3;
		this.boundsAction['right'] = 3;
		this.width = 13 * _posun;
		this.height = 13 * _posun;
		this.setY(_plocha_px_height - (3 * _posun) - this.height);
		
		this.iShoot = 100;
		
		this.frames = {
			'default': {'type': 'image', 'name': 'tank.png', 'width': 13 * _posun, 'height': 13 * _posun},
			'dead': {'type': 'image', 'name': 'tankdead.png', 'width': 13 * _posun, 'height': 13 * _posun},
			'dead-blink': {'type': 'blank', 'width': 13 * _posun, 'height': 13 * _posun},
			'shooting': {'type': 'image', 'name': 'tank-shooting.png', 'width': 13 * _posun, 'height': 13 * _posun},
		}
		
		this.animations = {
			'default': [['default', 1]],
			'dying': [['dead-blink', 200], ['dead', 200]],
			'shooting': [['shooting', 200]]
		};
		this.frame = 'default';
		
		this.setSpeedX(3);
	},
	pohyb: function()
	{
		this.base();
		
		var date = new Date;
		
		var j = Math.ceil(this.iShoot * (1 - (player.getY() / player.max_y)));
		if(date.getTime() > this.lastShot + this.loadTime && random(0, j - (j % 1), []) == j - (j % 1) && this.hasClass('dead') == false)
		{
			this.shoot();
			this.lastShot = date.getTime();
		}
	},
	shoot: function()
	{
		this.runAnim('shooting', 1, 'if(!this.hasClass("dead"))this.frame = "default";');
		
		var strela = new strela_obj();
		strela.setX(this.getX() + this.width / 2 - (this.width / 2) % _posun);
		strela.setY(this.getY() - strela.height);
				
		_Background.playSound('tankshot.mp3');
	},
	die: function(zomri)
	{
		this.removeEvents('die', true);
		if(zomri)
		{
			this.addClass('dead');
			this.base();
		}
		else
		{
			this.runAnim();
			_Background.playSound('tankdead.mp3');
			this.setSpeedX(0);
			this.frame = 'dead';
			this.addClass('dead');
			
			var tanky = getObjectsByClass('tank');
			var rychlo = true;
			for(var i = 0; i < tanky.length; i ++)
			{
				if(tanky[i].hasClass('dead') == false)
				{
					this.registerEvent(500, "this.runAnim('dying', 3, 'this.die(true);');", false, 'die');
					rychlo = false;
					break;
				}
			}
			if(rychlo)
				this.registerEvent(500, "this.die(true);", false, 'die');
		}
	},
});

var laserTank_obj = object.extend
({
	constructor: function()
	{
		this.base('lasertank'+numClass('lasertank'));
		this.addClass('tank');
		this.addClass('lasertank');
		
		this.lastShot = 0;
		this.loadTime = 2600;
		
		this.boundsAction['left'] = 3;
		this.boundsAction['right'] = 3;
		
		this.width = 13 * _posun;
		this.height = 13 * _posun;
		this.setY(_plocha_px_height - (3 * _posun) - this.height);
		
		this.iShoot = 100;
		
		this.frames = {
			'default': {'type': 'image', 'name': 'laserTank.png', 'width': 13 * _posun, 'height': 13 * _posun},
			'dead': {'type': 'image', 'name': 'laserTank-dead.png', 'width': 13 * _posun, 'height': 13 * _posun},
			'dead-blink': {'type': 'blank', 'width': 13 * _posun, 'height': 13 * _posun},
			'shooting': {'type': 'image', 'name': 'laserTank-shooting.png', 'width': 13 * _posun, 'height': 13 * _posun},
		}
		
		this.animations = {
			'default': [['default', 1]],
			'dying': [['dead-blink', 200], ['dead', 200]],
			'shooting': [['shooting', 500], ['default', 200], ['shooting', 200], ['default', 200], ['shooting', 500]]
		};
		this.frame = 'default';
		
		this.setSpeedX(3);
	},
	pohyb: function()
	{
		this.base();
		
		if(getObjectById(this.getId() + '-laser'))
			getObjectById(this.getId() + '-laser').setX(this.getX() + 5 * _posun);
		
		var date = new Date;
		
		var j = Math.ceil(this.iShoot * (1 - (player.getY() / player.max_y)));
		if(this.getRunningAnim() != 'shooting' && date.getTime() > this.lastShot + this.loadTime && random(0, j - (j % 1), []) == j - (j % 1) && this.hasClass('dead') == false)
		{
			_Background.playSound('lasercharge.mp3');
			this.lastShot = date.getTime();
			
			this.registerEvent(1100, 'this.shoot();', false, 'shot');
			this.runAnim('shooting', 1, 'getObjectById("'+this.getId()+'-laser").die(); this.frame = "default";');
		}
	},
	shoot: function()
	{
		if(this.hasClass('dead'))
			return 0;
			
			
		var laser = new laser_obj(this.getId());
				
		_Background.playSound('beam.mp3');
	},
	die: function(zomri)
	{
		this.removeEvents('die', true);
		if(zomri)
		{
			this.addClass('dead');
			this.base();
		}
		else
		{
			if(getObjectById(this.getId() + '-laser'))
				getObjectById(this.getId() + '-laser').die();
			
			this.runAnim();
			_Background.playSound('tankdead.mp3');
			this.setSpeedX(0);
			this.frame = 'dead';
			this.addClass('dead');
			
			this.removeEvents();
			
			for(var i = 0; i < _Background.sounds.length; i++)
			{
				if(_Background.sounds[i].playStart && _Background.sounds[i].name == 'beam.mp3')
				{
					_Background.sounds[i].sound.pause();
					_Background.sounds[i].playStart = 0;
				}
			}

			var tanky = getObjectsByClass('tank');
			var rychlo = true;
			for(var i = 0; i < tanky.length; i ++)
			{
				if(tanky[i].hasClass('dead') == false)
				{
					this.registerEvent(500, "this.runAnim('dying', 3, 'this.die(true);');", false, 'die');
					rychlo = false;
					break;
				}
			}
			if(rychlo)
				this.registerEvent(500, "this.die(true);", false, 'die');
		}
	}
});

var strela_obj = object.extend
({
	constructor: function()
	{
		this.base('strela' + numClass('strela'));
		this.addClass('strela');
		
		this.boundsAction = {'top': 2};
		
		this.frames = {
			'default': {'type': 'image', 'name': 'tankshot.png', 'width': 1 * _posun, 'height': 4 * _posun},
		}
		
		this.animations = {
			'default': [['default', 1]],
		};
		this.frame = 'default';

		this.width = 1 * _posun;
		this.height = 4 * _posun;
		this.setSpeedY(-9);
	},
	pohyb: function()
	{
		var hitTest = objectsInRect(this.getX(), this.getY(), this.width, this.height);
		for(var i = 0; i < hitTest.length; i++)
		{
			if(hitTest[i].getId() == "player" && hitTest[i].dead == false)
			{
				player.pridajHP(-50);
				player.overlay[1] = 1;
				this.die();
				break;
			}
		}
		this.base();
	}
});

var laser_obj = object.extend
({
	constructor: function(parent)
	{
		this.base(parent + '-laser');
		this.addClass('laser');
		
		this.width = 3 * _posun;
		this.height = 117 * _posun;
		
		this.parent = parent;
		
		this.frames = {
			'default': {'type': 'image', 'name': 'laser.png', 'width': 3 * _posun, 'height': 117 * _posun},
		}
		
		this.animations = {
			'default': [['default', 1]],
		};
		this.frame = 'default';

		if(getObjectById(this.parent).hasClass("dead"))
		{
			this.die();
		}
		
		this.setY(0);
		this.setX(getObjectById(this.parent).getX() + 5 * _posun);
	},
	pohyb: function()
	{
		var hitTest = objectsInRect(this.getX(), this.getY(), this.width, this.height);
		for(var i = 0; i < hitTest.length; i++)
		{
			if(hitTest[i].getId() == "player")
			{
				player.pridajHP(-100);
				break;
			}
		}
		this.base();
	}
});

var bomba_obj = object.extend
({
	constructor: function(id)
	{
		this.base('bomba'+numClass('bomba'));
		this.addClass('bomba');
		
		this.zrychlenie = 0.5;
		this.maxSpeed = 10;
		this.accHelper = 0.0;
		
		this.max_y = this.max_y - 15;
		
		this.boundsAction = {'top': 0, 'left': 0, 'bottom': 2, 'right': 0};
		
		this.frames = {
			'default': {'type': 'image', 'name': 'bomba.png', 'width': 4 * _posun, 'height': 4 * _posun},
		}
		
		this.animations = {
			'default': [['default', 1]],
		};
		this.frame = 'default';

		this.width = 4 * _posun;
		this.height = 4 * _posun;
	},
	die: function()
	{
		earthquake(5, 30, 4, 5);
		flash(2, 40, ['red', 'black']);
		hitTest = objectsInRect(this.getX(), this.getY(), this.width, this.height);
		for(var i = 0; i < hitTest.length; i++)
		{
			if(hitTest[i].hasClass('tank') && !hitTest[i].hasClass('dead'))
			{
				hitTest[i].die();
			}
		}
		_Background.playSound('vybuch.mp3');
		this.base();
	},
	pohyb: function()
	{
		this.accHelper += this.zrychlenie;
		if(this.accHelper > 1)
		{
			this.setSpeedY(Math.min(this.getSpeedY() + 1, this.maxSpeed));
			this.accHelper = 0.0;
		}
		this.base();
	}
});