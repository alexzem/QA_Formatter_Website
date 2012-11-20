/*
TODO
* Combine ads with the exact same issues
* Pull out any issues that are common to all ads and put them at the top.
* Catch null set error for results array
* Allow offline use (HTML5 offline storage)
* Optimize filtering algorithms
* Clean up updateOutput function
* Remove 0 from beginning of digits?
*/

/*
DONE
x Save filtering settings in a cookie

*/

var COOKIE_EXPIRATION_LIMIT = 360;

var clipboard;
var qaInput;
var qaOutput;
var lastInput = "";
var checkForInputIntervalID;

window.onload = init;

function init() {
	//console.log("init");
	//initZeroClipboard();
	setGlobalVariables();
	addEventListeners();
}

/*function initZeroClipboard() {
	ZeroClipboard.setMoviePath("swf/ZeroClipBoard.swf");
	clipboard = new ZeroClipboard.Client();
	clipboard.setHandCursor(true);
	clipboard.glue("clipboardButton", "clipboardButtonContainer");
	clipboard.addEventListener('mouseDown', function(client) {
		clipboard.setText(getOutput());
	});
}*/

function setGlobalVariables() {
	//console.log("Set global variables");
	qaInput = document.getElementById("qaInput");
	qaOutput = document.getElementById("qaOutput");
}

function addEventListeners() {
	//console.log("Add event listeners");
	qaInput.onblur = stopCheckingfForNewInput;
	qaInput.onfocus = startCheckingForNewInput;
}

function startCheckingForNewInput() {
	//console.log("Start checking for new input");
	
	if (checkForInputIntervalID) clearInterval(checkForInputIntervalID);
	checkForInputIntervalID = setInterval("checkForNewInput()", 250);
}

function stopCheckingfForNewInput() {
	//console.log("Stop checking for new input");
	clearInterval(checkForInputIntervalID);
	updateOutput();
}

function checkForNewInput() {
	//console.log("Check for new input");
	if (lastInput != getInput()) {
		lastInput = getInput();
		updateOutput();
	}
}

function getInput() {
	//console.log("Get input");
	return qaInput.value;
}

function getOutput() {
	//console.log("Get output");
	
	var output = unescape(qaOutput.innerHTML);
	//output = replaceURLEncodedNewline(output);
	return output;
}

function replaceURLEncodedNewline(text){
	var newline = "\r\n";
	
	text = escape(text);
	
	var encodedNewlineRegExp = /(%0D%0A|%0D|%0A)/g
	text = text.replace(encodedNewlineRegExp, newline);  ;
		
	return unescape(text);
}

function isInt(value){ 
	var intRegex = /^\d+$/;
	if(intRegex.test(value)) {
		return true;
	}
	else {
		return false;
	}
}

function updateOutput() {
	//console.log("Update output");
	
	var output;
	
	//try {
		//output = parseQAResults(getInput());
		output = parseQAResults(getInput());
		var adFeedbackCollection = new AdFeedbackCollection(output);
		printOutput(adFeedbackCollection);
	//}
	//catch (error) {
		//output = error.message;
	//}
	
	
	//qaOutput.value = output;
}

function parseQAResults(input) {
	var idPattern = /[1-9]\d{6,}/g;
	var ids = input.match(idPattern);
	
	var rowSplitPattern = /[1-9]\d{6,}\t/g
	
	var rows = input.split(rowSplitPattern);
	rows.shift();
	
	for (var j = 0; j < rows.length; j++) {
		//console.log("Row " + j + ": " + rows[j]);
		
		var columns = rows[j].split("\t");
		
		columns.unshift(ids[j]);
		
		rows[j] = columns;
	}
	
	return rows;
}

function printOutput(adFeedbackCollection) {
	var qaResults = adFeedbackCollection.qaResults;
	
	var outputString = "<p class=siteSpecification>Site Specification</p>";
	outputString += "<p class=functionality>Functionality</p>";
	outputString += "<p class=tracking>Tracking</p><br/>";
	
	for ( var i = 0; i < qaResults.length; i++) {
		
		//Ad ID and title
		outputString += "<p><b>";
		
		for (var j = 0; j < qaResults[i].ads.length; j++) {
			outputString += qaResults[i].ads[j].id ? qaResults[i].ads[j].id + " - " : "";
			outputString += qaResults[i].ads[j].title;
			outputString += qaResults[i].ads[j].format ? " (" + qaResults[i].ads[j].format + ")": "";
			outputString += "<br/>";
		}
		
		outputString += "</b><ul>";
		//
		
		//Ad issues
		if (qaResults[i].issues.length > 0) {
			for (var k = 0; k < qaResults[i].issues.length; k++) {
				outputString += "<li class=" 
				outputString += getCategoryClass(qaResults[i].issues[k].category);
				outputString += ">";
				
				outputString += qaResults[i].issues[k].problems_issues;
			
				if (qaResults[i].issues[k].additionalNotes) {
					if(qaResults[i].issues[k].additionalNotes.length > 1) {
						if (qaResults[i].issues[k].additionalNotes.length <= 10) {
							outputString += " (" + qaResults[i].issues[k].additionalNotes.replace(/\s$/, "")+ ")";
						}
						else {
							outputString += ". ";
							outputString += qaResults[i].issues[k].additionalNotes.replace(/(^"|"$)/g, "");
						}
					}
				}
			
				if (qaResults[i].issues[k].potentialReasons.length > 1) {
					outputString += "<br/>";
					outputString += qaResults[i].issues[k].potentialReasons.replace(/(^"|"$)/g, "");
				}
			
				outputString += "</li>";
			}
		}
		else {
			//outputString += "<li>No issues found in QA</li>";
		}
		//
		
		//Close remaining tags
		outputString += "</ul></p>";
		//
	}
	
	qaOutput.innerHTML = outputString;
}

function getCategoryClass(category) {
	switch(category) {
		case "Site Specification":
			return "siteSpecification";
			break;
		case "Functionality":
			return "functionality";
			break;
		case "Tracking":
			return "tracking";
			break;
		default:
			return "";
			break;
	}
}

function deduplicateIDs(idArray) {
	//console.log("Deduplicate IDs");
	//idArray.sort(ascendingNumericalSort);
	
	for (var i = 0; i < idArray.length; i++) {
		var j = i + 1;
		
		while (j < idArray.length && idArray[i] == idArray[j]) {
			idArray.splice(j, 1);
		}
	}
	
	return idArray;
}

function ascendingNumericalSort(a, b) {
	return Number(a) - Number(b);
}

function selectOutputText() {
	//console.log("Select output text");
	qaOutput.focus();
	qaOutput.select();
}