function init(){setGlobalVariables(),addEventListeners()}function setGlobalVariables(){qaInput=document.getElementById("qaInput"),qaOutput=document.getElementById("qaOutput"),defaultOutput=qaOutput.innerHTML,formatAdditionalCb=document.getElementById("formatAdditionalCb")}function addEventListeners(){var e=document.getElementById("clearButton"),t=document.getElementById("selectButton");e.addEventListener("click",resetQAInputText),t.addEventListener("click",selectOutputText),qaInput.addEventListener("keyup",updateOutput),qaInput.addEventListener("blur",updateOutput),qaInput.addEventListener("paste",function(){setTimeout(updateOutput,100)}),formatAdditionalCb.addEventListener("change",updateOutput)}function resetQAInputText(e){setInput(""),setOutput(defaultOutput)}function checkForNewInput(){lastInput!==getInput()&&(lastInput=getInput(),updateOutput())}function getInput(){return qaInput.value.trim()}function setInput(e){qaInput.value=e.trim()}function getOutput(){var e=unescape(qaOutput.innerHTML);return e}function setOutput(e){qaOutput.innerHTML=e}function isInt(e){var t=/^\d+$/;return t.test(e)?!0:!1}function updateOutput(){if(isStringBlank(getInput()))qaOutput.innerHTML=defaultOutput;else{var e=getInput();if(formatAdditionalCb.checked){for(var t=0;t<formatAdditionalResultsConfig.remove.length;t++)e=e.replace(new RegExp(formatAdditionalResultsConfig.remove[t],"ig"),"");for(var n=0;n<formatAdditionalResultsConfig.replace.length;n++)e=e.replace(new RegExp(formatAdditionalResultsConfig.replace[n][0],"ig"),formatAdditionalResultsConfig.replace[n][1])}if(isStringBlank(e))return void(qaOutput.innerHTML="Ad(s) passed QA. No issues present.");var s=new AdFeedbackCollection(e.trim());printOutput(s)}}function isStringBlank(e){var t=/^\s+$/;return t.test(e)||0===e.length||""===e}function printOutput(e){var t=e.qaResults,n="";t.length>0&&(n+="<p>",e.qaCategories.indexOf("Site Specification")>=0&&(n+="<span class=siteSpecification>Site Specification</span><br/>"),e.qaCategories.indexOf("Functionality")>=0&&(n+="<span class=functionality>Functionality</span><br/>"),e.qaCategories.indexOf("Tracking")>=0&&(n+="<span class=tracking>Tracking</span>"),n+="</p><br/>"),n+=t.map(getAdFeedback).join("<br/>"),n=n.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g,'"'),qaOutput.innerHTML=n}function getAdFeedback(e){var t=e.ads.map(getAdTitles).join("");return t+="<ul>",t+=e.issues.length>0?e.issues.map(getIssues,"").join(""):'<li>See "All Ads"</li>',t+="</ul>"}function getAdTitles(e){var t="<p class='bold'>";if(t+=e.id?e.id+" - ":"",t+=e.title,t+=e.format?" ("+e.format+")":"",t+="</p>",e.testPages&&e.testPages.length>0){t+="<p>Test page(s): ";var n=e.testPages.map(function(e){return"<a href='"+e+"' target='_blank'>"+e+"</a>"});t+=n.join(", "),t+="</p>"}return t}function getIssues(e){var t=getCategoryClass(e.category),n="<li class=";if(n+=t,n+=">",e.problemsIssues.length>1){n+=e.problemsIssues;var s=0===t.length;s&&e.adElements.length>0&&(n+=" ["+e.adElements.join(", ")+"]")}return e.additionalNotes&&e.additionalNotes.length>1&&(e.additionalNotes.length<=10?n+=" ("+e.additionalNotes+")":(e.problemsIssues.length>1&&(n+=" - "),n+=e.additionalNotes)),e.testPages&&e.testPages.length>0&&(n+="<br/>",n+="Test page(s): "+e.testPages.join(" | ")),n+="</li>"}function getCategoryClass(e){switch(e){case"Site Specification":return"siteSpecification";case"Functionality":return"functionality";case"Tracking":return"tracking";default:return""}}function selectText(e){var t,n;document.body.createTextRange?(t=document.body.createTextRange(),t.moveToElementText(e),t.select()):window.getSelection&&(n=window.getSelection(),t=document.createRange(),t.selectNodeContents(e),n.removeAllRanges(),n.addRange(t))}function ascendingNumericalSort(e,t){return Number(e)-Number(t)}function selectOutputText(){selectText(qaOutput)}function AdFeedbackCollection(e){this.qaResults=[],this.qaCategories=[],this.parseFeedback(e),this.isolateCommonTestPages(),this.isolateCommonIssues(),this.combineLikeIssues()}function AdFeedback(e){this.ads=e.ads,this.issues=e.issues}function Ad(e){this.id=e.id,this.title=e.title,this.format=e.format}function Issue(e){this.category=e.category,e.adElement&&(this.adElements=[e.adElement]),e.problemsIssues&&(this.problemsIssues=e.problemsIssues.replace(/^Other/,"")),e.testPage&&(this.testPages=[e.testPage]),e.additionalNotes&&(this.additionalNotes=e.additionalNotes.replace(/\s$/,""))}!window.addEventListener&&Element.prototype&&function(e){function t(){}function n(e,n,s){s=!!s;var i=this;i.__eventListener=i.__eventListener||{},i.__eventListener[e]=i.__eventListener[e]||[[],[]],i.__eventListener[e][0].length||i.__eventListener[e][1].length||(i.__eventListener["on"+e]=function(n){var s,a=new t,r=[],o=n.srcElement||i;for(s in n)a[s]=n[s];for(a.currentTarget=i,a.pageX=n.clientX+document.documentElement.scrollLeft,a.pageY=n.clientY+document.documentElement.scrollTop,a.target=o,a.timeStamp=+new Date,a.nativeEvent=n;o;)r.unshift(o),o=o.parentNode;for(var u,l=0;u=r[l];++l)if(u.__eventListener&&u.__eventListener[e])for(var c,d=0;c=u.__eventListener[e][0][d];++d)c.call(i,a);r.reverse();for(var u,l=0;(u=r[l])&&!n.cancelBubble;++l)if(u.__eventListener&&u.__eventListener[e])for(var c,d=0;(c=u.__eventListener[e][1][d])&&!n.cancelBubble;++d)c.call(i,a);n.cancelBubble=!0},i.attachEvent("on"+e,i.__eventListener["on"+e])),i.__eventListener[e][s?0:1].push(n)}function s(e,t,n){n=!!n;var s,i=this;for(i.__eventListener=i.__eventListener||{},i.__eventListener[e]=i.__eventListener[e]||[[],[]],s=i.__eventListener[e][n?0:1],eventIndex=s.length-1,eventLength=-1;eventIndex>eventLength;--eventIndex)s[eventIndex]==t&&s.splice(eventIndex,1)[0][1];i.__eventListener[e][0].length||i.__eventListener[e][1].length||i.detachEvent("on"+e,i.__eventListener["on"+e])}t.prototype.preventDefault=function(){this.nativeEvent.returnValue=!1},t.prototype.stopPropagation=function(){this.nativeEvent.cancelBubble=!0},window.constructor.prototype.addEventListener=document.constructor.prototype.addEventListener=Element.prototype.addEventListener=n,window.constructor.prototype.removeEventListener=document.constructor.prototype.removeEventListener=Element.prototype.removeEventListener=s}(),formatAdditionalResultsConfig={remove:["//Note:Please hot it for clickthrough",".*Initial load exceeds.*",".*Replay video action is tracking after the .*?start video.*? metric.*"],replace:[]};var qaInput,qaOutput,defaultOutput,lastInput="",checkForInputIntervalID,formatAdditionalCb;window.addEventListener("load",init),function(e,t,n,s,i,a,r){e.GoogleAnalyticsObject=i,e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(arguments)},e[i].l=1*new Date,a=t.createElement(n),r=t.getElementsByTagName(n)[0],a.async=1,a.src=s,r.parentNode.insertBefore(a,r)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),ga("create","UA-3719327-2","mediamind.com"),ga("send","pageview"),window.Modernizr=function(e,t,n){function s(e){p.cssText=e}function i(e,t){return typeof e===t}var a,r,o,u="2.7.1",l={},c=t.documentElement,d="modernizr",f=t.createElement(d),p=f.style,h=({}.toString,{}),m=[],g=m.slice,v={}.hasOwnProperty;o=i(v,"undefined")||i(v.call,"undefined")?function(e,t){return t in e&&i(e.constructor.prototype[t],"undefined")}:function(e,t){return v.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=g.call(arguments,1),s=function(){if(this instanceof s){var i=function(){};i.prototype=t.prototype;var a=new i,r=t.apply(a,n.concat(g.call(arguments)));return Object(r)===r?r:a}return t.apply(e,n.concat(g.call(arguments)))};return s}),h.localstorage=function(){try{return localStorage.setItem(d,d),localStorage.removeItem(d),!0}catch(e){return!1}};for(var I in h)o(h,I)&&(r=I.toLowerCase(),l[r]=h[I](),m.push((l[r]?"":"no-")+r));return l.addTest=function(e,t){if("object"==typeof e)for(var s in e)o(e,s)&&l.addTest(s,e[s]);else{if(e=e.toLowerCase(),l[e]!==n)return l;t="function"==typeof t?t():t,"undefined"!=typeof enableClasses&&enableClasses&&(c.className+=" "+(t?"":"no-")+e),l[e]=t}return l},s(""),f=a=null,function(e,t){function n(e,t){var n=e.createElement("p"),s=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",s.insertBefore(n.lastChild,s.firstChild)}function s(){var e=I.elements;return"string"==typeof e?e.split(" "):e}function i(e){var t=v[e[m]];return t||(t={},g++,e[m]=g,v[g]=t),t}function a(e,n,s){if(n||(n=t),c)return n.createElement(e);s||(s=i(n));var a;return a=s.cache[e]?s.cache[e].cloneNode():h.test(e)?(s.cache[e]=s.createElem(e)).cloneNode():s.createElem(e),!a.canHaveChildren||p.test(e)||a.tagUrn?a:s.frag.appendChild(a)}function r(e,n){if(e||(e=t),c)return e.createDocumentFragment();n=n||i(e);for(var a=n.frag.cloneNode(),r=0,o=s(),u=o.length;u>r;r++)a.createElement(o[r]);return a}function o(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return I.shivMethods?a(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+s().join().replace(/[\w\-]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(I,t.frag)}function u(e){e||(e=t);var s=i(e);return I.shivCSS&&!l&&!s.hasCSS&&(s.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),c||o(e,s),e}var l,c,d="3.7.0",f=e.html5||{},p=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,m="_html5shiv",g=0,v={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,c=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){l=!0,c=!0}}();var I={elements:f.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:d,shivCSS:f.shivCSS!==!1,supportsUnknownElements:c,shivMethods:f.shivMethods!==!1,type:"default",shivDocument:u,createElement:a,createDocumentFragment:r};e.html5=I,u(t)}(this,t),l._version=u,l}(this,this.document),AdFeedbackCollection.prototype={parseRawText:function(e){var t=/(?:\t)|(?:\n(?=[1-9]\d{6,}))/g,n=e.split(t),s=[],i=[];return n.forEach(function(e,t){t>0&&t%8===0&&(s.push(i),i=[]),i.push(e)}),s.push(i),s},parseFeedback:function(e){var t=0,n=1,s=2,i=3,a=4,r=5,o=6,u=7,l=this.parseRawText(e);l.forEach(function(e,l,c){var d=new Issue({category:e[i],problemsIssues:e[r],adElement:e[a],testPage:e[o],additionalNotes:e[u]});if(this.qaCategories.addUnique(d.category),0===l||e[t]!=c[l-1][t]){var f=new Ad({id:e[t],title:e[n],format:e[s]});this.qaResults.push(new AdFeedback({ads:[f],issues:[d]}))}else this.qaResults[this.qaResults.length-1].insertIssue(d)},this)},isolateCommonTestPages:function(){this.qaResults.length>1&&this.qaResults.forEach(function(e){var t=e.issues&&e.issues.length>0;if(t){var n=e.issues[0],s=n.testPages&&n.testPages.length>0;if(s){var i=e.issues.every(function(e){return e.testPages.sort().join(",")===n.testPages.sort().join(",")});i&&(e.ads[0].testPages=n.testPages,e.issues.forEach(function(e){e.testPages=null}))}}})},isolateCommonIssues:function(){if(this.qaResults.length>1){var e=this.qaResults[0].issues,t=e.filter(function(e){return this.qaResults.every(function(t){return t.hasSimilarIssue(e)})},this);if(t.forEach(function(e){this.qaResults.forEach(function(t){t.removeSimilarIssue(e)})},this),t.length>0){var n=new Ad({id:"",title:"All Ads",format:""}),s=new AdFeedback({ads:[n],issues:t});this.qaResults.unshift(s)}}},combineLikeIssues:function(){this.qaResults.forEach(function(e,t,n){for(var s=t+1;s<n.length;s++)e.hasSimilarIssuesAs(n[s])&&(e.insertAd(n[s].ads[0]),n.splice(s,1),s--)})}},AdFeedback.prototype={insertAd:function(e){this.hasAd(e)||this.ads.push(e)},getAdIndex:function(e){for(var t=0;t<this.ads.length;t++)if(this.ads[t].isEqualTo(e))return t;return-1},hasAd:function(e){return this.getAdIndex(e)>=0?!0:!1},insertIssue:function(e){this.hasIssue(e)||(this.hasSimilarIssue(e)?this.getSimilarIssue(e).combine(e):this.issues.push(e))},getIssueIndex:function(e){for(var t=0;t<this.issues.length;t++)if(this.issues[t].isEqualTo(e))return t;return-1},hasIssue:function(e){return this.getIssueIndex(e)>=0?!0:!1},getSimilarIssueIndex:function(e){for(var t=0;t<this.issues.length;t++)if(this.issues[t].isSimilarTo(e))return t;return-1},getSimilarIssue:function(e){var t=this.getSimilarIssueIndex(e);return t>=0?this.issues[t]:void 0},hasSimilarIssue:function(e){return this.getSimilarIssueIndex(e)>=0?!0:!1},removeSimilarIssue:function(e){return this.hasSimilarIssue(e)?this.issues.splice(this.getSimilarIssueIndex(e),1):void 0},hasSimilarIssuesAs:function(e){return this.issues.length!==e.issues.length?!1:this.issues.every(function(t){return e.hasSimilarIssue(t)})}},Ad.prototype={isEqualTo:function(e){return this.id===e.id&&this.title===e.title&&this.format===e.format}},Issue.prototype={insertAdElements:function(e){e&&e.length>0&&this.adElements.push(e)},insertTestPages:function(e){e&&e.length>0&&(this.testPages.push(e),this.testPages.forEach(function(e,t,n){n.indexOf(e)>=0&&n.splice(t,1)}))},combine:function(e){this.isSimilarTo(e)&&(this.insertAdElements(e.adElements),this.insertTestPages(e.testPages))},isEqualTo:function(e){return this.adElements===e.adElements&&this.testPage===e.testPage&&this.isSimilarTo(e)},isSimilarTo:function(e){return this.category===e.category&&this.problemsIssues===e.problemsIssues&&this.additionalNotes===e.additionalNotes}},Array.prototype.addUnique=function(e){this.indexOf(e)<0&&this.push(e)};