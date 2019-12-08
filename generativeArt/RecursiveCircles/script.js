var rotSpeedMult = 1.5;
var fluxSpeedMult = 4;
var renderLvl = 1;

function dist(x1, y1, x2, y2){
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.sqrt(dx*dx + dy*dy);
}

function RandColor(varienceMagnitude){

	this.fields = [0,0,0];		
	this.varienceMagnitude = varienceMagnitude;

	this.generate = function(){
		for(var i = 0; i < 3; i++){
			this.fields[i] = Math.floor(Math.random()*150);
		}
		/*var varience = Math.round(Math.random() * 15);
		this.fields[0] = 8 + varience;
		this.fields[1] = 18 + varience;
		this.fields[2] = 39 + varience;*/
	}

	this.getNewFlavor = function(){
		var tmp = new RandColor(this.varienceMagnitude);
		for(var i = 0; i < 3; i++){
			tmp.fields[i] = this.fields[i];
		}
		tmp.newFlavor();
		return tmp;
	}

	this.newFlavor = function(){
		for(var i = 0; i < 3; i++){
			this.fields[i] += Math.round(Math.random() * this.varienceMagnitude/* - this.varienceMagnitude/2*/);
			if(this.fields[i] > 255){
				this.fields[i] = 255;
			}
			if(this.fields[i] < 0){
				this.fields[i] = 0;
			}
		}	
	}
}

function RecursiveCircle(size, color, iterations, branchingFactor){
	if(iterations === 0){
		return;
	}
	this.r = color.fields[0];
	this.g = color.fields[1];
	this.b = color.fields[2];
	this.size = size;
	this.innerAngle = Math.random() * Math.PI;
	this.iterLevel = iterations;

	//this.fluxMagnitude = this.size * 0.1;
	this.fluxMagnitude = 20;
	this.fluxIncriment = Math.PI/100
	this.fluxNumber = Math.random() * Math.PI * 2;
	this.fluxMultiplier;
	this.drawSize;
	
	this.children = [];
	if(iterations > 1)
	{
		for(var i = 0; i < branchingFactor; i++){
			this.children.push(new RecursiveCircle(/*size/4 + (size/4) * Math.random()*/ size/2, color.getNewFlavor(), iterations-1, branchingFactor));
		}
	}

	this.update = function(x, y){
		this.x = x;
		this.y = y;
		this.innerAngle += (((this.iterLevel % 2) * 2 - 1) * Math.PI / 1000) * rotSpeedMult;
		var angleOffset = 0

		// update flux
		this.fluxNumber += this.fluxIncriment * fluxSpeedMult;
		this.fluxMultiplier = Math.sin(this.fluxNumber);
		this.drawSize = this.fluxMultiplier * this.fluxMagnitude + this.size;

		for(child of this.children){
			//console.log("ran");
			child.update(x + (Math.cos(this.innerAngle + angleOffset) * (this.size/2 - child.size/2)), y + (Math.sin(this.innerAngle + angleOffset) * (this.size/2 - child.size/2)));
			angleOffset += 2*Math.PI/branchingFactor;
		}
	}

	this.manualDraw = function(){
		fill(this.r, this.g, this.b);
		noStroke();
		if(this.iterLevel <= renderLvl)
			ellipse(this.x, this.y, this.drawSize, this.drawSize);
		for(child of this.children){
			child.manualDraw();
		}
	}

	this.rootCheckCollision = function(colX, colY){
		if(dist(colX, colY, this.x, this.y) > this.drawSize/2){
			return false;
		}
		if(this.children.length > 0){
			for(var i = branchingFactor-1; i >= 0; i--){
				if(this.children[i].rootCheckCollision(colX, colY)) return true;
			}
		}
		this.r = 255;
		this.g = 255;
		this.b = 255;
		return true;
	}

	this.updateColor = function(color){
		this.r = color.fields[0];
		this.g = color.fields[1];
		this.b = color.fields[2];
		for(child of this.children){
			child.updateColor(color.getNewFlavor());
		}
	}

	/*this.rootDraw = function(x, y){
		var queue = [];
		var qlen = 0;
		for(child of this.children){
			queue.push(child);
			qlen++;
		}
		while(qlen > 0){
			var i = qlen;
			for(i; i > 0; i--){
				for(child of queue[0].children){
					queue.push(child);
					qlen++;
				}
				queue[0].drawMe();
				queue.shift();
				qlen--;
			}
		}
	}*/
}

var rootCircle;

function setup() {
	createCanvas(800, 800);
	var rootColor = new RandColor(30);
	//rootColor.generate();
	rootCircle = new RecursiveCircle(width, rootColor, 6, 4);
	rootCircle.update(width/2, height/2);
	rootCircle.manualDraw();
}

function draw() {
	//background(255, 255, 255);
	rootCircle.update(width/2, height/2);
	rootCircle.manualDraw();
}

function mousePressed() {
	rootCircle.rootCheckCollision(mouseX, mouseY);
}


function rotSpeedSliderEvent(){
	rotSpeedMult = document.getElementById("rotSpeedSlider").value;
}

function fluxSpeedSliderEvent(){
	fluxSpeedMult = document.getElementById("fluxSpeedSlider").value;
}

function renderLvlSliderEvent(){
	background(255, 255, 255);
	renderLvl = document.getElementById("renderLvlSlider").value;
}

function updateRootColor(){
	var newColor = document.getElementById("rootColorPicker").value;
	var newR = parseInt(newColor.substring(1, 3), 16);
	var newG = parseInt(newColor.substring(3, 5), 16);
	var newB = parseInt(newColor.substring(5, 7), 16);
	var newRootColor = new RandColor(30);
	newRootColor.fields = [newR, newG, newB];
	console.log(rootCircle);
	rootCircle.updateColor(newRootColor);
	background(255, 255, 255);
}