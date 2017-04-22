// povinne premenne
var enableDebug = false;

var _posun = 3;
var _fpsLimit = 35;
var _drawFps = 40;

var _plocha_width = 166;
var _plocha_height = 133;

var _plocha_px_width = _plocha_width * _posun;
var _plocha_px_height = _plocha_height * _posun;

var _okno_width = _plocha_width;
var _okno_height = _plocha_height;

var _kamera_x = 0;
var _kamera_y = 0;

var _okno_px_width = _okno_width * _posun;
var _okno_px_height = _okno_height * _posun;

var _PovoleneEfekty = {'flash': true, 'earthquake': true, 'sound': true, 'overlay': true};

var _pauseKey = 27;
var _paused = 0;
var _pauseObjects;

var _Background;

var mainInterval;

// ostatne globalne premenne

var stages = [
			  {'tanky': [1, 1], 'iShoot': {1: 70}},
			  {'tanky': [1, 1, 1], 'iShoot': {1: 50}},
			  {'tanky': [2, 2], 'iShoot': {2: 100}},
			  {'tanky': [2, 1, 1, 1, 2], 'iShoot': {1: 50, 2: 100}},
			  {'tanky': [1, 2, 2, 2, 1], 'iShoot': {1: 50, 2: 70}},
			  {'tanky': [1, 1, 1, 1, 1], 'iShoot': {1: 50}},
			  {'tanky': [2, 2, 2, 2, 2], 'iShoot': {2: 50}}
			 ];

stage = 0;

lifes = 1;

var emulogic = (7 * _posun - 1)+'px emulogic';

var _novaHra = false;
var vystrelenych = 0;
var healthLost = 0;

var startGame = 0;
getHighScores();

// funkcie

function init()
{
	document.getElementsByTagName("h1")[0].innerHTML = "UFO v.2.1";
	
	plocha = document.getElementById('plocha'); // main canvas
	plocha.width = _plocha_px_width;
	plocha.height = _plocha_px_height;
	plocha.style.width = '100%';
	plocha.style.height = '100%';
	plocha.style.marginBottom = "-15px";
	plocha.style.margin = "auto";
	plocha.style.position = 'relative';
	plocha.style.border = "1px solid grey";
	
	ctx = plocha.getContext('2d');

	overlayer = document.getElementById('overlayer'); // canvas for overlay effect
	overlayer.width = 0;
	overlayer.height = 0;
	overlayer.style.display = "none";
	octx = overlayer.getContext('2d');
	
	var okno = document.getElementById("okno");
	okno.style.position = 'relative';
	okno.style.width = _plocha_px_width + "px";
	okno.style.height = _plocha_px_height + "px";
	
	debug = document.createElement('div');
	debug.style.width = '500 px';
	debug.style.height = '200 px';
	debug.style.overflow = "auto";
	okno.appendChild(debug);
	
	score = 0;
	
	plocha = document.getElementById('plocha');
	
	_plocha_left = _plocha_top = 0;
	
	do {
		_plocha_left += plocha.offsetLeft;
		_plocha_top += plocha.offsetTop;
	} while (plocha = plocha.offsetParent)

	plocha = document.getElementById('plocha');
	
	soundManager.onready(function(){
		_Background.registerSound('bomba.mp3');
		_Background.registerSound('naraz.mp3');
		_Background.registerSound('zzap.mp3');
		_Background.registerSound('dead.mp3');
		_Background.registerSound('vybuch.mp3');
		_Background.registerSound('menuaccept.mp3');
		_Background.registerSound('tankshot.mp3');
		_Background.registerSound('tankdead.mp3');
		_Background.registerSound('lasercharge.mp3');
		_Background.registerSound('tankdead.mp3');
		_Background.registerSound('beam.mp3');
	});

	drawloop();
	mainInterval = setInterval('main();', 1000/_fpsLimit);
	menuinit('main');
}

function getHighScores()
{
	var callback;
	
	if(arguments.length == 1)
	{
		callback = arguments[0];
	}
	
	var xmlhttp = new XMLHttpRequest();
	var timer = setTimeout("alert('Couldn\'t connect with the server. Check your internet connection.');", 3000);
	
	xmlhttp.onreadystatechange = function()
	{
			if(xmlhttp.readyState==4)
			{
				clearTimeout(timer);
				HighScores = eval(xmlhttp.responseText);
				if(callback)
				{
					eval(callback);
				}
			}
	}
	
	xmlhttp.open("GET", "getHiscores.php", true);
	xmlhttp.send(null);
}

