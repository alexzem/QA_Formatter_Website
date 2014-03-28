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
	setGlobalVariables();
	addEventListeners();
}

function setGlobalVariables() {
	qaInput = document.getElementById("qaInput");
	qaOutput = document.getElementById("qaOutput");
	selectOutputButton = document.getElementById("selectOutputButton");
}

function addEventListeners() {
	qaInput.addEventListener("blur", stopCheckingfForNewInput);
	qaInput.addEventListener("focus", startCheckingForNewInput);
	selectOutputButton.addEventListener("click", selectOutputText);
}

function startCheckingForNewInput() {
	if (checkForInputIntervalID) clearInterval(checkForInputIntervalID);
	checkForInputIntervalID = setInterval(checkForNewInput, 250);
}

function stopCheckingfForNewInput() {
	clearInterval(checkForInputIntervalID);
	updateOutput();
}

function checkForNewInput() {
	if (lastInput != getInput()) {
		lastInput = getInput();
		updateOutput();
	}
}

function getInput() {
	return qaInput.value;
}

function getOutput() {
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
	var output;
	
	var adFeedbackCollection = new AdFeedbackCollection(getInput());
	printOutput(adFeedbackCollection);
}

function printOutput(adFeedbackCollection) {
	var qaResults = adFeedbackCollection.qaResults;
	//var trailingWhiteSpacePattern = /\s$/;
	//var extraQuotationPattern = /(^")|(\"(?=\"))|("$)/g;
	
	var outputString = "";
	
	if (qaResults.length > 0) {
		outputString = "<p><span class=siteSpecification>Site Specification</span><br/>";
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
				outputString += "<li class=";
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
		case "Functionality":
			return "functionality";
		case "Tracking":
			return "tracking";
		default:
			return "";
	}
}

function selectText(element) {
    var text = document.getElementById(element);
    var range;
    var selection;
       
    if (document.body.createTextRange) { //ms
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function ascendingNumericalSort(a, b) {
	return Number(a) - Number(b);
}

function selectOutputText() {
	selectText('qaOutput');
}