if(app.activeDocument.placedItems.length > 0){
		
	function neg2pos(value){
		if(value < 0){
			newValue = value / -1
		}else{
			newValue = value;
		}
		return newValue;
	}

	scaled_items_counter = 0
	
	for(i=0;i<app.activeDocument.placedItems.length;i++){
		c_item = app.activeDocument.placedItems[i]
		c_item_matrix_A = c_item.matrix.mValueA
		c_item_matrix_B = c_item.matrix.mValueA
		c_item_matrix_C = c_item.matrix.mValueC
		c_item_matrix_D = c_item.matrix.mValueD
		temp_v = (c_item_matrix_A + c_item_matrix_B + c_item_matrix_C + c_item_matrix_D)
		temp_v = neg2pos(temp_v)
		$.writeln(c_item.file.name+ ' | temp V:' + temp_v + ' | ' + c_item_matrix_A + ' | ' + c_item_matrix_B + ' | ' + c_item_matrix_C + ' | ' + c_item_matrix_D)
		if(temp_v < 1){
				scaled_items_counter++
			}
		}
	alert_msg = 'Links no: ' + app.activeDocument.placedItems.length + '\nScaled (or rotated) links: ' + scaled_items_counter
	
	alert(alert_msg,'Link scale')
}