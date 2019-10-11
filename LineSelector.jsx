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
var compoundPathsGroup = activeLayer.groupItems.add();
compoundPathsGroup.name = "Compound Paths";
var othersGroup = activeLayer.groupItems.add();
othersGroup.name = "Other";
//---------------------------------------------------------------------------------------------
for (i=0;i<itemsArray.length;i++){
    if(itemsArray[i].typename === "PathItem"){
        if(itemsArray[i].pathPoints.length < 2){
            itemsArray[i].move(singlePointGroup, ElementPlacement.PLACEATEND);
            w.pbar.value += 1;
        }else if (itemsArray[i].pathPoints.length === 2){
            if(itemsArray[i].length <= itemsArray[i].strokeWidth * 10){
            itemsArray[i].move(sLineGroup, ElementPlacement.PLACEATEND);
            }else{
                itemsArray[i].move(lineGroup, ElementPlacement.PLACEATEND);
            }
            w.pbar.value += 1;
        }else if(itemsArray[i].pathPoints.length > 2 && itemsArray[i].pathPoints.length <= 3){
            itemsArray[i].move(sPathGroup, ElementPlacement.PLACEATEND);
            w.pbar.value += 1;
        }else if(itemsArray[i].pathPoints.length > 3){
            itemsArray[i].move(complexPathGroup, ElementPlacement.PLACEATEND);
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