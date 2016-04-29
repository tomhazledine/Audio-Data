var selectors = $('.nationSelector');

selectors.on('change',function(){
	
	var isChecked = this.checked;
	var nation = $(this).attr('name');
	// console.log('the ' + nation + ' checkbox status is ' + isChecked);
	
	setChartVisibleState(nation,isChecked);
});

function setChartVisibleState(dataSelector,status){
	var targetClass = '.entry' + dataSelector;
	var target = d3.select(targetClass);
	if (status) {
		target.classed('active',true);
	} else {
		target.classed('active',false);
	}
}