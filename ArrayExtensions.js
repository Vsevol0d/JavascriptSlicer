Array.prototype.max = function(){
    return Math.max.apply(Math, this);
};
Array.prototype.min = function(){
    return Math.min.apply(Math, this);
};
Array.prototype.Select = function(fieldName){
        var selectedValues = [];
    for (var i = 0; i != this.length; i++)
    {
        selectedValues.push(this[i][fieldName]);
    }
    return selectedValues;
};
Array.prototype.Find = function(elementHandler) {
	for (var i = 0; i != this.length; i++)
    {
		if (elementHandler(this[i]))
		{
			return this[i];
		}
    }
}
Array.prototype.FindAll = function(elementHandler) {
	var allElements = [];
	for (var i = 0; i != this.length; i++)
    {
		if (elementHandler(this[i]))
		{
			allElements.push(this[i]);
		}
    }
	return allElements;
}

Array.prototype.RemoveAt = function(index) {
	this.splice(index, 1);
}

Array.prototype.AddRange = function(arrayToAdd) {
	for (var i = 0; i != arrayToAdd.length; i++)
	{
		this.push(arrayToAdd[i]);
	}
}

Array.prototype.OrderBy = function(arrayToAdd) {
	// Do not need this
}

Array.prototype.minPoint = function() {
	var minX = this[0].x;
	var minY = this[0].y;
	var minZ = this[0].z;
	
	for (var i = 0; i != this.length; i++)
	{
		if (this[i].x < minX)
		{
			minX = this[i].x;
		}
		if (this[i].y < minY)
		{
			minY = this[i].y;
		}
		if (this[i].z < minZ)
		{
			minZ = this[i].z;
		}
	}
	
	return {x: minX, y: minY, z: minZ};
}

Array.prototype.maxPoint = function() {
	var maxX = this[0].x;
	var maxY = this[0].y;
	var maxZ = this[0].z;
	
	for (var i = 0; i != this.length; i++)
	{
		if (this[i].x > maxX)
		{
			maxX = this[i].x;
		}
		if (this[i].y > maxY)
		{
			maxY = this[i].y;
		}
		if (this[i].z > maxZ)
		{
			maxZ = this[i].z;
		}
	}
	
	return {x: maxX, y: maxY, z: maxZ};
}