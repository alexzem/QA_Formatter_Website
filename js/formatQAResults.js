/*
TODO
* Combine ads with the exact same issues
* Pull out any issues that are common to all ads and put them at the top.
* Catch null set error for results array
* Allow offline use (HTML5 offline storage)
* Optimize filtering algorithms
* Clean up printOutput function
*/

var COOKIE_EXPIRATION_LIMIT = 360;

var clipboard;
var qaInput;
var qaOutput;
var selectOutputButton;
var lastInput = "";
var checkForInputIntervalID;

window.onload = init;

function init() {
	//console.log("init");
	setGlobalVariables();
	addEventListeners();
}

function setGlobalVariables() {
	//console.log("Set global variables");
	qaInput = document.getElementById("qaInput");
	qaOutput = document.getElementById("qaOutput");
	selectOutputButton = document.getElementById("selectOutputButton");
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
	return output;
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
	
	var adFeedbackCollection = new AdFeedbackCollection(getInput());
	printOutput(adFeedbackCollection);
}

function printOutput(adFeedbackCollection) {
	var qaResults = adFeedbackCollection.qaResults;
	//var trailingWhiteSpacePattern = /\s$/;
	//var extraQuotationPattern = /(^")|(\"(?=\"))|("$)/g;
	
	if (qaResults.length > 0) {
		var outputString = "<p><span class=siteSpecification>Site Specification</span><br/>";
		outputString += "<span class=functionality>Functionality</span><br/>";
		outputString += "<span class=tracking>Tracking</span></p>";
	}
	
	for ( var i = 0; i < qaResults.length; i++) {
		
		//Ad ID and title
		outputString += "<br/><p>";
		
		for (var j = 0; j < qaResults[i].ads.length; j++) {
			//outputString += "<br/>";
			outputString += qaResults[i].ads[j].id ? qaResults[i].ads[j].id + " - " : "";
			outputString += qaResults[i].ads[j].title;
			outputString += qaResults[i].ads[j].format ? " (" + qaResults[i].ads[j].format + ")": "";
			outputString += "</p>";
		}
		
		outputString += "<ul>";
		
		//Ad issues
		if (qaResults[i].issues.length > 0) {
			for (var k = 0; k < qaResults[i].issues.length; k++) {
				outputString += "<li class=" 
				outputString += getCategoryClass(qaResults[i].issues[k].category);
				outputString += ">";
				
				if (qaResults[i].issues[k].problems_issues.length > 1) {
					outputString += qaResults[i].issues[k].problems_issues;
				}
			
				if (qaResults[i].issues[k].additionalNotes) {
					if(qaResults[i].issues[k].additionalNotes.length > 1) {
						if (qaResults[i].issues[k].additionalNotes.length <= 10) {
							outputString += " (" + qaResults[i].issues[k].additionalNotes + ")";
						}
						else {
							if (qaResults[i].issues[k].problems_issues.length > 1) {
								outputString += ". ";
							}
							outputString += qaResults[i].issues[k].additionalNotes;
						}
					}
				}
			
				if (qaResults[i].issues[k].potentialReasons.length > 1) {
					outputString += "<br/>";
					outputString += qaResults[i].issues[k].potentialReasons;
				}
			
				outputString += "</li>";
			}
		}
		else {
			outputString += "<li>See \"All Ads\"</li>";
		}
		
		//Close remaining tags
		outputString += "</ul>";
	}
	
	outputString = outputString.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, "\"");
	
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

function selectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function ascendingNumericalSort(a, b) {
	return Number(a) - Number(b);
}

function selectOutputText() {
	//console.log("Select output text");
	qaOutput.focus();
	qaOutput.select();
}