function zapisHighScore(score, meno, callback)
{
	var xmlhttp = new XMLHttpRequest();
	var timer = setTimeout("alert('Couldn\'t connect with the server. Check your internet connection.');", 3000);
	
	xmlhttp.onreadystatechange = function()
	{
			if(xmlhttp.readyState==4)
			{
				clearTimeout(timer);
				setTimeout(callback, 500);
			}
	}
	
	xmlhttp.open("GET", "setHiscore.php?meno="+meno+"&score="+score, true);
	xmlhttp.send(null);
}

function menuinit(ktore)
{
	_allObjects = new Array;
	_Key['up'] = new Array;
	
	if(!getObjectById('leftalien'))
	{
		var leftAlien = new object('leftalien');
		leftAlien.frames = {'default': {'type': 'image', 'name': 'Saucer.png', 'width': 13 * _posun, 'height': 10 * _posun}};
		leftAlien.width = 13 * _posun;
		leftAlien.height = 10 * _posun;
		leftAlien.setX(-100);
		leftAlien.frame = 'default';
	
		var rightAlien = new object('rightalien');
		rightAlien.frames = {'default': {'type': 'image', 'name': 'Saucer.png', 'width': 13 * _posun, 'height': 10 * _posun}};
		rightAlien.width = 13 * _posun;
		rightAlien.height = 10 * _posun;
		rightAlien.setX(-100);
		rightAlien.frame = 'default';
	}

	_Background.menurunning = ktore;
	_Background.frame = ktore;	

	polozky = new Array;
	
	switch(ktore)
	{
		case 'main':
			
			getHighScores();
			
			items = new Array;
			
			if(_paused === true)
			{
				vypisFontom("resume", 'center', 153, emulogic, 'ffffff');
				
				items = [{'left': 132, 'top': 141, 'right': 330, 'action': 'pause(false);'}];
			}
			else
				vypisFontom("resume", 'center', 153, emulogic, '3a3a3a');
			
			vypisFontom('U.F.O', 'center', 50, '55px emulogic', '00ff00');
			
			vypisFontom("new game", 'center', 196, emulogic, 'ffffff');
			vypisFontom("options", 'center', 241, emulogic, 'ffffff');
			vypisFontom("high scores", 'center', 286, emulogic, 'ffffff');
			vypisFontom("help", 'center', 331, emulogic, 'ffffff');
			
			items.push({'left': 111, 'top': 186, 'right': 351, 'action': 'menuinit("newgame");'}); // new game menu
			items.push({'left': 123, 'top': 231, 'right': 342, 'action': 'menuinit("options");'}); // options
			items.push({'left': 81, 'top': 276, 'right': 384, 'action': 'getHighScores(\'menuinit("hiscore")\');'}); // high scores
			items.push({'left': 153, 'top': 321, 'right': 309, 'action': 'menuinit("help");'}); // help
			
			_Background.items = items;
			
			break;
			
		case 'options':
			spinace = new Array;
			
			var prepis = "vypisFontom('options', 'center', 50, '55px emulogic', '00ff00');vypisFontom('sound ' + ( _PovoleneEfekty['sound'] ? 'on!' : 'off'), 'center', 163, emulogic, 'ffffff');vypisFontom('marsquake ' + ( _PovoleneEfekty['earthquake'] ? 'on!' : 'off'), 'center', 217, emulogic, 'ffffff');vypisFontom('flash ' + ( _PovoleneEfekty['flash'] ? 'on!' : 'off'), 'center', 271, emulogic, 'ffffff');vypisFontom('< back', 'center', 322, emulogic, '3a3a3a');";
			
			eval(prepis);

			items = [
				{'left': 102, 'right': 363, 'top': 153, 'action': '_PovoleneEfekty["sound"] = _PovoleneEfekty["sound"] ? false : true; znictext(); '+prepis+' _Background.playSound("menuaccept.mp3");'},
				{'left': 54, 'right': 399, 'top': 210, 'action': '_PovoleneEfekty["earthquake"] = _PovoleneEfekty["earthquake"] ? false : true; znictext(); '+prepis+' earthquake(10, 20, 2, 5);'},
				{'left': 102, 'right': 356, 'top': 264, 'action': '_PovoleneEfekty["flash"] = _PovoleneEfekty["flash"] ? false : true; znictext(); '+prepis+' flash(5, 30, ["green", "blank", "lime", "blank"], true);'},
				{'left': 132, 'right': 327, 'top': 315, 'action': 'menuinit("main");'}, ];
			_Background.items = items;
			break
			
		case 'newgame':	
			vypisFontom('new game', 'center', 50, '55px emulogic', '00ff00');

			vypisFontom('easy', 'center', 145, emulogic, 'ffffff');
			vypisFontom('moderate', 'center', 190, emulogic, 'ffffff');
			vypisFontom('hard', 'center', 235, emulogic, 'ffffff');
			vypisFontom('extreme', 'center', 280, emulogic, 'ffffff');
			vypisFontom('< back', 'center', 337, emulogic, '3a3a3a');
		
			var items = [];
			items.push({'left': 153, 'top': 135, 'right': 309, 'action': '_paused = false;lifes = 5;_fpsLimit = 30;novaHra(0)'}); // easy
			items.push({'left': 109, 'top': 180, 'right': 351, 'action': '_paused = false;lifes = 3;_fpsLimit = 32;novaHra(0)'}); // moderate
			items.push({'left': 153, 'top': 225, 'right': 309, 'action': '_paused = false;lifes = 2;_fpsLimit = 34;novaHra(0)'}); // hard
			items.push({'left': 123, 'top': 270, 'right': 342, 'action': '_paused = false;lifes = 1;_fpsLimit = 36;novaHra(0)'}); // extreme
			items.push({'left': 132, 'right': 327, 'top': 327, 'action': 'menuinit("main");'});
			
			_Background.items = items;
			
			break;
			
		case 'hiscore':
			getHighScores();
			
			vypisFontom('high', 'center', 18, '55px emulogic', '00ff00');
			vypisFontom('scores', 'center', 84, '55px emulogic', '00ff00');
			vypisFontom('< back', 'center', 346, emulogic, '3a3a3a');
			
			var y = 168;
			for(var i = 0; i < 5; i++)
			{
				var meno = '...............';
				var score = '   0';
				if(i < HighScores.length)
				{
					meno = HighScores[i]['meno'] + meno.substr(0, 15 - HighScores[i]['meno'].length);
					score = score.substr(0, 4 - HighScores[i]['score'].length) + HighScores[i]['score'];
				}
				
				vypisFontom(i + 1 + " " + meno + " " + score, 27, y, emulogic, 'ffffff');
				
				y += 33;
			}
			
			var items = [];
			items.push({'left': 132, 'right': 327, 'top': 336, 'action': 'menuinit("main");'});
			_Background.items = items;
			
			break;
			
		case 'sethiscore':
			getHighScores();
			
			_allObjects = new Array;
			
			vypisFontom('high', 'center', 18, '55px emulogic', '00ff00');
			vypisFontom('scores', 'center', 84, '55px emulogic', '00ff00');
			
			naMiesto = 0;
			
			for(var i = 0; i < HighScores.length; i++)
			{
				if(arguments[arguments.length - 1] > HighScores[i]['score'])
				{
					naMiesto = i + 1;
					break;
				}
			}
			
			if(naMiesto == 0 && HighScores.length < 5)
			{
				naMiesto = HighScores.length + 1;
			}
			
			if(naMiesto == 0)
			{
				menuinit('hiscore');
				return 0;
			}
			
			var temp = new Array;
			for(var i = 0; i <= HighScores.length; i++)
			{
				if(i < naMiesto - 1)
					temp.push(HighScores[i]);
				else if(i > (naMiesto - 1) && i < 5)
					temp.push(HighScores[i - 1]);
				else if(i == (naMiesto -1) && i < 5)
				{
					var pole = {'score': arguments[arguments.length - 1]+"", 'meno': ""};
					temp.push(pole);
				}
			}
			HighScores = temp;

				
			var y = 168;
			for(var i = 0; i < 5; i++)
			{
				var meno = '...............';
				var score = '   0';

				if(HighScores.length > i)
				{
					meno = HighScores[i]['meno'] + meno.substr(0, 15 - HighScores[i]['meno'].length);
					score = score.substr(0, 4 - HighScores[i]['score'].length) + HighScores[i]['score'];
				}

				if(i == (naMiesto - 1))
				{
					meno = '               ';

					var pis = new object('sempis');
					pis.addClass('_text');
					pis.frames = [{'type': 'text', 'text': '', 'font': emulogic, 'color': 'ffffff', 'width': 200, 'height': 20}];
					pis.frame = 0;
					pis.width = 200;
					pis.height = 20;
					pis.setX(67);
					pis.setY(y);
					
					var kurzor = new object('kurzor');
					kurzor.addClass('_text');
					kurzor.frames = [{'type': 'text', 'text': '_', 'font': emulogic, 'color': 'ffffff', 'width': 20, 'height': 20}];
					kurzor.addClass('makurzor');
					kurzor.frame = 0;
					kurzor.width = 20;
					kurzor.height = 20;
					kurzor.setX(67);
					kurzor.setY(y);
					
					kurzor.registerEvent(1, 'if(getObjectById("sempis").frames[0].text.length == 15) this.kurzor = " "; else this.kurzor = "_"; this.setX(getObjectById("sempis").frames[0].text.length * 20 + 67);', true, 'posun');
					kurzor.registerEvent(500, 'if(this.hasClass("makurzor")){this.removeClass("makurzor");this.frames[this.frame].text = this.frames[this.frame].text.substr(0, this.frames[this.frame].text.length - 1);}else{this.addClass("makurzor");this.frames[this.frame].text = this.frames[this.frame].text + this.kurzor;}', true, 'kurzor');
				}

				vypisFontom(i + 1 + " " + meno + " " + score, 27, y, emulogic, 'ffffff');

				y += 33;
			}


						
			var zadavaj = document.createElement('input');
			zadavaj.setAttribute('onkeydown', 'if(event.keyCode == 13 && this.value.length){ getObjectById("kurzor").die(); _Key["up"] = new Array; zapisHighScore('+ arguments[1] +', this.value, "getHighScores(\'_Key[\\"up\\"] = new Array; menuinit(\\"hiscore\\")\');"); document.body.removeChild(this)}');
			zadavaj.setAttribute('maxlength', '15');
			zadavaj.style.position = 'absolute';
			zadavaj.style.top = '-3em';
			
			zadavaj.id = 'zadavaj';
			document.body.appendChild(zadavaj);
			document.getElementById('zadavaj').focus();
			
			break;
			
		case 'credits':
			_Background.items = [{'left': 132, 'right': 327, 'top': 315, 'action': 'menuinit("main");'}];
			break;
			
		case 'help':
			_Key['up'] = new Array
	
			_Background.items = [{'left': -50, 'right': -50, 'top': -50, 'action': 'menuinit("main");'}];
			break;
			
		case 'recap':
			var date = new Date;
			var sekundSpolu = Math.floor((date.getTime() - startGame) / 1000);
			
			startGame = date.getTime() - startGame;
			
			var minut = Math.floor(sekundSpolu / 60);
			var sekund = sekundSpolu - minut * 60;
			
			var nasobice = {
				'30': 1,   // easy
				'32': 1.1, // moderate
				'34': 1.2, // hard
				'36': 1.3  // extreme
			}
			
			var score = Math.ceil(((1000 - Math.min(sekundSpolu, 1000)) / (vystrelenych * Math.max(healthLost / 10, 1)) * 100) * nasobice[_fpsLimit]);
			
			vypisFontom('you won!', 'center', 50, '55px emulogic', '00ff00');

			vypisFontom('time: ' + minut+":"+sekund, 70, 137, emulogic, 'ffffff');
			vypisFontom('fired: ' + vystrelenych + ' bombs', 70, 186, emulogic, 'ffffff');
			vypisFontom('health lost: ' + healthLost + "%", 70, 235, emulogic, 'ffffff');

			if(HighScores === false || score > HighScores[HighScores.length - 1]['score'] || HighScores.length < 5)
			{
				vypisFontom('score: ' + score + "!!!", 70, 288, emulogic, 'ffffff');
				polozky = [{'left': 132, 'right': 327, 'top': 336, 'action': "menuinit('sethiscore', "+score+");"}];
				vypisFontom('next >', 'center', 346, emulogic, '3a3a3a');
			}
			else
			{
				vypisFontom('score: ' + score, 70, 288, emulogic, 'ffffff');
				polozky = [{'left': 132, 'right': 327, 'top': 336, 'action': 'menuinit("hiscore");'}];
				vypisFontom('< back', 'center', 346, emulogic, '3a3a3a');
			}
							
			_Background.items = polozky;
			break;
	}
}

