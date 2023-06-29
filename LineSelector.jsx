//-------------------
$.writeln('\n-------------- LineSelector.jsx --------------\nSplitting items into groups...\n');
userInput();
lineSelector();
//-------------------
function lineSelector(){
	if(doSomething === true){
		//---------------------------------------------------------------------------------------------
		var doc = app.activeDocument;
		var activeLayer = doc.activeLayer;
		//---------------------------------------------------------------------------------------------
		var itemsArray = new Array ();
		var docSelected = app.activeDocument.selection;
		if (docSelected.length === 0 ){
			var docSelected = activeLayer;
		}
		if(docSelected.typename == "Layer"){
			for  (a = 0; a < docSelected.pageItems.length; a++){
				itemsArray[a] = docSelected.pageItems[a];
			}
		}else{
			itemsArray = docSelected;
		}
		//---------------------------------------------------------------------------------------------
		var w = new Window ('palette');
		w.pbar = w.add ('progressbar', undefined, 0, (itemsArray.length));
		w.pbar.preferredSize.width = 300;
		w.pbar.value = 1; 
		w.show();
		//---------------------------------------------------------------------------------------------
		//activeLayer = docSelected.pageItems[a].layer()
		var zeroXzeroGroup = activeLayer.groupItems.add();
		zeroXzeroGroup.name = "0 x 0";
		var singlePointGroup = activeLayer.groupItems.add();
		singlePointGroup.name = "Single Points";
		var sLineGroup = activeLayer.groupItems.add();
		sLineGroup.name = "Short Lines";
		var lineGroup = activeLayer.groupItems.add();
		lineGroup.name = "Lines";
		var sPathGroup = activeLayer.groupItems.add();
		sPathGroup.name = "Simple Paths";
		var complexPathGroup = activeLayer.groupItems.add();
		complexPathGroup.name = "Complex Paths";
		var vComplexPathGroup = activeLayer.groupItems.add();
		vComplexPathGroup.name = "Very Complex Paths";
		var compoundPathsGroup = activeLayer.groupItems.add();
		compoundPathsGroup.name = "Compound Paths";
		var othersGroup = activeLayer.groupItems.add();
		othersGroup.name = "Other";
		
		al = inputAnchorsL
		$.writeln(al)
		at = inputAnchorsT
		$.writeln(at)
		//---------------------------------------------------------------------------------------------
		for (i=0;i<itemsArray.length;i++){
			if(itemsArray[i].typename === "PathItem"){
				//inputXTolerance,inputYTolerance
				if (itemsArray[i].width < inputXTolerance && itemsArray[i].height < inputYTolerance){
					itemsArray[i].move(zeroXzeroGroup, ElementPlacement.PLACEATEND);
					w.pbar.value += 1;
				}else if(itemsArray[i].pathPoints.length < inputAnchorsL){
					itemsArray[i].move(singlePointGroup, ElementPlacement.PLACEATEND);
					w.pbar.value += 1;
				}else if (itemsArray[i].pathPoints.length === inputAnchorsL){
					if(itemsArray[i].length <= itemsArray[i].strokeWidth * 10){
					itemsArray[i].move(sLineGroup, ElementPlacement.PLACEATEND);
					}else{
						itemsArray[i].move(lineGroup, ElementPlacement.PLACEATEND);
					}
					w.pbar.value += 1;
				}else if(itemsArray[i].pathPoints.length > inputAnchorsL && itemsArray[i].pathPoints.length <= inputAnchorsT){
					itemsArray[i].move(sPathGroup, ElementPlacement.PLACEATEND);
					w.pbar.value += 1;
				}else if(itemsArray[i].pathPoints.length > inputAnchorsT && itemsArray[i].pathPoints.length <= 50){
					itemsArray[i].move(complexPathGroup, ElementPlacement.PLACEATEND);
					w.pbar.value += 1;
				}else if(itemsArray[i].pathPoints.length > 50){
					itemsArray[i].move(vComplexPathGroup, ElementPlacement.PLACEATEND);
					w.pbar.value += 1;
				}else{
					w.pbar.value += 1;
					continue
				}
			}else if (itemsArray[i].typename === "CompoundPathItem"){
				itemsArray[i].move(compoundPathsGroup, ElementPlacement.PLACEATEND);
				w.pbar.value += 1;
			}else{
				itemsArray[i].move(othersGroup, ElementPlacement.PLACEATEND);
				w.pbar.value += 1;
			}
		}
		//---------------------------------------------------------------------------------------------
		w.hide();
		//---------------------------------------------------------------------------------------------
	}
}
$.writeln('-----------------------------------------------------------------------');
//----------------------------------------------------

