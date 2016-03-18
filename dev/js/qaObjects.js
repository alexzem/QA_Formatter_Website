function AdFeedbackCollection(inputText) {
  this.qaResults = [];
  this.qaCategories = [];
  this.parseFeedback(inputText);
  this.isolateCommonTestPages();
  this.isolateCommonIssues();
  this.combineLikeIssues();
}

AdFeedbackCollection.prototype = {
  parseRawText: function(input) {
    var splitPattern = /(?:\t)|(?:\n(?=[1-9]\d{6,}))/g;
    var allCells = input.split(splitPattern);
    var rows = [];
    var columns = [];

    allCells.forEach(function(cell, i) {
      if (i > 0 && i % 8 === 0) {
        rows.push(columns);
        columns = [];
      }

      columns.push(cell);
    });

    rows.push(columns);

    return rows;
  },

  parseFeedback: function(input) {
    var ID = 0;
    var TITLE = 1;
    var FORMAT = 2;
    var CATEGORY = 3;
    var AD_ELEMENT = 4;
    var PROBLEMS_ISSUES = 5;
    var TEST_PAGE = 6;
    var ADDITIONAL_NOTES = 7;

    var feedbacks = this.parseRawText(input);

    feedbacks.forEach(function(feedback, i, feedbacks) {
      var issue = new Issue({
        category: feedback[CATEGORY],
        problemsIssues: feedback[PROBLEMS_ISSUES],
        adElement: feedback[AD_ELEMENT],
        testPage: feedback[TEST_PAGE],
        additionalNotes: feedback[ADDITIONAL_NOTES]
      });

      this.qaCategories.addUnique(issue.category);

      if (i === 0 || feedback[ID] != feedbacks[i - 1][ID]) {
        var ad = new Ad({
          id: feedback[ID],
          title: feedback[TITLE],
          format: feedback[FORMAT]
        });

<<<<<<< HEAD
        this.qaResults.push(new AdFeedback({
          ads: [ad],
          issues: [issue]
        }));
      } else {
        this.qaResults[this.qaResults.length - 1].insertIssue(issue);
      }
    }, this);
  },

  isolateCommonTestPages: function() {
    if (this.qaResults.length > 1) {
      this.qaResults.forEach(function(qaResult) {
        var isThereAtLeastOneIssue = qaResult.issues && qaResult.issues.length > 0;

        if (isThereAtLeastOneIssue) {
          var firstIssue = qaResult.issues[0];
          var isThereAtLeastOneTestPage = firstIssue.testPages && firstIssue.testPages.length > 0;

          if (isThereAtLeastOneTestPage) {
            var doAllIssuesHaveSameTestPage = qaResult.issues.every(function(issue) {
              //Prevents same testpages from displaying seperately
              if (issue.testPages && issue.testPages.toString().length > 3) {
                return issue.testPages.sort().join(',') === firstIssue.testPages.sort().join(',');
              }
=======
        return rows;
    },

    parseFeedback: function (input) {
        var ID = 0;
        var TITLE = 1;
        var FORMAT = 2;
        var CATEGORY = 3;
        var AD_ELEMENT = 4;
        var PROBLEMS_ISSUES = 5;
        var TEST_PAGE = 6;
        var ADDITIONAL_NOTES = 7;

        var feedbacks = this.parseRawText(input);

        feedbacks.forEach(function (feedback, i, feedbacks) {
            var issue = new Issue({
                category: feedback[CATEGORY],
                problemsIssues: feedback[PROBLEMS_ISSUES],
                adElement: feedback[AD_ELEMENT],
                testPage: feedback[TEST_PAGE],
                additionalNotes: feedback[ADDITIONAL_NOTES]
>>>>>>> parent of c8ddf07... Merge pull request #11 from alexzem/master
            });

            if (doAllIssuesHaveSameTestPage) {
              qaResult.ads[0].testPages = firstIssue.testPages;
              qaResult.issues.forEach(function(issue) {
                issue.testPages = null;
              });
            }
          }
        }
      });
    }
  },

  isolateCommonIssues: function() {
    if (this.qaResults.length > 1) {
      var issues = this.qaResults[0].issues;

      var commonIssues = issues.filter(function(issue) {
        return this.qaResults.every(function(qaResult) {
          return qaResult.hasSimilarIssue(issue);
        });
      }, this);

      commonIssues.forEach(function(issue) {
        this.qaResults.forEach(function(qaResult) {
          qaResult.removeSimilarIssue(issue);
        });
      }, this);

      if (commonIssues.length > 0) {
        var allAds = new Ad({
          id: "",
          title: "All Ads",
          format: ""
        });
        var commonFeedback = new AdFeedback({
          ads: [allAds],
          issues: commonIssues
        });

        this.qaResults.unshift(commonFeedback);
      }
    }
  },

  combineLikeIssues: function() {
    this.qaResults.forEach(function(qaResult, i, qaResults) {
      for (var j = i + 1; j < qaResults.length; j++) {
        if (qaResult.hasSimilarIssuesAs(qaResults[j])) {
          qaResult.insertAd(qaResults[j].ads[0]);
          qaResults.splice(j, 1);
          j--;
        }
      }
    });
  }
};

function AdFeedback(args) {
  this.ads = args.ads;
  this.issues = args.issues;
}

AdFeedback.prototype = {
  insertAd: function(ad) {
    if (!this.hasAd(ad)) {
      this.ads.push(ad);
    }
  },

  getAdIndex: function(ad) {
    for (var i = 0; i < this.ads.length; i++) {
      if (this.ads[i].isEqualTo(ad)) {
        return i;
      }
    }

    return -1;
  },

  hasAd: function(ad) {
    if (this.getAdIndex(ad) >= 0) {
      return true;
    }

    return false;
  },

  insertIssue: function(issue) {
    if (!this.hasIssue(issue)) {
      if (this.hasSimilarIssue(issue)) {
        this.getSimilarIssue(issue).combine(issue);
      } else {
        this.issues.push(issue);
      }
    }
  },

  getIssueIndex: function(issue) {
    for (var i = 0; i < this.issues.length; i++) {
      if (this.issues[i].isEqualTo(issue)) {
        return i;
      }
    }
    return -1;
  },

  hasIssue: function(issue) {
    if (this.getIssueIndex(issue) >= 0) {
      return true;
    }

    return false;
  },

  getSimilarIssueIndex: function(issue) {
    for (var i = 0; i < this.issues.length; i++) {
      if (this.issues[i].isSimilarTo(issue)) {
        return i;
      }
    }
    return -1;
  },

  getSimilarIssue: function(issue) {
    var i = this.getSimilarIssueIndex(issue);

    if (i >= 0) {
      return this.issues[i];
    }

    return undefined;
  },

  hasSimilarIssue: function(issue) {
    if (this.getSimilarIssueIndex(issue) >= 0) {
      return true;
    }

    return false;
  },

  removeSimilarIssue: function(issue) {
    if (this.hasSimilarIssue(issue)) {
      return this.issues.splice(this.getSimilarIssueIndex(issue), 1);
    }
  },

  hasSimilarIssuesAs: function(adFeedback) {
    if (this.issues.length !== adFeedback.issues.length) {
      return false;
    }

    return this.issues.every(function(issue) {
      return adFeedback.hasSimilarIssue(issue);
    });
  }
};

function Ad(args) {
  this.id = args.id;
  this.title = args.title;
  this.format = args.format;
}

Ad.prototype = {
  isEqualTo: function(ad) {
    return (this.id === ad.id &&
      this.title === ad.title &&
      this.format === ad.format);
  }
};

function Issue(args) {
  this.category = args.category;

  if (args.adElement) {
    this.adElements = [args.adElement];
  }

  if (args.problemsIssues) {
    this.problemsIssues = args.problemsIssues.replace(/^Other/, "");
  }

  if (args.testPage) {
    this.testPages = [args.testPage];
  }

  if (args.additionalNotes) {
    this.additionalNotes = args.additionalNotes.replace(/\s$/, "");
  }
}

Issue.prototype = {
  insertAdElements: function(adElements) {
    if (adElements && adElements.length > 0) {
      this.adElements.push(adElements);
    }
  },

  insertTestPages: function(testPages) {
    if (testPages && testPages.length > 0) {
      this.testPages.push(testPages);

      this.testPages.forEach(function(testPage, i, testPages) {
        if (testPages.indexOf(testPage) >= 0) {
          testPages.splice(i, 1);
        }
      });
    }
  },

  combine: function(issue) {
    if (this.isSimilarTo(issue)) {
      this.insertAdElements(issue.adElements);
      this.insertTestPages(issue.testPages);
    }
  },

  isEqualTo: function(issue) {
    return (this.adElements === issue.adElements &&
      this.testPage === issue.testPage &&
      this.isSimilarTo(issue));
  },

  isSimilarTo: function(issue) {
    return (this.category === issue.category &&
      this.problemsIssues === issue.problemsIssues &&
      this.additionalNotes === issue.additionalNotes);
  }
};

Array.prototype.addUnique = function(val) {
  if (this.indexOf(val) < 0) {
    this.push(val);
  }
};
