function NoisePoint(point){
	this.x = point[0] + 400 * (Math.random()-0.5);
	this.y = point[1] + 400 * (Math.random()-0.5);
	this.seed = Math.random() * 50;
	this.offsetMag = Math.random() * 60;
	this.seedUpdate = 0.1 + 0.3*Math.random();
	this.update = function(){
		this.x += (noise(this.seed)-0.5) * this.offsetMag;
		this.y += (noise(this.seed+4.5)-0.5)* this.offsetMag;
		this.seed += 0.1;
	}
}

function NoiseShape(pointList, ctrlPointList){
	this.points = [];
	this.ctrlPoints = [];
	this.color = [0, 0, 0];
	this.rInc = Math.random()*6;
	this.gInc = Math.random()*6;
	this.bInc = Math.random()*6;
	
	for(point of pointList){
		this.points.push(new NoisePoint(point));
	}
	for(point of ctrlPointList){
		this.ctrlPoints.push(new NoisePoint(point));
	}
	this.drawShape = function(){
		for(var i = 0; i < this.points.length; i++){
			this.points[i].update();
			this.ctrlPoints[i].update();
		}
		stroke(this.color[0], this.color[1], this.color[2]);
		this.drawCurve(0,1);
		this.drawCurve(1,2);
		this.drawCurve(2,3);
		this.drawCurve(3,0);
		this.color[0] += this.rInc;
		this.color[1] += this.gInc;
		this.color[2] += this.bInc;
	}
	this.drawCurve = function(index1, index2){
		bezier(this.points[index1].x, this.points[index1].y,
			   this.ctrlPoints[index1].x, this.ctrlPoints[index1].y,
			   this.ctrlPoints[index2].x, this.ctrlPoints[index2].y,
			   this.points[index2].x, this.points[index2].y);
		/*bezier(this.points[index1].x, this.points[index1].y,
			   this.points[index2].x, this.points[index2].y,
			   this.points[index1].x, this.points[index1].y,
			   this.points[index2].x, this.points[index2].y);*/
	}
}

function newShape(){
	var offset = width/4;
	var offset2 = width-offset;
	return new NoiseShape([[offset,offset], [offset2,offset], [offset2,offset2], [offset, offset2]],
						  [[offset,offset], [offset2,offset], [offset2,offset2], [offset, offset2]]);
}

function setup() {
	noFill();
	createCanvas(800, 800);
	background(0,0,0);
	strokeWeight(1);
	var numShapes = 1;
	var shapes = [];
	for(var i = 0; i < numShapes; i++){
		shapes.push(newShape());
	}
	
	for(var i = 0; i < 200; i++){
		for(shape of shapes){
			shape.drawShape();
		}
	}
}

function draw() {

}
