
function Tuple2(item1, item2) {
	this.Item1 = item1;
	this.Item2 = item2;
}

function Tuple3(item1, item2, item3) {
	this.Item1 = item1;
	this.Item2 = item2;
	this.Item3 = item3;
}

function SlicerPoint(x, y) {
	this.X = x;
	this.Y = y;
	
	this.Copy = function() {
		return new SlicerPoint(this.X, this.Y);
	}
}

function SlicerPoint3(x, y, z) {
	this.X = x;
	this.Y = y;
	this.Z = z;
	
	this.Copy = function() {
		return new SlicerPoint(this.X, this.Y, this.Z);
	}
}


/*
function Point() {
	this.X = null;
	this.Y = null;
	
	this.Copy() = function() {
		return new Point(this.X, this.Y);
	}
}
*/
function SlicerVector(x, y) {
	this.X = x;
	this.Y = y;
	
	this.Copy = function() {
		return new SlicerVector(this.X, this.Y);
	}
}
/*
function Vector() {
	this.X = null;
	this.Y = null;
	
	this.Copy() = function() {
		return new Vector(this.X, this.Y);
	}
}
*/
function TestPointLayer() {
    this.layerCounturs = [];
}

function TestPointCountur() {
 	this.IsInternal;
    this.counturPoints = [];
}

function TestPointLayers()
{
    this.testPointLayers = [];
}

function ConfigSettings() {
    this.useNeighbourCubes = false;
    this.arrayDimensions = null;
    this.xLimitValues = null;
    this.yLimitValues = null;
    this.zLimitValues = null;
}

function Point3D(x, y, z) {
	this.X = x;
	this.Y = y;
	this.Z = z;
}

function BoundingBoxConstructor(startPoint, endPoint) {
	this.minPoint = startPoint;
    this.maxPoint = endPoint;
}


