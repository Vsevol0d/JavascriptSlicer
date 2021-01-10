console.log('Initialization started');
function triggerFileInput() {
		var filesInput = document.getElementById('files');
		filesInput.click();
	}
	
	function loadLocalModelFile(localFileName)
	{
		var xhr = new XMLHttpRequest();

		xhr.open('GET', localFileName);

		xhr.responseType = 'arraybuffer';

		xhr.send();

		xhr.onload = function() {
			var objectStlLoader = new THREE.STLLoader();
				// var elem = document.getElementById("includedContent");
				// var geometry = objectStlLoader.parse( elem.innerHTML );
			  
				var responseObj = xhr.response;
				var geometry = objectStlLoader.parse(responseObj);
				LoadModel(localFileName, geometry);
			/*
		  var responseObj = xhr.response;
		  var dv = new DataView(responseObj);
		  var str = '';
			for (var i = 0; i != 100; i++)
			{
				str += dv.getUint8( i, true ) + ' ';
			}
			// // alert(Array.apply([], binData).join(","));
			// // alert('1 ' + binData);
			alert('DataView: ' + str);
		  if(xhr.statusText == "success")
			{
				var objectStlLoader = new THREE.STLLoader();
				var elem = document.getElementById("includedContent");
				var geometry = objectStlLoader.parse( elem.innerHTML );
			  
				LoadModel(localFileName, geometry);
			}
			else
			{
				alert("Cannot load file: " + responseObj.message);
			}
			*/
		  
		};
		/*
		$("#includedContent").load(localFileName, function(responseTxt, statusTxt, xhr){
		if(statusTxt == "success")
		{
			// alert("External content loaded successfully!");
			var objectStlLoader = new THREE.STLLoader();
			var elem = document.getElementById("includedContent");
			var geometry = objectStlLoader.parse( elem.innerHTML );
		  
			LoadModel(localFileName, geometry);
		    // sceneManager.removeModel();
			// sceneManager.addModel(geometry);
			// sliceView.SetObject(geometry);
		}
		  if(statusTxt == "error")
			alert("Error: " + xhr.status + ": " + xhr.statusText);
		});
		*/
	  // var elem = document.getElementById("includedContent");
	  // triggerFileInput(elem.innerHTML);
	  // var objectStlLoader = new THREE.STLLoader();
	  // var geometry = objectStlLoader.parse( elem.innerHTML );
	  
	  // This is not good. Repair it
			// var slider = document.getElementById('stepSlider');
			// slider.value = 0;
			// var stepTextBox = document.getElementById('stepTextBox');
			// stepTextBox.value = slider.value;
			// This is not good. Repair it
	}
	
	var SetupGridSplitter = function()
	{
		 $(".panel-left").resizable({
		   handleSelector: ".splitter",
		   resizeHeight: false
		 });
	}
	
	var objectModelsDropDownList = document.getElementById('objectModelsDropDownList');
	objectModelsDropDownList.addEventListener("mousedown", function( event ) {
		var el = document.elementFromPoint(event.clientX, event.clientY);
		var fileName = el.innerHTML;
		if (el.nodeName == "A")
		{
			var localFileName = fileName;
			loadLocalModelFile('TestModels/' + localFileName);
			// alert('file selected:' + fileName);
		}
		
	}, true);
	
	var objectModelsDropDownListIsShown = false;
	function expandModelItemsList(/*dropDownElementId*/) {
		var dropDownElement = document.getElementById('objectModelsDropDownList');
		dropDownElement.style.display = 'block';
		objectModelsDropDownListIsShown = true;
		var modelNameField = document.getElementById('fileNameTextBox');
		modelNameField.focus();
	}
	function collapseModelItemsList(/*dropDownElementId*/) {
		var dropDownElement = document.getElementById('objectModelsDropDownList');
		dropDownElement.style.display = 'none';
		objectModelsDropDownListIsShown = false;
	}
	
	var selectedModelNameField = document.getElementById('fileNameTextBox');
	selectedModelNameField.addEventListener("blur", function( event ) {
		if (objectModelsDropDownListIsShown)
		{
			collapseModelItemsList();
		}
	}, true);
	
	var rotateСameraRadioButton = document.getElementById('RotateСameraRadioButton');
	rotateСameraRadioButton.addEventListener("change", function( event ) {
		if(rotateСameraRadioButton.checked) {
			sceneManager.DisableObjectRotation();
			sceneManager.EnableCameraRotation();
		} else { 
		// This doesn't work
		// https://stackoverflow.com/questions/11173685/how-to-detect-radio-button-deselect-event
			sceneManager.DisableCameraRotation();
		}
	}, true);
	var rotateObjectRadioButton = document.getElementById('RotateObjectRadioButton');
	rotateObjectRadioButton.addEventListener('change', function( event ) {
		if(rotateObjectRadioButton.checked) {
			sceneManager.DisableCameraRotation();
			sceneManager.EnableObjectRotation();
		} else { 
			sceneManager.DisableObjectRotation();
		}
	}, true);
	
	var SetupViewerControls = function()
	{
		rotateСameraRadioButton.checked = true;
		rotateObjectRadioButton.checked = false;
		var showContoursCheckbox = document.getElementById('ShowContoursCheckbox');
		
		showContoursCheckbox.checked = true;
		FillCountursChanged(null);
		
		var sliceViewer = document.getElementById('SliceViewer');
		var cutPlaneNumberSlider = document.getElementById('cutPlaneNumberSlider');
		cutPlaneNumberSlider.style.width = sliceViewer.offsetHeight;
		cutPlaneNumberSlider.style.offsetWidth = sliceViewer.offsetHeight;
		// cutPlaneNumberSlider.style.position = 'static';
		// alert(cutPlaneNumberSlider.style.width);
		/*
		alert('cutPlaneNumberSliderHeight 1');
		var cutPlaneNumberSliderHeight = $('#ViewTable').height();
		$('#cutPlaneNumberSlider').css({
			'width': cutPlaneNumberSliderHeight + 'px'
		});
		alert('cutPlaneNumberSliderHeight 2');
		*/
	}
	
	var SetupPrintModalWindow = function()
	{
		// Get the modal
		var modal = document.getElementById("myModal");

		// Get the button that opens the modal
		var btn = document.getElementById("printButton");

		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

		// When the user clicks the button, open the modal 
		btn.onclick = function() {
		  modal.style.display = "block";
		}

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		  modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
		  if (event.target == modal) {
			modal.style.display = "none";
		  }
		}
	}
	
	var view_canvas = document.getElementById('main_canvas_objectview');
	var objectStlLoader = new THREE.STLLoader();
	console.log('STLLoader created');
	var sceneManager = new SceneManager(view_canvas);
	console.log('SceneManager created');
  
	paper.install(window);
	var canvas = document.getElementById('main_canvas_sliceview');
	paper.setup(canvas);
	
	var pointsCheckBoxState = document.getElementById('ShowPointsCheckbox').checked;
	var linesCheckBoxState = document.getElementById('ShowLinesCheckbox').checked;
	var countursCheckBoxState = document.getElementById('ShowContoursCheckbox').checked;
	
	var sliceView = new SliceViewer(canvas, function(layerIndex, layer) {sceneManager.HighlightLayer(layerIndex);}, 
		pointsCheckBoxState, linesCheckBoxState, countursCheckBoxState);
	console.log('SliceViewer created');

	canvas.onmousewheel = function (event){
		console.log('onmousewheel');
		sliceView.OnCanvasScrolled(event);
	}
	
	var isSliderBeingChanged = false;
	function textBoxChangeStep(stepValue) {
		var stepSlider = document.getElementById('stepSlider');
		if (isSliderBeingChanged)
		{
			isSliderBeingChanged = false;
		}
		else
		{
			stepSlider.value = parseFloat(stepValue);
		}
	}
	
	function sliderChangeStep(stepValue) {
		isSliderBeingChanged = true;
		var modelHeightSlider = document.getElementById('modelHeightSlider');
		var stepSlider = document.getElementById('stepSlider');
		sliceView.cutPlanesCount = parseInt(parseFloat(modelHeightSlider.value) / parseFloat(stepSlider.value));
		sceneManager.SetStep(sliceView.cutPlanesCount);
		sliceView.step = sceneManager.GetZDelta();
		var stepTextBox = document.getElementById('stepTextBox');
		stepTextBox.value = stepValue;
	}
	
	function textBoxChangeModelHeight(stepValue) {
		var modelHeightSlider = document.getElementById('modelHeightSlider');
		if (isSliderBeingChanged)
		{
			isSliderBeingChanged = false;
		}
		else
		{
			modelHeightSlider.value = parseFloat(stepValue);
		}
	}
	
	function sliderChangeCurrentSelectedSlice(stepValue) {
		sliceView.SetCurrentPlaneIndex(stepValue);
	}
	
	function sliderChangeModelHeight(stepValue) {
		isSliderBeingChanged = true;
		var stepSlider = document.getElementById('stepSlider');
		var modelHeightSlider = document.getElementById('modelHeightSlider');
		sliceView.cutPlanesCount = parseInt(parseFloat(modelHeightSlider.value) / parseFloat(stepSlider.value));
		sceneManager.SetStep(sliceView.cutPlanesCount);
		sliceView.step = sceneManager.GetZDelta();
		
		var modelHeightTextBox = document.getElementById('modelHeightTextBox');
		modelHeightTextBox.value = stepValue;
	}
	
	function sliceButtonClicked(event) {
		// sliceView.SetInputGeometry(sceneManager.GetCurrentGeometry());
		sliceView.SetObject(sceneManager.GetCurrentGeometry());
		sliceView.OnSliceCommand();
		// alert('Geo after');
	}
	
	function printButtonClicked(event) {
		
	}
	
	var OnResize = function(event) {
		
		//var viewTable = document.getElementById('ViewTable');
		
		//var sideLength = viewTable.offsetWidth / 2;
		// sliceView.OnResize(event, sideLength);
		var objectCanvasView = document.getElementById('td_canvas');
		var sideLength = objectCanvasView.offsetWidth;
		var sideHeight = objectCanvasView.offsetHeight;
		sceneManager.OnResize(event, sideLength, sideHeight);
		// alert('Resize');
		// var stepSlider1 = document.getElementById('stepSlider1');
	// alert("Slider1: " + stepSlider1.offsetWidth);
	// // stepSlider1.offsetWidth = 1000;
	// var viewTable = document.getElementById('ViewTable');
	// alert("ViewTable: " + viewTable.offsetWidth);
	// var sliceViewer = document.getElementById('SliceViewer');
	// alert("SliceViewer: " + sliceViewer.offsetWidth);
	};

	var objectCanvasView = document.getElementById('td_canvas');
	objectCanvasView.onresize = OnResize;
	window.onresize = OnResize;
	OnResize();
  
	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object
		var f = files[0];

		// Only process stl files.
		/*
        if (!f.type.match('.stl')) {
			alert('This file format is not supported');
			return;
		}*/
		var ext = this.value.match(/\.(.+)$/)[1];
		if (ext !== 'stl')
		{
			alert('This file format is not supported');
			return;
		}
		
		objectStlLoader.load(f, function(geometry){
			// This is not good. Repair it
			// var slider = document.getElementById('stepSlider');
			// slider.value = 0;
			// var stepTextBox = document.getElementById('stepTextBox');
			// stepTextBox.value = slider.value;
			// This is not good. Repair it
			
			LoadModel(f.name, geometry);
			
		});
    }
	
	function LoadModel(modelName, geometry)
	{
		var fileNameTextBox = document.getElementById('fileNameTextBox');
		fileNameTextBox.style.fontSize = 15;		
		fileNameTextBox.value = modelName;
		
		var stepSlider = document.getElementById('stepSlider');
		var modelHeightSlider = document.getElementById('modelHeightSlider');
		var stepTextBox = document.getElementById('stepTextBox');
		var modelHeightTextBox = document.getElementById('modelHeightTextBox');
		
		sceneManager.removeModel();
		sceneManager.addModel(geometry);
		sliceView.SetObject(geometry);
		
		var stepSliderInitValue = stepSlider.max / 10;
		sliceView.cutPlanesCount = parseInt(parseFloat(modelHeightSlider.min) / parseFloat(stepSliderInitValue));
		sceneManager.SetStep(sliceView.cutPlanesCount);
		sliceView.step = sceneManager.GetZDelta();
		stepTextBox.value = stepSliderInitValue;
		modelHeightTextBox.value = modelHeightSlider.min;
		stepSlider.value = stepSliderInitValue;
		modelHeightSlider.value = modelHeightSlider.min;
	}

