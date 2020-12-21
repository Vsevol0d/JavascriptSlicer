console.log('Initialization started');
function triggerFileInput() {
		var filesInput = document.getElementById('files');
		filesInput.click();
	}
	
	function loadLocalModelFile(localFileName)
	{
		$("#includedContent").load(localFileName, function(responseTxt, statusTxt, xhr){
		if(statusTxt == "success")
		{
		  // alert("External content loaded successfully!");
		  var objectStlLoader = new THREE.STLLoader();
		  var elem = document.getElementById("includedContent");
		  var geometry = objectStlLoader.parse( elem.innerHTML );
		  sceneManager.removeModel();
				sceneManager.addModel(geometry);
				sliceView.SetObject(geometry);
		  }
		  if(statusTxt == "error")
			alert("Error: " + xhr.status + ": " + xhr.statusText);
		});
	  // var elem = document.getElementById("includedContent");
	  // triggerFileInput(elem.innerHTML);
	  // var objectStlLoader = new THREE.STLLoader();
	  // var geometry = objectStlLoader.parse( elem.innerHTML );
	  
	  // This is not good. Repair it
			var slider = document.getElementById('stepSlider');
			slider.value = 0;
			var stepTextBox = document.getElementById('stepTextBox');
			stepTextBox.value = slider.value;
			// This is not good. Repair it
	}
	
	var objectModelsDropDownList = document.getElementById('objectModelsDropDownList');
	objectModelsDropDownList.addEventListener("mousedown", function( event ) {
		var el = document.elementFromPoint(event.clientX, event.clientY);
		var fileName = el.innerHTML;
		if (el.nodeName == "A")
		{
			var localFileName = fileName;
			loadLocalModelFile(localFileName);
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

	var view_canvas = document.getElementById('main_canvas_objectview');
	var objectStlLoader = new THREE.STLLoader();
	console.log('STLLoader created');
	var sceneManager = new SceneManager(view_canvas);
	console.log('SceneManager created');
  
	paper.install(window);
	var canvas = document.getElementById('main_canvas_sliceview');
	paper.setup(canvas);
	
	var pointsCheckBoxState = document.getElementById('squaredOne').checked;
	var linesCheckBoxState = document.getElementById('squaredTwo').checked;
	var countursCheckBoxState = document.getElementById('squaredThree').checked;
	
	var sliceView = new SliceViewer(canvas, function(layerIndex, layer) {sceneManager.HighlightLayer(layerIndex);}, 
		pointsCheckBoxState, linesCheckBoxState, countursCheckBoxState);
	console.log('SliceViewer created');

	canvas.onmousewheel = function (event){
		console.log('onmousewheel');
		sliceView.OnCanvasScrolled(event);
	}
	
	function textBoxChangeStep(stepValue) {
		// TODO: Implement this
		//sliceView.SetStep(parseFloat(stepValue));
		sliceView.step = parseFloat(stepValue);
		sceneManager.SetStep(sliceView.step);
		// alert('                   changed to: ' + sceneManager.zDelta);
		//sliceView.step = sceneManager.deltaZ;
	}
	
	function sliderChangeStep(stepValue) {
		var stepTextBox = document.getElementById('stepTextBox');
		stepTextBox.value = stepValue;
		//sliceView.SetStep(parseFloat(stepValue));
		sliceView.step = parseFloat(stepValue);
		sceneManager.SetStep(sliceView.step);
		// alert('                   changed to: ' + sceneManager.GetZDelta());
		sliceView.step = sceneManager.GetZDelta();
	}
	
	function sliceButtonClicked(event) {
		sliceView.OnSliceCommand();
	}
	
	var OnResize = function(event) {
		
		var viewTable = document.getElementById('ViewTable');
		
		var sideLength = viewTable.offsetWidth / 2;
		sliceView.OnResize(event, sideLength);
		sceneManager.OnResize(event, sideLength);
	};

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
		
		var fileNameTextBox = document.getElementById('fileNameTextBox');
		fileNameTextBox.value = f.name;
		
		objectStlLoader.load(f, function(geometry){

			// This is not good. Repair it
			var slider = document.getElementById('stepSlider');
			slider.value = 0;
			var stepTextBox = document.getElementById('stepTextBox');
			stepTextBox.value = slider.value;
			// This is not good. Repair it
			
			sceneManager.removeModel();
			sceneManager.addModel(geometry);
			sliceView.SetObject(geometry);
		});
    }

document.getElementById('files').addEventListener('change', handleFileSelect, false);


// Handlers
function FillCountursChanged(element)
{
	console.log(document.getElementById('squaredThree').checked);	
	sliceView.OnFillCountursChanged(document.getElementById('squaredThree').checked);
}
  
function ShowLineChanged(element)
{
	console.log(document.getElementById('squaredTwo').checked);
	sliceView.OnShowLineChanged(document.getElementById('squaredTwo').checked);
}

function ShowPointsChanged(element)
{
	console.log(document.getElementById('squaredOne').checked);  
	sliceView.OnShowPointsChanged(document.getElementById('squaredOne').checked);
}
  
function ResetLayer()
{
	var layer = sliceView.GetLayer();
    sliceView.SetLayer(layer);
 }
// Handlers

var showPointsCheckbox = document.getElementById('squaredOne');
var showLinesCheckbox = document.getElementById('squaredTwo');
var fillCountursCheckbox = document.getElementById('squaredThree');

showPointsCheckbox.addEventListener("change", ShowPointsChanged);
showLinesCheckbox.addEventListener("change", ShowLineChanged);
fillCountursCheckbox.addEventListener("change", FillCountursChanged);

console.log('Initialization succeeded');