//-----------------------------------------------------
initialConstants()
userInput()
if(doSomething===true){
	if(quadSides === [0,0,0,0]){
		//do nothing
	}else{
		makeQuad(quadSides)
	}
}else{
	//do nothing
}
//-----------------------------------------------------
function makeQuad(sides){
	newQuad = app.activeDocument.activeLayer.pathItems.add();
	//-----------------------------------------------------
	qA = [0,0]
	qB = [sides[0]*units,0]
	qCA = 180-(quadrilateralAngles(sides)[0])
	qCX = qB[0] + p2cX(sides[1]*units,qCA)
	qCY = qB[1] - p2cY(sides[1]*units,qCA)
	qC = [qCX,qCY]
	qDA = -(quadrilateralAngles(sides)[3])
	qDX = p2cX(sides[3]*units,qDA)
	qDY = p2cY(sides[3]*units,qDA)
	qD = [qDX,qDY]
	//-----------------------------------------------------
	newQuad.setEntirePath([
									qA,
									qB,
									qC,
									qD
									]);
	//-----------------------------------------------------
	newQuad.closed = true;
	newQuad.filled = false;
	newQuad.stroked = true;
	newQuad.strokeColor = customColour(0,0,0,100);
	newQuad.strokeWidth = 5 * units
}
//-----------------------------------------------------
function userInput(){
	doSomething = false;
	//-----------------------------------------------------
	var gui = new Window ("dialog","Quadrilateral Polygon Generator")
	gui.alignChildren = "fill"
	//-----------------------------------------------------
	var infoPanel = gui.add("panel",undefined,'', {borderStyle:"white"});
	infoPanel.orientation = "column";
	infoPanel.alignChildren = "left";
	info0 = infoPanel.add("statictext", undefined,'Quadrilateral Polygon Generator.');
	info1 = infoPanel.add("statictext", undefined,'If displayed angles are equal to 0.00°,');
	info2 = infoPanel.add("statictext", undefined,'side lenghts are irrational and');
	info3 = infoPanel.add("statictext", undefined,'polygon will not be created.');
	//-----------------------------------------------------
	var inputPanel = gui.add("panel",undefined,'', {borderStyle:"white"});
	inputPanel.orientation = "column"
	inputPanel.alignChildren = "center"
	//-----------------------------------------------------
	topRow = inputPanel.add('group');
	topRow.orientation = "row"
	topRow.alignChildren = "fill"
		cornerD = topRow.add("statictext", [undefined,undefined,50,23],cornerDVar);
		cornerD.justify = 'left';
		sideA=topRow.add("edittext", [undefined,undefined,50,23],'1440')
		sideA.justify = 'ceter';
		cornerA = topRow.add("statictext", [undefined,undefined,50,23],cornerAVar);
		cornerA.justify = 'right';
	//-----------------------------------------------------
	middleRow = inputPanel.add('group');
	middleRow.orientation = "row"
	middleRow.alignChildren = "fill"
		sideD=middleRow.add("edittext", [undefined,undefined,50,23],'700')
		middleStatic = middleRow.add("statictext", [undefined,undefined,50,23],'*mm');middleStatic.justify = 'center'
		sideB=middleRow.add("edittext", [undefined,undefined,50,23],'440')
	//-----------------------------------------------------
	bottomRow = inputPanel.add('group');
	bottomRow.orientation = "row"
	bottomRow.alignChildren = "fill"
		cornerC = bottomRow.add("statictext", [undefined,undefined,50,23],cornerCVar);
		cornerC.justify = 'left';
		sideC=bottomRow.add("edittext", [undefined,undefined,50,23],'830')
		cornerB = bottomRow.add("statictext", [undefined,undefined,50,23],cornerBVar);
		cornerB.justify = 'right';
	//-----------------------------------------------------
	var middlePanel = gui.add("panel",undefined,'', {borderStyle:"white"});
	middlePanelGroup = middlePanel.add('group');
	middlePanelGroup.orientation = "row"
	middlePanelGroup.alignChildren = "center"
	scaleInfo = middlePanelGroup.add ("statictext", undefined, 'Scale 1:');
	scaleInput = middlePanelGroup.add ("edittext", ([undefined,undefined,50,21]), 10);
	//-----------------------------------------------------
	var bottomPanel = gui.add("panel",undefined,'', {borderStyle:"white"});
	bottomPanel.orientation = "row"
	bottomPanel.alignChildren = "center"
	//-----------------------------------------------------
	var updateValues = bottomPanel.add ("button", undefined, "Update");
	updateValues.onClick = function () {
		quadSides = quadrilateralAngles([parseFloat(sideA.text),parseFloat(sideB.text),parseFloat(sideC.text),parseFloat(sideD.text)])
		cornerA.text = (quadSides[0]).toFixed(2) + '°'
		cornerB.text = (quadSides[1]).toFixed(2) + '°'
		cornerC.text = (quadSides[2]).toFixed(2) + '°'
		cornerD.text = (quadSides[3]).toFixed(2) + '°'
	}
	var generateButton = bottomPanel.add ("button", undefined, "Generate");
	generateButton.onClick = function (){
		doSomething = true;
		gui.close();
	}
	//-----------------------------------------------------
	gui.show();
	quadSides = [parseFloat(sideA.text),parseFloat(sideB.text),parseFloat(sideC.text),parseFloat(sideD.text)];
	units = (72/25.4) * (1/(parseFloat(scaleInput.text)))
	//-----------------------------------------------------
	return doSomething, quadSides,units;
}
//-----------------------------------------------------
function initialConstants(){
	cornerAVar = '63.38°'
	cornerBVar = '127.74°'
	cornerCVar = '116.62°'
	cornerDVar = '52.26°'
	//scale = 1/1
	//units = (72/25.4)*scale
}
//-----------------------------------------------------
function quadrilateralAngles(array){
	//-----------------------------------------------------
	a = array[0]*units
	b = array[1]*units
	c = array[2]*units
	d = array[3]*units
	//-----------------------------------------------------
	ab = a*b
	ac = a*c
	ad = a*d
	bd = b*d
	bc = b*c
	bd = b*d
	cd = c*d
	//-----------------------------------------------------
	p1 = (ab+cd)*(ac+bd)
	p2 = ad+bc
	//-----------------------------------------------------
	q1 = (ac+bd)*(ad+bc)
	q2 = ab+cd
	//-----------------------------------------------------
	p = Math.sqrt(p1/p2)
	q = Math.sqrt(q1/q2)
	//-----------------------------------------------------
	aRadian = (Math.pow(b,2) + Math.pow(a,2) - Math.pow(q,2)) / (2*b*a)
	bRadian = (Math.pow(c,2) + Math.pow(b,2) - Math.pow(p,2)) / (2*c*b)
	cRadian = (Math.pow(d,2) + Math.pow(c,2) - Math.pow(q,2)) / (2*d*c)
	dRadian = (Math.pow(a,2) + Math.pow(d,2) - Math.pow(p,2)) / (2*a*d)
	//-----------------------------------------------------
	if(aRadian > 1 || bRadian > 1 || cRadian > 1 || dRadian > 1){
		aCorner = 0
		bCorner = 0
		cCorner = 0
		dCorner = 0
	}else{
		aCorner = degrees(Math.acos(aRadian))
		bCorner = degrees(Math.acos(bRadian))
		cCorner = degrees(Math.acos(cRadian))
		dCorner = degrees(Math.acos(dRadian))
	}
	//-----------------------------------------------------
	quadAngles = [aCorner,bCorner,cCorner,dCorner]
	//-----------------------------------------------------
	return quadAngles
}
/*
function quadrilateralAngles(array){
	//-----------------------------------------------------
	a = array[0]*units
	b = array[1]*units
	c = array[2]*units
	d = array[3]*units
	//-----------------------------------------------------
	ab = a*b
	ac = a*c
	ad = a*d
	bd = b*d
	bc = b*c
	bd = b*d
	cd = c*d
	//-----------------------------------------------------
	p1 = (ab+cd)*(ac+bd)
	p2 = ad+bc
	//-----------------------------------------------------
	q1 = (ac+bd)*(ad+bc)
	q2 = ab+cd
	//-----------------------------------------------------
	p = Math.sqrt(p1/p2)
	q = Math.sqrt(q1/q2)
	//-----------------------------------------------------
	aCorner = degrees(Math.acos((Math.pow(b,2) + Math.pow(a,2) - Math.pow(q,2)) / (2*b*a)))
	bCorner = degrees(Math.acos((Math.pow(c,2) + Math.pow(b,2) - Math.pow(p,2)) / (2*c*b)))
	cCorner = degrees(Math.acos((Math.pow(d,2) + Math.pow(c,2) - Math.pow(q,2)) / (2*d*c)))
	dCorner = degrees(Math.acos((Math.pow(a,2) + Math.pow(d,2) - Math.pow(p,2)) / (2*a*d)))
	//-----------------------------------------------------
	quadAngles = [aCorner,bCorner,cCorner,dCorner]
	//-----------------------------------------------------
	return quadAngles
}
*/
//-----------------------------------------------------
function degrees(x){
	return x * 180 / Math.PI 
}
//-----------------------------------------------------
function radians(x){	
	return x * (Math.PI / 180);
}
//-----------------------------------------------------
function p2cX(length,angle){ //polar to cartesian
	return length * Math.cos(radians(angle))
}
//-----------------------------------------------------
function p2cY(length,angle){ //polar to cartesian
	return length * Math.sin(radians(angle));
}
//-----------------------------------------------------
function c2pL(x,y){ //cartesian to polar
	return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}
//-----------------------------------------------------
function c2pA(x,y){ //cartesian to polar
	return degrees(Math.atan(y/x));
}
//-----------------------------------------------------
function customColour(c,m,y,k){
	var customCMYK = new CMYKColor();
	customCMYK.cyan = cmykValue(c);
	customCMYK.magenta = cmykValue(m);
	customCMYK.yellow = cmykValue(y);
	customCMYK.black = cmykValue(k);
	return customCMYK;
}
//-----------------------------------------------------
function cmykValue(v){
	if (v < 0){
		v = 0;
	}
	if (v>100){
		v=100;
	}
	return v;
}