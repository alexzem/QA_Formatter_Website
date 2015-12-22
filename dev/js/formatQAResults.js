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
	if (lastInput !== getInput()) {
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
	var outputString = "";
	
	if (qaResults.length > 0) {
		outputString = "<p><span class=siteSpecification>Site Specification</span><br/>";
		outputString += "<span class=functionality>Functionality</span><br/>";
		outputString += "<span class=tracking>Tracking</span></p><br/>";
	}
	
	outputString += qaResults.map(getAdFeedback).join("<br/>");
	outputString = outputString.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, "\"");
	
	qaOutput.innerHTML = outputString;
}

function getAdFeedback(adFeedback) {
	//Ad ID and title
	var html = adFeedback.ads.map(getAdTitles).join("");

	//Ad issues
	html += "<ul>";
	
	if (adFeedback.issues.length > 0) {
		html += adFeedback.issues.map(getIssues, "").join("");
	}
	else {
		html += "<li>See \"All Ads\"</li>";
	}
	
	html += "</ul>";

	return html;
}

function getAdTitles(ad) {
	var html = "<p class='bold'>";
	html += ad.id ? ad.id + " - " : "";
	html += ad.title;
	html += ad.format ? " (" + ad.format + ")": "";
	html += "</p>";

        if (ad.testPages && ad.testPages.length > 0) {
            html += "<p>Test page(s): ";

            var anchors = ad.testPages.map(function (testPage) {
                return "<a href='" + testPage + "' target='_blank'>" + testPage + "</a>";
            });
            
            html += anchors.join(", ");
            html += "</p>";
        }
	
	return html;
}

function getIssues(issue) {
	var categoryClass = getCategoryClass(issue.category);
	var html = "<li class=";

	html += categoryClass;
	html += ">";

	if (issue.problemsIssues.length > 1) {
		html += issue.problemsIssues;

		var isNotStandardCategory = categoryClass.length === 0;

		if (isNotStandardCategory && issue.adElements.length > 0) {
			html += " [" + issue.adElements.join(', ') + "]";
		}

	}

	if (issue.additionalNotes) {
		if(issue.additionalNotes.length > 1) {
			if (issue.additionalNotes.length <= 10) {
				html += " (" + issue.additionalNotes + ")";
			}
			else {
				if (issue.problemsIssues.length > 1) {
					html += " - ";
				}
				html += issue.additionalNotes;
			}
		}
	}

	if (issue.testPages && issue.testPages.length > 0) {
		html += "<br/>";
		html += "Test page(s): " + issue.testPages.join(" | ");
	}

	html += "</li>";

	return html;
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
    } }

function ascendingNumericalSort(a, b) {
	return Number(a) - Number(b);
}

function selectOutputText() {
	selectText(qaOutput);
}
