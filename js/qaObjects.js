function AdFeedbackCollection(inputText) {
	this.qaResults = [];
	
	this.parseFeedback(inputText);
	this.isolateCommonIssues();
	this.combineLikeIssues();
}

AdFeedbackCollection.prototype.parseRawText = function(input) {
	var splitPattern = /(?:\t)|(?:\n(?=[1-9]\d{6,}))/g
	var allCells = input.split(splitPattern);
	var rows = [];
	var columns = [];
	
	var i;
	for (i = 0; i < allCells.length; i++) {
		//console.log("Row " + j + ": " + rows[j]);
		
		if (i > 0 && i % 8 == 0) {
			rows.push(columns);
			columns = [];
		}
		
		columns.push(allCells[i]);
	}
	
	return rows;
}

AdFeedbackCollection.prototype.parseFeedback = function(input) {
	var ID = 0;
	var TITLE = 1;
	var FORMAT = 2;
	var CATEGORY = 3;
	var AD_ELEMENT = 4;
	var PROBLEMS_ISSUES = 5;
	var POTENTIAL_REASON = 6;
	var ADDITIONAL_NOTES = 7;
		
	var feedback = this.parseRawText(input);
		
	for (var i = 0; i < feedback.length; i++) {
		var issue = new Issue(feedback[i][CATEGORY],
								feedback[i][PROBLEMS_ISSUES],
								feedback[i][POTENTIAL_REASON],
								feedback[i][ADDITIONAL_NOTES]);
			
			
		if (i == 0 || feedback[i][ID] != feedback[i - 1][ID]) {
			var ad = new Ad(feedback[i][ID], feedback[i][TITLE], feedback[i][FORMAT]);
				
			this.qaResults.push(new AdFeedback([ad],
											[issue]));
		}
		else {
			this.qaResults[this.qaResults.length - 1].insertIssue(issue);
		}
	}
}
	
AdFeedbackCollection.prototype.isolateCommonIssues = function() {
	var commonIssues = [];
	
	if (this.qaResults.length > 1) {
		for (var i = 0; i < this.qaResults[0].issues.length; i++) {
			var currentIssue = this.qaResults[0].issues[i];
			
			var doAllAdsHaveIssue = true;
			
			for (var j = 0; j < this.qaResults.length; j++) {
				if (!this.qaResults[j].hasIssue(currentIssue)) {
					doAllAdsHaveIssue = false;
				}
			}
			
			if (doAllAdsHaveIssue) {
				//if (commonIssues.indexOf(currentIssue) < 0) {
					commonIssues.push(currentIssue);
				//}
			}
		}
		
		for (var k = 0; k < commonIssues.length; k++) {
			for (var l = 0; l < this.qaResults.length; l++) {
				this.qaResults[l].removeIssue(commonIssues[k]);
			}
		}
		
		if (commonIssues.length > 0) {
			var allAds = new Ad("", "All Ads", "");
			var commonFeedback = new AdFeedback([allAds], commonIssues);
			this.qaResults.unshift(commonFeedback);
		}
	}
}
	
AdFeedbackCollection.prototype.combineLikeIssues = function () {
	for (var i = 0; i < this.qaResults.length; i++) {
		for (var j = i + 1; j < this.qaResults.length; j++) {
			if (this.qaResults[i].hasSameIssuesAs(this.qaResults[j])) {
				this.qaResults[i].insertAd(this.qaResults[j].ads[0]);
				this.qaResults.splice(j, 1);
				j--;
			}
		}
	}
}

function AdFeedback(ads, issues) {
	this.ads = ads;
	this.issues = issues;
}

AdFeedback.prototype.insertAd = function (ad) {
	if (!this.hasAd(ad)) {
		this.ads.push(ad);
	}
}
	
AdFeedback.prototype.getAdIndex = function (ad) {
	for (var i = 0; i < this.ads.length; i++) {
		if (this.ads[i].isEqualTo(ad)) {
			return i;
		}
	}
	
	return -1;
}
	
AdFeedback.prototype.hasAd = function (ad) {
	if (this.getAdIndex(ad) >= 0) {
		return true;
	}
	
	return false;
}
	
AdFeedback.prototype.insertIssue = function (issue) {
	if (!this.hasIssue(issue)) {
		this.issues.push(issue);
	}
}
	
AdFeedback.prototype.getIssueIndex = function (issue) {
	for (var i = 0; i < this.issues.length; i++) {
		if (this.issues[i].isEqualTo(issue)) {
			return i;
		}
	}		
	return -1;
}
	
AdFeedback.prototype.hasIssue = function (issue) {
	if (this.getIssueIndex(issue) >= 0) {
		return true;
	}
	
	return false;
}
	
AdFeedback.prototype.removeIssue = function(issue) {
	if (this.hasIssue(issue)) {
		return this.issues.splice(this.getIssueIndex(issue), 1);
	}
}
	
AdFeedback.prototype.insertIssue = function(issue) {
	if (!this.hasIssue(issue)) {
		this.issues.push(issue);
	}
}
	
	AdFeedback.prototype.hasSameIssuesAs = function (adFeedback) {
	if (this.issues.length == adFeedback.issues.length) {
		for (var i = 0; i < this.issues.length; i++) {
			if (!adFeedback.hasIssue(this.issues[i])) {
				return false;
			}
		}
	}
	else {
		return false;
	}
		
	return true;
}

function Ad(id, title, format) {
	this.id = id;
	this.title = title;
	this.format = format;
}

Ad.prototype.isEqualTo = function (ad) {
	return (this.id == ad.id &&
		this.title == ad.title &&
		this.format == ad.format);
}

function Issue(category, problems_issues, potentialReasons, additionalNotes) {
	this.category = category;
	this.problems_issues = problems_issues;
	this.potentialReasons = potentialReasons;
	this.additionalNotes = additionalNotes;
	
}

Issue.prototype.isEqualTo = function (issue) {
	return (this.category == issue.category &&
		this.problems_issues == issue.problems_issues &&
		this.potentialReasons == issue.potentialReasons &&
		this.additionalNotes == issue.additionalNotes);
}

