////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Created by Piotr Lalak. 08th July 2017. V1.13
    
    Item measurement tool.
    By running the script, and providing working scale, script marks all the dimensions of every item in the graphics layer.
    If its a box/rectangle, group or compound path item, it will measure geometry boundries.
    Additionally any two-point lines will be measured as well. to provide quick tool to measure gaps and distances.
    
    */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var doc = app.activeDocument;
var activeArtboards = doc.artboards;
var docIntLayers = doc.layers.length;//initial layers
var charStyle = doc.characterStyles.removeAll();
var paraStyle = doc.paragraphStyles.removeAll();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//User Input
var userInput = userInputFunction ();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (createDimensionsLayer === true){
    for (i=0;i<docIntLayers;i++){
        var docLayer = doc.layers[i];    
        if (docLayer.name === "Dimensions"){
        break;
        }else{
        dimensionsLayer = doc.layers.add();
        dimensionsLayer.name = "Dimensions";
        break;
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//var dimensionsLayer = doc.layers["Dimensions"]; //determined in the loop below
var units = 72/25.4;
var paperSizeA4 = 297 * units;
var paperSizeA3 = 420 * units;
var orientation;
var activeArtboardRect3 = activeArtboards[0].artboardRect[2];
var activeArtboardRect4 = -activeArtboards[0].artboardRect[3];
var decimalPointFactor = parseInt(decimalPointInput);
var reversedDimVertical = true; //false default
var reversedDimHorizontal = true; //false default
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Finds dimensions & graphics layer. If dimensions layer doesn exists, it creates one. If graphics layer doesnt exists, layer with selected artwork is graphics layer.
var docLayers = doc.layers.length;
for (i=0;i<docLayers;i++){
    var docLayer = doc.layers[i];    
    if (docLayer.name === "Graphics"){
            var graphicsLayer = doc.layers[i];
            break;
    }else{
            if (docLayer.hasSelectedArtwork == true){
            var graphicsLayer = doc.layers[i];
            break;
            }else{
                    if (docLayers === 1){
                        var graphicsLayer = doc.layers[0];
                        }else{
                            var dimensionsLayer = doc.activeLayer;
                            }
                }
}
}

for (i=0;i<docLayers;i++){
    var docLayer = doc.layers[i];    
    if (docLayer.name === "Dimensions"){
            var dimensionsLayer = doc.layers[i];
            break;
    }else{
            var dimensionsLayer = doc.activeLayer;
            }
}

if (dimensionsLayer.locked == true || dimensionsLayer.visible == false){
    dimensionsLayer.locked = false;
    dimensionsLayer.visible = true;
    }

if (graphicsLayer.locked == true || graphicsLayer.visible == false){
    graphicsLayer.locked = false;
    graphicsLayer.visible = true;
    }
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var amoutOfDims = 0;
var alphabet = "ABCEDFGHIJKLMNOPQRSTUVWXYZ";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Input scales and units
var scale = 1 / (parseFloat(scaleInput));//1/10; // 1:10 scale
var dimTriangleLength = (parseFloat(dimTriangleLengthInput)) * units; //5x2.5mm triangle regardless of working scale
//var scale = 1/10;
var workingFactor = scale*units; //multiply anysize to work in scale in millimeters
var dimTriangleHeight = dimTriangleLength / 4;
var dimTriangleLVectorDeg = 270+(Math.atan(dimTriangleLength/dimTriangleHeight) * 180) / Math.PI; //triangle angle
var dimTriangleLVectorRad = dimTriangleLVectorDeg * Math.PI / 180;
var dimTriangleRVectorDeg = 90+(Math.atan(dimTriangleLength/dimTriangleHeight) * 180) / Math.PI; //triangle angle
var dimTriangleRVectorRad = dimTriangleRVectorDeg * Math.PI / 180;
var dimTriangleLSLength =  Math.sqrt((dimTriangleLength*dimTriangleLength) +(dimTriangleHeight*dimTriangleHeight));
var dimStrokeWidth = dimTriangleLength * 0.1;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//if ()
//Dimensions Colours
dimensionsGrey = new CMYKColor();
dimensionsGrey.cyan = parseFloat (C1);
dimensionsGrey.magenta = parseFloat (M1);
dimensionsGrey.yellow = parseFloat (Y1);
dimensionsGrey.black = parseFloat (K1);
//--------------------------------------------------------
dimensionsBlack = new CMYKColor();
dimensionsBlack.cyan = parseFloat (C2);
dimensionsBlack.magenta = parseFloat (M2);
dimensionsBlack.yellow = parseFloat (Y2);
dimensionsBlack.black = parseFloat (K2);

//Dimensions Character Style
var dimCharStyle = doc.characterStyles.add("Dimensions");
var dimParaStyle = doc.paragraphStyles.add("Dimensions"); 
var dimCharAttr = dimCharStyle.characterAttributes;
dimCharAttr.size = (dimTriangleLength / units)*6;
dimCharAttr.tracking = 0;
dimCharAttr.capitalization = FontCapsOption.NORMALCAPS;
//dimCharAttr.wariChuEnabled = true;
//dimCharAttr.wariChuJustification = WariChuJustificationType.Right;
//dimCharAttr.alignment = StyleRunAlignmentType.bottom;
dimCharAttr.fillColor = dimensionsBlack;
var dimParaAttr = dimParaStyle.paragraphAttributes;
dimParaAttr.justification = Justification.CENTER;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Main Program Function
var docSelected = app.activeDocument.selection;
// ---------------------------------------------------------------------------------------------------------------------------    
if (docSelected.length === 0 ){
    var docSelected = graphicsLayer.pageItems;
}
var breakCounter = 0;
var numberOfItems = graphicsLayer.pageItems.length;
// ---------------------------------------------------------------------------------------------------------------------------    
    for (i=0;i<docSelected.length;i++){ //STANDARD LOOP
// ---------------------------------------------------------------------------------------------------------------------------    
            if(docSelected[i].typename === "TextFrame"){
                var looseTextFrameItem = docSelected[i];
                var looseTextFrameParent = docSelected[i].parent;
                var selectedTextFrameGroup = looseTextFrameParent.groupItems.add();
                selectedTextFrameGroup.name = "Text";
                looseTextFrameItem.move(selectedTextFrameGroup, ElementPlacement.PLACEATBEGINNING);
     
                var boundsArray = [];       
                boundsArray = selectedTextFrameGroup.geometricBounds;
                
                var artB1 = boundsArray[0]; //Left of the path
                var artB2 = boundsArray[1]; //Top of the path
                var artB3 = boundsArray[2]; //Right of the path
                var artB4 = boundsArray[3]; //Bottom of the path  
                dimensionLineStandard(artB1,artB2,artB3,artB2);
                dimensionLineStandard(artB3,artB4,artB3,artB2);   
            }
// ---------------------------------------------------------------------------------------------------------------------------    
            if(docSelected[i].typename === "PathItem"){
                if(docSelected[i].pathPoints.length <= 2){
                        //two points line 
                        var p0X = docSelected[i].pathPoints[0].anchor[0];
                        var p0Y = docSelected[i].pathPoints[0].anchor[1];
                        var p1X = docSelected[i].pathPoints[1].anchor[0];
                        var p1Y = docSelected[i].pathPoints[1].anchor[1];   
                        // ---------------------------------------------------------------------------------------------------------------------------    
                       if (p1X > p0X){
                            dimensionLineStandard(p0X,p0Y,p1X,p1Y);   
                            }else{
                            dimensionLineStandard(p1X,p1Y,p0X,p0Y);           
                            }
                        }else{
                        graphicsPathItem = docSelected[i];
                        
                        var boundsArray = [];       
                        boundsArray = docSelected[i].geometricBounds;
                        
                        var artB1 = boundsArray[0]; //Left of the path
                        var artB2 = boundsArray[1]; //Top of the path
                        var artB3 = boundsArray[2]; //Right of the path
                        var artB4 = boundsArray[3]; //Bottom of the path  
                        
                        dimensionLineStandard(artB1,artB2,artB3,artB2);
                        dimensionLineStandard(artB3,artB4,artB3,artB2);  
                        }
                }
// ---------------------------------------------------------------------------------------------------------------------------    
             if(docSelected[i].typename === "PlacedItem"){
                linkedItem =docSelected[i];
                
                var boundsArray = [];       
                boundsArray = docSelected[i].geometricBounds;
                
                var artB1 = boundsArray[0]; //Left of the path
                var artB2 = boundsArray[1]; //Top of the path
                var artB3 = boundsArray[2]; //Right of the path
                var artB4 = boundsArray[3]; //Bottom of the path  
                
                if (linksSizeName === true){
                    var linkURL = linkedItem.file; 
                    linkedFileName(artB1,artB2,artB3,artB4,linkURL);        
                    }else{                
                    dimensionLineStandard(artB1,artB2,artB3,artB2);
                    dimensionLineStandard(artB3,artB4,artB3,artB2);        
                    var linkURL = linkedItem.file; 
                    linkedFileName(artB1,artB2,artB3,artB4,linkURL);        
                }
            }
// ---------------------------------------------------------------------------------------------------------------------------    
             if(docSelected[i].typename === "GroupItem"){
                if(docSelected[i].clipped === false){
                var boundsArray = [];       
                boundsArray = docSelected[i].geometricBounds;
                var artB1 = boundsArray[0]; //Left of the path
                var artB2 = boundsArray[1]; //Top of the path
                var artB3 = boundsArray[2]; //Right of the path
                var artB4 = boundsArray[3]; //Bottom of the path  
                dimensionLineStandard(artB1,artB2,artB3,artB2);
                dimensionLineStandard(artB3,artB4,artB3,artB2);   
                }
                }
// ---------------------------------------------------------------------------------------------------------------------------    
             if(docSelected[i].typename === "CompoundPathItem"){
                graphicsCompoundPathItem =docSelected[i];
                
                var boundsArray = [];       
                boundsArray = docSelected[i].geometricBounds;
                
                var artB1 = boundsArray[0]; //Left of the path
                var artB2 = boundsArray[1]; //Top of the path
                var artB3 = boundsArray[2]; //Right of the path
                var artB4 = boundsArray[3]; //Bottom of the path  
                dimensionLineStandard(artB1,artB2,artB3,artB2);
                dimensionLineStandard(artB3,artB4,artB3,artB2);   
                }
// ---------------------------------------------------------------------------------------------------------------------------    
                if(docSelected[i].clipped === true){
                    var clipGroup = docSelected[i];
                    var clipGroupLength = clipGroup.pathItems.length;
                    if (clipGroupLength>0){
                    for(ii=0;ii<clipGroupLength;ii++){
                        var clipMask = clipGroup.pathItems[ii];
                        if(clipMask.clipping === true){
                        var clipPath = clipMask;
                        var boundsArray = [];       
                        boundsArray = clipPath.geometricBounds;
                        var artB1 = boundsArray[0]; //Left of the path
                        var artB2 = boundsArray[1]; //Top of the path
                        var artB3 = boundsArray[2]; //Right of the path
                        var artB4 = boundsArray[3]; //Bottom of the path  
                        dimensionLineStandard(artB1,artB2,artB3,artB2);
                        dimensionLineStandard(artB3,artB4,artB3,artB2);
                        }
                    }
                    }
                
            }
            /* if(docSelected[i].typename === "GroupItem"){
                if(docSelected[i].clipped === true){
                    var clipGroupLength = docSelected[i].length;
                    for(ii=0;ii<clipGroupLength;ii++){
                        var clipMask = docSelected[i].pathItems[ii];
                        if(clipMask.clipping === true){
                        var clipPath = clipMask;
                        var boundsArray = [];       
                        boundsArray = clipPath.geometricBounds;
                        var artB1 = boundsArray[0]; //Left of the path
                        var artB2 = boundsArray[1]; //Top of the path
                        var artB3 = boundsArray[2]; //Right of the path
                        var artB4 = boundsArray[3]; //Bottom of the path  
                        dimensionLineStandard(artB1,artB2,artB3,artB2);
                        dimensionLineStandard(artB3,artB4,artB3,artB2);
                        }
                    }
                }
                }*/
// ---------------------------------------------------------------------------------------------------------------------------    
            breakCounter++;
            if (breakCounter === numberOfItems){
                break;
                }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
for (j=0;j<graphicsLayer.pageItems.length;j++){
    var currentItem = graphicsLayer.pageItems[j];
   if (currentItem.name === "Dimension"){
    currentItem.move (graphicsLayer, ElementPlacement.PLACEATBEGINNING);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dimensionLineStandard (p0X,p0Y,p1X,p1Y){
amoutOfDims++;
if (actionTypeA === true || actionTypeB === true){
//Creates Dimensions group in dimensions layer.
var dimGroup = dimensionsLayer.groupItems.add();
dimGroup.name = "Dimension";
//if (dimensionsLayer === doc.activeLayer){
dimGroup.move (dimensionsLayer, ElementPlacement.PLACEATEND);
//}

var p0Xinput = p0X;
var p0Yinput = p0Y;
var p1Xinput = p1X;
var p1Yinput = p1Y;

/*
if (reversedDimVertical == true){
    var p0Y = p1Yinput;
    var p1Y = p0Yinput;
    }else{
    var p0Y = p0Yinput;
    var p1Y = p1Yinput;
        }
    
if (reversedDimHorizontal == true){
    var p0X = p1Xinput;
    var p1X = p0Xinput;
}else{
    var p0X = p0XInput;
    var p1X = p1Xinput;
}
*/

//reverses order of  vertical coordinates if lines begins from bottom to top
var p0YS = p0Y;
var p1YS = p1Y;


if (p0Y>p1Y && p0X==p1X){
        var p0Y = p1YS;
        var p1Y = p0YS;
    }

//substract values and treats first point in path as 0.0 coordinates
var p1X0 = p0X-p1X;
var p1Y0 = p0Y-p1Y;

//cartesian to polar
var lineLength = Math.sqrt((p1X0*p1X0)+(p1Y0*p1Y0));
var lineAngleDeg = (Math.atan(p1X0/p1Y0) * 180) / Math.PI;

//Dimensions Line coordinates
var dimVLineDeg= ((Math.atan(p1Y0/p1X0)+(90 * Math.PI / 180))* 180) / Math.PI;
var dimVLineRad = dimVLineDeg * Math.PI / 180;
var dimVHalfHeight = p1Y0/2;

if (addOffset == false){
    var dimVLineLengthNeg = dimTriangleLength*-0.5;//0 is standard
    var dimVLineLengthD = dimTriangleLength*18; //18 is standard
    var dimHLineLength = dimTriangleLength*0; //4 is standard
    var dimSHLineLength = dimTriangleLength*0.5; //6 is standard
    var dimSHLineLengthD = dimTriangleLength*1.5; //only short measurements without offset
    var dimSHLineOverhang = dimTriangleLength*5; //5 is standard
    var dimVLineLength = dimTriangleLength*0.5; //5 is standard
}else{
    var dimVLineLengthNeg = dimTriangleLength*0;//0 is standard
    var dimVLineLengthD = dimTriangleLength*18; //18 is standard
    var dimHLineLength = dimTriangleLength*4; //4 is standard
    var dimSHLineLength = dimTriangleLength*6; //6 is standard
    var dimSHLineLengthD = dimTriangleLength*6; //only short measurements without offset
    var dimSHLineOverhang = dimTriangleLength*5; //5 is standard
    var dimVLineLength = dimTriangleLength*5; //5 is standard
    }

//vertical measurement, horizontal text
var dimVDimLineLengthLeft = Math.sqrt((dimVHalfHeight*dimVHalfHeight)+(dimVLineLength*dimVLineLength));
var dimVDimLineLengthRadLeft = Math.atan(dimVHalfHeight/dimVLineLength);
var dimVDimLineLengthRight = Math.sqrt((dimVHalfHeight*dimVHalfHeight)+(dimVLineLengthD*dimVLineLengthD));
var dimVDimLineLengthRadRight = Math.atan(dimVHalfHeight/dimVLineLengthD);

//Shor Dimension Text Line Coordinates Horizontal & Angle
var dimSHLineLengthL = Math.sqrt((dimSHLineLengthD*dimSHLineLengthD)+(dimSHLineOverhang*dimSHLineOverhang));
var dimSHLineLengthDeg = (Math.atan(dimSHLineLengthD/dimSHLineOverhang) * 180) / Math.PI; //polar degree of 6mm height and triangle size length off the measurement point
//Left Point Horizontal & Angle
var dimSHLineLengthDegRLeft = ((Math.atan(p1Y0/p1X0)+((dimSHLineLengthDeg+(2*(90-dimSHLineLengthDeg))) * Math.PI / 180))* 180) / Math.PI; //degree relative to the degree of horizontal line
var dimSHLineLengthRadLeft = dimSHLineLengthDegRLeft * Math.PI / 180;
//Right Point Horizontal & Angle
var dimSHLineLengthDegRRight = ((Math.atan(p1Y0/p1X0)+(dimSHLineLengthDeg * Math.PI / 180))* 180) / Math.PI; //degree relative to the degree of horizontal line
var dimSHLineLengthRadRight = dimSHLineLengthDegRRight * Math.PI / 180;

//Left Point Vertical
var dimSHLineLengthDegRLeftV = ((Math.atan(p1Y0/p1X0)-((dimSHLineLengthDeg+(2*(90-dimSHLineLengthDeg))) * Math.PI / 180))* 180) / Math.PI; //degree relative to the degree of horizontal line
var dimSHLineLengthRadLeftV = dimSHLineLengthDegRLeftV * Math.PI / 180;
//Right Point Vertical
var dimSHLineLengthDegRRightV = ((Math.atan(p1Y0/p1X0)-(dimSHLineLengthDeg * Math.PI / 180))* 180) / Math.PI; //degree relative to the degree of horizontal line
var dimSHLineLengthRadRightV = dimSHLineLengthDegRRightV * Math.PI / 180;

//Vertical Line Coordinates - Standard Measurement
var dimVLinep0X = dimVLineLength * Math.cos(dimVLineRad)+p0X;
var dimVLinep0Y = dimVLineLength * Math.sin(dimVLineRad)+p0Y;
var dimVLinep1X = dimVLineLength * Math.cos(dimVLineRad)+p1X;
var dimVLinep1Y = dimVLineLength * Math.sin(dimVLineRad)+p1Y;

//Vertical Line Coordinates - NEGATIVE
var dimVLinep0XN = dimVLineLengthNeg * Math.cos(dimVLineRad)+p0X;
var dimVLinep0YN = dimVLineLengthNeg * Math.sin(dimVLineRad)+p0Y;
var dimVLinep1XN = dimVLineLengthNeg * Math.cos(dimVLineRad)+p1X;
var dimVLinep1YN = dimVLineLengthNeg * Math.sin(dimVLineRad)+p1Y;

//Vertical Line Coordinates - Short Measurement
var dimVLinep0XS = dimSHLineLengthL * Math.cos(dimSHLineLengthRadLeft)+p0X;
var dimVLinep0YS = dimSHLineLengthL * Math.sin(dimSHLineLengthRadLeft)+p0Y;
var dimVLinep1XS = dimSHLineLengthL * Math.cos(dimSHLineLengthRadRight)+p1X;
var dimVLinep1YS =  dimSHLineLengthL * Math.sin(dimSHLineLengthRadRight)+p1Y;

//Vertical Line Coordinates - Short Measurement - Vertical
var dimVLinep0XSV = -dimSHLineLengthL * Math.cos(dimSHLineLengthRadLeftV)+p0X;
var dimVLinep0YSV = -dimSHLineLengthL * Math.sin(dimSHLineLengthRadLeftV)+p0Y;
var dimVLinep1XSV = -dimSHLineLengthL * Math.cos(dimSHLineLengthRadRightV)+p1X;
var dimVLinep1YSV =  -dimSHLineLengthL * Math.sin(dimSHLineLengthRadRightV)+p1Y;

//Horizontal Line Coordinates
var dimHLinep0X = dimHLineLength * Math.cos(dimVLineRad)+p0X;
var dimHLinep0Y = dimHLineLength * Math.sin(dimVLineRad)+p0Y;
var dimHLinep1X = dimHLineLength * Math.cos(dimVLineRad)+p1X;
var dimHLinep1Y = dimHLineLength * Math.sin(dimVLineRad)+p1Y;

//working, basic vertical measurement horizontal text
/*
//Vertical Measurements Line Coordinates
var dimVDimLinep0X = (p1X0+dimVLineLength)+p0X;
var dimVDimLinep0Y = -((p1Y0/2)+((dimTriangleLength / units)*1.9))+p0Y;
var dimVDimLinep1X = (p1X0+dimVLineLengthD)+p1X;
var dimVDimLinep1Y = -((p1Y0/2)+((dimTriangleLength / units)*1.9))+p0Y;
*/
//Vertical Measurements Line Coordinates
var dimVDimLinep0X = dimVDimLineLengthLeft * Math.cos(dimVDimLineLengthRadLeft)+p0X;
var dimVDimLinep0Y = dimVDimLineLengthLeft * Math.sin(dimVDimLineLengthRadLeft)+p1Y-((dimTriangleLength / units)*1.9);
var dimVDimLinep1X = dimVDimLineLengthRight * Math.cos(dimVDimLineLengthRadRight)+p1X;
var dimVDimLinep1Y = dimVDimLineLengthRight * Math.sin(dimVDimLineLengthRadRight)+p1Y-((dimTriangleLength / units)*1.9);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Vertical Left Line
var vLeftLine = dimensionsLayer.pathItems.add();
vLeftLine.setEntirePath( Array( Array(dimVLinep0XN, dimVLinep0YN), Array(dimVLinep0X, dimVLinep0Y) ) );
vLeftLine.filled = false;
vLeftLine.stroked = true;
vLeftLine.strokeDashes = [];
vLeftLine.strokeColor = dimensionsGrey;
vLeftLine.strokeWidth = dimStrokeWidth;
vLeftLine.move(dimGroup, ElementPlacement.PLACEATBEGINNING);

//Vertical Right Line
var vRightLine = dimensionsLayer.pathItems.add();
vRightLine.setEntirePath( Array( Array(dimVLinep1XN, dimVLinep1YN), Array(dimVLinep1X, dimVLinep1Y) ) );
vRightLine.filled = false;
vRightLine.stroked = true;
vRightLine.strokeDashes = [];
vRightLine.strokeColor = dimensionsGrey;
vRightLine.strokeWidth = dimStrokeWidth;
vRightLine.move(dimGroup, ElementPlacement.PLACEATBEGINNING);

//Horizontal Line
var hLine = dimensionsLayer.pathItems.add();
hLine.setEntirePath(Array( Array(dimHLinep0X, dimHLinep0Y) , Array(dimHLinep1X, dimHLinep1Y)));
hLine.filled = false;
hLine.stroked = true;
hLine.strokeDashes = [];
hLine.strokeColor = dimensionsGrey;
hLine.strokeWidth = dimStrokeWidth;
hLine.move(dimGroup, ElementPlacement.PLACEATBEGINNING);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Dimension Triangle Coordinates - Left
if (dimVLinep0X != dimVLinep1X){
var dimTriangleLp1Deg = ((Math.atan(p1Y0/p1X0)+(dimTriangleLVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleLp1Rad = (dimTriangleLp1Deg * Math.PI / 180);
var dimTriangleLp2Deg = ((Math.atan(p1Y0/p1X0)-(dimTriangleLVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleLp2Rad = (dimTriangleLp2Deg * Math.PI / 180);
}else{
var dimTriangleLp1Deg = ((Math.atan(p1Y0/p1X0)+(dimTriangleRVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleLp1Rad = (dimTriangleLp1Deg * Math.PI / 180);
var dimTriangleLp2Deg = ((Math.atan(p1Y0/p1X0)-(dimTriangleRVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleLp2Rad = (dimTriangleLp2Deg * Math.PI / 180);
}

//Standard Measurement Triangle
var dimTriangleLp1X = dimTriangleLSLength * Math.cos(dimTriangleLp1Rad)+dimHLinep0X;
var dimTriangleLp1Y = dimTriangleLSLength * Math.sin(dimTriangleLp1Rad)+dimHLinep0Y;
var dimTriangleLp2X = dimTriangleLSLength * Math.cos(dimTriangleLp2Rad)+dimHLinep0X;
var dimTriangleLp2Y = dimTriangleLSLength * Math.sin(dimTriangleLp2Rad)+dimHLinep0Y;

//Short Measurement Triangle
var dimTriangleLp1XS = -dimTriangleLSLength * Math.cos(dimTriangleLp1Rad)+dimHLinep0X;
var dimTriangleLp1YS = -dimTriangleLSLength * Math.sin(dimTriangleLp1Rad)+dimHLinep0Y;
var dimTriangleLp2XS = -dimTriangleLSLength * Math.cos(dimTriangleLp2Rad)+dimHLinep0X;
var dimTriangleLp2YS = -dimTriangleLSLength * Math.sin(dimTriangleLp2Rad)+dimHLinep0Y;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Dimension Triangle Coordinates - Right
if (dimVLinep0X != dimVLinep1X){
var dimTriangleRp1Deg = ((Math.atan(p1Y0/p1X0)+(dimTriangleRVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleRp1Rad = (dimTriangleRp1Deg * Math.PI / 180);
var dimTriangleRp2Deg = ((Math.atan(p1Y0/p1X0)-(dimTriangleRVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleRp2Rad = (dimTriangleRp2Deg * Math.PI / 180);
}else{
var dimTriangleRp1Deg = ((Math.atan(p1Y0/p1X0)+(dimTriangleLVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleRp1Rad = (dimTriangleRp1Deg * Math.PI / 180);
var dimTriangleRp2Deg = ((Math.atan(p1Y0/p1X0)-(dimTriangleLVectorDeg * Math.PI / 180))* 180) / Math.PI;
var dimTriangleRp2Rad = (dimTriangleRp2Deg * Math.PI / 180);
}
//Standard Measurement Triangle
var dimTriangleRp1X = dimTriangleLSLength * Math.cos(dimTriangleRp1Rad)+dimHLinep1X;
var dimTriangleRp1Y = dimTriangleLSLength * Math.sin(dimTriangleRp1Rad)+dimHLinep1Y;
var dimTriangleRp2X = dimTriangleLSLength * Math.cos(dimTriangleRp2Rad)+dimHLinep1X;
var dimTriangleRp2Y = dimTriangleLSLength * Math.sin(dimTriangleRp2Rad)+dimHLinep1Y;

//Short Measurement Triangle
var dimTriangleRp1XS = -dimTriangleLSLength * Math.cos(dimTriangleRp2Rad)+dimHLinep1X;
var dimTriangleRp1YS = -dimTriangleLSLength * Math.sin(dimTriangleRp2Rad)+dimHLinep1Y;
var dimTriangleRp2XS = -dimTriangleLSLength * Math.cos(dimTriangleRp1Rad)+dimHLinep1X;
var dimTriangleRp2YS = -dimTriangleLSLength * Math.sin(dimTriangleRp1Rad)+dimHLinep1Y;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Creating Both triangles
var dimTriangleL = dimensionsLayer.pathItems.add();
var dimTriangleR = dimensionsLayer.pathItems.add();

if (lineLength <= (dimTriangleLength*6)){
    ///////////////////////////////Smaller than triangle
    dimTriangleL.setEntirePath( Array(Array(dimHLinep1X, dimHLinep1Y), Array(dimTriangleRp1XS,dimTriangleRp1YS), Array(dimTriangleRp2XS,dimTriangleRp2YS)))
    dimTriangleR.setEntirePath( Array(Array(dimHLinep0X, dimHLinep0Y), Array(dimTriangleLp2XS,dimTriangleLp2YS), Array(dimTriangleLp1XS,dimTriangleLp1YS)));
    
}else{
    ///////////////////////////////Standard size
    dimTriangleL.setEntirePath( Array(Array(dimHLinep1X, dimHLinep1Y), Array(dimTriangleRp1X,dimTriangleRp1Y), Array(dimTriangleRp2X,dimTriangleRp2Y)));
    dimTriangleR.setEntirePath( Array(Array(dimHLinep0X, dimHLinep0Y), Array(dimTriangleLp2X,dimTriangleLp2Y), Array(dimTriangleLp1X,dimTriangleLp1Y)));
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Assigns colours, strokes and moves it to the group
dimTriangleL.closed = true;
dimTriangleL.stroked = false;
dimTriangleL.filled = true;
dimTriangleL.fillColor = dimensionsGrey;
dimTriangleL.move(dimGroup, ElementPlacement.PLACEATBEGINNING);
dimTriangleR.closed = true;
dimTriangleR.stroked = false;
dimTriangleR.filled = true;
dimTriangleR.fillColor = dimensionsGrey;
dimTriangleR.move(dimGroup, ElementPlacement.PLACEATBEGINNING);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Creates text frame in details layer containing first set of input details.
var dimTextLine = dimensionsLayer.pathItems.add();

if (lineLength <= (dimTriangleLength*6)){
    
            //Short Dimension text base line
        if (dimVLinep0X != dimVLinep1X){
            dimTextLine.setEntirePath( Array(Array(dimVLinep0XS, dimVLinep0YS), Array(dimVLinep1XS, dimVLinep1YS) ) );
        }else{
            if (horizontalMeasurements == true){
            dimTextLine.setEntirePath( Array(Array(dimVLinep0XS, dimVDimLinep0Y), Array(dimVDimLinep1X, dimVDimLinep1Y) ) ); //vertical measurements to read horizontal
            }else{
            dimTextLine.setEntirePath( Array(Array(dimVLinep1XSV, dimVLinep1YSV), Array(dimVLinep0XSV, dimVLinep0YSV) ) );
            }
    }
        
    }else{
        
    //Standard Dimension text base line
    if (dimVLinep0X != dimVLinep1X){
        //Horizontal Measurement
        dimTextLine.setEntirePath( Array(Array(dimVLinep0X, dimVLinep0Y), Array(dimVLinep1X, dimVLinep1Y) ) );
        }else{
        //Vertical Measurement
        if (horizontalMeasurements == true){
            dimTextLine.setEntirePath( Array(Array(dimVDimLinep0X, dimVDimLinep0Y), Array(dimVDimLinep1X, dimVDimLinep1Y) ) ); //vertical measurements to read horizontall
            }else{
        // riginal line following angle of the measured path
        dimTextLine.setEntirePath( Array(Array(dimVLinep1X, dimVLinep1Y), Array(dimVLinep0X, dimVLinep0Y) ) );
        }
        
        }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var dimText = dimensionsLayer.textFrames.pathText(dimTextLine);
var dimTextAttributes = dimText.paragraphs.paragraphAttributes;
redraw();
// ---------------------------------------------------------------------------------------------------------------------------    
if(surveyA === true){
// ---------------------------------------------------------------------------------------------------------------------------    
    dimTextMeasurement = lineLength / units / scale;
    dimTextMeasurementFormat = dimTextMeasurement.toFixed(decimalPointFactor);
// ---------------------------------------------------------------------------------------------------------------------------    
    if (addUnits === true){
        dimText.contents = dimTextMeasurementFormat + " mm";
        }else{
        dimText.contents = dimTextMeasurementFormat;
    }
}
// ---------------------------------------------------------------------------------------------------------------------------    
    if(surveyB === true){
        dimText.contents = amoutOfDims.toString();
    }
// ---------------------------------------------------------------------------------------------------------------------------    
if(surveyC === true){
    if(amoutOfDims<=26){
        dimText.contents = alphabet[(amoutOfDims-1)];
        }else{
        var panelNumberFactor = ( amoutOfDims-1 ) - ( alphabet.length * (Math.floor(((amoutOfDims-1)/alphabet.length))));
        var alphabetNumber = (Math.floor(((amoutOfDims-1)/alphabet.length))+1).toString();
        dimText.contents = alphabet[panelNumberFactor] + alphabetNumber;
    }
}  

dimText.selected = false;
dimText.name = "Dimension";

if (horizontalMeasurements == true){
    
    if (dimVLinep0X != dimVLinep1X){
        var dimPara = dimText.paragraphs.length;
        dimParaStyle.applyTo(dimText.paragraphs[0], true);
        //Applies character style
        dimCharStyle.applyTo(dimText.textRange);
        }else{
        dimCharStyle.applyTo(dimText.textRange);
        }
        
    }else{
         var dimPara = dimText.paragraphs.length;
        dimParaStyle.applyTo(dimText.paragraphs[0], true);
        dimCharStyle.applyTo(dimText.textRange);
        }
    dimText.move(dimGroup, ElementPlacement.PLACEATBEGINNING);
    }else{
//do fuck all        
        }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//END OF MAIN DIMENSIONS FUNCTION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//linked files name function
function linkedFileName(artB1,artB2,artB3,artB4,linkURL){
    
    if (actionTypeA === true || actionTypeC === true){
// ---------------------------------------------------------------------------------------------------------------------------
        if (linksSizeName === true){
            
        var linkWidth = (artB3-artB1) / units / scale;
        var linkWidth = linkWidth.toFixed(decimalPointFactor);
        var linkWidthString = linkWidth.toString();
        var linkHeight = -((artB4-artB2) / units / scale);
        var linkHeight = linkHeight.toFixed(decimalPointFactor);
        var linkHeightString = linkHeight.toString();
        
        if(fullURL === false){
        var linkURLString = linkURL.toString();
        var linkURLStringSplit = linkURLString.split ('/');
        var linkNameLast = linkURLStringSplit.length-1;        
        var linkName = linkURLStringSplit[linkNameLast]; 
        }else{
        var linkURLString = linkURL.toString();
         var linkName = linkURLString; 
        }
        var linkName = linkName + " | " + linkWidthString + " x " + linkHeightString + " mm";
        }else{            
        if(fullURL === false){
        var linkURLString = linkURL.toString();
        var linkURLStringSplit = linkURLString.split ('/');
        var linkNameLast = linkURLStringSplit.length-1;        
        var linkName = linkURLStringSplit[linkNameLast]; 
        }else{
        var linkURLString = linkURL.toString();
         var linkName = linkURLString; 
         }
        }
// ---------------------------------------------------------------------------------------------------------------------------
        var linkNameInputString = linkName;
        var linkFileNameLine = dimensionsLayer.pathItems.add();    
        linkFileNameLine.setEntirePath(Array(Array(artB1, artB4-dimTriangleLength*5), Array(artB3+dimTriangleLength*18, artB4-dimTriangleLength*5)));    
        var linkFileName = dimensionsLayer.textFrames.pathText(linkFileNameLine);
        linkFileName.contents = linkNameInputString;
        linkFileName.selected = false;
        linkFileName.name = "File Name";
        //Applies character style
        dimCharStyle.applyTo(linkFileName.textRange);
        //var dimGroup = dimensionsLayer.groupItems["Dimension"];
        //linkFileName.move(dimGroup, ElementPlacement.PLACEATBEGINNING);
    }else{
        //no link names
        }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Scale input function
function userInputFunction () {
w = new Window ('dialog');
w.alignChildren = "center";
// ---------------------------------------------------------------------------------------------------------------------------
var topGroup = w.add ('group');
topGroup.alignChildren = "top";
topGroup.orientation = "row";
// ---------------------------------------------------------------------------------------------------------------------------
var scaleGroup = topGroup.add ('group');
var scalePanel = scaleGroup.add('panel',undefined , 'Scale', {borderStyle:'white'});
scalePanel.alignChildren = "left";
var scaleStatic1 = scalePanel.add("statictext", undefined, "Please enter scale");
var scaleStatic2 = scalePanel.add("statictext", undefined,  "factor after colon (:)");
var scalePanelGroup1 = scalePanel.add ('group');
var scaleStatic3 = scalePanelGroup1.add("statictext", undefined, "Scale 1:");
var scaleInputText = scalePanelGroup1.add ("edittext", ([0,0,50,15]), "1");
var scaleStatic4 = scalePanel.add("statictext", undefined, "i.e. 1:10 to be 10,");
var scaleStatic5 = scalePanel.add("statictext", undefined, "1:40 to be 40 etc.");
// ---------------------------------------------------------------------------------------------------------------------------
var radioBoxPanel = topGroup.add('panel', undefined , 'Size', {borderStyle:'white'});
radioBoxPanel.alignChildren = "left";
radioBoxPanel.orientation = "column";
var radioA4 = radioBoxPanel.add ("radiobutton", undefined, "A4 (1mm)");
var radioA3 = radioBoxPanel.add ("radiobutton", undefined, "A3 (2mm)");
var radioCustom = radioBoxPanel.add ("radiobutton", undefined, "Custom");
var radioCustomInput = radioBoxPanel.add ('group');
radioCustomInput.orientation = "row";
var radioCustomInputText = radioCustomInput.add ("edittext", ([0,0,50,15]), "2");
var radioCustomInputStatic = radioCustomInput.add("statictext", undefined, "mm");
radioA4.value = true;
// ---------------------------------------------------------------------------------------------------------------------------
var checkBoxGroup = w.add ('group');
var checkBoxPanel = checkBoxGroup.add('panel', undefined , 'Features', {borderStyle:'white'});
checkBoxPanel.alignChildren = "left";
checkBoxPanel.orientation = "column";
var offsetCheckbox = checkBoxPanel.add ("checkbox", undefined, "Offsetted");
var dimensionsLayerCheckbox = checkBoxPanel.add ("checkbox", undefined, "Create Dimensions Layer");
var linksSizeNameLayerCheckbox = checkBoxPanel.add ("checkbox", undefined, "Link size in the name");
var unitsCheckbox = checkBoxPanel.add ("checkbox", undefined, "Include units");
var alwaysHorizontalCheckbox = checkBoxPanel.add ("checkbox", undefined, "All horizontal measurements");
var urlCheckbox = checkBoxPanel.add ("checkbox", undefined, "Full URL link");
checkBoxPanel.alignChildren = ["fill","fill"];
checkBoxPanel.separator = checkBoxPanel.add ("panel");
checkBoxPanel.separator.minimumSize.height = checkBoxPanel.separator.maximumSize.height = 2;
var decimalPointGroup = checkBoxPanel.add ('group');
var decimalPointStatic = decimalPointGroup.add("statictext", undefined, "Decimal Point:");
var decimalPointInputText = decimalPointGroup.add ("edittext", ([0,0,50,15]), "2");
checkBoxPanel.separator = checkBoxPanel.add ("panel");
checkBoxPanel.separator.minimumSize.height = checkBoxPanel.separator.maximumSize.height = 2;
var colourGroup = checkBoxPanel.add ('group');
colourGroup.alignChildren = "top";
colourGroup.orientation = "row";
var colourARadio = colourGroup.add ("radiobutton", undefined, "Black");
var colourBRadio = colourGroup.add ("radiobutton", undefined, "White");
var colourCRadio = colourGroup.add ("radiobutton", undefined, "Cyan");
colourARadio.value = true;
dimensionsLayerCheckbox.value = false;
linksSizeNameLayerCheckbox.value = false;
unitsCheckbox.value = false;
alwaysHorizontalCheckbox.value = false;
offsetCheckbox.value = true;
urlCheckbox.value = false;
// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
var radioBoxGroup = w.add ('group');
radioBoxGroup.alignChildren = "top";
radioBoxGroup.orientation = "row";
// ---------------------------------------------------------------------------------------------------------------------------
var radioTypeBoxPanel = radioBoxGroup.add('panel', undefined , 'Links', {borderStyle:'white'});
radioTypeBoxPanel.alignChildren = "left";
var radioTypeA = radioTypeBoxPanel.add ("radiobutton", undefined, "Size + Link Name");
var radioTypeB = radioTypeBoxPanel.add ("radiobutton", undefined, "Size Only");
var radioTypeC = radioTypeBoxPanel.add ("radiobutton", undefined, "Link Name Only");
radioTypeA.value = true;
// ---------------------------------------------------------------------------------------------------------------------------
var radioSurveyBoxPanel = radioBoxGroup.add('panel', undefined , 'Survey', {borderStyle:'white'});
radioSurveyBoxPanel.alignChildren = "left";
var radioSurveyA = radioSurveyBoxPanel.add ("radiobutton", undefined, "Sizes");
var radioSurveyB = radioSurveyBoxPanel.add ("radiobutton", undefined, "Numbering");
var radioSurveyC = radioSurveyBoxPanel.add ("radiobutton", undefined, "Lettering");
radioSurveyA.value = true;
// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
var buttonsGroup = w.add ('group');
var buttonsPanel = buttonsGroup.add('panel', undefined , "", {borderStyle:'white'});
buttonsPanel.orientation = "row";
var buttonOK = buttonsPanel.add ("button", undefined, "OK");
var buttonCancel = buttonsPanel.add ("button", undefined, "Cancel");
var creditsText = w.add("statictext", undefined, "Version 1.16 08/07/2017 | PL");
// ---------------------------------------------------------------------------------------------------------------------------
if (w.show () == 1) {
    scaleInput = scaleInputText.text;
    // -----------------------------------------------------------------   
    if (dimensionsLayerCheckbox.value == true){
        createDimensionsLayer = true;
    }else{
        createDimensionsLayer = false;
    }
    // -----------------------------------------------------------------
    if (linksSizeNameLayerCheckbox.value == true){
        linksSizeName = true;
    }else{
        linksSizeName = false;
    }
    // -----------------------------------------------------------------
    if (unitsCheckbox.value == true){
        addUnits = true;
    }else{
        addUnits = false;
    }
    // -----------------------------------------------------------------
    if (alwaysHorizontalCheckbox.value == true){
        horizontalMeasurements = true;
    }else{
        horizontalMeasurements = false;
    }
    // -----------------------------------------------------------------
    if (offsetCheckbox.value == true){
        addOffset = true;
    }else{
        addOffset = false;
    }
    // -----------------------------------------------------------------
    if (urlCheckbox.value == true){
        fullURL = true;
    }else{
        fullURL = false;
    }
    // -----------------------------------------------------------------
    if (radioA4.value == true){
        dimTriangleLengthInput = 1;
    }
    if (radioA3.value == true){
        dimTriangleLengthInput = 2;
    }
    if (radioCustom.value == true){
        dimTriangleLengthInput = radioCustomInputText.text;
    }
    // -----------------------------------------------------------------
    if (radioTypeA.value == true){
        actionTypeA = true;
    }else{
        actionTypeA = false;
        }

    if (radioTypeB.value == true){
        actionTypeB = true;
    }else{
        actionTypeB = false;
        }
    
    if (radioTypeC.value == true){
        actionTypeC = true;
    }else{
        actionTypeC = false;
        }
    // -----------------------------------------------------------------
    if (radioSurveyA.value == true){
        surveyA = true;
    }else{
        surveyA = false;
        }
    if (radioSurveyB.value == true){
        surveyB = true;
    }else{
        surveyB = false;
        }
    if (radioSurveyC.value == true){
        surveyC = true;
    }else{
        surveyC = false;
        }
     // -----------------------------------------------------------------
    decimalPointInput = decimalPointInputText.text;
     // -----------------------------------------------------------------
    if (colourARadio.value == true){//grey & black
        C1 = 0;
        M1 = 0;
        Y1 = 0;
        K1 = 80;
        C2 = 0;
        M2 = 0;
        Y2 = 0;
        K2 = 100;
        }
    if (colourBRadio.value == true){//white
        C1 = 0;
        M1 = 0;
        Y1 = 0;
        K1 = 0;
        C2 = 0;
        M2 = 0;
        Y2 = 0;
        K2 = 0;
        }
    if (colourCRadio.value == true){//cyan
        C1 = 100;
        M1 = 0;
        Y1 = 0;
        K1 = 0;
        C2 = 100;
        M2 = 0;
        Y2 = 0;
        K2 = 0;
        }
    // -----------------------------------------------------------------

    return scaleInputText.text;
    return decimalPointInput;
    return createDimensionsLayer;
    return horizontalMeasurements;
    return addUnits;
    return linksSizeName;
    return addOffset;
    return fullURL;
    return dimTriangleLengthInput;
    return actionTypeA; return actionTypeB; return actionTypeC;
    return surveyA; return surveyB; return surveyC; 
    return colourA; return colourB; return colourC;
    return C1; return C2; return M1; return M2; return Y1; return Y2; return K1; return K2;
    }
    exit ();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Replacing %20 with spaces in the link file names
if (actionTypeA === true || actionTypeC === true){
var linkedNameTextFrames = dimensionsLayer.textFrames.length;
for (i=0; i<linkedNameTextFrames;i++){    
var currentTextFrame = dimensionsLayer.textFrames[i];
var currentTextRange = currentTextFrame.textRange;
var currentTextRangeLength = currentTextRange.length-2;
var stringToBeReplaced = "%20";

if (currentTextRangeLength>=3){
  for (ii=0;ii<currentTextRangeLength;ii++){
  for (iii=0;iii<currentTextRangeLength;iii++){
        var currentCharacter1 = currentTextRange.characters[iii];
        var currentCharacter2 = currentTextRange.characters[iii+1];
        var currentCharacter3 = currentTextRange.characters[iii+2];   
            if (currentCharacter1.contents === stringToBeReplaced[0]
                && currentCharacter2.contents === stringToBeReplaced[1]
                && currentCharacter3.contents === stringToBeReplaced[2]){
                var detectedSpace = "Yes";
                var removeChar1 = currentCharacter1.remove();
                var removeChar2 = currentCharacter2.remove();
                var removeChar3 = currentCharacter3.remove();
                var addSpaceChar =currentTextRange.characters.add(" ",currentTextFrame.textRange.characters[iii], ElementPlacement.PLACEBEFORE);
                var currentTextRangeLength = currentTextRange.length-2;
                break
                }else{
                var detectedSpace = "No";
                }
    }
}
}
}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//removes all styles
var charStyle = doc.characterStyles.removeAll();
var paraStyle = doc.paragraphStyles.removeAll();