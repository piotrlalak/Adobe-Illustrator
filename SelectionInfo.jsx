//--------------------------------------------------------------------
if(app.activeDocument.selection.length === 1){
	selectionInfo(app.activeDocument.selection[0]);
	var aaSelectedItem = app.activeDocument.selection[0];
}else{
	alert('Too many or none objects were selected','Selection Info Error');
}
//$.writeln(Object.constructor(app.activeDocument.selection))
//--------------------------------------------------------------------
function selectionInfo(item){
	var window = new Window ('dialog','Item Properties');
	var windowGroup = window.add('group');
	windowGroup.orientation = 'row';
	windowGroup.alignChildren = 'top';
	var mainPanel = windowGroup.add('panel',undefined , 'PageItems Properties', {borderStyle:'white'});
	mainPanel.orientation = 'column';
	mainPanel.alignChildren = 'left';
	//--------------------------------------------------------------------
	artworkKnockout = mainPanel.add ("statictext", undefined, 'artworkKnockout: ' + item.artworkKnockout);
	blendingMode = mainPanel.add ("statictext", undefined, 'blendingMode: ' + item.blendingMode);
	controlBounds = mainPanel.add ("statictext", undefined, 'controlBounds: ' + (item.controlBounds[0]).toFixed(2) + ', ' + (item.controlBounds[1]).toFixed(2) + ', ' + (item.controlBounds[2]).toFixed(2) + ', ' + (item.controlBounds[3]).toFixed(2) );
	editable = mainPanel.add ("statictext", undefined, 'editable: ' + item.editable);
	geometricBounds = mainPanel.add ("statictext", undefined, 'geometricBounds: ' + (item.geometricBounds[0]).toFixed(2) + ', ' + (item.geometricBounds[1]).toFixed(2) + ', ' + (item.geometricBounds[2]).toFixed(2) + ', ' + (item.geometricBounds[3]).toFixed(2) );
	height = mainPanel.add ("statictext", undefined, 'height: ' + item.height);
	hidden = mainPanel.add ("statictext", undefined, 'hidden: ' + item.hidden);
	isIsolated = mainPanel.add ("statictext", undefined, 'isIsolated: ' + item.isIsolated);
	layer = mainPanel.add ("statictext", undefined, 'layer: ' + item.layer);
	left = mainPanel.add ("statictext", undefined, 'left: ' + item.left);
	locked = mainPanel.add ("statictext", undefined, 'locked: ' + item.locked);
	name = mainPanel.add ("statictext", undefined, 'name: ' + item.name);
	note = mainPanel.add ("statictext", undefined, 'note: ' + item.note);
	opacity = mainPanel.add ("statictext", undefined, 'opacity: ' + item.opacity);
	parent = mainPanel.add ("statictext", undefined, 'parent: ' + item.parent);
	pixelAligned = mainPanel.add ("statictext", undefined, 'pixelAligned: ' + item.pixelAligned);
	position = mainPanel.add ("statictext", undefined, 'position: ' + item.position);
	selected = mainPanel.add ("statictext", undefined, 'selected: ' + item.selected);
	sliced = mainPanel.add ("statictext", undefined, 'sliced: ' + item.sliced);
	tags = mainPanel.add ("statictext", undefined, 'tags: ' + item.tags);
	top = mainPanel.add ("statictext", undefined, 'top: ' + item.top);
	typename = mainPanel.add ("statictext", undefined, 'typename: ' + item.typename);
	URL = mainPanel.add ("statictext", undefined, 'URL: ' + item.URL);
	visibilityVariable = mainPanel.add ("statictext", undefined, 'visibilityVariable: ' + item.visibilityVariable);
	visibleBounds = mainPanel.add ("statictext", undefined, 'visibleBounds: ' + (item.visibleBounds[0]).toFixed(2) + ', ' + (item.visibleBounds[1]).toFixed(2) + ', ' + (item.visibleBounds[2]).toFixed(2) + ', ' + (item.visibleBounds[3]).toFixed(2) );
	width = mainPanel.add ("statictext", undefined, 'width: ' + item.width);
	if(item.wrapped === true){
		wrapInside = mainPanel.add ("statictext", undefined, 'wrapInside: ' + item.wrapInside);
		wrapOffset = mainPanel.add ("statictext",undefined, 'wrapOffset: ' + item.wrapOffset);
		wrapped = mainPanel.add ("statictext", undefined, 'wrapped: ' + item.wrapped);
	}
	if(item.parent.typename === 'Layer'){
		//zOrderPosition = mainPanel.add ("statictext", undefined, 'zOrderPosition: ' + item.zOrderPosition);
	}
	//--------------------------------------------------------------------
	var additionalPanel = windowGroup.add('panel',undefined , 'Item-specific Properties', {borderStyle:'white'});
	additionalPanel.orientation = 'column';
	additionalPanel.alignChildren = 'left';
	//--------------------------------------------------------------------
	switch(item.typename){
		case 'CompoundPathItem':
			pathItems = additionalPanel.add ("statictext", undefined, 'pathItems: ' + item.pathItems);
		case 'GroupItem':
			clipped = additionalPanel.add ("statictext", undefined, 'clipped: ' + item.clipped);
			compoundPathItems = additionalPanel.add ("statictext", undefined, 'compoundPathItems: ' + item.compoundPathItems);
			graphItems = additionalPanel.add ("statictext", undefined, 'graphItems: ' + item.graphItems);
			groupItems = additionalPanel.add ("statictext", undefined, 'groupItems: ' + item.groupItems);
			legacyTextItems = additionalPanel.add ("statictext", undefined, 'legacyTextItems: ' + item.legacyTextItems);
			meshItems = additionalPanel.add ("statictext", undefined, 'meshItems: ' + item.meshItems);
			nonNativeItems = additionalPanel.add ("statictext", undefined, 'nonNativeItems: ' + item.nonNativeItems);
			pageItems = additionalPanel.add ("statictext", undefined, 'pageItems: ' + item.pageItems);
			pathItems = additionalPanel.add ("statictext", undefined, 'pathItems: ' + item.pathItems);
			placedItems = additionalPanel.add ("statictext", undefined, 'placedItems: ' + item.placedItems);
			pluginItems = additionalPanel.add ("statictext", undefined, 'pluginItems: ' + item.pluginItems);
			rasterItems = additionalPanel.add ("statictext", undefined, 'rasterItems: ' + item.rasterItems);
			symbolItems = additionalPanel.add ("statictext", undefined, 'symbolItems: ' + item.symbolItems);
			textFrames = additionalPanel.add ("statictext", undefined, 'textFrames: ' + item.textFrames);
		case 'PathItem':
			area = additionalPanel.add ("statictext", undefined, 'area: ' + item.area);
			clipping = additionalPanel.add ("statictext", undefined, 'clipping: ' + item.clipping);
			closed = additionalPanel.add ("statictext", undefined, 'closed: ' + item.closed);
			evenodd = additionalPanel.add ("statictext", undefined, 'evenodd: ' + item.evenodd);
			filled = additionalPanel.add ("statictext", undefined, 'filled: ' + item.filled);
			if(item.filled === true){
				fillColor = additionalPanel.add ("statictext", undefined, 'fillColor: ' + item.fillColor);
				fillOverprint = additionalPanel.add ("statictext", undefined, 'fillOverprint: ' + item.fillOverprint);
			}
			guides = additionalPanel.add ("statictext", undefined, 'guides: ' + item.guides);
			pathPoints = additionalPanel.add ("statictext", undefined, 'pathPoints: ' + item.pathPoints);
			polarity = additionalPanel.add ("statictext", undefined, 'polarity: ' + item.polarity);
			resolution = additionalPanel.add ("statictext", undefined, 'resolution: ' + item.resolution);
			//selectedPathPoints = additionalPanel.add ("statictext", undefined, 'selectedPathPoints: ' + item.selectedPathPoints.length);
			stroked = additionalPanel.add ("statictext", undefined, 'stroked: ' + item.stroked);
			if(item.stroked === true){
				strokeCap = additionalPanel.add ("statictext", undefined, 'strokeCap: ' + item.strokeCap);
				strokeColor = additionalPanel.add ("statictext", undefined, 'strokeColor: ' + item.strokeColor);
				strokeDashes = additionalPanel.add ("statictext", undefined, 'strokeDashes: ' + item.strokeDashes);
				strokeDashOffset = additionalPanel.add ("statictext", undefined, 'strokeDashOffset: ' + item.strokeDashOffset);
				strokeJoin = additionalPanel.add ("statictext", undefined, 'strokeJoin: ' + item.strokeJoin);
				strokeMiterLimit = additionalPanel.add ("statictext", undefined, 'strokeMiterLimit: ' + item.strokeMiterLimit);
				strokeOverprint = additionalPanel.add ("statictext", undefined, 'strokeOverprint: ' + item.strokeOverprint);
				strokeWidth = additionalPanel.add ("statictext", undefined, 'strokeWidth: ' + item.strokeWidth);
			}
		case 'PlacedItem':
			contentVariable = additionalPanel.add ("statictext", undefined, 'contentVariable: ' + item.contentVariable);
			file = additionalPanel.add ("statictext", undefined, 'file: ' + item.file);
			matrix = additionalPanel.add ("statictext", undefined, 'matrix: ' + item.matrix);
		default:
			//nothing;
	}
	//--------------------------------------------------------------------
	window.show();
}
//--------------------------------------------------------------------