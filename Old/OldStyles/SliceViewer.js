
function Tuple(perimeter, countur) {
    this.Perimeter = perimeter;
    this.Countur = countur;
}

function VisualPoint(x, y) {
    this.X = x;
    this.Y = y;
	// alert('PC: ' + this.X + ' ' + this.Y);
    this.Copy = function() {
    		var cx = this.X;
        var cy = this.Y;
    		return new VisualPoint(cx, xy);
    }
}

function SliceViewer(canvas, pointsState, linesState, countursState) {
	
	// Handlers
    this.OnFillCountursChanged = function(state) {
    	this.SetIsFillingEnabled(state);
		if (state) ShowCounturs();
		else HideCounturs();
        //alert('filling state: ' + state);
    }
    this.OnShowLineChanged = function(state) {
    	this.SetAreCountursVisible(state);
		if (state) ShowLines();
		else HideLines();
        //alert('line state: ' + state);
    }
    this.OnShowPointsChanged = function(state) {
    	this.SetAreReferencePointsVisible(state);
		if (state) ShowPoints();
		else HidePoints();
        //alert('point state: ' + state);
    }
	this.OnResize = function(event, sideLength) {
		//canvas.height = sideLength;
		//canvas.width = sideLength;
		RecalculateLayout(sideLength, sideLength);
        //alert('point state: ' + state);
    }
    
	
	// Handlers of SlicerView
	// geometry - global variable in SlicerView
	// step - global variable in SlicerView
	// SlicedObject - global variable in SlicerView
	// CurrentLayer - global variable in SlicerView
	
	this.step = 0;
	var CurrentLayer = 0;
	var Geometry = null;
	var SlicedObject = null;
	
	this.SetObject = function(geometry) {
	//alert('                              GEOMETRY SET!' + geometry.faces.length);
	//alert('                              GEOMETRY SET!' + geometry.vertices[geometry.faces[0].a].x);
		Geometry = geometry;
		// boundingRectangle = {minPoint: geometry.boundingBox.min, maxPoint: geometry.boundingBox.max};
		SetBoundingRectangle(geometry.boundingBox.min, geometry.boundingBox.max);
		// this.BoundingRectangle = {X: geometry.boundingBox.x, Y: geometry.boundingBox.y}; 
		this.OnSliceCommand();
	}

	this.MoveToLayer = function(layerIndex) {
		var layer = SlicedObject.Layers[layerIndex];
		var str = "Layers: \n";
		for (var i = 0; i != SlicedObject.Layers.length; i++)
		{
			str += 'Layer ' + i + ': ' + SlicedObject.Layers[i].Counturs.length + '\n';
		}
		alert(str);
		//alert('                                        Layers count ' + SlicedObject.Layers.length);
		//alert('                                        Counturs count ' + layer.Counturs.length);
		//alert('                                        Points count ' + layer.Counturs[0].ReferencePoints[0].x);
		this.SetLayer(SlicedObject.Layers[layerIndex]);
	}
		
	this.OnSliceCommand = function() {
		alert('OnSliceCommand');
		if (this.step <= 0)
		{
			alert('Step cannot be 0. Please choose correct value.');
			return;
		}
		var slicer = new FastSlicer(Geometry);
		SlicedObject = slicer.Slice(this.step);
		if (SlicedObject == null) {
			alert('Cannot slice object');
			return;
		}
		CurrentLayer = 0;
		alert('MoveToLayer');
		this.MoveToLayer(CurrentLayer);
	}

	// This is maybe not ok if we can have different meanings of event.delta from time to time
	this.OnCanvasScrolled = function(event) {
		if (event.wheelDelta > 0)
		{
			if (CurrentLayer < SlicedObject.Layers.length - 1)
			{
				CurrentLayer++;
				this.MoveToLayer(CurrentLayer);
			}
		}
		else
		{
			if (CurrentLayer > 0)
			{
				CurrentLayer--;
				this.MoveToLayer(CurrentLayer);
			}
		}
	}
	
	var originalLayer = null;
	this.GetLayer = function() {
		return originalLayer;
	}
	
	this.SetLayer = function(newLayer) {
		
		originalLayer = newLayer;
        layer = newLayer.Copy();
			
		RemoveLayer();
		GenerateLayer(layer);
		Visualize();
	}
	
	
	function Visualize() {
		if (areReferencePointsVisible) {
			ShowPoints();
		}
        else {
			HidePoints();
		}
		
		if (areCountursVisible) {
			ShowLines();
		}
        else {
			HideLines();
		}
		
		if (isFillingEnabled) {
			ShowCounturs();
		}
        else {
			HideCounturs();
		}
	}
	
	var currentLines = [];
	var currentAreas = [];
	var currentPoints = [];
	
	function RecalculateLayout(newWidth, newHeight) {
		RecalculatePoints(newWidth, newHeight);
		RecalculateLines(newWidth, newHeight);
		RecalculateAreas(newWidth, newHeight);
	}
	
	function RecalculatePoints(newWidth, newHeight) {
		// TODO: Implement this
	}
	
	function RecalculateLines(newWidth, newHeight) {
		// TODO: Implement this
	}
	
	function RecalculateAreas(newWidth, newHeight) {
		// TODO: Implement this
	}
	
	function HidePoints() {
		console.log('Method HidePoints');
		if (currentPoints == null)
		{
			console.log('Method HidePoints: Cannot hide points as they are absent');
			return;
		}
		currentPoints.forEach(function(item, i, arr) {
            item.visible = false;
        });
		paper.view.draw();
	}
	
	function ShowPoints() {
		console.log('Method ShowPoints');
		if (currentPoints == null)
		{
			console.log('Method ShowPoints: Cannot show points as they are absent');
			return;
		}
		currentPoints.forEach(function(item, i, arr) {
            item.visible = true;
        });
		paper.view.draw();
	}
	
	function ShowLines() {
		console.log('Method ShowLines');
		if (currentLines == null)
		{
			console.log('Method ShowLines: Cannot show lines as they are absent');
			return;
		}
		currentLines.forEach(function(item, i, arr) {
            item.visible = true;
        });
		paper.view.draw();
	}
	
	function HideLines() {
		console.log('Method HideLines');
		if (currentLines == null)
		{
			console.log('Method HideLines: Cannot hide lines as they are absent');
			return;
		}
		currentLines.forEach(function(item, i, arr) {
			item.visible = false;
		});
		paper.view.draw();
	}
	
	function ShowCounturs() {
		console.log('Method ShowCounturs');
		if (currentAreas == null)
		{
			console.log('Method ShowCounturs: Cannot show counturs as they are absent');
			return;
		}
		currentAreas.forEach(function(item, i, arr) {
            item.visible = true;
        });
		paper.view.draw();
	}
	
	function HideCounturs() {
		console.log('Method HideCounturs');
		if (currentAreas == null)
		{
			console.log('Method HideCounturs: Cannot hide counturs as they are absent');
			return;
		}

		currentAreas.forEach(function(item, i, arr) {
			item.visible = false;
		});
		paper.view.draw();
	}
	
	function RemoveLayer() {
		for (var i = 0; i != currentLines.length; i++)
		{
			currentLines[i].remove();
		}
		for (var i = 0; i != currentAreas.length; i++)
		{
			currentAreas[i].remove();
		}
		for (var i = 0; i != currentPoints.length; i++)
		{
			currentPoints[i].remove();
		}
	}
	
	function GenerateLayer(layer) {
		alert('Method GenerateLayer');
		GenerateLines(layer.Counturs);
		GenerateCounturs(layer.Counturs);
		alert('Method After GenerateCounturs');
		var listOfPoints = [];
        layer.Counturs.forEach(function(item, i, arr) {
            listOfPoints.AddRange(item.ReferencePoints);
        });
		GeneratePoints(listOfPoints);
	}
	
	function SortCounturs(unsortedList) {
		alert('Method SortCounturs ' + unsortedList.length);
		alert('Method SortCounturs ' + unsortedList[0].ReferencePoints.length);
		alert('Method SortCounturs ' + unsortedList[0].ReferencePoints[0].X);
        var sortedList = [];
        unsortedList.forEach(function(item, i, arr) {
			
						var maxX = item.ReferencePoints.Select('X').max();
                        var minX = item.ReferencePoints.Select('X').min();
                        var maxY = item.ReferencePoints.Select('Y').max();
                        var minY = item.ReferencePoints.Select('Y').min();
                        //var maxX = item.segments.Select('point').Select('x').max();
                        //var minX = item.segments.Select('point').Select('x').min();
                        //var maxY = item.segments.Select('point').Select('y').max();
                        //var minY = item.segments.Select('point').Select('y').min();
                        
                        sortedList.push(new Tuple(maxX - minX + maxY - minY, item));
                      });
        // var orderedList = sortedList.sort(function(a, b){return b.Item1 - a.Item1});
		
		sortedList.sort(function(a, b){return b.Perimeter - a.Perimeter});
        return sortedList; //.Select('Countur');
    }
	
	function GenerateCounturs(counturs) {
		alert('Method GenerateCounturs');
		var sortedCounturs = SortCounturs(counturs);
		alert('Method GenerateCounturs: sorted successfuly');
		
		
		for (var i = 0; i != sortedCounturs.length; i++)
        {
			var counturLine = new paper.Path();
			counturLine.visible = false;
			counturLine.closed = true;
			counturLine.strokeWidth = 2;
		
			for (var j = 0; j != sortedCounturs[i].Countur.ReferencePoints.length; j++)
			{
				// var adaptedPoint = AdaptToCoordSystem(sortedCounturs[i].Countur.ReferencePoints[j]);
				var adaptedPoint = sortedCounturs[i].Countur.ReferencePoints[j];
				counturLine.add(new paper.Point(adaptedPoint.X, adaptedPoint.Y));
				if (sortedCounturs[i].Countur.IsInternal)
				{
					counturLine.strokeColor = 'green';
					counturLine.fillColor = '#808080';
				}
				else
				{
					counturLine.strokeColor = 'blue';
					counturLine.fillColor = 'yellow';
				}
			}
			
			currentAreas.push(counturLine);
		}
        paper.view.draw();
	}
	
	function GenerateLines(counturs) {
		alert('Method GenerateLines');
		for (var i = 0; i != counturs.length; i++)
        {
			var counturLine = new paper.Path();
			counturLine.strokeColor = 'black';
			counturLine.visible = false;
			counturLine.closed = true;
			counturLine.strokeWidth = 2;
		
			for (var j = 0; j != counturs[i].ReferencePoints.length; j++)
			{
				var adaptedPoint = AdaptToCoordSystem(counturs[i].ReferencePoints[j]);
				counturLine.add(new paper.Point(adaptedPoint.X, adaptedPoint.Y));
			}
			
			currentLines.push(counturLine);
		}
        paper.view.draw();
	}
    
    
    function GeneratePoints(convertedList) {
		console.log('Method: PaintPointsImage\n started executing');
        // alert('PaintPointsImage');
        convertedList.forEach(function(item, i, arr)     { // console.log('Dot: ' + item.X + ' ' + item.Y);
		// var adaptedPoint = AdaptToCoordSystem(item);
              var myCircle = new paper.Path.Circle(new paper.Point(item.X, item.Y), 3);
            myCircle.fillColor = 'red';
            currentPoints.push(myCircle);
            
        });
        paper.view.draw();
    }
    
    var xRatio = 1; var yRatio = 1;
    var minPointDelta = new VisualPoint();
    
    function AdaptToCoordSystem(point) {
        // Adapt to (0, 0) - (Top, Left) system
        point.X += minPointDelta.X;
        point.Y += minPointDelta.Y;
        point.X *= xRatio;
        point.Y *= yRatio;
		//alert('AdaptToCoordSystem ratio: ' + xRatio + ' ' + yRatio);
		//alert('AdaptToCoordSystem : ' + minPointDelta.X + ' ' + minPointDelta.Y);
        
        return point;
    }
   
    function SetBoundingRectangle(minPoint, maxPoint) {
        minPointDelta.X = -minPoint.x;
        minPointDelta.Y = -minPoint.y;
//alert('SetBoundingRectangle ' + minPointDelta.X + ' ' + minPointDelta.Y);
        xRatio = canvas.width / Math.abs(maxPoint.x - minPoint.x);
        yRatio = canvas.height / Math.abs(maxPoint.y - minPoint.y);
        // alert('Ratio: ' + xRatio + ' ' + yRatio);
    }
	
	var areCountursVisible = linesState; // pointsState, linesState, countursState
    var areReferencePointsVisible = pointsState;
    var isFillingEnabled = countursState;
    
    this.GetAreCountursVisible = function() {
        return areCountursVisible;
    }
    this.SetAreCountursVisible = function(newValue) {
        areCountursVisible = newValue;
    }
    
    this.GetAreReferencePointsVisible = function() {
        return areReferencePointsVisible;
    }
    this.SetAreReferencePointsVisible = function(newValue) {
        areReferencePointsVisible = newValue;
    }
    
    this.GetIsFillingEnabled = function() {
        return isFillingEnabled;
    }
    this.SetIsFillingEnabled = function(newValue) {
        isFillingEnabled = newValue;
    }
}