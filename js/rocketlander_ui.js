'use strict';

var CC = {};

CC.canvas = document.getElementById('cas');
CC.context = CC.canvas.getContext('2d');

(function(){
	var $canvas = $('#cas');
	function resizeCanvas() {
		CC.canvas.width = $canvas.width();
		CC.canvas.height = $canvas.height();
	}
	$( window ).resize(resizeCanvas);
	resizeCanvas();
})();


(function(){
	var runSimulation = false;
	CC.pause = function () {
		runSimulation = false;
	};
	CC.play = function () {
		runSimulation = true;
	};
	CC.running = function(){return runSimulation;};
})();


CC.gameLoop = (function() {
	if(this.running()) {
		try {  this.rocket = this.rocket.simulate (0.02, function(){return{throttle:CC.inputUp,gimbalAngle:CC.inputLeft};}); }
		catch(e) {
			this.pause();
			alert(e);
		}
	}
	this.rocket.draw(this.context,this.canvas);

	if(this.rocket.detectCollision()) CC.pause();
	
	if(this.running()) requestAnimationFrame(this.gameLoop);
	else setTimeout( function() {requestAnimationFrame(CC.gameLoop);}, 200);
}).bind(CC);



var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;




shortcut.add("P",function() {if(CC.running())CC.pause();else CC.play();}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("enter",function() {CC.resetRocket();CC.play();}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("left",function() {CC.inputLeft=1;}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("left",function() {CC.inputLeft=0;}, {'type':'keyup','propagate':true,'target':document});
shortcut.add("right",function() {CC.inputLeft=-1;}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("right",function() {CC.inputLeft=0;}, {'type':'keyup','propagate':true,'target':document});
shortcut.add("up",function() {CC.inputUp=1;}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("up",function() {CC.inputUp=0;}, {'type':'keyup','propagate':true,'target':document});


CC.resetRocket = function(){	
	this.rocket = new Models.RocketLanding({TWR: 2,theta: rand0(),dtheta: rand0(),Length: 40,Width: 5,x: 200*rand0(),dx: 0,y: 300+100*rand0(),dy: 40*rand0()});
};

function rand0(){return Math.random()*2-1;}

CC.inputLeft=0;
CC.inputUp=0;
CC.play();
CC.resetRocket();
CC.gameLoop();
