
function PolygonList() {
    var polygons = [];
    this.Polygons = polygons;
    this.Clear = function() {
            polygons.splice(0, polygons.length);
    }
    this.Add = function(polygon) {
        polygons.push(polygon);
    }
}
// We don't need this
function PointList() {
        var points = [];
        this.Points = points;
    this.Clear = function() {
            points.splice(0, points.length);
    }
    this.AddRange = function(Points) {
            Points.forEach(function(item, i, arr)                             {
                          points.push(item);
              });
    }
    this.Add = function(point) {
            points.push(point);
    }
}
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
function VisualCountur() {

    var isInternal = false;
    var referencePoints = [];
    this.IsInternal = isInternal;
    this.ReferencePoints = referencePoints;
}
function VisualCountur(isInternal, refPoints) {
    this.IsInternal = isInternal;
    this.ReferencePoints = refPoints;
    // alert('PC: In countur' + refPoints[0].x);
    this.Copy = function() {
    		var copiedCountur = new VisualCountur();
        copiedCountur.IsInternal = this.IsInternal;
        var copiedReferencePoints = [];
        this.ReferencePoints.forEach(function(item, i, arr)  
		{
			// alert('Point: ' + item.X + ' ' + item.Y);
             copiedReferencePoints.push(new VisualPoint(item.X, item.Y));
        });
        copiedCountur.ReferencePoints = copiedReferencePoints;
        return copiedCountur;
    }
}
function VisualLayer() {
    var counturs = [];
    this.Counturs = counturs;
    this.Copy = function() {
    		var copiedLayer = new VisualLayer();
        var copiedCounturs = [];
        // alert('Inside: ' + counturs.length);
        // alert('Inside: ' + this.Counturs.length);
        this.Counturs.forEach(function(item, i, arr)                             {
             copiedCounturs.push(item.Copy());
        });
        copiedLayer.Counturs = copiedCounturs;
        return copiedLayer;
    }
}