function ObjectSortedCollection(settings) {
        var xAxisDelimiters = [];
        var yAxisDelimiters = [];
        var zAxisDelimiters = [];
        var sortedArray = [];
		var _dimensions = settings.arrayDimensions;

		this.GetBoundingBox = function() {
			return BoundingBox;
		}
        var BoundingBox = null;

        this.ToList = function()
        {
            var list = [];
            for (var k = 0; k != _dimensions.Item1; k++)
            {
                var zPositionList = [];
                for (var i = 0; i != _dimensions.Item2; i++)
                {
                    for (var j = 0; j != _dimensions.Item3; j++)
                    {
					if (sortedArray[i][j][k].length != 0)
					{
						//alert('                                      sortedArray Point: ' + sortedArray[i][j][k][0].point.Z);
					}
                        zPositionList.AddRange(sortedArray[i][j][k]);
                    }
                }
				
                list.AddRange(zPositionList.sort(function(a, b) {
					return a.point.Z - b.point.Z;
				}));
            }
			
			//alert('                                      ToList Point 1: ' + list[0].point.Z);
				//alert('                                      ToList Point 2: ' + list[1].point.Z);
				//alert('                                      ToList Point 3: ' + list[2].point.Z);
            return list;
        }

        var InitAxis = function(size, axisLimitValues)
        {
            // Here Item1 is min value, Item2 - max value
            var axis = new Array();
            var delta = (axisLimitValues.Item2 - axisLimitValues.Item1) / size;
            var currValue = axisLimitValues.Item1 + delta;
            for (var i = 0; i != size; i++)
            {
                axis[i] = currValue;
                currValue += delta;
            }
			return axis;
        }
		// alert('ObjectSortedCollection: InitAxis');

        // Improve this in future. This can be searched using binary search.
        this.Add = function(point)
        {
            var m = null; var n = null; var k = null;

			// alert('                        Try to add Point ' + point.X);
            // Search in X array
            m = SearchArrayIndex(xAxisDelimiters, point.X);

            // Search in Y array
            n = SearchArrayIndex(yAxisDelimiters, point.Y);

            // Search in Z array
            k = SearchArrayIndex(zAxisDelimiters, point.Z);

            // Search in cube. In future implement binary search
            // For now it is linear searching only enabled
			//alert('                        Add in ' + m + ' ' + n + ' ' + k);
			//alert('                        Add in ' + sortedArray);
			//alert('                        Add in ' + sortedArray[m][n][k].length);
			
            for (var i = 0; i != sortedArray[m][n][k].length; i++)
            {
                if (sortedArray[m][n][k][i].point.X == point.X && 
                    sortedArray[m][n][k][i].point.Y == point.Y &&
                    sortedArray[m][n][k][i].point.Z == point.Z)
                {
                    return sortedArray[m][n][k][i];
                }
            }
			//alert('                        Add sortedArray')

            // If no the same point found create new one
            var specPoint = new SpecPoint();
            specPoint.point = point;
            sortedArray[m][n][k].push(specPoint); var g = sortedArray[m][n][k].length - 1;
			// alert('Point added ' + sortedArray[m][n][k][g].point.X + ' ' + sortedArray[m][n][k][g].point.Y + ' ' + sortedArray[m][n][k][g].point.Z);
			// alert('Point added ' + specPoint.point.X + ' ' + specPoint.point.Y + ' ' + specPoint.point.Z);
			// alert('                        Point added ' + sortedArray[m][n][k][g].point.X + ' ' + sortedArray[m][n][k][g].point.Y + ' ' + sortedArray[m][n][k].point.Z);
			// alert('                                 Sorted array of' + i + ' ' + ' ' + j + ' ' + k + ' l: ' + sortedArray[i][j][k].length);
            return specPoint;
        }

        var SearchArrayIndex = function(arrayToSearch, coord)
        {
            var k = 0;
            for (var i = 0; i != arrayToSearch.length; i++)
            {
                if (arrayToSearch[i] > coord)
                {
                    k = i;
                    break;
                }
            }
            return k;
        }
		
		//alert('ObjectSortedCollection: SearchArrayIndex');
		
		xAxisDelimiters = InitAxis(_dimensions.Item1, settings.xLimitValues);
        yAxisDelimiters = InitAxis(_dimensions.Item2, settings.yLimitValues);
        zAxisDelimiters = InitAxis(_dimensions.Item3, settings.zLimitValues);
		
		//alert('ObjectSortedCollection: xAxisDelimiters');

        BoundingBox = new BoundingBoxConstructor(new Point3D(settings.xLimitValues.Item1,
            settings.yLimitValues.Item1, settings.zLimitValues.Item1),
            new Point3D(settings.xLimitValues.Item2, settings.yLimitValues.Item2,
                settings.zLimitValues.Item2));

				//alert('ObjectSortedCollection: Dims ' + _dimensions.Item1 + ' ' + _dimensions.Item2 + ' ' + _dimensions.Item3);
        // Init sorted array
        sortedArray = new Array();
        for (var i = 0; i != _dimensions.Item1; i++)
        {
			sortedArray[i] = new Array();
            for (var j = 0; j != _dimensions.Item2; j++)
            {
				sortedArray[i][j] = new Array();
                for (var k = 0; k != _dimensions.Item3; k++)
                {
                    sortedArray[i][j][k] = new Array();
                }
            }
        }
		//alert('ObjectSortedCollection: sortedArray');
    }
	
	function SliceCommandSettings(zDeltaDistanceVal)
    {
        this.UseOnlyNewAdditionAnalysis = false;
        this.zDeltaDistance = zDeltaDistanceVal;
    }
	
	function SpecPoint()
    {
	    this.isVisited = false;

        // #region RelationsEnumerator declaration

        this.currentRelationIndex;
	    this.startEdges = [];     // This must be added during file read process

        // #endregion
        
        this.point = null;                                       // This must be added during file read process
    }
	
	function CounturPoint()
    {
        this.IsAlreadyBuilt = false;
        this.isActual = false;
        this.IsPrevStep = false;
        this.IsInverseDirection = false;
        this.Next = null;
	    this.Prev = null;
	    this.point = new SlicerPoint(0, 0);
	    this.stepDelta = new SlicerVector(0, 0);
	    this.relPoints = [];    // This must be added during file read process

        this.Copy = function()
        {
            var cp = new CounturPoint();
            cp.isActual = isActual;
            cp.IsAlreadyBuilt = IsAlreadyBuilt;
            cp.IsPrevStep = IsPrevStep;
            cp.Next = Next;
            cp.Prev = Prev;
            cp.point = point.Copy();
            cp.stepDelta = stepDelta.Copy();
            return cp;
        }
    }
	
	function ObjectLayer() {
		this.Counturs = [];
		
		this.Copy = function() {
				var copiedLayer = new ObjectLayer();
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
	
	function CounturData() {
		this.IsInternal;
		this.ReferencePoints = [];
		
		this.Copy = function() {
    		var copiedCountur = new CounturData();
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
	
	function PrintObject(name) {
		this.Name = name;
		this.Layers = [];
	}
	
	
	
	
	// This is Slicer with objectSortedCollection which uses k-tree to accelerate collecting points process
		// Not sure this is really fast :)
		function FastSlicer(geometry) {// alert('                                              in fast slicer');
			var xDim = 5; var yDim = 5; var zDim = 5;
			this.Slice = function(sliceStep) {
			
				if (sliceStep <= 0)
					return;
				var slicedObject = new SlicedObject();
				slicedObject.objectSortedCollection = ConstructObjectModel(geometry);
				
				// TODO
				var minZ = geometry.boundingBox.min.z;//slicedObject.objectSortedCollection.BoundingBox.minPoint.Z;
				var maxZ = geometry.boundingBox.max.z;//slicedObject.objectSortedCollection.BoundingBox.maxPoint.Z;
				
				alert('                         pre Slicer');
				var slicer = new Slicer(new SliceCommandSettings(sliceStep), minZ, maxZ, slicedObject.objectSortedCollection.ToList());
				alert('                         Slicer constructed');
				var printObject = slicer.Execute();
				alert('                         Slicer executed');
				
				return printObject;		//returning of PrintObject
			}
			
			function ConstructObjectModel(geometry)
			{
				var MinMaxPoints = new Tuple2(geometry.boundingBox.min/*.vertices.minPoint()*/, geometry.boundingBox.max/*.vertices.maxPoint()*/);
				
				//alert('Min x: ' + MinMaxPoints.Item1 + ' y: ' + MinMaxPoints.Item2);
				//alert('Min x: ' + MinMaxPoints.Item1.x + ' y: ' + MinMaxPoints.Item1.y);
				//alert('Max x: ' + MinMaxPoints.Item2.x + ' y: ' + MinMaxPoints.Item2.y);
				//alert('Min x: ' + geometry.boundingBox.min.x + ' y: ' + geometry.boundingBox.min.y);
				//alert('Max x: ' + geometry.boundingBox.max.x + ' y: ' + geometry.boundingBox.max.y);
				var config = {
					useNeighbourCubes: false,
					arrayDimensions: new Tuple3(xDim, yDim, zDim),
					minMaxPoints: MinMaxPoints,
					xLimitValues: new Tuple2(MinMaxPoints.Item1.x, MinMaxPoints.Item2.x),
					yLimitValues: new Tuple2(MinMaxPoints.Item1.y, MinMaxPoints.Item2.y),
					zLimitValues: new Tuple2(MinMaxPoints.Item1.z, MinMaxPoints.Item2.z)
				};

				//alert('                             ConstructObjectModel: ObjectSortedCollection start');
				var objectSortedCollection = new ObjectSortedCollection(config);
				//alert('                             ConstructObjectModel: ObjectSortedCollection end');
				// This is blocked as it works very slow
				for (var i = 0; i != geometry.faces.length; i++)
				{
				// alert('analyze face a: ' + geometry.faces[i].a.x + ' ' geometry.faces[i].b.z);
					AnalyzeFacet(geometry.faces[i], geometry.vertices, objectSortedCollection);
				}
            
				return objectSortedCollection;
			}
			
			function OrderFaceVertices(facet, vertices) {
				// var orderedPoints = facet.triPoints.OrderBy<Point3D, double>(x => x.z).ToList<Point3D>();
				// alert('OrderFaceVertices a: ' + facet.a.x + ' ' + facet.a.y);
				
				var orderedPoints = [new SlicerPoint3(vertices[facet.a].x, vertices[facet.a].y, vertices[facet.a].z), new SlicerPoint3(vertices[facet.b].x, vertices[facet.b].y, vertices[facet.b].z), new SlicerPoint3(vertices[facet.c].x, vertices[facet.c].y, vertices[facet.c].z)];
				orderedPoints.sort(function(a, b) {
					return a.Z - b.Z;
				});
				return orderedPoints;
			}
			
			function AnalyzeFacet(facet, vertices, objectSortedCollection)
			{
				// Calculate normal projection vector
				var normalZPlaneProjection = new SlicerVector(facet.normal.x, facet.normal.y);

				var orderedPoints = OrderFaceVertices(facet, vertices);
				// alert('Ordered: ' + orderedPoints[0].X);
            
				var p1 = objectSortedCollection.Add(orderedPoints[0]);
				var p2 = objectSortedCollection.Add(orderedPoints[1]);
				var p3 = objectSortedCollection.Add(orderedPoints[2]);
				var s1 = Connect(p1, p2);
				var s2 = Connect(p1, p3);
				var s3 = Connect(p2, p3);

				s1.Item2.relPoints.push(new Tuple2(s2.Item2, normalZPlaneProjection));
				s1.Item2.relPoints.push(new Tuple2(s3.Item2, normalZPlaneProjection));

				s2.Item2.relPoints.push(new Tuple2(s1.Item2, normalZPlaneProjection));
				s2.Item2.relPoints.push(new Tuple2(s3.Item2, normalZPlaneProjection));

				s3.Item2.relPoints.push(new Tuple2(s1.Item2, normalZPlaneProjection));
				s3.Item2.relPoints.push(new Tuple2(s2.Item2, normalZPlaneProjection));
			}
			
			function Connect(pointFrom, pointTo)
			{
				if (pointFrom.point.Z > pointTo.point.Z)
					return null;

				var pair = null;
				
				// ATTENTION: This checking makes algorithm slower but it is only way
				// to fill relPoints
				var existingEdge = pointFrom.startEdges.Find(function(x) {return x.Item1 == pointTo ||
					(x.Item1.point.X == pointTo.point.X && x.Item1.point.Y == pointTo.point.Y &&
					x.Item1.point.Z == pointTo.point.Z);});
				if (existingEdge != null)
				{
					pair = new Tuple2(pointTo, existingEdge.Item2);
				}
				else
				{
					pair = new Tuple2(pointTo, new CounturPoint());
					pointFrom.startEdges.push(pair);
				}

				return pair;
			}
		}
// TODO: 
// 1) ensure that return value of slicer.Slice will return suggested interface
// 2) check if all the structs were account
	
	
	

function Slicer(sliceCommandSettings, minZ, maxZ, specPoints) {
    var currentActualPointIndex = 0;
    var actualPoints = [];
	var modelMinZ = minZ;
    var modelMaxZ = maxZ;
    var zDistance = sliceCommandSettings.zDeltaDistance;
    var delta = modelMinZ;
	var currentIndex = 0;
	
    var sortedPoints = specPoints;
	
    sortedPoints.sort(function(a, b) {
					return a.point.Z - b.point.Z;
				});
				
	
	// Execute for Mode 1
        this.Execute = function(data)
        {
            var currentLayer = new ObjectLayer();
            var printObject = new PrintObject();

            delta += zDistance;
            while (delta <= modelMaxZ)
            {
				// alert('from ' + delta + ' to ' + modelMaxZ + ' by ' + zDistance);
                var count = actualPoints.length;

                // Init new points
				
	            while (currentIndex < sortedPoints.length && sortedPoints[currentIndex].point.Z <= delta)
	            {
				// alert('                                           POINT ACCOUNTED ' + currentIndex + ' of ' + sortedPoints.length);
		            sortedPoints[currentIndex].isVisited = true;
			        actualPoints.push(sortedPoints[currentIndex++]);
	            }
				//alert('                                      ActualPoints: ' + actualPoints.length);
				//alert('                                      Point 1: ' + actualPoints[0].point.Z);
				//alert('                                      Point 2: ' + actualPoints[1].point.Z);
				//alert('                                      Point 3: ' + actualPoints[2].point.Z);
				//alert('                                      Delta: ' + delta);
				
                // We place the following code apart of (Init new points) to exclude
                // edges that was fully layed in zDistance, so we can use SetCounturPart() now
                for (var i = count; i != actualPoints.length; i++)
                {
                    InitIntersections(actualPoints[i], delta);
                }

                // Do Step1: Intersection
                for (var i = 0; i != count; i++)
                {
                    DoIntersections(actualPoints[i]);
                }

                // Do Step2: Perform newly added points
                PerformCounturs(count);
                var layer = PerformLayer(count);
                currentLayer = layer;
                printObject.Layers.push(currentLayer);
                delta += zDistance;
				alert('                          Delta: ' + delta + ', Max: ' + modelMaxZ);
            }
// alert('                                 OUT OF CYCLE');

			var str = "";
			for (var i = 0; i != printObject.Layers.length; i++)
			{
				str += 'Layer ' + i + ': \n';
				for (var j = 0; j != printObject.Layers[i].Counturs.length; j++)
				{
					str += '		' + printObject.Layers[i].Counturs[j].IsInternal + ' Countur ' + j + ': \n';
					for (var k = 0; k != printObject.Layers[i].Counturs[j].ReferencePoints.length; k++)
					{
						str += '			Point ' + k + ': ' + printObject.Layers[i].Counturs[j].ReferencePoints[k].X + ', ' + printObject.Layers[i].Counturs[j].ReferencePoints[k].Y + '\n';
					}
				}
			}
			alert(str);
            return printObject;
        }
		
		// This function creates point counturs
        function PerformLayer(startIndex)
        {
            var objectLayer = new ObjectLayer();
            // var counturData = new CounturData();

            CreateBuildContext();
            var cp = [];
			alert('                                       Points to search: ' + actualPoints.length);
            for (var i = 0; i != actualPoints.length; i++)
            {
                for (var j = 0; j != actualPoints[i].startEdges.length; j++)
                {
                    
                    if (!actualPoints[i].startEdges[j].Item2.IsAlreadyBuilt &&
                        actualPoints[i].startEdges[j].Item2.isActual)
                    {
                        // We can control here if counturs intersect
						//alert('About to build countur');
                        var pointCountur = BuildCountur(actualPoints[i].startEdges[j].Item2);
						// counturData = pointCountur;
						objectLayer.Counturs.push(pointCountur);
                        // counturData.Add(pointCountur, PrintMaterial.Paper);
                    }
                }
            }
            CloseBuildContext(startIndex);
            return objectLayer;
        }
		
		function PerformCounturDirection(clockwiseCounturVector, normalVector)
        {
            // If this z plane projection is on the right - the countur is external
            // otherwise (on the left hand) - internal
            var s = clockwiseCounturVector.X * normalVector.Y - clockwiseCounturVector.Y * normalVector.X;

            // ATTENTION: Remove after testings
            if (s == 0)
            {
                alert('Invalid projection vector');
                return false;
            }
            return s > 0;
        }
		
		function CloseBuildContext(startIndex)
        {
            for (var i = startIndex; i != actualPoints.length; i++)
            {
                for (var j = 0; j != actualPoints[i].startEdges.length; j++)
                {
                    if (actualPoints[i].startEdges[j].Item2.isActual)
                    {
                        // This field IsPrevStep can be removed it is usefull only for testing
                        actualPoints[i].startEdges[j].Item2.IsPrevStep = true;
                    }
                }
            }
        }
		
		function CreateBuildContext()
        {
            for (var i = 0; i != actualPoints.length; i++)
            {
                for (var j = 0; j != actualPoints[i].startEdges.length; j++)
                {
                    if (actualPoints[i].startEdges[j].Item2.isActual)
                    {
                        actualPoints[i].startEdges[j].Item2.IsAlreadyBuilt = false;
                    }
                }
            }
        }
		
		function BuildCountur(counturPoint)
        {
            var pointCountur = new CounturData();
            var flag = false;
            var currPoint = counturPoint;
            var minPoint = currPoint;
            do
            {
                if (minPoint.point.X > currPoint.point.X)
                {
                    minPoint = currPoint;
                }
                if (!flag)
                {
                    if (currPoint.Next.Next == currPoint)
                    {
                        flag = true;
                    }
                    currPoint.IsAlreadyBuilt = true;
                    pointCountur.ReferencePoints.push(currPoint.point);
                    currPoint = currPoint.Next;
                }
                else
                {
                    if (currPoint.Prev.Prev == currPoint)
                    {
                        flag = false;
                    }
                    currPoint.IsAlreadyBuilt = true;
                    pointCountur.ReferencePoints.push(currPoint.point);
                    currPoint = currPoint.Prev;
                }
            } while (currPoint != counturPoint);

            var normalVector = new SlicerVector();
            var clockwiseCounturVector = new SlicerVector();

            var nextToMinVector = new SlicerVector(minPoint.Next.point.X - minPoint.point.X, 
            minPoint.Next.point.Y - minPoint.point.Y);
            var prevToMinVector = new SlicerVector(minPoint.Prev.point.X - minPoint.point.X, 
            minPoint.Prev.point.Y - minPoint.point.Y);
            var s = nextToMinVector.X * prevToMinVector.Y - nextToMinVector.Y * prevToMinVector.X;
            if (s > 0)
            {
                clockwiseCounturVector = nextToMinVector;
                var next = minPoint.relPoints.Find(function(x) {return x.Item1 == minPoint.Next;});
                normalVector = next.Item2;
            }
            else
            {
                clockwiseCounturVector = prevToMinVector;
                var prev = minPoint.relPoints.Find(function(x) {return x.Item1 == minPoint.Prev;});
                normalVector = prev.Item2;
            }
            pointCountur.IsInternal = PerformCounturDirection(clockwiseCounturVector, normalVector);
            return pointCountur;
        }
		
		function PerformCounturs(startIndex)
        {
            for (var i = startIndex; i != actualPoints.length; i++)
                {
                    for (var j = 0; j != actualPoints[i].startEdges.length; j++)
                    {
                        if (actualPoints[i].startEdges[j].Item2.isActual)
                        {
                            NewPerform(actualPoints[i].startEdges[j].Item2);
                        }
                    }
                }
        }
		
		function GetTwoActuals(counturPoints)
        {
            var points = counturPoints.FindAll(function(x) {return x.isActual;});

            // Remove next code afer testings
            if (points.length != 2 || counturPoints.length != 4)
            {
                alert('Point relPoints or Actives are incorrect! Count: ' + points.length);
            }

            var pair = new Tuple2(points[0], points[1]);
            return pair;
        }
		
		function PerformNeighbour(neighbourPoint, targetPoint)
        {
            if (neighbourPoint.Next != null)
            {
                if (neighbourPoint.Prev == null)
                {
                    // Remove next code afer testings
                    if (neighbourPoint.IsPrevStep)
                    {
                        alert('Neighbour point doesn\'t have Prev or Next!');
                        return;
                    }
                    neighbourPoint.Prev = targetPoint;

                    // Remove next code afer testings
                    if (neighbourPoint.Next == neighbourPoint.Prev)
                    {
                        alert('Cycle detected!');
                    }
                    return;
                }

                if (!neighbourPoint.Prev.isActual)
                {
                    neighbourPoint.Prev = targetPoint;

                    // Remove next code afer testings
                    if (neighbourPoint.Next == neighbourPoint.Prev)
                    {
                        alert('Cycle detected!');
                    }
                }
                else
                {
                    // This means neighbourPoint.Next must be false, otherwise - error
                    // Remove next code afer testings
                    if (neighbourPoint.Next.isActual && !(neighbourPoint.Next == targetPoint ||
                        neighbourPoint.Prev == targetPoint))
                    {
                        alert('Neighbour point doesn\'t change its point!');
                        return;
                    }

                    // Simplify this condition after testings
                    if (neighbourPoint.Next == targetPoint ||
                        neighbourPoint.Prev == targetPoint)
                    {
                        return;
                    }

                    neighbourPoint.Next = targetPoint;

                    // Remove next code afer testings
                    if (neighbourPoint.Next == neighbourPoint.Prev)
                    {
                        alert('Cycle detected!');
                    }
                }
            }
            else
            {
                // This must be new point, so Prev = Next = null
                // Remove next code afer testings
                if (neighbourPoint.Prev != null)
                {
                    if (neighbourPoint.IsPrevStep)
                    {
                        alert('Neighbour point doesn\'t have Prev or Next!');
                        return;
                    }
                    neighbourPoint.Next = targetPoint;

                    // Remove next code afer testings
                    if (neighbourPoint.Next == neighbourPoint.Prev)
                    {
                        alert('Cycle detected!');
                    }
                }
                else
                {
                    // Fill any side - Prev or Next because it is new point so we can
                    // put it to Prev or Next
                    neighbourPoint.Next = targetPoint;

                    // Remove next code afer testings
                    if (neighbourPoint.Next == neighbourPoint.Prev)
                    {
                        alert('Cycle detected!');
                    }
                }
            }
        }
		
		function NewPerform(point)
        {
            var relatedPoints = point.relPoints.Select('Item1');
            var pair = GetTwoActuals(relatedPoints);

            PerformNeighbour(pair.Item1, point);
            PerformNeighbour(pair.Item2, point);

            // As it has no sense if we place prev to next order
            // we place it in the way it can be just connected
            point.Next = pair.Item1;
            point.Prev = pair.Item2;
        }
		
		function InitIntersections(src3DPoint, zCoord)
        {
			for (var i = 0; i != src3DPoint.startEdges.length; i++)
            {
                InitIntersection(src3DPoint, src3DPoint.startEdges[i], zCoord);
            }
        }
		
		function InitIntersection(src3DPoint, pair, zCoord)
        {
            var finalPoint = new SlicerPoint();
            // var delta = pair.Item1.point - src3DPoint.point;
			var delta = new SlicerPoint3(pair.Item1.point.X - src3DPoint.point.X, pair.Item1.point.Y - src3DPoint.point.Y, pair.Item1.point.Z - src3DPoint.point.Z);
            if (delta.Z == 0 || pair.Item1.point.Z < zCoord)
                return;
            var deltaZ = (zCoord - src3DPoint.point.Z) / delta.Z;
            finalPoint.X = src3DPoint.point.X + delta.X * deltaZ;
            finalPoint.Y = src3DPoint.point.Y + delta.Y * deltaZ;
            pair.Item2.point = finalPoint;
            pair.Item2.stepDelta =
                new SlicerVector(delta.X * zDistance / delta.Z, delta.Y * zDistance / delta.Z);
            pair.Item2.isActual = true;
        }
		
		function DoIntersections(specPoint)
        {
            var relatedPoint = null;
            InitRelationEnumerator(specPoint);
            while ((relatedPoint = GetNextRelation(specPoint)) != null)
            {
                // ATTENTION: Remove this if conditions after testing

                if (!(specPoint.point.X >= relatedPoint.Item2.point.X &&
                    relatedPoint.Item1.point.X <= relatedPoint.Item2.point.X ||
                    specPoint.point.X <= relatedPoint.Item2.point.X &&
                    relatedPoint.Item1.point.X >= relatedPoint.Item2.point.X))
                {
                    alert('Countur point is not valid!1 Val: \n' +
                        relatedPoint.Item2.point.X + ' Lim1:' + specPoint.point.X +
                    ' Lim2:' + relatedPoint.Item1.point.X);
                }

                if (!(specPoint.point.Y >= relatedPoint.Item2.point.Y &&
                    relatedPoint.Item1.point.Y <= relatedPoint.Item2.point.Y ||
                    specPoint.point.Y <= relatedPoint.Item2.point.Y &&
                    relatedPoint.Item1.point.Y >= relatedPoint.Item2.point.Y))
                {
                    alert('Countur point is not valid!1 Val: \n' +
                    relatedPoint.Item2.point.Y + ' Lim1:' + specPoint.point.Y +
                ' Lim2:' + relatedPoint.Item1.point.Y);
                }

                DoIntersection(relatedPoint.Item2);
            }
        }
		
		function InitRelationEnumerator(specPoint)
        {
            specPoint.currentRelationIndex = specPoint.startEdges.length - 1;
        }

        function GetNextRelation(specPoint)
        {
            var i = specPoint.currentRelationIndex;
            while (i != -1 && specPoint.startEdges[i].Item1.isVisited)
            {
                specPoint.startEdges[i].Item2.isActual = false;
                specPoint.startEdges.RemoveAt(i);
                i--;
            }
            if (i == -1)
            {
                return null;
            }
            specPoint.currentRelationIndex = i - 1;
            return specPoint.startEdges[i];
        }
		
		function DoIntersection(counturPoint)
        {
            counturPoint.point.X += counturPoint.stepDelta.X;
			counturPoint.point.Y += counturPoint.stepDelta.Y;
        }

        function LookForOneInRelatedPoints(counturPoints, alreadyPresent)
        {
            var i = 0;
            // We don't check for end of counturPoints because we suppose that in every situation we have point
            // Can optimize this as it is known there are only 4 points in counturPoints
            while (!counturPoints[i].isActual || Object.is(counturPoints[i], alreadyPresent))
            {
                i++;
            }
            return counturPoints[i];
        }

        function LookForTwoInRelatedPoints(counturPoints)
        {
            // We don't check for end of counturPoints because we suppose that in every situation we have point
            // Can optimize this as it is known there are only 4 points in counturPoints
            var i = 0;
            while (!counturPoints[i++].isActual) ;
            var j = --i;
            while (!counturPoints[i++].isActual) ;
            return new Tuple2(counturPoints[j], counturPoints[--i]);
        }
}



function SlicedObject() {				
	this.objectSortedCollection = null;		// ObjectSortedCollection
}