function pause(bool)
{
	if(bool && _paused !== 0) // zapauzuj
	{
		_paused = true;
		var date = new Date;
		_pausedTime = date.getTime();
		_pauseObjects = _allObjects;
		_allObjects = new Array;
		
		for(var i = 0; i < _pauseObjects.length; i++)
		{
			if(_pauseObjects[i].sounds.length)
			{
				for(var j = 0; j < _pauseObjects[i].sounds.length; j++)
				{
					if(_pauseObjects[i].sounds[j].playStart)
					{
						_pauseObjects[i].sounds[j].sound.pause();
					}
				}
			}
			if(_Background.sounds.length)
			{
				for(var j = 0; j < _Background.sounds.length; j++)
				{
					if(_Background.sounds[j].playStart)
					{
						_Background.sounds[j].sound.pause();
					}
				}
			}
		}
		
		menuinit('main');		
	}
	else if(_paused == true) // odpauzuj
	{
		menurunning = "terminate";
		_paused = false;
		
		_allObjects = _pauseObjects;
		
		var date = new Date;
		startGame = date.getTime() - (_pausedTime - startGame);
		for(var j = 0; j < _allObjects.length; j++)
		{
			for(var i = 0; i < _allObjects[j].events.length; i++)
			{
				_allObjects[j].events[i]['registered'] = date.getTime() - (_pausedTime - _allObjects[j].events[i]['registered']);
			}
		}
		
		for(var i = 0; i < _allObjects.length; i++)
		{
			unpauseSounds(_allObjects[i]);
		}
		unpauseSounds(_Background);unpauseSounds(_Flash);

		_Background.frame = 'game';
	}
}