document.getElementById('files').addEventListener('change', handleFileSelect, false);


// Handlers
function FillCountursChanged(element)
{
	console.log(document.getElementById('ShowContoursCheckbox').checked);	
	sliceView.OnFillCountursChanged(document.getElementById('ShowContoursCheckbox').checked);
}
  
function ShowLineChanged(element)
{
	console.log(document.getElementById('ShowLinesCheckbox').checked);
	sliceView.OnShowLineChanged(document.getElementById('ShowLinesCheckbox').checked);
}

function ShowPointsChanged(element)
{
	console.log(document.getElementById('ShowPointsCheckbox').checked);  
	sliceView.OnShowPointsChanged(document.getElementById('ShowPointsCheckbox').checked);
}
  
function ResetLayer()
{
	var layer = sliceView.GetLayer();
    sliceView.SetLayer(layer);
 }
// Handlers

var showPointsCheckbox = document.getElementById('ShowPointsCheckbox');
var showLinesCheckbox = document.getElementById('ShowLinesCheckbox');
var fillCountursCheckbox = document.getElementById('ShowContoursCheckbox');

showPointsCheckbox.addEventListener("change", ShowPointsChanged);
showLinesCheckbox.addEventListener("change", ShowLineChanged);
fillCountursCheckbox.addEventListener("change", FillCountursChanged);

SetupGridSplitter();
SetupViewerControls();
SetupPrintModalWindow();

console.log('Initialization succeeded');