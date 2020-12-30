
function SceneManager(scopeCanvas) {
  var scene = null;
  var camera = null;
  var renderer = null;
  var container = null;
  var controls = null;
  var clock = null;
  var stats = null;
  var AlignCoefficient = 1.0; 
  var Alpha;
  
  var isObjectRotated = false;
  var previousX = -1;
  var previousY = -1;
  
  var slicePlanes = [];
  var defaultBoundingBox = {min: {x: -15, y: -15, z: -15}, max: {x: 15, y: 15, z: 15}};
  var currentSlicePlane = 0;
  var sliceDelta = 0;
  
  function init() {
	console.log('scene init started');
    // create main scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;

    // prepare camera
    var VIEW_ANGLE = 60, ASPECT = 1.0 /*SCREEN_WIDTH / SCREEN_HEIGHT*/, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	Alpha = camera.fov / 2; Alpha = Alpha * 2 * Math.PI / 360;
    scene.add(camera);
    camera.position.set(-27, 15, -25);
    // camera.lookAt(new THREE.Vector3(0,0,0));

    // prepare renderer
    renderer = new THREE.WebGLRenderer({ canvas: scopeCanvas, antialias: true, alpha: true });
    renderer.setSize(/*SCREEN_WIDTH, SCREEN_HEIGHT*/scopeCanvas.width, scopeCanvas.height);
	renderer.setViewport(0, 0, scopeCanvas.width, scopeCanvas.height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

	// prepare container
	container = document.getElementById('td_canvas');
    //container = document.createElement('div');
    //document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    // events
    THREEx.WindowResize(renderer, camera);

    // prepare controls (OrbitControls)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.maxDistance = 3000;
	controls.noPan = true;
	// this.DisableCameraRotation();
	// https://threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html

    // prepare clock
    clock = new THREE.Clock();

	// TEMPORARY STATS IS NOT IN USE
	/*
    // prepare stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '50px';
    stats.domElement.style.bottom = '50px';
    stats.domElement.style.zIndex = 1;
	stats.domElement.style.visible = false;
    container.appendChild( stats.domElement );
	*/
	
    scene.add( new THREE.AmbientLight(0x606060) );

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, 200, 1000).normalize();
    camera.add(dirLight);
    camera.add(dirLight.target);
	GeneratePlanes(defaultBoundingBox);
  }
  
  function ObjectManipulationMouseDown(event) {

	isObjectRotated = true;
  }
  function ObjectManipulationMouseMove(event) {

	if (isObjectRotated)
		{
			if (previousX == -1 || previousY == -1)
			{
				previousX = event.clientX;
				previousY = event.clientY;
			}
			else
			{
				var deltaX = event.clientX - previousX;
				var deltaY = event.clientY - previousY;
				var angleXInRadians = deltaX;
				var angleYInRadians = deltaY;
				
				currentModel.rotation.x = -Math.PI / 360 * angleXInRadians;
				currentModel.rotation.z = -Math.PI / 360 * angleYInRadians;
				
				//alert('rotation by ' + angleXInRadians);
				// currentModel.matrix.makeRotationX(angleXInRadians);
				// currentModel.matrix.makeRotationX(angleYInRadians);
				// renderer.render(scene, camera);
				//alert('rotation by ' + angleXInRadians);
			}
		}
  }
  function ObjectManipulationMouseUp(event) {

	 isObjectRotated = false;
	 previousX = -1;
	 previousY = -1;
  }
  
  function onPositionChange(o) {

	alert(camera.up.z);
	//Geometry.matrix.makeRotationX(angleInRadians);
	//Geometry.matrix.makeRotationY(angleInRadians);
	//Geometry.matrix.makeRotationZ(angleInRadians);
	// allControls = allControls.Where(x => x.Data.BoundingRectangle.Bottom - x.Data.BoundingRectangle.Top > 0).ToList();
	// https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%82%D1%80%D0%B8%D1%86%D0%B0_%D0%BF%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82%D0%B0
	// x2 = x * x, xy = x * y, xz = x * z, y2 = y * y, yz = y * z, z2 = z * z
	// cosA = cos(A), cosA1 = 1 - cos(A), sinA = sin(A)
	// 
	// cosA + cosA1 * x2 		cosA1 * xy - sinA * z		cosA1 * xz - sinA * y
	// 
	//Geometry.matrix.makeScale ( x : Float, y : Float, z : Float );
	
	
    console.log("position changed in object");
    console.log(o);
  }

  this.EnableCameraRotation = function() {
	  controls.enabled = true;
	  // controls.addEventListener('change', onPositionChange);
  }
  this.DisableCameraRotation = function() {
	  controls.enabled = false;
	  // controls.removeEventListener('change', onPositionChange);
  }
  
  this.EnableObjectRotation = function() {
	  controls.enabled = false;
	  scopeCanvas.addEventListener('mousedown', ObjectManipulationMouseDown, true);
	  scopeCanvas.addEventListener('mousemove', ObjectManipulationMouseMove, true);
	  scopeCanvas.addEventListener('mouseup', ObjectManipulationMouseUp, true);
  }
  this.DisableObjectRotation = function() {
	  scopeCanvas.removeEventListener('mousedown', ObjectManipulationMouseDown, true);
	  scopeCanvas.removeEventListener('mousemove', ObjectManipulationMouseMove, true);
	  scopeCanvas.removeEventListener('mouseup', ObjectManipulationMouseUp, true);
  }
  
  this.GetCurrentGeometry = function() {
	  alert('getting ' + currentModel);
	  // item.geometry.dispose();
	  
	  //currentModel.geometry.verticesNeedUpdate = true;
	  //var clone = currentModel.geometry.clone();
	  //currentModel.geometry.verticesNeedUpdate = false;
	  var c = currentModel.clone();
	  c.geometry.rotateX(currentModel.rotation.x);
	  c.geometry.rotateZ(currentModel.rotation.z);
	  
	  return c.geometry;
  }
  
  var currentModel = null;
  var currentGeometry = null;
  this.addModel = function(geometry) {
	
	if (geometry == null || geometry == undefined)
	{
		alert('Error reading geometry');
		return;
	}
	AdaptToViewPort(geometry);
	
	var material = new THREE.MeshNormalMaterial();
	
	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	
	currentModel = mesh;
	this.OnObjectChanged(geometry);
  }
  this.removeModel = function() {
	scene.remove(currentModel);
	currentModel = null;
  }
  this.OnResize = function(event, sideLength) {
    var canvas = renderer.context.canvas;
	//alert('                             ' + canvas.clientWidth + ' '  + canvas.width);
	//alert('                             ' + canvas.clientHeight + ' '  + canvas.height);
	// Lookup the size the browser is displaying the canvas.
	var displayWidth  = canvas.clientWidth;
	var displayHeight = canvas.clientHeight;
	canvas.width = sideLength; canvas.height = sideLength;
 // alert('Resized to: ' + canvas.width + ' ' + canvas.height);
	// Check if the canvas is not the same size.
	//alert('                             ' + canvas.clientWidth + ' '  + canvas.width);
	//alert('                             ' + canvas.clientHeight + ' '  + canvas.height);
	if (canvas.width  != displayWidth ||
		canvas.height != displayHeight) {
 
		// Make the canvas the same size
		//canvas.width  = displayWidth;
		//canvas.height = displayHeight;
 
		// Set the viewport to match
		renderer.setSize(sideLength, sideLength);
		renderer.setViewport(0, 0, sideLength, sideLength);
		// alert('Resized to: ' + canvas.width + ' ' + canvas.height);
	}
	
  }
  
  var highLightedLayerIndex = null;
  this.HighlightLayer = function(index) {
		if (highLightedLayerIndex != null)
		{
			UnselectLayer(slicePlanes[highLightedLayerIndex]);
		}
		SelectLayer(slicePlanes[index]);
		highLightedLayerIndex = index;
  }
  
  function SelectLayer(layer) {
		layer.traverse(function(obj) { 
			var material = layer.children[0].material;
			material.opacity = 1; 
			material.color.setHex(0xff0000);
		} );
  }
  function UnselectLayer(layer) {
		layer.traverse(function(obj) { 
			var material = layer.children[0].material;
			material.opacity = 0.5; 
			material.color.setHex(0xffffff);
		} );
  }
  
  this.OnObjectChanged = function(geometry) {
	var bBox = geometry.boundingBox;
	currentGeometry = geometry;
    RemoveCurrentPlanes();
	currentSlicePlane = 0;
    GeneratePlanes(bBox);
}

this.GetZDelta = function() {
	return zDelta1;
}
var zDelta1 = -1;

function RecalculateVisibility(stepValue) {
	if (stepValue >= 0 && stepValue <= 100)
		{
			if (stepValue > currentSlicePlane)
			{
				ShowSlices(currentSlicePlane, stepValue);
			}
			else
			{
				HideSlices(stepValue, currentSlicePlane);
			}
		}
}
function ShowSlices(startIndex, endIndex) {
	for (var i = startIndex; i != endIndex; i++)
	{
		slicePlanes[i].traverse(function(obj) { obj.visible = true; } );
	}
}

function HideSlices(startIndex, endIndex) {
	for (var i = startIndex; i != endIndex; i++)
	{
		slicePlanes[i].traverse(function(obj) { obj.visible = false; } );
	}
}
  
  this.SetStep = function(stepValue) {
		RecalculateVisibility(stepValue);
		currentSlicePlane = stepValue;

		if (currentModel == null)
		{
			RecalculateSlicePlanes(currentSlicePlane, null);
		}
		else
		{
			RecalculateSlicePlanes(currentSlicePlane, currentModel.geometry.boundingBox);
		}
		
		renderer.render( scene, camera );
  }
  
function RemoveCurrentPlanes() {
	for (var i = 0; i != slicePlanes.length; i++)
    {
    	scene.remove(slicePlanes[i]);
    }
	slicePlanes.splice(0, slicePlanes.length);
}
  
function RecalculateSlicePlanes(currentPosition, boundingBox) {
	var zLength = 0;
	var zOffset = 0;
	if (boundingBox != null)
	{
		zLength = boundingBox.max.z - boundingBox.min.z;
		zOffset = boundingBox.min.z;
	}
	else
	{
		zLength = 300; // default value
	}
    var deltaZ = zLength / currentPosition;
	zDelta1 = deltaZ;
	zOffset += deltaZ;
    
    for (var i = 0; i != currentPosition; i++)
    {
    	slicePlanes[i].position.z = zOffset;
        zOffset += deltaZ;
    }
}
  
function GeneratePlanes(boundingBox) {
	var bBox = boundingBox;
	var zPosition = 0;
	for (var i = 0; i != 100; i++)
	{
    	CreatePlane(bBox, zPosition);
    }
	/*
	if (currentSlicePlane != 0)
	{
		var height = bBox.max.z - bBox.min.z;
		currentSlicePlane = Math.trunc(height / zDelta1);
		
		ShowSlices(0, currentSlicePlane);
		RecalculateSlicePlanes(currentSlicePlane, currentModel.geometry.boundingBox);
		
		renderer.render( scene, camera );
	}
	*/
}
  
function CreatePlane(boundingBox, zPosition) {
	var geom = new THREE.Geometry();
    console.log(geom.vertices)
	
	geom.vertices.push(new THREE.Vector3(boundingBox.min.x,boundingBox.min.y,zPosition));
    geom.vertices.push(new THREE.Vector3(boundingBox.max.x,boundingBox.min.y,zPosition));
    geom.vertices.push(new THREE.Vector3(boundingBox.max.x,boundingBox.max.y,zPosition));
    geom.vertices.push(new THREE.Vector3(boundingBox.min.x,boundingBox.min.y,zPosition));
    geom.vertices.push(new THREE.Vector3(boundingBox.min.x,boundingBox.max.y,zPosition));
    geom.vertices.push(new THREE.Vector3(boundingBox.max.x,boundingBox.max.y,zPosition));
    
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 5, 4, 3 ) );
    
    var material = new THREE.MeshLambertMaterial();
	material.transparent = true;
    material.opacity = 0.5;
	material.side = THREE.DoubleSide;
	
    var mesh= new THREE.Mesh(geom, material);
    var group = new THREE.Object3D();
	group.add(mesh);
    slicePlanes.push(group);
    scene.add(group);
    group.traverse(function(obj) { obj.visible = false; } );
}
  
  
  
		function AdaptToViewPort(geometry)
        {
			var bBox = geometry.boundingBox;
            MoveModel(geometry, GetInitVector(bBox));
            var dist = GetDeltaDistance(bBox);
            OrientByVector(dist, new THREE.Vector3(-1, -1, -1));
        }
		
		function MoveModel(geometry, moveVector) {
			geometry.translate(moveVector.x, moveVector.y, moveVector.z);
		}
		
		function GetInitVector(bBox)
        {
            var dx = (bBox.max.x + bBox.min.x) / 2;
            var dy = (bBox.max.y + bBox.min.y) / 2;
            var dz = (bBox.max.z + bBox.min.z) / 2;

            return new THREE.Vector3(-dx, -dy, -dz);
        }
            
		function GetDeltaDistance(bBox)
        {
            var dx = bBox.max.x - bBox.min.x;
            var dy = bBox.max.y - bBox.min.y;
            var dz = bBox.max.z - bBox.min.z;

            var ds = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
            var zDistance = ds / (2 * Math.sin(Math.atan(Math.tan(Alpha) / AlignCoefficient)));
            return zDistance;
        }
		
		function OrientByVector(distance, dirVector)
        {
            dirVector.normalize();
            var dx = distance * (-dirVector.x);
            var dy = distance * (-dirVector.y);
            var dz = distance * (-dirVector.z);

			camera.position.set(dx, dy, dz);
			camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
  
	// Animate the scene
	function animate() {
		requestAnimationFrame(animate);
		render();
		update();
	}

	// Update controls and stats
	function update() {
		controls.update(clock.getDelta());
		// TEMPORARY STATS IS NOT IN USE
		// stats.update();
	}

	// Render the scene
	function render() {
		if (renderer) {
			renderer.render(scene, camera);
		}
	}
	
	// Initialize lesson on page load
	function initializeLesson() {
		init();
		animate();
	}
	initializeLesson();
};
  