function unpauseSounds(obj)
{
	var date = new Date;
	if(obj.sounds.length)
	{
		for(var j = 0; j < obj.sounds.length; j++)
		{
			if(obj.sounds[j].playStart)
			{
				obj.sounds[j].sound.position = date.getTime() - (_pausedTime - obj.sounds[j].playStart);
				obj.sounds[j].sound.play();
				if(_PovoleneEfekty.sound)
					obj.sounds[j].sound.unmute();
				else
					obj.sounds[j].sound.mute();
			}
		}
	}
}

function novaHra(level)
{
	if(_paused)
	{
		return 0;
	}
	
	clearInterval(mainInterval);
	mainInterval = setInterval('main();', 1000/_fpsLimit);
	
	_Background.menurunning = "none";
	stage = level;
	
	getHighScores();
		
	_allObjects = new Array;
		
	_paused = false;
	
	_Key['code'] = new Array;
	_Key['up'] = new Array;
	_Key['last'] = 0;
		
	
	_Background.frame = 'game';
	
	// lifes
	
	healthSaucer = new object('healthSaucer');
	healthSaucer.frames = {'default': {'type': 'image', 'name': 'Saucerdead.png', 'width': 13 * _posun, 'height': 10 * _posun}};
	healthSaucer.width = 13 * _posun;
	healthSaucer.height = 10 * _posun;
	healthSaucer.frame = 'default';
	healthSaucer.setY(2 * _posun);
	healthSaucer.setX(2 * _posun);
	healthSaucer.setZindex(9);
	
	vypisFontom("*"+lifes, 51, 12, emulogic, 'ffffff', 20);
	
	vypisFontom("stage "+(stage+1), _plocha_px_width - 153, 12, emulogic, 'ffffff', 20);
	
		
	player = new player_obj();

	player.setX((_plocha_px_width / 2 - (_plocha_px_width / 2) % _posun) - (player.width / 2 - ((player.width / 2) % _posun)));
	player.setY(20 * _posun) ;
	
	healthBar = new object('healthBar');
	healthBar.frames = {'default': {'type': 'rect', 'color': '00ff00', 'width': _plocha_px_width, 'height': _posun}};
	healthBar.width = _plocha_px_width;
	healthBar.height = _posun;
	healthBar.frame = 'default';
	healthBar.setY(_plocha_px_height - _posun);
	healthBar.setX(0);
	healthBar.setZindex(50);

	for(var i = 0; i < stages[stage]['tanky'].length; i++)
	{
		var typTanku;
		var tank;
		
		switch(stages[stage]['tanky'][i])
		{
			case 1: // normalny tank
				tank = new tank_obj();
				break;
			case 2: // laserovy tank
				tank = new laserTank_obj();
				break;
			default:
				alert('Error: there is no tank_type '+stages[stage]['tanky'][i]);
				_paused = 0;
				init();
		}
		
		x = ((_plocha_width / stages[stage]['tanky'].length - ((_plocha_width / stages[stage]['tanky'].length) % _posun))*i * _posun);
		tank.iShoot = stages[stage]['iShoot'][stages[stage]['tanky'][i]];
		tank.setX(x);
	}
	
	if(stage == 0)
	{
		var date = new Date;
		startGame = date.getTime();
		vystrelenych = 0;
		healthLost = 0;
	}
}