// ATTENTION: Add RecalculateLayout function to prevent
function SlicerView(canvas) {

		// Handlers
    this.OnFillCountursChanged = function(state) {
    	isFillingEnabled = state;
        //alert('filling state: ' + state);
    }
    this.OnShowLineChanged = function(state) {
    	areCountursVisible = state;
        //alert('line state: ' + state);
    }
    this.OnShowPointsChanged = function(state) {
    	areReferencePointsVisible = state;
        //alert('point state: ' + state);
    }
	this.OnResize = function(event, sideLength) {
		canvas.height = sideLength;
		canvas.width = sideLength;
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
	
	/*
	this.GetObject = function() {
		return SlicedObject;
	}
	*/
	
	//var boundingRectangle = null;
    // this.BoundingRectangle = boundingRectangle;
	
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
	function OnCanvasScrolled(event) {
		if (event.delta > 0)
		{
			if (CurrentLayer < SlicedObject.Layers.length - 1)
			{
				CurrentLayer++;
				MoveToLayer(CurrentLayer);
			}
		}
		else
		{
			if (CurrentLayer > 0)
			{
				CurrentLayer--;
				MoveToLayer(CurrentLayer);
			}
		}
	}
    
    var layer = null;
    var originalLayer = null;
    
    this.GetLayer = function() {
        return originalLayer;
    }
    this.SetLayer = function(newLayer) {
    				originalLayer = newLayer;
					
            layer = newLayer.Copy();
			
            //alert(layer.Counturs.length);
            // boundingRectangle = this.BoundingRectangle;
        // alert('Bounds: ' + this.BoundingRectangle.minPoint.X);
        BuildLayer(layer/*, boundingRectangle*/);
    }
    
	/*
    var SortCounturs = function(unsortedList) {
        var sortedList = [];
        unsortedList.Polygons.forEach(function(item, i, arr) {
                          var maxX = item.segments.Select('point').Select('x').max();
                        var minX = item.segments.Select('point').Select('x').min();
                        var maxY = item.segments.Select('point').Select('y').max();
                        var minY = item.segments.Select('point').Select('y').min();
                        
                        sortedList.push(new Tuple(maxX - minX + maxY - minY, item));
                      });
        var orderedList = sortedList.sort(function(a, b){return b.Perimeter - a.Perimeter});
        return orderedList.Select('Countur');
    }
	*/
    
    var BuildLayer = function(layer/*, boundingRectangle*/) {
    alert('BuildLayer');
	
	/*
    if (boundingRectangle == null)
            {
				alert('                                 BuildLayer boundingRectangle is null');
                var minPoint = new VisualPoint(listOfPoints.Points.Select('Point').Select('X').min(), listOfPoints.Points.Select('Y').min());
                var maxPoint = new VisualPoint(listOfPoints.Points.Select('X').max(), listOfPoints.Points.Select('Y').max());
                SetBoundingRectangle(minPoint, maxPoint);
            }
            else
            {//alert('Rect: ' + boundingRectangle.minPoint.X);
				SetBoundingRectangle(boundingRectangle.minPoint, boundingRectangle.maxPoint);
            }
            */
        RemoveCurrentLayer();
        
        layer.Counturs.forEach(function(item, i, arr)                             {
                          BuildCountur(item);
              });
        if (isFillingEnabled) {
                var sortedPolygons = SortCounturs(currentLayer);
            
            sortedPolygons.forEach(function(item, i, arr)                             {
                              AddPolygon(item);
                      });
        }/*
		var str = "";
				str += 'Layer\n';
				for (var j = 0; j != layer.Counturs.length; j++)
				{
					str += '		Countur ' + j + ': \n';
					for (var k = 0; k != layer.Counturs[j].ReferencePoints.length; k++)
					{
						str += '			Point ' + k + ': ' + layer.Counturs[j].ReferencePoints[k].X + ', ' + layer.Counturs[j].ReferencePoints[k].Y + '\n';
					}
				}
			alert(str);*/
        // Create points image
        var listOfPoints = new PointList();
        layer.Counturs.forEach(function(item, i, arr)                             {
                          listOfPoints.AddRange(item.ReferencePoints);
                          // alert('listOfPoints ' + item.ReferencePoints[0].X);
              });

            RemovePoints();
            GeneratePoints(listOfPoints);
            // Instead of two rows under we use one row above
            // currentPoints = GetPointsImage(convertedList);
            // AddPointsImage(currentPoints);
            
            if (!areReferencePointsVisible)
                {
                currentPoints.forEach(function(item, i, arr) {
              		item.visible = false;
        				});
                paper.view.draw();
        }
    }
	
	
	function Visualize() {
		if (isFillingEnabled) {
			ShowPoints();
		}
        else {
			HidePoints();
		}
		
		if (areReferencePointsVisible) {
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
		if (currentPoints == null)
		{
			console.log('Method HidePoints: Cannot hide points as they are absent');
			return;
		}
		currentPoints.forEach(function(item, i, arr) {
            item.visible = false;
        });
	}
	
	function ShowPoints() {
		if (currentPoints == null)
		{
			console.log('Method ShowPoints: Cannot show points as they are absent');
			return;
		}
		currentPoints.forEach(function(item, i, arr) {
            item.visible = true;
        });
	}
	
	function ShowLines() {
		if (currentLines == null)
		{
			console.log('Method ShowLines: Cannot show lines as they are absent');
			return;
		}
		currentLines.forEach(function(item, i, arr) {
            item.visible = true;
        });
	}
	
	function HideLines() {
		if (currentLines == null)
		{
			console.log('Method HideLines: Cannot hide lines as they are absent');
			return;
		}
		currentLines.forEach(function(item, i, arr) {
			item.visible = false;
		});
	}
	
	function ShowCounturs() {
		if (currentAreas == null)
		{
			console.log('Method ShowCounturs: Cannot show counturs as they are absent');
			return;
		}
		currentAreas.forEach(function(item, i, arr) {
            item.visible = true;
        });
	}
	
	function HideCounturs() {
		if (currentAreas == null)
		{
			console.log('Method HideCounturs: Cannot hide counturs as they are absent');
			return;
		}

		currentAreas.forEach(function(item, i, arr) {
			item.visible = false;
		});
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
                        //var maxX = item.segments.Select('point').Select('x').max();
                        //var minX = item.segments.Select('point').Select('x').min();
                        //var maxY = item.segments.Select('point').Select('y').max();
                        //var minY = item.segments.Select('point').Select('y').min();
                        
                        sortedList.push(new Tuple(maxX - minX + maxY - minY, item));
                      });
        var orderedList = sortedList.sort(function(a, b){return b.Perimeter - a.Perimeter});
        return orderedList; //.Select('Countur');
    }
	
	function GenerateCounturs(counturs) {
		
		var sortedCounturs = SortCounturs(counturs);
		for (var i = 0; i != sortedCounturs.length; i++)
        {
			var counturLine = new paper.Path();
			counturLine.visible = false;
			counturLine.closed = true;
			counturLine.strokeWidth = 2;
		
			for (var j = 0; j != sortedCounturs[i].Item2.ReferencePoints.length; j++)
			{
				var adaptedPoint = AdaptToCoordSystem(closedCountur[i].ReferencePoints[i]);
				counturLine.add(new paper.Point(adaptedPoint.X, adaptedPoint.Y));
				if (sortedCounturs[i].Item2.IsInternal)
				{
					counturLine.strokeColor = 'green';
					counturLine.fillColor = '#80808000';
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
				var adaptedPoint = AdaptToCoordSystem(closedCountur[i].ReferencePoints[i]);
				counturLine.add(new paper.Point(adaptedPoint.X, adaptedPoint.Y));
			}
			
			currentLines.push(counturLine);
		}
        paper.view.draw();
	}
    
    
    var GeneratePoints = function(convertedList) {
		console.log('Method: PaintPointsImage\n started executing');
        // alert('PaintPointsImage');
        convertedList.forEach(function(item, i, arr)     { // alert('Dot: ' + item.X + ' ' + item.Y);
              var myCircle = new paper.Path.Circle(new paper.Point(item.X, item.Y), 3);
            myCircle.fillColor = 'red';
            currentPoints.push(myCircle);
            
        });
        paper.view.draw();
    }
    
    var xRatio = 1; var yRatio = 1;
        var minPointDelta = new VisualPoint();
    
    var AdaptToCoordSystem = function(point) {
        // Adapt to (0, 0) - (Top, Left) system
        point.X += minPointDelta.X;
        point.Y += minPointDelta.Y;
        point.X *= xRatio;
        point.Y *= yRatio;
		//alert('AdaptToCoordSystem ratio: ' + xRatio + ' ' + yRatio);
		//alert('AdaptToCoordSystem : ' + minPointDelta.X + ' ' + minPointDelta.Y);
        
        return point;
    }
   
    var SetBoundingRectangle = function(minPoint, maxPoint) {
    /*
        if (maxPoint.x < minPoint.x)
        {
            maxPoint.x = [minPoint.x, minPoint.x = maxPoint.x][0];
        }
        if (maxPoint.y < minPoint.y)
        {
            maxPoint.y = [minPoint.y, minPoint.y = maxPoint.y][0];
        }*/
        minPointDelta.X = -minPoint.x;
        minPointDelta.Y = -minPoint.y;
//alert('SetBoundingRectangle ' + minPointDelta.X + ' ' + minPointDelta.Y);
        xRatio = canvas.width / Math.abs(maxPoint.x - minPoint.x);
        yRatio = canvas.height / Math.abs(maxPoint.y - minPoint.y);
        // alert('Ratio: ' + xRatio + ' ' + yRatio);
    }
    
    var BuildCountur = function(closedCountur) {
    
        var counturLine = new paper.Path();
        counturLine.strokeColor = 'black';
        counturLine.visible = false;
        counturLine.closed = true;
        if (isFillingEnabled)
        {
            if (closedCountur.IsInternal)
                counturLine.strokeColor = 'green';
            else
                counturLine.strokeColor = 'blue';
        }
        counturLine.strokeWidth = 2;
        
        for (var i = 0; i != closedCountur.ReferencePoints.length; i++)
        {
            var adaptedPoint = AdaptToCoordSystem(closedCountur.ReferencePoints[i]);
      // alert(closedCountur.ReferencePoints[i].X + ' ' + closedCountur.ReferencePoints[i].Y);
            counturLine.add(new paper.Point(adaptedPoint.X, adaptedPoint.Y));
        }
        if (!areCountursVisible)
            counturLine.visible = false;
        else
        		counturLine.visible = true;
        currentLayer.Add(counturLine);
        
        if (isFillingEnabled)
        {
            if (closedCountur.IsInternal)
                counturLine.fillColor = 'gray';
            else
                counturLine.fillColor = 'yellow';
        }
        paper.view.draw();
    }
    
    var RemoveCurrentLayer = function() {
         currentLayer.Polygons.forEach(function(item, i, arr) {
                RemovePolygon(item);
             });
        currentLayer.Clear();
    }
    var RemovePoints = function() {
        currentPoints.forEach(function(item, i, arr) {
              item.remove();
        });
    
        currentPoints = [];
    }
    /*
    var AddPolygon = function(polygon) {
        polygon.visible = true;
    }
    */
    var RemovePolygon = function(polygon) {
        polygon.remove();
    }
    
    var areCountursVisible = false;
    var areReferencePointsVisible = false;
    var isFillingEnabled = false;
    
    this.GetAreCountursVisible = function() {
        return areCountursVisible;
    }
    this.SetAreCountursVisible = function(newValue) {
        areCountursVisible = newValue;
        
        if (areCountursVisible) {
            currentLayer.Polygons.forEach(function(item, i, arr) {
                          item.visible = true;
             });
        }
        else {
            currentLayer.Polygons.forEach(function(item, i, arr) {
                          item.visible = false;
             });
        }
    }
    
    this.GetAreReferencePointsVisible = function() {
        return areReferencePointsVisible;
    }
    this.SetAreReferencePointsVisible = function(newValue) {
        areReferencePointsVisible = newValue;
        
        if (areReferencePointsVisible) {
            currentPoints.forEach(function(item, i, arr) {
                item.visible = true;
            });
        }
        else {
            currentPoints.forEach(function(item, i, arr) {
                item.visible = false;
            });
        }
    }
    
    this.GetIsFillingEnabled = function() {
        return isFillingEnabled;
    }
    this.SetIsFillingEnabled = function(newValue) {
        isFillingEnabled = newValue;
    }
}