var qaInput;
var qaOutput;
var defaultOutput;
var lastInput = "";
var checkForInputIntervalID;

window.addEventListener("load", init);

function init() {
	setGlobalVariables();
	addEventListeners();
}

function setGlobalVariables() {
	qaInput = document.getElementById("qaInput");
	qaOutput = document.getElementById("qaOutput");
	defaultOutput = qaOutput.innerHTML;
}

function addEventListeners() {
	var clearButton = document.getElementById("clearButton");
	var selectButton = document.getElementById("selectButton");

	clearButton.addEventListener("click", resetQAInputText);
	selectButton.addEventListener("click", selectOutputText);

	qaInput.addEventListener("keyup", updateOutput);
	qaInput.addEventListener("blur", updateOutput);
	qaInput.addEventListener("paste", function() {
		setTimeout(updateOutput, 100);
	});
}

function resetQAInputText(event) {
	setInput("");
	setOutput(defaultOutput);
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

function setInput(input) {
	qaInput.value = input;
}

function getOutput() {
	var output = unescape(qaOutput.innerHTML);
	return output;
}

function setOutput(output) {
	qaOutput.innerHTML = output;
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
	if (!isStringBlank(getInput())) {
		var output;

		var adFeedbackCollection = new AdFeedbackCollection(getInput());
		printOutput(adFeedbackCollection);
	}
	else {
		qaOutput.innerHTML = defaultOutput;
	}
}

function isStringBlank(string) {
	var whiteSpace = /^\s+$/;

	return whiteSpace.test(string) || string.length === 0 || string === "";
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
		outputString += "<br/><p class='bold'>";
		
		for (var j = 0; j < qaResults[i].ads.length; j++) {
			outputString += qaResults[i].ads[j].id ? qaResults[i].ads[j].id + " - " : "";
			outputString += qaResults[i].ads[j].title;
			outputString += qaResults[i].ads[j].format ? " (" + qaResults[i].ads[j].format + ")": "";
			outputString += "</p>";
		}
		
		outputString += "<ul>";
		
		//Ad issues
		if (qaResults[i].issues.length > 0) {
			for (var k = 0; k < qaResults[i].issues.length; k++) {
				var issue = qaResults[i].issues[k];
				var categoryClass = getCategoryClass(issue.category);

				outputString += "<li class=";
				outputString += categoryClass;
				outputString += ">";

				if (issue.problems_issues.length > 1) {
					var isNotStandardCategory = categoryClass.length === 0;

					if (isNotStandardCategory && issue.ad_element.length > 1) {
						outputString += issue.ad_element + " - ";
					}

					outputString += issue.problems_issues;
				}
			
				if (issue.additionalNotes) {
					if(issue.additionalNotes.length > 1) {
						if (issue.additionalNotes.length <= 10) {
							outputString += " (" + issue.additionalNotes + ")";
						}
						else {
							if (issue.problems_issues.length > 1) {
								outputString += ". ";
							}
							outputString += issue.additionalNotes;
						}
					}
				}
			
				if (issue.potentialReasons.length > 1) {
					outputString += "<br/>";
					outputString += issue.potentialReasons;
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
    var range;
    var selection;
       
    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function ascendingNumericalSort(a, b) {
	return Number(a) - Number(b);
}

function selectOutputText() {
	selectText(qaOutput);
}