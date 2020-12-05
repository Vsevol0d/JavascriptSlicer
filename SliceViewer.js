
function Tuple(perimeter, countur) {
    this.Perimeter = perimeter;
    this.Countur = countur;
}

function VisualPoint(x, y) {
    this.X = x;
    this.Y = y;

    this.Copy = function() {
    		var cx = this.X;
        var cy = this.Y;
    		return new VisualPoint(cx, xy);
    }
}

function SliceViewer(canvas, layerChangedCallback, pointsState, linesState, countursState) {
	
	// Handlers
    this.OnFillCountursChanged = function(state) {
    	this.SetIsFillingEnabled(state);
		if (state) ShowCounturs();
		else HideCounturs();
    }
    this.OnShowLineChanged = function(state) {
    	this.SetAreCountursVisible(state);
		if (state) ShowLines();
		else HideLines();
    }
    this.OnShowPointsChanged = function(state) {
    	this.SetAreReferencePointsVisible(state);
		if (state) ShowPoints();
		else HidePoints();
    }
	this.OnResize = function(event, sideLength) {
		canvas.height = sideLength;
		//canvas.width = sideLength;
		RecalculateLayout(sideLength, sideLength);
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
		Geometry = geometry;
		SetBoundingRectangle(geometry.boundingBox.min, geometry.boundingBox.max); 
		SlicedObject = null;
		CurrentLayer = 0;
		this.MoveToLayer(CurrentLayer);
		// this.OnSliceCommand();
	}

	this.MoveToLayer = function(layerIndex) {
		this.SetLayer(SlicedObject.Layers[layerIndex]);
	}
		
	this.OnSliceCommand = function() {
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
		
		layerChangedCallback(CurrentLayer, layer);
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
		paper.view.draw();
	}
	
	function GenerateLayer(layer) {
		GenerateLines(layer.Counturs);
		GenerateCounturs(layer.Counturs);
		var listOfPoints = [];
        layer.Counturs.forEach(function(item, i, arr) {
            listOfPoints.AddRange(item.ReferencePoints);
        });
		GeneratePoints(listOfPoints);
	}
	
	function SortCounturs(unsortedList) {
        var sortedList = [];
        unsortedList.forEach(function(item, i, arr) {
			
						var maxX = item.ReferencePoints.Select('X').max();
                        var minX = item.ReferencePoints.Select('X').min();
                        var maxY = item.ReferencePoints.Select('Y').max();
                        var minY = item.ReferencePoints.Select('Y').min();
                        
                        sortedList.push(new Tuple(maxX - minX + maxY - minY, item));
                      });
		
		sortedList.sort(function(a, b){return b.Perimeter - a.Perimeter});
        return sortedList;
    }
	
	function GenerateCounturs(counturs) {
		var sortedCounturs = SortCounturs(counturs);
		
		
		for (var i = 0; i != sortedCounturs.length; i++)
        {
			var counturLine = new paper.Path();
			counturLine.visible = false;
			counturLine.closed = true;
			counturLine.strokeWidth = 2;
		
			for (var j = 0; j != sortedCounturs[i].Countur.ReferencePoints.length; j++)
			{
				var adaptedPoint = sortedCounturs[i].Countur.ReferencePoints[j];
				counturLine.add(new paper.Point(adaptedPoint.X, adaptedPoint.Y));
				if (sortedCounturs[i].Countur.IsInternal)
				{
					counturLine.strokeColor = 'green';
					counturLine.fillColor = '#808080';
					counturLine.blendMode = 'xor';
					// counturLine.opacity = 0;
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
        convertedList.forEach(function(item, i, arr)     {
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
        
        return point;
    }
   
    function SetBoundingRectangle(minPoint, maxPoint) {
        minPointDelta.X = -minPoint.x;
        minPointDelta.Y = -minPoint.y;

        xRatio = canvas.width / Math.abs(maxPoint.x - minPoint.x);
        yRatio = canvas.height / Math.abs(maxPoint.y - minPoint.y);
    }
	
	var areCountursVisible = linesState;
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