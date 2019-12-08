function LSystem(){
	this.ruleset = [["A", "AEA<BA><CAA>"], ["B", "B<BA>"], ["C", "C"], ["NULL", "NULL"]];
	this.axium = "A";
	this.applyRules = function(){
		var newAxium = "";
		for(var i = 0; i < this.axium.length; i++){
			for(rule of this.ruleset){
				if(rule[0] === "NULL"){
					newAxium += this.axium.charAt(i);
					break;
				}
				if(rule[0] === this.axium.substring(i, i+rule[0].length)){
					newAxium += rule[1];
					i += rule[0].length-1;
					break;
				}
			}
		}
		this.axium = newAxium;
	}

	this.drawSystem = function(){
		stroke(100,255,100, 50);
		push();
		translate(width/3, height);
		for(char of this.axium){
			if(char==="A"){
				var base = -3+Math.random()*-3;
				line(0, 0, 0, base-8);
				translate(0, base);
			}
			else if(char==="B"){
				rotate(Math.random() * PI/10);
			}
			else if(char==="C"){
				rotate(Math.random()*-PI/4);
			}
			else if(char==="D"){
				translate(0, 20);
			}
			else if(char ==="E"){
				rotate(PI/300);
			}
			else if(char==="<"){
				push();
			}
			else if(char===">"){
				pop();
			}
		}
		pop();
	}
}

function setup() {
	noFill();
	createCanvas(800, 800);
	background(0,0,0);
	var l = new LSystem();
	var numApplies = 6;
	for(var i = 0; i < numApplies; i++){
		l.applyRules();
	}
	l.drawSystem();
	console.log(l.axium);
}

function draw() {

}
