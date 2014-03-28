!window.addEventListener && Element.prototype && (function (polyfill) {
	// window.addEventListener, document.addEventListener, <>.addEventListener
	// window.removeEventListener, document.removeEventListener, <>.removeEventListener
 
	function Event() { [polyfill] }
 
	Event.prototype.preventDefault = function () {
		this.nativeEvent.returnValue = false;
	};
 
	Event.prototype.stopPropagation = function () {
		this.nativeEvent.cancelBubble = true;
	};
 
	function addEventListener(type, listener, useCapture) {
		useCapture = !!useCapture;
 
		var that = this;
 
		that.__eventListener = that.__eventListener || {};
		that.__eventListener[type] = that.__eventListener[type] || [[],[]];
 
		if (!that.__eventListener[type][0].length && !that.__eventListener[type][1].length) {
			that.__eventListener['on' + type] = function (nativeEvent) {
				var newEvent = new Event, newNodeList = [], node = nativeEvent.srcElement || that, property;
 
				for (property in nativeEvent) {
					newEvent[property] = nativeEvent[property];
				}
 
				newEvent.currentTarget =  that;
				newEvent.pageX = nativeEvent.clientX + document.documentElement.scrollLeft;
				newEvent.pageY = nativeEvent.clientY + document.documentElement.scrollTop;
				newEvent.target = node;
				newEvent.timeStamp = +new Date;
 
				newEvent.nativeEvent = nativeEvent;
 
				while (node) {
					newNodeList.unshift(node);
 
					node = node.parentNode;
				}
 
				for (var a, i = 0; (a = newNodeList[i]); ++i) {
					if (a.__eventListener && a.__eventListener[type]) {
						for (var aa, ii = 0; (aa = a.__eventListener[type][0][ii]); ++ii) {
							aa.call(that, newEvent);
						}
					}
				}
 
				newNodeList.reverse();
 
				for (var a, i = 0; (a = newNodeList[i]) && !nativeEvent.cancelBubble; ++i) {
					if (a.__eventListener && a.__eventListener[type]) {
						for (var aa, ii = 0; (aa = a.__eventListener[type][1][ii]) && !nativeEvent.cancelBubble; ++ii) {
							aa.call(that, newEvent);
						}
					}
				}
 
				nativeEvent.cancelBubble = true;
			};
 
			that.attachEvent('on' + type, that.__eventListener['on' + type]);
		}
 
		that.__eventListener[type][useCapture ? 0 : 1].push(listener);
	}
 
	function removeEventListener(type, listener, useCapture) {
		useCapture = !!useCapture;
 
		var that = this, a;
 
		that.__eventListener = that.__eventListener || {};
		that.__eventListener[type] = that.__eventListener[type] || [[],[]];
 
		a = that.__eventListener[type][useCapture ? 0 : 1];
 
		for (eventIndex = a.length - 1, eventLength = -1; eventIndex > eventLength; --eventIndex) {
			if (a[eventIndex] == listener) {
				a.splice(eventIndex, 1)[0][1];
			}
		}
 
		if (!that.__eventListener[type][0].length && !that.__eventListener[type][1].length) {
			that.detachEvent('on' + type, that.__eventListener['on' + type]);
		}
	}
 
	window.constructor.prototype.addEventListener = document.constructor.prototype.addEventListener = Element.prototype.addEventListener = addEventListener;
	window.constructor.prototype.removeEventListener = document.constructor.prototype.removeEventListener = Element.prototype.removeEventListener = removeEventListener;
})();