//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"LineSelector");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will group items by type');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	toleranceGroup = mainGroup.add ('group');
	toleranceGroup.orientation = 'row'
		toleranceStatic = toleranceGroup.add ("statictext", undefined, '0 x 0 size:');
		toleranceXInput = toleranceGroup.add ("edittext", ([undefined,undefined,50,21]),1e-3);
		percentStatic = toleranceGroup.add ("statictext", undefined, 'x');
		toleranceYInput = toleranceGroup.add ("edittext", ([undefined,undefined,50,21]),1e-3);
	units = 72/25.4
	inputXTolerance = (parseFloat(toleranceXInput.text))
	inputYTolerance = (parseFloat(toleranceYInput.text))
	$.writeln(inputXTolerance + ' ' + inputYTolerance)
	//----------------------------------------------------
	divider2 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	anchorCountGroup = mainGroup.add ('group');
	anchorCountGroup.orientation = 'row'
		anchorCountStatic = anchorCountGroup.add ("statictext", undefined, 'Anchor range:');
		inputAnchorsLInput = anchorCountGroup.add ("edittext", ([undefined,undefined,50,21]),2);
		rangeStatic = anchorCountGroup.add ("statictext", undefined, '-');
		inputAnchorsTInput = anchorCountGroup.add ("edittext", ([undefined,undefined,50,21]),10);
	//----------------------------------------------------
	divider3 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	inputAnchorsL = (parseFloat(inputAnchorsLInput.text))
	inputAnchorsT = (parseFloat(inputAnchorsTInput.text))
	return doSomething,inputXTolerance,inputYTolerance,inputAnchorsL,inputAnchorsT;
}
/*
//---------------------------------------------------------------------------------------------
var doc = app.activeDocument;
var activeLayer = doc.activeLayer;
//---------------------------------------------------------------------------------------------
var itemsArray = new Array ();
var docSelected = app.activeDocument.selection;
if (docSelected.length === 0 ){
    var docSelected = activeLayer;
}
if(docSelected.typename == "Layer"){
    for  (a = 0; a < docSelected.pageItems.length; a++){
        itemsArray[a] = docSelected.pageItems[a];
    }
}else{
    itemsArray = docSelected;
}
//---------------------------------------------------------------------------------------------
var w = new Window ('palette');
w.pbar = w.add ('progressbar', undefined, 0, (itemsArray.length));
w.pbar.preferredSize.width = 300;
w.pbar.value = 1; 
w.show();
//---------------------------------------------------------------------------------------------
var zeroXzeroGroup = activeLayer.groupItems.add();
zeroXzeroGroup.name = "0 x 0";
var singlePointGroup = activeLayer.groupItems.add();
singlePointGroup.name = "Single Points";
var sLineGroup = activeLayer.groupItems.add();
sLineGroup.name = "Short Lines";
var lineGroup = activeLayer.groupItems.add();
lineGroup.name = "Lines";
var sPathGroup = activeLayer.groupItems.add();
sPathGroup.name = "Simple Paths";
var complexPathGroup = activeLayer.groupItems.add();
complexPathGroup.name = "Complex Paths";
var vComplexPathGroup = activeLayer.groupItems.add();
vComplexPathGroup.name = "Very Complex Paths";
var compoundPathsGroup = activeLayer.groupItems.add();
compoundPathsGroup.name = "Compound Paths";
var othersGroup = activeLayer.groupItems.add();
othersGroup.name = "Other";
//---------------------------------------------------------------------------------------------
for (i=0;i<itemsArray.length;i++){
    if(itemsArray[i].typename === "PathItem"){
		if (itemsArray[i].width < 1e-3 && itemsArray[i].height < 1e-3){
            itemsArray[i].move(zeroXzeroGroup, ElementPlacement.PLACEATEND);
            w.pbar.value += 1;
		}else if(itemsArray[i].pathPoints.length < 2){
            itemsArray[i].move(singlePointGroup, ElementPlacement.PLACEATEND);
            w.pbar.value += 1;
        }else if (itemsArray[i].pathPoints.length === 2){
            if(itemsArray[i].length <= itemsArray[i].strokeWidth * 10){
            itemsArray[i].move(sLineGroup, ElementPlacement.PLACEATEND);
            }else{
                itemsArray[i].move(lineGroup, ElementPlacement.PLACEATEND);
            }
            w.pbar.value += 1;
        }else if(itemsArray[i].pathPoints.length > 2 && itemsArray[i].pathPoints.length <= 10){
            itemsArray[i].move(sPathGroup, ElementPlacement.PLACEATEND);
            w.pbar.value += 1;
        }else if(itemsArray[i].pathPoints.length > 10 && itemsArray[i].pathPoints.length <= 50){
            itemsArray[i].move(complexPathGroup, ElementPlacement.PLACEATEND);
            w.pbar.value += 1;
        }else if(itemsArray[i].pathPoints.length > 50){
            itemsArray[i].move(vComplexPathGroup, ElementPlacement.PLACEATEND);
            w.pbar.value += 1;
        }else{
            w.pbar.value += 1;
            continue
        }
    }else if (itemsArray[i].typename === "CompoundPathItem"){
        itemsArray[i].move(compoundPathsGroup, ElementPlacement.PLACEATEND);
        w.pbar.value += 1;
    }else{
        itemsArray[i].move(othersGroup, ElementPlacement.PLACEATEND);
        w.pbar.value += 1;
    }
}
//---------------------------------------------------------------------------------------------
w.hide();
//---------------------------------------------------------------------------------------------
*/