GetNextFacet() -> SortPoints() -> IdentifyOrRegisterEdges() -> CalculatePointsForRegisteredEdges() -> ConnectPoints()

function CalculatePointsForRegisteredEdges(registeredEdges) {
	CalculateFirstPointsForEdges();
}

function FastStorage() {
	
}

function ConnectAllPoints(minToMaxCounturPointIndex, bottomEdgePointIndex, topEdgePointIndex, startLayerIndex, changePointIndex, endLayerIndex) {

	
	for (var i = startLayerIndex; i != changePointIndex; i++)
	{
		var baseCounturPoint = Layers[i][minToMaxCounturPointIndex];
		var bottomEdgeCounturPoint = Layers[i][bottomEdgePointIndex];
		baseCounturPoint.related = currentRelation;

		baseCounturPoint.related.push(bottomEdgeCounturPoint);
		bottomEdgeCounturPoint.related.push(baseCounturPoint);
	}

	for (var i = changePointIndex; i != endLayerIndex; i++)
	{
		var baseCounturPoint = Layers[i][minToMaxCounturPointIndex];
		var topEdgeCounturPoint = Layers[i][topEdgePointIndex];
		baseCounturPoint.related = currentRelation;

		baseCounturPoint.related.push(topEdgeCounturPoint);
		topEdgeCounturPoint.related.push(baseCounturPoint);
	}
}