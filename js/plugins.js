/*
 * plugins.js — slim bundle
 * Isotope v3.0.6 | Waypoints v4.0.1 | ShaderProgram (waves)
 * Swiper, Magnific Popup, NiceScroll now loaded via CDN
 */

/*------------------------------------------------------------------*/
/*	01) ISOTOPE
/*------------------------------------------------------------------*/

/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

/**
 * Bridget makes jQuery widgets
 * v2.0.1
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */

(function(window, factory) {
	// universal module definition
	/*jshint strict: false */
	/* globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('jquery-bridget/jquery-bridget', ['jquery'], function(jQuery) {
			return factory(window, jQuery);
		});
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			window,
			require('jquery')
		);
	} else {
		// browser global
		window.jQueryBridget = factory(
			window,
			window.jQuery
		);
	}

}(window, function factory(window, jQuery) {
	'use strict';

	// ----- utils ----- //

	var arraySlice = Array.prototype.slice;

	// helper function for logging errors
	// $.error breaks jQuery chaining
	var console = window.console;
	var logError = typeof console == 'undefined' ? function() {} :
		function(message) {
			console.error(message);
		};

	// ----- jQueryBridget ----- //

	function jQueryBridget(namespace, PluginClass, $) {
		$ = $ || jQuery || window.jQuery;
		if (!$) {
			return;
		}

		// add option method -> $().plugin('option', {...})
		if (!PluginClass.prototype.option) {
			// option setter
			PluginClass.prototype.option = function(opts) {
				// bail out if not an object
				if (!$.isPlainObject(opts)) {
					return;
				}
				this.options = $.extend(true, this.options, opts);
			};
		}

		// make jQuery plugin
		$.fn[namespace] = function(arg0 /*, arg1 */ ) {
			if (typeof arg0 == 'string') {
				// method call $().plugin( 'methodName', { options } )
				// shift arguments by 1
				var args = arraySlice.call(arguments, 1);
				return methodCall(this, arg0, args);
			}
			// just $().plugin({ options })
			plainCall(this, arg0);
			return this;
		};

		// $().plugin('methodName')
		function methodCall($elems, methodName, args) {
			var returnValue;
			var pluginMethodStr = '$().' + namespace + '("' + methodName + '")';

			$elems.each(function(i, elem) {
				// get instance
				var instance = $.data(elem, namespace);
				if (!instance) {
					logError(namespace + ' not initialized. Cannot call methods, i.e. ' +
						pluginMethodStr);
					return;
				}

				var method = instance[methodName];
				if (!method || methodName.charAt(0) == '_') {
					logError(pluginMethodStr + ' is not a valid method');
					return;
				}

				// apply method, get return value
				var value = method.apply(instance, args);
				// set return value if value is returned, use only first value
				returnValue = returnValue === undefined ? value : returnValue;
			});

			return returnValue !== undefined ? returnValue : $elems;
		}

		function plainCall($elems, options) {
			$elems.each(function(i, elem) {
				var instance = $.data(elem, namespace);
				if (instance) {
					// set options & init
					instance.option(options);
					instance._init();
				} else {
					// initialize new instance
					instance = new PluginClass(elem, options);
					$.data(elem, namespace, instance);
				}
			});
		}

		updateJQuery($);

	}

	// ----- updateJQuery ----- //

	// set $.bridget for v1 backwards compatibility
	function updateJQuery($) {
		if (!$ || ($ && $.bridget)) {
			return;
		}
		$.bridget = jQueryBridget;
	}

	updateJQuery(jQuery || window.jQuery);

	// -----  ----- //

	return jQueryBridget;

}));

/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

(function(global, factory) {
	// universal module definition
	/* jshint strict: false */
	/* globals define, module, window */
	if (typeof define == 'function' && define.amd) {
		// AMD - RequireJS
		define('ev-emitter/ev-emitter', factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS - Browserify, Webpack
		module.exports = factory();
	} else {
		// Browser globals
		global.EvEmitter = factory();
	}

}(typeof window != 'undefined' ? window : this, function() {



	function EvEmitter() {}

	var proto = EvEmitter.prototype;

	proto.on = function(eventName, listener) {
		if (!eventName || !listener) {
			return;
		}
		// set events hash
		var events = this._events = this._events || {};
		// set listeners array
		var listeners = events[eventName] = events[eventName] || [];
		// only add once
		if (listeners.indexOf(listener) == -1) {
			listeners.push(listener);
		}

		return this;
	};

	proto.once = function(eventName, listener) {
		if (!eventName || !listener) {
			return;
		}
		// add event
		this.on(eventName, listener);
		// set once flag
		// set onceEvents hash
		var onceEvents = this._onceEvents = this._onceEvents || {};
		// set onceListeners object
		var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
		// set flag
		onceListeners[listener] = true;

		return this;
	};

	proto.off = function(eventName, listener) {
		var listeners = this._events && this._events[eventName];
		if (!listeners || !listeners.length) {
			return;
		}
		var index = listeners.indexOf(listener);
		if (index != -1) {
			listeners.splice(index, 1);
		}

		return this;
	};

	proto.emitEvent = function(eventName, args) {
		var listeners = this._events && this._events[eventName];
		if (!listeners || !listeners.length) {
			return;
		}
		// copy over to avoid interference if .off() in listener
		listeners = listeners.slice(0);
		args = args || [];
		// once stuff
		var onceListeners = this._onceEvents && this._onceEvents[eventName];

		for (var i = 0; i < listeners.length; i++) {
			var listener = listeners[i]
			var isOnce = onceListeners && onceListeners[listener];
			if (isOnce) {
				// remove listener
				// remove before trigger to prevent recursion
				this.off(eventName, listener);
				// unset once flag
				delete onceListeners[listener];
			}
			// trigger listener
			listener.apply(this, args);
		}

		return this;
	};

	proto.allOff = function() {
		delete this._events;
		delete this._onceEvents;
	};

	return EvEmitter;

}));

/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */
/* globals console: false */

(function(window, factory) {
	/* jshint strict: false */
	/* globals define, module */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('get-size/get-size', factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory();
	} else {
		// browser global
		window.getSize = factory();
	}

})(window, function factory() {
	'use strict';

	// -------------------------- helpers -------------------------- //

	// get a number from a string, not a percentage
	function getStyleSize(value) {
		var num = parseFloat(value);
		// not a percent like '100%', and a number
		var isValid = value.indexOf('%') == -1 && !isNaN(num);
		return isValid && num;
	}

	function noop() {}

	var logError = typeof console == 'undefined' ? noop :
		function(message) {
			console.error(message);
		};

	// -------------------------- measurements -------------------------- //

	var measurements = [
		'paddingLeft',
		'paddingRight',
		'paddingTop',
		'paddingBottom',
		'marginLeft',
		'marginRight',
		'marginTop',
		'marginBottom',
		'borderLeftWidth',
		'borderRightWidth',
		'borderTopWidth',
		'borderBottomWidth'
	];

	var measurementsLength = measurements.length;

	function getZeroSize() {
		var size = {
			width: 0,
			height: 0,
			innerWidth: 0,
			innerHeight: 0,
			outerWidth: 0,
			outerHeight: 0
		};
		for (var i = 0; i < measurementsLength; i++) {
			var measurement = measurements[i];
			size[measurement] = 0;
		}
		return size;
	}

	// -------------------------- getStyle -------------------------- //

	/**
	 * getStyle, get style of element, check for Firefox bug
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
	 */
	function getStyle(elem) {
		var style = getComputedStyle(elem);
		if (!style) {
			logError('Style returned ' + style +
				'. Are you running this code in a hidden iframe on Firefox? ' +
				'See https://bit.ly/getsizebug1');
		}
		return style;
	}

	// -------------------------- setup -------------------------- //

	var isSetup = false;

	var isBoxSizeOuter;

	/**
	 * setup
	 * check isBoxSizerOuter
	 * do on first getSize() rather than on page load for Firefox bug
	 */
	function setup() {
		// setup once
		if (isSetup) {
			return;
		}
		isSetup = true;

		// -------------------------- box sizing -------------------------- //

		/**
		 * Chrome & Safari measure the outer-width on style.width on border-box elems
		 * IE11 & Firefox<29 measures the inner-width
		 */
		var div = document.createElement('div');
		div.style.width = '200px';
		div.style.padding = '1px 2px 3px 4px';
		div.style.borderStyle = 'solid';
		div.style.borderWidth = '1px 2px 3px 4px';
		div.style.boxSizing = 'border-box';

		var body = document.body || document.documentElement;
		body.appendChild(div);
		var style = getStyle(div);
		// round value for browser zoom. desandro/masonry#928
		isBoxSizeOuter = Math.round(getStyleSize(style.width)) == 200;
		getSize.isBoxSizeOuter = isBoxSizeOuter;

		body.removeChild(div);
	}

	// -------------------------- getSize -------------------------- //

	function getSize(elem) {
		setup();

		// use querySeletor if elem is string
		if (typeof elem == 'string') {
			elem = document.querySelector(elem);
		}

		// do not proceed on non-objects
		if (!elem || typeof elem != 'object' || !elem.nodeType) {
			return;
		}

		var style = getStyle(elem);

		// if hidden, everything is 0
		if (style.display == 'none') {
			return getZeroSize();
		}

		var size = {};
		size.width = elem.offsetWidth;
		size.height = elem.offsetHeight;

		var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

		// get all measurements
		for (var i = 0; i < measurementsLength; i++) {
			var measurement = measurements[i];
			var value = style[measurement];
			var num = parseFloat(value);
			// any 'auto', 'medium' value will be 0
			size[measurement] = !isNaN(num) ? num : 0;
		}

		var paddingWidth = size.paddingLeft + size.paddingRight;
		var paddingHeight = size.paddingTop + size.paddingBottom;
		var marginWidth = size.marginLeft + size.marginRight;
		var marginHeight = size.marginTop + size.marginBottom;
		var borderWidth = size.borderLeftWidth + size.borderRightWidth;
		var borderHeight = size.borderTopWidth + size.borderBottomWidth;

		var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

		// overwrite width and height if we can get it from style
		var styleWidth = getStyleSize(style.width);
		if (styleWidth !== false) {
			size.width = styleWidth +
				// add padding and border unless it's already including it
				(isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
		}

		var styleHeight = getStyleSize(style.height);
		if (styleHeight !== false) {
			size.height = styleHeight +
				// add padding and border unless it's already including it
				(isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
		}

		size.innerWidth = size.width - (paddingWidth + borderWidth);
		size.innerHeight = size.height - (paddingHeight + borderHeight);

		size.outerWidth = size.width + marginWidth;
		size.outerHeight = size.height + marginHeight;

		return size;
	}

	return getSize;

});

/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

(function(window, factory) {
	/*global define: false, module: false */
	'use strict';
	// universal module definition
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('desandro-matches-selector/matches-selector', factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory();
	} else {
		// browser global
		window.matchesSelector = factory();
	}

}(window, function factory() {
	'use strict';

	var matchesMethod = (function() {
		var ElemProto = window.Element.prototype;
		// check for the standard method name first
		if (ElemProto.matches) {
			return 'matches';
		}
		// check un-prefixed
		if (ElemProto.matchesSelector) {
			return 'matchesSelector';
		}
		// check vendor prefixes
		var prefixes = ['webkit', 'moz', 'ms', 'o'];

		for (var i = 0; i < prefixes.length; i++) {
			var prefix = prefixes[i];
			var method = prefix + 'MatchesSelector';
			if (ElemProto[method]) {
				return method;
			}
		}
	})();

	return function matchesSelector(elem, selector) {
		return elem[matchesMethod](selector);
	};

}));

/**
 * Fizzy UI utils v2.0.7
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

(function(window, factory) {
	// universal module definition
	/*jshint strict: false */
	/*globals define, module, require */

	if (typeof define == 'function' && define.amd) {
		// AMD
		define('fizzy-ui-utils/utils', [
			'desandro-matches-selector/matches-selector'
		], function(matchesSelector) {
			return factory(window, matchesSelector);
		});
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			window,
			require('desandro-matches-selector')
		);
	} else {
		// browser global
		window.fizzyUIUtils = factory(
			window,
			window.matchesSelector
		);
	}

}(window, function factory(window, matchesSelector) {



	var utils = {};

	// ----- extend ----- //

	// extends objects
	utils.extend = function(a, b) {
		for (var prop in b) {
			a[prop] = b[prop];
		}
		return a;
	};

	// ----- modulo ----- //

	utils.modulo = function(num, div) {
		return ((num % div) + div) % div;
	};

	// ----- makeArray ----- //

	var arraySlice = Array.prototype.slice;

	// turn element or nodeList into an array
	utils.makeArray = function(obj) {
		if (Array.isArray(obj)) {
			// use object if already an array
			return obj;
		}
		// return empty array if undefined or null. #6
		if (obj === null || obj === undefined) {
			return [];
		}

		var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
		if (isArrayLike) {
			// convert nodeList to array
			return arraySlice.call(obj);
		}

		// array of single index
		return [obj];
	};

	// ----- removeFrom ----- //

	utils.removeFrom = function(ary, obj) {
		var index = ary.indexOf(obj);
		if (index != -1) {
			ary.splice(index, 1);
		}
	};

	// ----- getParent ----- //

	utils.getParent = function(elem, selector) {
		while (elem.parentNode && elem != document.body) {
			elem = elem.parentNode;
			if (matchesSelector(elem, selector)) {
				return elem;
			}
		}
	};

	// ----- getQueryElement ----- //

	// use element as selector string
	utils.getQueryElement = function(elem) {
		if (typeof elem == 'string') {
			return document.querySelector(elem);
		}
		return elem;
	};

	// ----- handleEvent ----- //

	// enable .ontype to trigger from .addEventListener( elem, 'type' )
	utils.handleEvent = function(event) {
		var method = 'on' + event.type;
		if (this[method]) {
			this[method](event);
		}
	};

	// ----- filterFindElements ----- //

	utils.filterFindElements = function(elems, selector) {
		// make array of elems
		elems = utils.makeArray(elems);
		var ffElems = [];

		elems.forEach(function(elem) {
			// check that elem is an actual element
			if (!(elem instanceof HTMLElement)) {
				return;
			}
			// add elem if no selector
			if (!selector) {
				ffElems.push(elem);
				return;
			}
			// filter & find items if we have a selector
			// filter
			if (matchesSelector(elem, selector)) {
				ffElems.push(elem);
			}
			// find children
			var childElems = elem.querySelectorAll(selector);
			// concat childElems to filterFound array
			for (var i = 0; i < childElems.length; i++) {
				ffElems.push(childElems[i]);
			}
		});

		return ffElems;
	};

	// ----- debounceMethod ----- //

	utils.debounceMethod = function(_class, methodName, threshold) {
		threshold = threshold || 100;
		// original method
		var method = _class.prototype[methodName];
		var timeoutName = methodName + 'Timeout';

		_class.prototype[methodName] = function() {
			var timeout = this[timeoutName];
			clearTimeout(timeout);

			var args = arguments;
			var _this = this;
			this[timeoutName] = setTimeout(function() {
				method.apply(_this, args);
				delete _this[timeoutName];
			}, threshold);
		};
	};

	// ----- docReady ----- //

	utils.docReady = function(callback) {
		var readyState = document.readyState;
		if (readyState == 'complete' || readyState == 'interactive') {
			// do async to allow for other scripts to run. metafizzy/flickity#441
			setTimeout(callback);
		} else {
			document.addEventListener('DOMContentLoaded', callback);
		}
	};

	// ----- htmlInit ----- //

	// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
	utils.toDashed = function(str) {
		return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
			return $1 + '-' + $2;
		}).toLowerCase();
	};

	var console = window.console;
	/**
	 * allow user to initialize classes via [data-namespace] or .js-namespace class
	 * htmlInit( Widget, 'widgetName' )
	 * options are parsed from data-namespace-options
	 */
	utils.htmlInit = function(WidgetClass, namespace) {
		utils.docReady(function() {
			var dashedNamespace = utils.toDashed(namespace);
			var dataAttr = 'data-' + dashedNamespace;
			var dataAttrElems = document.querySelectorAll('[' + dataAttr + ']');
			var jsDashElems = document.querySelectorAll('.js-' + dashedNamespace);
			var elems = utils.makeArray(dataAttrElems)
				.concat(utils.makeArray(jsDashElems));
			var dataOptionsAttr = dataAttr + '-options';
			var jQuery = window.jQuery;

			elems.forEach(function(elem) {
				var attr = elem.getAttribute(dataAttr) ||
					elem.getAttribute(dataOptionsAttr);
				var options;
				try {
					options = attr && JSON.parse(attr);
				} catch (error) {
					// log error, do not initialize
					if (console) {
						console.error('Error parsing ' + dataAttr + ' on ' + elem.className +
							': ' + error);
					}
					return;
				}
				// initialize
				var instance = new WidgetClass(elem, options);
				// make available via $().data('namespace')
				if (jQuery) {
					jQuery.data(elem, namespace, instance);
				}
			});

		});
	};

	// -----  ----- //

	return utils;

}));

/**
 * Outlayer Item
 */

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/* globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD - RequireJS
		define('outlayer/item', [
				'ev-emitter/ev-emitter',
				'get-size/get-size'
			],
			factory
		);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS - Browserify, Webpack
		module.exports = factory(
			require('ev-emitter'),
			require('get-size')
		);
	} else {
		// browser global
		window.Outlayer = {};
		window.Outlayer.Item = factory(
			window.EvEmitter,
			window.getSize
		);
	}

}(window, function factory(EvEmitter, getSize) {
	'use strict';

	// ----- helpers ----- //

	function isEmptyObj(obj) {
		for (var prop in obj) {
			return false;
		}
		prop = null;
		return true;
	}

	// -------------------------- CSS3 support -------------------------- //


	var docElemStyle = document.documentElement.style;

	var transitionProperty = typeof docElemStyle.transition == 'string' ?
		'transition' : 'WebkitTransition';
	var transformProperty = typeof docElemStyle.transform == 'string' ?
		'transform' : 'WebkitTransform';

	var transitionEndEvent = {
		WebkitTransition: 'webkitTransitionEnd',
		transition: 'transitionend'
	} [transitionProperty];

	// cache all vendor properties that could have vendor prefix
	var vendorProperties = {
		transform: transformProperty,
		transition: transitionProperty,
		transitionDuration: transitionProperty + 'Duration',
		transitionProperty: transitionProperty + 'Property',
		transitionDelay: transitionProperty + 'Delay'
	};

	// -------------------------- Item -------------------------- //

	function Item(element, layout) {
		if (!element) {
			return;
		}

		this.element = element;
		// parent layout class, i.e. Masonry, Isotope, or Packery
		this.layout = layout;
		this.position = {
			x: 0,
			y: 0
		};

		this._create();
	}

	// inherit EvEmitter
	var proto = Item.prototype = Object.create(EvEmitter.prototype);
	proto.constructor = Item;

	proto._create = function() {
		// transition objects
		this._transn = {
			ingProperties: {},
			clean: {},
			onEnd: {}
		};

		this.css({
			position: 'absolute'
		});
	};

	// trigger specified handler for event type
	proto.handleEvent = function(event) {
		var method = 'on' + event.type;
		if (this[method]) {
			this[method](event);
		}
	};

	proto.getSize = function() {
		this.size = getSize(this.element);
	};

	/**
	 * apply CSS styles to element
	 * @param {Object} style
	 */
	proto.css = function(style) {
		var elemStyle = this.element.style;

		for (var prop in style) {
			// use vendor property if available
			var supportedProp = vendorProperties[prop] || prop;
			elemStyle[supportedProp] = style[prop];
		}
	};

	// measure position, and sets it
	proto.getPosition = function() {
		var style = getComputedStyle(this.element);
		var isOriginLeft = this.layout._getOption('originLeft');
		var isOriginTop = this.layout._getOption('originTop');
		var xValue = style[isOriginLeft ? 'left' : 'right'];
		var yValue = style[isOriginTop ? 'top' : 'bottom'];
		var x = parseFloat(xValue);
		var y = parseFloat(yValue);
		// convert percent to pixels
		var layoutSize = this.layout.size;
		if (xValue.indexOf('%') != -1) {
			x = (x / 100) * layoutSize.width;
		}
		if (yValue.indexOf('%') != -1) {
			y = (y / 100) * layoutSize.height;
		}
		// clean up 'auto' or other non-integer values
		x = isNaN(x) ? 0 : x;
		y = isNaN(y) ? 0 : y;
		// remove padding from measurement
		x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
		y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

		this.position.x = x;
		this.position.y = y;
	};

	// set settled position, apply padding
	proto.layoutPosition = function() {
		var layoutSize = this.layout.size;
		var style = {};
		var isOriginLeft = this.layout._getOption('originLeft');
		var isOriginTop = this.layout._getOption('originTop');

		// x
		var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
		var xProperty = isOriginLeft ? 'left' : 'right';
		var xResetProperty = isOriginLeft ? 'right' : 'left';

		var x = this.position.x + layoutSize[xPadding];
		// set in percentage or pixels
		style[xProperty] = this.getXValue(x);
		// reset other property
		style[xResetProperty] = '';

		// y
		var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
		var yProperty = isOriginTop ? 'top' : 'bottom';
		var yResetProperty = isOriginTop ? 'bottom' : 'top';

		var y = this.position.y + layoutSize[yPadding];
		// set in percentage or pixels
		style[yProperty] = this.getYValue(y);
		// reset other property
		style[yResetProperty] = '';

		this.css(style);
		this.emitEvent('layout', [this]);
	};

	proto.getXValue = function(x) {
		var isHorizontal = this.layout._getOption('horizontal');
		return this.layout.options.percentPosition && !isHorizontal ?
			((x / this.layout.size.width) * 100) + '%' : x + 'px';
	};

	proto.getYValue = function(y) {
		var isHorizontal = this.layout._getOption('horizontal');
		return this.layout.options.percentPosition && isHorizontal ?
			((y / this.layout.size.height) * 100) + '%' : y + 'px';
	};

	proto._transitionTo = function(x, y) {
		this.getPosition();
		// get current x & y from top/left
		var curX = this.position.x;
		var curY = this.position.y;

		var didNotMove = x == this.position.x && y == this.position.y;

		// save end position
		this.setPosition(x, y);

		// if did not move and not transitioning, just go to layout
		if (didNotMove && !this.isTransitioning) {
			this.layoutPosition();
			return;
		}

		var transX = x - curX;
		var transY = y - curY;
		var transitionStyle = {};
		transitionStyle.transform = this.getTranslate(transX, transY);

		this.transition({
			to: transitionStyle,
			onTransitionEnd: {
				transform: this.layoutPosition
			},
			isCleaning: true
		});
	};

	proto.getTranslate = function(x, y) {
		// flip cooridinates if origin on right or bottom
		var isOriginLeft = this.layout._getOption('originLeft');
		var isOriginTop = this.layout._getOption('originTop');
		x = isOriginLeft ? x : -x;
		y = isOriginTop ? y : -y;
		return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
	};

	// non transition + transform support
	proto.goTo = function(x, y) {
		this.setPosition(x, y);
		this.layoutPosition();
	};

	proto.moveTo = proto._transitionTo;

	proto.setPosition = function(x, y) {
		this.position.x = parseFloat(x);
		this.position.y = parseFloat(y);
	};

	// ----- transition ----- //

	/**
	 * @param {Object} style - CSS
	 * @param {Function} onTransitionEnd
	 */

	// non transition, just trigger callback
	proto._nonTransition = function(args) {
		this.css(args.to);
		if (args.isCleaning) {
			this._removeStyles(args.to);
		}
		for (var prop in args.onTransitionEnd) {
			args.onTransitionEnd[prop].call(this);
		}
	};

	/**
	 * proper transition
	 * @param {Object} args - arguments
	 *   @param {Object} to - style to transition to
	 *   @param {Object} from - style to start transition from
	 *   @param {Boolean} isCleaning - removes transition styles after transition
	 *   @param {Function} onTransitionEnd - callback
	 */
	proto.transition = function(args) {
		// redirect to nonTransition if no transition duration
		if (!parseFloat(this.layout.options.transitionDuration)) {
			this._nonTransition(args);
			return;
		}

		var _transition = this._transn;
		// keep track of onTransitionEnd callback by css property
		for (var prop in args.onTransitionEnd) {
			_transition.onEnd[prop] = args.onTransitionEnd[prop];
		}
		// keep track of properties that are transitioning
		for (prop in args.to) {
			_transition.ingProperties[prop] = true;
			// keep track of properties to clean up when transition is done
			if (args.isCleaning) {
				_transition.clean[prop] = true;
			}
		}

		// set from styles
		if (args.from) {
			this.css(args.from);
			// force redraw. http://blog.alexmaccaw.com/css-transitions
			var h = this.element.offsetHeight;
			// hack for JSHint to hush about unused var
			h = null;
		}
		// enable transition
		this.enableTransition(args.to);
		// set styles that are transitioning
		this.css(args.to);

		this.isTransitioning = true;

	};

	// dash before all cap letters, including first for
	// WebkitTransform => -webkit-transform
	function toDashedAll(str) {
		return str.replace(/([A-Z])/g, function($1) {
			return '-' + $1.toLowerCase();
		});
	}

	var transitionProps = 'opacity,' + toDashedAll(transformProperty);

	proto.enableTransition = function( /* style */ ) {
		// HACK changing transitionProperty during a transition
		// will cause transition to jump
		if (this.isTransitioning) {
			return;
		}

		// make `transition: foo, bar, baz` from style object
		// HACK un-comment this when enableTransition can work
		// while a transition is happening
		// var transitionValues = [];
		// for ( var prop in style ) {
		//   // dash-ify camelCased properties like WebkitTransition
		//   prop = vendorProperties[ prop ] || prop;
		//   transitionValues.push( toDashedAll( prop ) );
		// }
		// munge number to millisecond, to match stagger
		var duration = this.layout.options.transitionDuration;
		duration = typeof duration == 'number' ? duration + 'ms' : duration;
		// enable transition styles
		this.css({
			transitionProperty: transitionProps,
			transitionDuration: duration,
			transitionDelay: this.staggerDelay || 0
		});
		// listen for transition end event
		this.element.addEventListener(transitionEndEvent, this, false);
	};

	// ----- events ----- //

	proto.onwebkitTransitionEnd = function(event) {
		this.ontransitionend(event);
	};

	proto.onotransitionend = function(event) {
		this.ontransitionend(event);
	};

	// properties that I munge to make my life easier
	var dashedVendorProperties = {
		'-webkit-transform': 'transform'
	};

	proto.ontransitionend = function(event) {
		// disregard bubbled events from children
		if (event.target !== this.element) {
			return;
		}
		var _transition = this._transn;
		// get property name of transitioned property, convert to prefix-free
		var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;

		// remove property that has completed transitioning
		delete _transition.ingProperties[propertyName];
		// check if any properties are still transitioning
		if (isEmptyObj(_transition.ingProperties)) {
			// all properties have completed transitioning
			this.disableTransition();
		}
		// clean style
		if (propertyName in _transition.clean) {
			// clean up style
			this.element.style[event.propertyName] = '';
			delete _transition.clean[propertyName];
		}
		// trigger onTransitionEnd callback
		if (propertyName in _transition.onEnd) {
			var onTransitionEnd = _transition.onEnd[propertyName];
			onTransitionEnd.call(this);
			delete _transition.onEnd[propertyName];
		}

		this.emitEvent('transitionEnd', [this]);
	};

	proto.disableTransition = function() {
		this.removeTransitionStyles();
		this.element.removeEventListener(transitionEndEvent, this, false);
		this.isTransitioning = false;
	};

	/**
	 * removes style property from element
	 * @param {Object} style
	 **/
	proto._removeStyles = function(style) {
		// clean up transition styles
		var cleanStyle = {};
		for (var prop in style) {
			cleanStyle[prop] = '';
		}
		this.css(cleanStyle);
	};

	var cleanTransitionStyle = {
		transitionProperty: '',
		transitionDuration: '',
		transitionDelay: ''
	};

	proto.removeTransitionStyles = function() {
		// remove transition
		this.css(cleanTransitionStyle);
	};

	// ----- stagger ----- //

	proto.stagger = function(delay) {
		delay = isNaN(delay) ? 0 : delay;
		this.staggerDelay = delay + 'ms';
	};

	// ----- show/hide/remove ----- //

	// remove element from DOM
	proto.removeElem = function() {
		this.element.parentNode.removeChild(this.element);
		// remove display: none
		this.css({
			display: ''
		});
		this.emitEvent('remove', [this]);
	};

	proto.remove = function() {
		// just remove element if no transition support or no transition
		if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
			this.removeElem();
			return;
		}

		// start transition
		this.once('transitionEnd', function() {
			this.removeElem();
		});
		this.hide();
	};

	proto.reveal = function() {
		delete this.isHidden;
		// remove display: none
		this.css({
			display: ''
		});

		var options = this.layout.options;

		var onTransitionEnd = {};
		var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
		onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;

		this.transition({
			from: options.hiddenStyle,
			to: options.visibleStyle,
			isCleaning: true,
			onTransitionEnd: onTransitionEnd
		});
	};

	proto.onRevealTransitionEnd = function() {
		// check if still visible
		// during transition, item may have been hidden
		if (!this.isHidden) {
			this.emitEvent('reveal');
		}
	};

	/**
	 * get style property use for hide/reveal transition end
	 * @param {String} styleProperty - hiddenStyle/visibleStyle
	 * @returns {String}
	 */
	proto.getHideRevealTransitionEndProperty = function(styleProperty) {
		var optionStyle = this.layout.options[styleProperty];
		// use opacity
		if (optionStyle.opacity) {
			return 'opacity';
		}
		// get first property
		for (var prop in optionStyle) {
			return prop;
		}
	};

	proto.hide = function() {
		// set flag
		this.isHidden = true;
		// remove display: none
		this.css({
			display: ''
		});

		var options = this.layout.options;

		var onTransitionEnd = {};
		var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
		onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;

		this.transition({
			from: options.visibleStyle,
			to: options.hiddenStyle,
			// keep hidden stuff hidden
			isCleaning: true,
			onTransitionEnd: onTransitionEnd
		});
	};

	proto.onHideTransitionEnd = function() {
		// check if still hidden
		// during transition, item may have been un-hidden
		if (this.isHidden) {
			this.css({
				display: 'none'
			});
			this.emitEvent('hide');
		}
	};

	proto.destroy = function() {
		this.css({
			position: '',
			left: '',
			right: '',
			top: '',
			bottom: '',
			transition: '',
			transform: ''
		});
	};

	return Item;

}));

/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */

(function(window, factory) {
	'use strict';
	// universal module definition
	/* jshint strict: false */
	/* globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD - RequireJS
		define('outlayer/outlayer', [
				'ev-emitter/ev-emitter',
				'get-size/get-size',
				'fizzy-ui-utils/utils',
				'./item'
			],
			function(EvEmitter, getSize, utils, Item) {
				return factory(window, EvEmitter, getSize, utils, Item);
			}
		);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS - Browserify, Webpack
		module.exports = factory(
			window,
			require('ev-emitter'),
			require('get-size'),
			require('fizzy-ui-utils'),
			require('./item')
		);
	} else {
		// browser global
		window.Outlayer = factory(
			window,
			window.EvEmitter,
			window.getSize,
			window.fizzyUIUtils,
			window.Outlayer.Item
		);
	}

}(window, function factory(window, EvEmitter, getSize, utils, Item) {
	'use strict';

	// ----- vars ----- //

	var console = window.console;
	var jQuery = window.jQuery;
	var noop = function() {};

	// -------------------------- Outlayer -------------------------- //

	// globally unique identifiers
	var GUID = 0;
	// internal store of all Outlayer intances
	var instances = {};


	/**
	 * @param {Element, String} element
	 * @param {Object} options
	 * @constructor
	 */
	function Outlayer(element, options) {
		var queryElement = utils.getQueryElement(element);
		if (!queryElement) {
			if (console) {
				console.error('Bad element for ' + this.constructor.namespace +
					': ' + (queryElement || element));
			}
			return;
		}
		this.element = queryElement;
		// add jQuery
		if (jQuery) {
			this.$element = jQuery(this.element);
		}

		// options
		this.options = utils.extend({}, this.constructor.defaults);
		this.option(options);

		// add id for Outlayer.getFromElement
		var id = ++GUID;
		this.element.outlayerGUID = id; // expando
		instances[id] = this; // associate via id

		// kick it off
		this._create();

		var isInitLayout = this._getOption('initLayout');
		if (isInitLayout) {
			this.layout();
		}
	}

	// settings are for internal use only
	Outlayer.namespace = 'outlayer';
	Outlayer.Item = Item;

	// default options
	Outlayer.defaults = {
		containerStyle: {
			position: 'relative'
		},
		initLayout: true,
		originLeft: true,
		originTop: true,
		resize: true,
		resizeContainer: true,
		// item options
		transitionDuration: '0.4s',
		hiddenStyle: {
			opacity: 0,
			transform: 'scale(0.001)'
		},
		visibleStyle: {
			opacity: 1,
			transform: 'scale(1)'
		}
	};

	var proto = Outlayer.prototype;
	// inherit EvEmitter
	utils.extend(proto, EvEmitter.prototype);

	/**
	 * set options
	 * @param {Object} opts
	 */
	proto.option = function(opts) {
		utils.extend(this.options, opts);
	};

	/**
	 * get backwards compatible option value, check old name
	 */
	proto._getOption = function(option) {
		var oldOption = this.constructor.compatOptions[option];
		return oldOption && this.options[oldOption] !== undefined ?
			this.options[oldOption] : this.options[option];
	};

	Outlayer.compatOptions = {
		// currentName: oldName
		initLayout: 'isInitLayout',
		horizontal: 'isHorizontal',
		layoutInstant: 'isLayoutInstant',
		originLeft: 'isOriginLeft',
		originTop: 'isOriginTop',
		resize: 'isResizeBound',
		resizeContainer: 'isResizingContainer'
	};

	proto._create = function() {
		// get items from children
		this.reloadItems();
		// elements that affect layout, but are not laid out
		this.stamps = [];
		this.stamp(this.options.stamp);
		// set container style
		utils.extend(this.element.style, this.options.containerStyle);

		// bind resize method
		var canBindResize = this._getOption('resize');
		if (canBindResize) {
			this.bindResize();
		}
	};

	// goes through all children again and gets bricks in proper order
	proto.reloadItems = function() {
		// collection of item elements
		this.items = this._itemize(this.element.children);
	};


	/**
	 * turn elements into Outlayer.Items to be used in layout
	 * @param {Array or NodeList or HTMLElement} elems
	 * @returns {Array} items - collection of new Outlayer Items
	 */
	proto._itemize = function(elems) {

		var itemElems = this._filterFindItemElements(elems);
		var Item = this.constructor.Item;

		// create new Outlayer Items for collection
		var items = [];
		for (var i = 0; i < itemElems.length; i++) {
			var elem = itemElems[i];
			var item = new Item(elem, this);
			items.push(item);
		}

		return items;
	};

	/**
	 * get item elements to be used in layout
	 * @param {Array or NodeList or HTMLElement} elems
	 * @returns {Array} items - item elements
	 */
	proto._filterFindItemElements = function(elems) {
		return utils.filterFindElements(elems, this.options.itemSelector);
	};

	/**
	 * getter method for getting item elements
	 * @returns {Array} elems - collection of item elements
	 */
	proto.getItemElements = function() {
		return this.items.map(function(item) {
			return item.element;
		});
	};

	// ----- init & layout ----- //

	/**
	 * lays out all items
	 */
	proto.layout = function() {
		this._resetLayout();
		this._manageStamps();

		// don't animate first layout
		var layoutInstant = this._getOption('layoutInstant');
		var isInstant = layoutInstant !== undefined ?
			layoutInstant : !this._isLayoutInited;
		this.layoutItems(this.items, isInstant);

		// flag for initalized
		this._isLayoutInited = true;
	};

	// _init is alias for layout
	proto._init = proto.layout;

	/**
	 * logic before any new layout
	 */
	proto._resetLayout = function() {
		this.getSize();
	};


	proto.getSize = function() {
		this.size = getSize(this.element);
	};

	/**
	 * get measurement from option, for columnWidth, rowHeight, gutter
	 * if option is String -> get element from selector string, & get size of element
	 * if option is Element -> get size of element
	 * else use option as a number
	 *
	 * @param {String} measurement
	 * @param {String} size - width or height
	 * @private
	 */
	proto._getMeasurement = function(measurement, size) {
		var option = this.options[measurement];
		var elem;
		if (!option) {
			// default to 0
			this[measurement] = 0;
		} else {
			// use option as an element
			if (typeof option == 'string') {
				elem = this.element.querySelector(option);
			} else if (option instanceof HTMLElement) {
				elem = option;
			}
			// use size of element, if element
			this[measurement] = elem ? getSize(elem)[size] : option;
		}
	};

	/**
	 * layout a collection of item elements
	 * @api public
	 */
	proto.layoutItems = function(items, isInstant) {
		items = this._getItemsForLayout(items);

		this._layoutItems(items, isInstant);

		this._postLayout();
	};

	/**
	 * get the items to be laid out
	 * you may want to skip over some items
	 * @param {Array} items
	 * @returns {Array} items
	 */
	proto._getItemsForLayout = function(items) {
		return items.filter(function(item) {
			return !item.isIgnored;
		});
	};

	/**
	 * layout items
	 * @param {Array} items
	 * @param {Boolean} isInstant
	 */
	proto._layoutItems = function(items, isInstant) {
		this._emitCompleteOnItems('layout', items);

		if (!items || !items.length) {
			// no items, emit event with empty array
			return;
		}

		var queue = [];

		items.forEach(function(item) {
			// get x/y object from method
			var position = this._getItemLayoutPosition(item);
			// enqueue
			position.item = item;
			position.isInstant = isInstant || item.isLayoutInstant;
			queue.push(position);
		}, this);

		this._processLayoutQueue(queue);
	};

	/**
	 * get item layout position
	 * @param {Outlayer.Item} item
	 * @returns {Object} x and y position
	 */
	proto._getItemLayoutPosition = function( /* item */ ) {
		return {
			x: 0,
			y: 0
		};
	};

	/**
	 * iterate over array and position each item
	 * Reason being - separating this logic prevents 'layout invalidation'
	 * thx @paul_irish
	 * @param {Array} queue
	 */
	proto._processLayoutQueue = function(queue) {
		this.updateStagger();
		queue.forEach(function(obj, i) {
			this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
		}, this);
	};

	// set stagger from option in milliseconds number
	proto.updateStagger = function() {
		var stagger = this.options.stagger;
		if (stagger === null || stagger === undefined) {
			this.stagger = 0;
			return;
		}
		this.stagger = getMilliseconds(stagger);
		return this.stagger;
	};

	/**
	 * Sets position of item in DOM
	 * @param {Outlayer.Item} item
	 * @param {Number} x - horizontal position
	 * @param {Number} y - vertical position
	 * @param {Boolean} isInstant - disables transitions
	 */
	proto._positionItem = function(item, x, y, isInstant, i) {
		if (isInstant) {
			// if not transition, just set CSS
			item.goTo(x, y);
		} else {
			item.stagger(i * this.stagger);
			item.moveTo(x, y);
		}
	};

	/**
	 * Any logic you want to do after each layout,
	 * i.e. size the container
	 */
	proto._postLayout = function() {
		this.resizeContainer();
	};

	proto.resizeContainer = function() {
		var isResizingContainer = this._getOption('resizeContainer');
		if (!isResizingContainer) {
			return;
		}
		var size = this._getContainerSize();
		if (size) {
			this._setContainerMeasure(size.width, true);
			this._setContainerMeasure(size.height, false);
		}
	};

	/**
	 * Sets width or height of container if returned
	 * @returns {Object} size
	 *   @param {Number} width
	 *   @param {Number} height
	 */
	proto._getContainerSize = noop;

	/**
	 * @param {Number} measure - size of width or height
	 * @param {Boolean} isWidth
	 */
	proto._setContainerMeasure = function(measure, isWidth) {
		if (measure === undefined) {
			return;
		}

		var elemSize = this.size;
		// add padding and border width if border box
		if (elemSize.isBorderBox) {
			measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
				elemSize.borderLeftWidth + elemSize.borderRightWidth :
				elemSize.paddingBottom + elemSize.paddingTop +
				elemSize.borderTopWidth + elemSize.borderBottomWidth;
		}

		measure = Math.max(measure, 0);
		this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
	};

	/**
	 * emit eventComplete on a collection of items events
	 * @param {String} eventName
	 * @param {Array} items - Outlayer.Items
	 */
	proto._emitCompleteOnItems = function(eventName, items) {
		var _this = this;

		function onComplete() {
			_this.dispatchEvent(eventName + 'Complete', null, [items]);
		}

		var count = items.length;
		if (!items || !count) {
			onComplete();
			return;
		}

		var doneCount = 0;

		function tick() {
			doneCount++;
			if (doneCount == count) {
				onComplete();
			}
		}

		// bind callback
		items.forEach(function(item) {
			item.once(eventName, tick);
		});
	};

	/**
	 * emits events via EvEmitter and jQuery events
	 * @param {String} type - name of event
	 * @param {Event} event - original event
	 * @param {Array} args - extra arguments
	 */
	proto.dispatchEvent = function(type, event, args) {
		// add original event to arguments
		var emitArgs = event ? [event].concat(args) : args;
		this.emitEvent(type, emitArgs);

		if (jQuery) {
			// set this.$element
			this.$element = this.$element || jQuery(this.element);
			if (event) {
				// create jQuery event
				var $event = jQuery.Event(event);
				$event.type = type;
				this.$element.trigger($event, args);
			} else {
				// just trigger with type if no event available
				this.$element.trigger(type, args);
			}
		}
	};

	// -------------------------- ignore & stamps -------------------------- //


	/**
	 * keep item in collection, but do not lay it out
	 * ignored items do not get skipped in layout
	 * @param {Element} elem
	 */
	proto.ignore = function(elem) {
		var item = this.getItem(elem);
		if (item) {
			item.isIgnored = true;
		}
	};

	/**
	 * return item to layout collection
	 * @param {Element} elem
	 */
	proto.unignore = function(elem) {
		var item = this.getItem(elem);
		if (item) {
			delete item.isIgnored;
		}
	};

	/**
	 * adds elements to stamps
	 * @param {NodeList, Array, Element, or String} elems
	 */
	proto.stamp = function(elems) {
		elems = this._find(elems);
		if (!elems) {
			return;
		}

		this.stamps = this.stamps.concat(elems);
		// ignore
		elems.forEach(this.ignore, this);
	};

	/**
	 * removes elements to stamps
	 * @param {NodeList, Array, or Element} elems
	 */
	proto.unstamp = function(elems) {
		elems = this._find(elems);
		if (!elems) {
			return;
		}

		elems.forEach(function(elem) {
			// filter out removed stamp elements
			utils.removeFrom(this.stamps, elem);
			this.unignore(elem);
		}, this);
	};

	/**
	 * finds child elements
	 * @param {NodeList, Array, Element, or String} elems
	 * @returns {Array} elems
	 */
	proto._find = function(elems) {
		if (!elems) {
			return;
		}
		// if string, use argument as selector string
		if (typeof elems == 'string') {
			elems = this.element.querySelectorAll(elems);
		}
		elems = utils.makeArray(elems);
		return elems;
	};

	proto._manageStamps = function() {
		if (!this.stamps || !this.stamps.length) {
			return;
		}

		this._getBoundingRect();

		this.stamps.forEach(this._manageStamp, this);
	};

	// update boundingLeft / Top
	proto._getBoundingRect = function() {
		// get bounding rect for container element
		var boundingRect = this.element.getBoundingClientRect();
		var size = this.size;
		this._boundingRect = {
			left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
			top: boundingRect.top + size.paddingTop + size.borderTopWidth,
			right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
			bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
		};
	};

	/**
	 * @param {Element} stamp
	 **/
	proto._manageStamp = noop;

	/**
	 * get x/y position of element relative to container element
	 * @param {Element} elem
	 * @returns {Object} offset - has left, top, right, bottom
	 */
	proto._getElementOffset = function(elem) {
		var boundingRect = elem.getBoundingClientRect();
		var thisRect = this._boundingRect;
		var size = getSize(elem);
		var offset = {
			left: boundingRect.left - thisRect.left - size.marginLeft,
			top: boundingRect.top - thisRect.top - size.marginTop,
			right: thisRect.right - boundingRect.right - size.marginRight,
			bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
		};
		return offset;
	};

	// -------------------------- resize -------------------------- //

	// enable event handlers for listeners
	// i.e. resize -> onresize
	proto.handleEvent = utils.handleEvent;

	/**
	 * Bind layout to window resizing
	 */
	proto.bindResize = function() {
		window.addEventListener('resize', this);
		this.isResizeBound = true;
	};

	/**
	 * Unbind layout to window resizing
	 */
	proto.unbindResize = function() {
		window.removeEventListener('resize', this);
		this.isResizeBound = false;
	};

	proto.onresize = function() {
		this.resize();
	};

	utils.debounceMethod(Outlayer, 'onresize', 100);

	proto.resize = function() {
		// don't trigger if size did not change
		// or if resize was unbound. See #9
		if (!this.isResizeBound || !this.needsResizeLayout()) {
			return;
		}

		this.layout();
	};

	/**
	 * check if layout is needed post layout
	 * @returns Boolean
	 */
	proto.needsResizeLayout = function() {
		var size = getSize(this.element);
		// check that this.size and size are there
		// IE8 triggers resize on body size change, so they might not be
		var hasSizes = this.size && size;
		return hasSizes && size.innerWidth !== this.size.innerWidth;
	};

	// -------------------------- methods -------------------------- //

	/**
	 * add items to Outlayer instance
	 * @param {Array or NodeList or Element} elems
	 * @returns {Array} items - Outlayer.Items
	 **/
	proto.addItems = function(elems) {
		var items = this._itemize(elems);
		// add items to collection
		if (items.length) {
			this.items = this.items.concat(items);
		}
		return items;
	};

	/**
	 * Layout newly-appended item elements
	 * @param {Array or NodeList or Element} elems
	 */
	proto.appended = function(elems) {
		var items = this.addItems(elems);
		if (!items.length) {
			return;
		}
		// layout and reveal just the new items
		this.layoutItems(items, true);
		this.reveal(items);
	};

	/**
	 * Layout prepended elements
	 * @param {Array or NodeList or Element} elems
	 */
	proto.prepended = function(elems) {
		var items = this._itemize(elems);
		if (!items.length) {
			return;
		}
		// add items to beginning of collection
		var previousItems = this.items.slice(0);
		this.items = items.concat(previousItems);
		// start new layout
		this._resetLayout();
		this._manageStamps();
		// layout new stuff without transition
		this.layoutItems(items, true);
		this.reveal(items);
		// layout previous items
		this.layoutItems(previousItems);
	};

	/**
	 * reveal a collection of items
	 * @param {Array of Outlayer.Items} items
	 */
	proto.reveal = function(items) {
		this._emitCompleteOnItems('reveal', items);
		if (!items || !items.length) {
			return;
		}
		var stagger = this.updateStagger();
		items.forEach(function(item, i) {
			item.stagger(i * stagger);
			item.reveal();
		});
	};

	/**
	 * hide a collection of items
	 * @param {Array of Outlayer.Items} items
	 */
	proto.hide = function(items) {
		this._emitCompleteOnItems('hide', items);
		if (!items || !items.length) {
			return;
		}
		var stagger = this.updateStagger();
		items.forEach(function(item, i) {
			item.stagger(i * stagger);
			item.hide();
		});
	};

	/**
	 * reveal item elements
	 * @param {Array}, {Element}, {NodeList} items
	 */
	proto.revealItemElements = function(elems) {
		var items = this.getItems(elems);
		this.reveal(items);
	};

	/**
	 * hide item elements
	 * @param {Array}, {Element}, {NodeList} items
	 */
	proto.hideItemElements = function(elems) {
		var items = this.getItems(elems);
		this.hide(items);
	};

	/**
	 * get Outlayer.Item, given an Element
	 * @param {Element} elem
	 * @param {Function} callback
	 * @returns {Outlayer.Item} item
	 */
	proto.getItem = function(elem) {
		// loop through items to get the one that matches
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if (item.element == elem) {
				// return item
				return item;
			}
		}
	};

	/**
	 * get collection of Outlayer.Items, given Elements
	 * @param {Array} elems
	 * @returns {Array} items - Outlayer.Items
	 */
	proto.getItems = function(elems) {
		elems = utils.makeArray(elems);
		var items = [];
		elems.forEach(function(elem) {
			var item = this.getItem(elem);
			if (item) {
				items.push(item);
			}
		}, this);

		return items;
	};

	/**
	 * remove element(s) from instance and DOM
	 * @param {Array or NodeList or Element} elems
	 */
	proto.remove = function(elems) {
		var removeItems = this.getItems(elems);

		this._emitCompleteOnItems('remove', removeItems);

		// bail if no items to remove
		if (!removeItems || !removeItems.length) {
			return;
		}

		removeItems.forEach(function(item) {
			item.remove();
			// remove item from collection
			utils.removeFrom(this.items, item);
		}, this);
	};

	// ----- destroy ----- //

	// remove and disable Outlayer instance
	proto.destroy = function() {
		// clean up dynamic styles
		var style = this.element.style;
		style.height = '';
		style.position = '';
		style.width = '';
		// destroy items
		this.items.forEach(function(item) {
			item.destroy();
		});

		this.unbindResize();

		var id = this.element.outlayerGUID;
		delete instances[id]; // remove reference to instance by id
		delete this.element.outlayerGUID;
		// remove data for jQuery
		if (jQuery) {
			jQuery.removeData(this.element, this.constructor.namespace);
		}

	};

	// -------------------------- data -------------------------- //

	/**
	 * get Outlayer instance from element
	 * @param {Element} elem
	 * @returns {Outlayer}
	 */
	Outlayer.data = function(elem) {
		elem = utils.getQueryElement(elem);
		var id = elem && elem.outlayerGUID;
		return id && instances[id];
	};


	// -------------------------- create Outlayer class -------------------------- //

	/**
	 * create a layout class
	 * @param {String} namespace
	 */
	Outlayer.create = function(namespace, options) {
		// sub-class Outlayer
		var Layout = subclass(Outlayer);
		// apply new options and compatOptions
		Layout.defaults = utils.extend({}, Outlayer.defaults);
		utils.extend(Layout.defaults, options);
		Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);

		Layout.namespace = namespace;

		Layout.data = Outlayer.data;

		// sub-class Item
		Layout.Item = subclass(Item);

		// -------------------------- declarative -------------------------- //

		utils.htmlInit(Layout, namespace);

		// -------------------------- jQuery bridge -------------------------- //

		// make into jQuery plugin
		if (jQuery && jQuery.bridget) {
			jQuery.bridget(namespace, Layout);
		}

		return Layout;
	};

	function subclass(Parent) {
		function SubClass() {
			Parent.apply(this, arguments);
		}

		SubClass.prototype = Object.create(Parent.prototype);
		SubClass.prototype.constructor = SubClass;

		return SubClass;
	}

	// ----- helpers ----- //

	// how many milliseconds are in each unit
	var msUnits = {
		ms: 1,
		s: 1000
	};

	// munge time-like parameter into millisecond number
	// '0.4s' -> 40
	function getMilliseconds(time) {
		if (typeof time == 'number') {
			return time;
		}
		var matches = time.match(/(^\d*\.?\d*)(\w*)/);
		var num = matches && matches[1];
		var unit = matches && matches[2];
		if (!num.length) {
			return 0;
		}
		num = parseFloat(num);
		var mult = msUnits[unit] || 1;
		return num * mult;
	}

	// ----- fin ----- //

	// back in global
	Outlayer.Item = Item;

	return Outlayer;

}));

/**
 * Isotope Item
 **/

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/*globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('isotope-layout/js/item', [
				'outlayer/outlayer'
			],
			factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			require('outlayer')
		);
	} else {
		// browser global
		window.Isotope = window.Isotope || {};
		window.Isotope.Item = factory(
			window.Outlayer
		);
	}

}(window, function factory(Outlayer) {
	'use strict';

	// -------------------------- Item -------------------------- //

	// sub-class Outlayer Item
	function Item() {
		Outlayer.Item.apply(this, arguments);
	}

	var proto = Item.prototype = Object.create(Outlayer.Item.prototype);

	var _create = proto._create;
	proto._create = function() {
		// assign id, used for original-order sorting
		this.id = this.layout.itemGUID++;
		_create.call(this);
		this.sortData = {};
	};

	proto.updateSortData = function() {
		if (this.isIgnored) {
			return;
		}
		// default sorters
		this.sortData.id = this.id;
		// for backward compatibility
		this.sortData['original-order'] = this.id;
		this.sortData.random = Math.random();
		// go thru getSortData obj and apply the sorters
		var getSortData = this.layout.options.getSortData;
		var sorters = this.layout._sorters;
		for (var key in getSortData) {
			var sorter = sorters[key];
			this.sortData[key] = sorter(this.element, this);
		}
	};

	var _destroy = proto.destroy;
	proto.destroy = function() {
		// call super
		_destroy.apply(this, arguments);
		// reset display, #741
		this.css({
			display: ''
		});
	};

	return Item;

}));

/**
 * Isotope LayoutMode
 */

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/*globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('isotope-layout/js/layout-mode', [
				'get-size/get-size',
				'outlayer/outlayer'
			],
			factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			require('get-size'),
			require('outlayer')
		);
	} else {
		// browser global
		window.Isotope = window.Isotope || {};
		window.Isotope.LayoutMode = factory(
			window.getSize,
			window.Outlayer
		);
	}

}(window, function factory(getSize, Outlayer) {
	'use strict';

	// layout mode class
	function LayoutMode(isotope) {
		this.isotope = isotope;
		// link properties
		if (isotope) {
			this.options = isotope.options[this.namespace];
			this.element = isotope.element;
			this.items = isotope.filteredItems;
			this.size = isotope.size;
		}
	}

	var proto = LayoutMode.prototype;

	/**
	 * some methods should just defer to default Outlayer method


	 * and reference the Isotope instance as `this`
	**/
	var facadeMethods = [
		'_resetLayout',
		'_getItemLayoutPosition',
		'_manageStamp',
		'_getContainerSize',
		'_getElementOffset',
		'needsResizeLayout',
		'_getOption'
	];

	facadeMethods.forEach(function(methodName) {
		proto[methodName] = function() {
			return Outlayer.prototype[methodName].apply(this.isotope, arguments);
		};
	});

	// -----  ----- //

	// for horizontal layout modes, check vertical size
	proto.needsVerticalResizeLayout = function() {
		// don't trigger if size did not change
		var size = getSize(this.isotope.element);
		// check that this.size and size are there
		// IE8 triggers resize on body size change, so they might not be
		var hasSizes = this.isotope.size && size;
		return hasSizes && size.innerHeight != this.isotope.size.innerHeight;
	};

	// ----- measurements ----- //

	proto._getMeasurement = function() {
		this.isotope._getMeasurement.apply(this, arguments);
	};

	proto.getColumnWidth = function() {
		this.getSegmentSize('column', 'Width');
	};

	proto.getRowHeight = function() {
		this.getSegmentSize('row', 'Height');
	};

	/**
	 * get columnWidth or rowHeight
	 * segment: 'column' or 'row'
	 * size 'Width' or 'Height'
	 **/
	proto.getSegmentSize = function(segment, size) {
		var segmentName = segment + size;
		var outerSize = 'outer' + size;
		// columnWidth / outerWidth // rowHeight / outerHeight
		this._getMeasurement(segmentName, outerSize);
		// got rowHeight or columnWidth, we can chill
		if (this[segmentName]) {
			return;
		}
		// fall back to item of first element
		var firstItemSize = this.getFirstItemSize();
		this[segmentName] = firstItemSize && firstItemSize[outerSize] ||
			// or size of container
			this.isotope.size['inner' + size];
	};

	proto.getFirstItemSize = function() {
		var firstItem = this.isotope.filteredItems[0];
		return firstItem && firstItem.element && getSize(firstItem.element);
	};

	// ----- methods that should reference isotope ----- //

	proto.layout = function() {
		this.isotope.layout.apply(this.isotope, arguments);
	};

	proto.getSize = function() {
		this.isotope.getSize();
		this.size = this.isotope.size;
	};

	// -------------------------- create -------------------------- //

	LayoutMode.modes = {};

	LayoutMode.create = function(namespace, options) {

		function Mode() {
			LayoutMode.apply(this, arguments);
		}

		Mode.prototype = Object.create(proto);
		Mode.prototype.constructor = Mode;

		// default options
		if (options) {
			Mode.options = options;
		}

		Mode.prototype.namespace = namespace;
		// register in Isotope
		LayoutMode.modes[namespace] = Mode;

		return Mode;
	};

	return LayoutMode;

}));

/*!
 * Masonry v4.2.1
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/*globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('masonry-layout/masonry', [
				'outlayer/outlayer',
				'get-size/get-size'
			],
			factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			require('outlayer'),
			require('get-size')
		);
	} else {
		// browser global
		window.Masonry = factory(
			window.Outlayer,
			window.getSize
		);
	}

}(window, function factory(Outlayer, getSize) {



	// -------------------------- masonryDefinition -------------------------- //

	// create an Outlayer layout class
	var Masonry = Outlayer.create('masonry');
	// isFitWidth -> fitWidth
	Masonry.compatOptions.fitWidth = 'isFitWidth';

	var proto = Masonry.prototype;

	proto._resetLayout = function() {
		this.getSize();
		this._getMeasurement('columnWidth', 'outerWidth');
		this._getMeasurement('gutter', 'outerWidth');
		this.measureColumns();

		// reset column Y
		this.colYs = [];
		for (var i = 0; i < this.cols; i++) {
			this.colYs.push(0);
		}

		this.maxY = 0;
		this.horizontalColIndex = 0;
	};

	proto.measureColumns = function() {
		this.getContainerWidth();
		// if columnWidth is 0, default to outerWidth of first item
		if (!this.columnWidth) {
			var firstItem = this.items[0];
			var firstItemElem = firstItem && firstItem.element;
			// columnWidth fall back to item of first element
			this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth ||
				// if first elem has no width, default to size of container
				this.containerWidth;
		}

		var columnWidth = this.columnWidth += this.gutter;

		// calculate columns
		var containerWidth = this.containerWidth + this.gutter;
		var cols = containerWidth / columnWidth;
		// fix rounding errors, typically with gutters
		var excess = columnWidth - containerWidth % columnWidth;
		// if overshoot is less than a pixel, round up, otherwise floor it
		var mathMethod = excess && excess < 1 ? 'round' : 'floor';
		cols = Math[mathMethod](cols);
		this.cols = Math.max(cols, 1);
	};

	proto.getContainerWidth = function() {
		// container is parent if fit width
		var isFitWidth = this._getOption('fitWidth');
		var container = isFitWidth ? this.element.parentNode : this.element;
		// check that this.size and size are there
		// IE8 triggers resize on body size change, so they might not be
		var size = getSize(container);
		this.containerWidth = size && size.innerWidth;
	};

	proto._getItemLayoutPosition = function(item) {
		item.getSize();
		// how many columns does this brick span
		var remainder = item.size.outerWidth % this.columnWidth;
		var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
		// round if off by 1 pixel, otherwise use ceil
		var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
		colSpan = Math.min(colSpan, this.cols);
		// use horizontal or top column position
		var colPosMethod = this.options.horizontalOrder ?
			'_getHorizontalColPosition' : '_getTopColPosition';
		var colPosition = this[colPosMethod](colSpan, item);
		// position the brick
		var position = {
			x: this.columnWidth * colPosition.col,
			y: colPosition.y
		};
		// apply setHeight to necessary columns
		var setHeight = colPosition.y + item.size.outerHeight;
		var setMax = colSpan + colPosition.col;
		for (var i = colPosition.col; i < setMax; i++) {
			this.colYs[i] = setHeight;
		}

		return position;
	};

	proto._getTopColPosition = function(colSpan) {
		var colGroup = this._getTopColGroup(colSpan);
		// get the minimum Y value from the columns
		var minimumY = Math.min.apply(Math, colGroup);

		return {
			col: colGroup.indexOf(minimumY),
			y: minimumY,
		};
	};

	/**
	 * @param {Number} colSpan - number of columns the element spans
	 * @returns {Array} colGroup
	 */
	proto._getTopColGroup = function(colSpan) {
		if (colSpan < 2) {
			// if brick spans only one column, use all the column Ys
			return this.colYs;
		}

		var colGroup = [];
		// how many different places could this brick fit horizontally
		var groupCount = this.cols + 1 - colSpan;
		// for each group potential horizontal position
		for (var i = 0; i < groupCount; i++) {
			colGroup[i] = this._getColGroupY(i, colSpan);
		}
		return colGroup;
	};

	proto._getColGroupY = function(col, colSpan) {
		if (colSpan < 2) {
			return this.colYs[col];
		}
		// make an array of colY values for that one group
		var groupColYs = this.colYs.slice(col, col + colSpan);
		// and get the max value of the array
		return Math.max.apply(Math, groupColYs);
	};

	// get column position based on horizontal index. #873
	proto._getHorizontalColPosition = function(colSpan, item) {
		var col = this.horizontalColIndex % this.cols;
		var isOver = colSpan > 1 && col + colSpan > this.cols;
		// shift to next row if item can't fit on current row
		col = isOver ? 0 : col;
		// don't let zero-size items take up space
		var hasSize = item.size.outerWidth && item.size.outerHeight;
		this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

		return {
			col: col,
			y: this._getColGroupY(col, colSpan),
		};
	};

	proto._manageStamp = function(stamp) {
		var stampSize = getSize(stamp);
		var offset = this._getElementOffset(stamp);
		// get the columns that this stamp affects
		var isOriginLeft = this._getOption('originLeft');
		var firstX = isOriginLeft ? offset.left : offset.right;
		var lastX = firstX + stampSize.outerWidth;
		var firstCol = Math.floor(firstX / this.columnWidth);
		firstCol = Math.max(0, firstCol);
		var lastCol = Math.floor(lastX / this.columnWidth);
		// lastCol should not go over if multiple of columnWidth #425
		lastCol -= lastX % this.columnWidth ? 0 : 1;
		lastCol = Math.min(this.cols - 1, lastCol);
		// set colYs to bottom of the stamp

		var isOriginTop = this._getOption('originTop');
		var stampMaxY = (isOriginTop ? offset.top : offset.bottom) +
			stampSize.outerHeight;
		for (var i = firstCol; i <= lastCol; i++) {
			this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
		}
	};

	proto._getContainerSize = function() {
		this.maxY = Math.max.apply(Math, this.colYs);
		var size = {
			height: this.maxY
		};

		if (this._getOption('fitWidth')) {
			size.width = this._getContainerFitWidth();
		}

		return size;
	};

	proto._getContainerFitWidth = function() {
		var unusedCols = 0;
		// count unused columns
		var i = this.cols;
		while (--i) {
			if (this.colYs[i] !== 0) {
				break;
			}
			unusedCols++;
		}
		// fit container to columns that have been used
		return (this.cols - unusedCols) * this.columnWidth - this.gutter;
	};

	proto.needsResizeLayout = function() {
		var previousWidth = this.containerWidth;
		this.getContainerWidth();
		return previousWidth != this.containerWidth;
	};

	return Masonry;

}));

/*!
 * Masonry layout mode
 * sub-classes Masonry
 * https://masonry.desandro.com
 */

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/*globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('isotope-layout/js/layout-modes/masonry', [
				'../layout-mode',
				'masonry-layout/masonry'
			],
			factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			require('../layout-mode'),
			require('masonry-layout')
		);
	} else {
		// browser global
		factory(
			window.Isotope.LayoutMode,
			window.Masonry
		);
	}

}(window, function factory(LayoutMode, Masonry) {
	'use strict';

	// -------------------------- masonryDefinition -------------------------- //

	// create an Outlayer layout class
	var MasonryMode = LayoutMode.create('masonry');

	var proto = MasonryMode.prototype;

	var keepModeMethods = {
		_getElementOffset: true,
		layout: true,
		_getMeasurement: true
	};

	// inherit Masonry prototype
	for (var method in Masonry.prototype) {
		// do not inherit mode methods
		if (!keepModeMethods[method]) {
			proto[method] = Masonry.prototype[method];
		}
	}

	var measureColumns = proto.measureColumns;
	proto.measureColumns = function() {
		// set items, used if measuring first item
		this.items = this.isotope.filteredItems;
		measureColumns.call(this);
	};

	// point to mode options for fitWidth
	var _getOption = proto._getOption;
	proto._getOption = function(option) {
		if (option == 'fitWidth') {
			return this.options.isFitWidth !== undefined ?
				this.options.isFitWidth : this.options.fitWidth;
		}
		return _getOption.apply(this.isotope, arguments);
	};

	return MasonryMode;

}));

/**
 * fitRows layout mode
 */

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/*globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('isotope-layout/js/layout-modes/fit-rows', [
				'../layout-mode'
			],
			factory);
	} else if (typeof exports == 'object') {
		// CommonJS
		module.exports = factory(
			require('../layout-mode')
		);
	} else {
		// browser global
		factory(
			window.Isotope.LayoutMode
		);
	}

}(window, function factory(LayoutMode) {
	'use strict';

	var FitRows = LayoutMode.create('fitRows');

	var proto = FitRows.prototype;

	proto._resetLayout = function() {
		this.x = 0;
		this.y = 0;
		this.maxY = 0;
		this._getMeasurement('gutter', 'outerWidth');
	};

	proto._getItemLayoutPosition = function(item) {
		item.getSize();

		var itemWidth = item.size.outerWidth + this.gutter;
		// if this element cannot fit in the current row
		var containerWidth = this.isotope.size.innerWidth + this.gutter;
		if (this.x !== 0 && itemWidth + this.x > containerWidth) {
			this.x = 0;
			this.y = this.maxY;
		}

		var position = {
			x: this.x,
			y: this.y
		};

		this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
		this.x += itemWidth;

		return position;
	};

	proto._getContainerSize = function() {
		return {
			height: this.maxY
		};
	};

	return FitRows;

}));

/**
 * vertical layout mode
 */

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/*globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define('isotope-layout/js/layout-modes/vertical', [
				'../layout-mode'
			],
			factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			require('../layout-mode')
		);
	} else {
		// browser global
		factory(
			window.Isotope.LayoutMode
		);
	}

}(window, function factory(LayoutMode) {
	'use strict';

	var Vertical = LayoutMode.create('vertical', {
		horizontalAlignment: 0
	});

	var proto = Vertical.prototype;

	proto._resetLayout = function() {
		this.y = 0;
	};

	proto._getItemLayoutPosition = function(item) {
		item.getSize();
		var x = (this.isotope.size.innerWidth - item.size.outerWidth) *
			this.options.horizontalAlignment;
		var y = this.y;
		this.y += item.size.outerHeight;
		return {
			x: x,
			y: y
		};
	};

	proto._getContainerSize = function() {
		return {
			height: this.y
		};
	};

	return Vertical;

}));

/*!
 * Isotope v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

(function(window, factory) {
	// universal module definition
	/* jshint strict: false */
	/*globals define, module, require */
	if (typeof define == 'function' && define.amd) {
		// AMD
		define([
				'outlayer/outlayer',
				'get-size/get-size',
				'desandro-matches-selector/matches-selector',
				'fizzy-ui-utils/utils',
				'isotope-layout/js/item',
				'isotope-layout/js/layout-mode',
				// include default layout modes
				'isotope-layout/js/layout-modes/masonry',
				'isotope-layout/js/layout-modes/fit-rows',
				'isotope-layout/js/layout-modes/vertical'
			],
			function(Outlayer, getSize, matchesSelector, utils, Item, LayoutMode) {
				return factory(window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode);
			});
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
			window,
			require('outlayer'),
			require('get-size'),
			require('desandro-matches-selector'),
			require('fizzy-ui-utils'),
			require('isotope-layout/js/item'),
			require('isotope-layout/js/layout-mode'),
			// include default layout modes
			require('isotope-layout/js/layout-modes/masonry'),
			require('isotope-layout/js/layout-modes/fit-rows'),
			require('isotope-layout/js/layout-modes/vertical')
		);
	} else {
		// browser global
		window.Isotope = factory(
			window,
			window.Outlayer,
			window.getSize,
			window.matchesSelector,
			window.fizzyUIUtils,
			window.Isotope.Item,
			window.Isotope.LayoutMode
		);
	}

}(window, function factory(window, Outlayer, getSize, matchesSelector, utils,
	Item, LayoutMode) {



	// -------------------------- vars -------------------------- //

	var jQuery = window.jQuery;

	// -------------------------- helpers -------------------------- //

	var trim = String.prototype.trim ?
		function(str) {
			return str.trim();
		} :
		function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		};

	// -------------------------- isotopeDefinition -------------------------- //

	// create an Outlayer layout class
	var Isotope = Outlayer.create('isotope', {
		layoutMode: 'masonry',
		isJQueryFiltering: true,
		sortAscending: true
	});

	Isotope.Item = Item;
	Isotope.LayoutMode = LayoutMode;

	var proto = Isotope.prototype;

	proto._create = function() {
		this.itemGUID = 0;
		// functions that sort items
		this._sorters = {};
		this._getSorters();
		// call super
		Outlayer.prototype._create.call(this);

		// create layout modes
		this.modes = {};
		// start filteredItems with all items
		this.filteredItems = this.items;
		// keep of track of sortBys
		this.sortHistory = ['original-order'];
		// create from registered layout modes
		for (var name in LayoutMode.modes) {
			this._initLayoutMode(name);
		}
	};

	proto.reloadItems = function() {
		// reset item ID counter
		this.itemGUID = 0;
		// call super
		Outlayer.prototype.reloadItems.call(this);
	};

	proto._itemize = function() {
		var items = Outlayer.prototype._itemize.apply(this, arguments);
		// assign ID for original-order
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			item.id = this.itemGUID++;
		}
		this._updateItemsSortData(items);
		return items;
	};


	// -------------------------- layout -------------------------- //

	proto._initLayoutMode = function(name) {
		var Mode = LayoutMode.modes[name];
		// set mode options
		// HACK extend initial options, back-fill in default options
		var initialOpts = this.options[name] || {};
		this.options[name] = Mode.options ?
			utils.extend(Mode.options, initialOpts) : initialOpts;
		// init layout mode instance
		this.modes[name] = new Mode(this);
	};


	proto.layout = function() {
		// if first time doing layout, do all magic
		if (!this._isLayoutInited && this._getOption('initLayout')) {
			this.arrange();
			return;
		}
		this._layout();
	};

	// private method to be used in layout() & magic()
	proto._layout = function() {
		// don't animate first layout
		var isInstant = this._getIsInstant();
		// layout flow
		this._resetLayout();
		this._manageStamps();
		this.layoutItems(this.filteredItems, isInstant);

		// flag for initalized
		this._isLayoutInited = true;
	};

	// filter + sort + layout
	proto.arrange = function(opts) {
		// set any options pass
		this.option(opts);
		this._getIsInstant();
		// filter, sort, and layout

		// filter
		var filtered = this._filter(this.items);
		this.filteredItems = filtered.matches;

		this._bindArrangeComplete();

		if (this._isInstant) {
			this._noTransition(this._hideReveal, [filtered]);
		} else {
			this._hideReveal(filtered);
		}

		this._sort();
		this._layout();
	};
	// alias to _init for main plugin method
	proto._init = proto.arrange;

	proto._hideReveal = function(filtered) {
		this.reveal(filtered.needReveal);
		this.hide(filtered.needHide);
	};

	// HACK
	// Don't animate/transition first layout
	// Or don't animate/transition other layouts
	proto._getIsInstant = function() {
		var isLayoutInstant = this._getOption('layoutInstant');
		var isInstant = isLayoutInstant !== undefined ? isLayoutInstant :
			!this._isLayoutInited;
		this._isInstant = isInstant;
		return isInstant;
	};

	// listen for layoutComplete, hideComplete and revealComplete
	// to trigger arrangeComplete
	proto._bindArrangeComplete = function() {
		// listen for 3 events to trigger arrangeComplete
		var isLayoutComplete, isHideComplete, isRevealComplete;
		var _this = this;

		function arrangeParallelCallback() {
			if (isLayoutComplete && isHideComplete && isRevealComplete) {
				_this.dispatchEvent('arrangeComplete', null, [_this.filteredItems]);
			}
		}
		this.once('layoutComplete', function() {
			isLayoutComplete = true;
			arrangeParallelCallback();
		});
		this.once('hideComplete', function() {
			isHideComplete = true;
			arrangeParallelCallback();
		});
		this.once('revealComplete', function() {
			isRevealComplete = true;
			arrangeParallelCallback();
		});
	};

	// -------------------------- filter -------------------------- //

	proto._filter = function(items) {
		var filter = this.options.filter;
		filter = filter || '*';
		var matches = [];
		var hiddenMatched = [];
		var visibleUnmatched = [];

		var test = this._getFilterTest(filter);

		// test each item
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.isIgnored) {
				continue;
			}
			// add item to either matched or unmatched group
			var isMatched = test(item);
			// item.isFilterMatched = isMatched;
			// add to matches if its a match
			if (isMatched) {
				matches.push(item);
			}
			// add to additional group if item needs to be hidden or revealed
			if (isMatched && item.isHidden) {
				hiddenMatched.push(item);
			} else if (!isMatched && !item.isHidden) {
				visibleUnmatched.push(item);
			}
		}

		// return collections of items to be manipulated
		return {
			matches: matches,
			needReveal: hiddenMatched,
			needHide: visibleUnmatched
		};
	};

	// get a jQuery, function, or a matchesSelector test given the filter
	proto._getFilterTest = function(filter) {
		if (jQuery && this.options.isJQueryFiltering) {
			// use jQuery
			return function(item) {
				return jQuery(item.element).is(filter);
			};
		}
		if (typeof filter == 'function') {
			// use filter as function
			return function(item) {
				return filter(item.element);
			};
		}
		// default, use filter as selector string
		return function(item) {
			return matchesSelector(item.element, filter);
		};
	};

	// -------------------------- sorting -------------------------- //

	/**
	 * @params {Array} elems
	 * @public
	 */
	proto.updateSortData = function(elems) {
		// get items
		var items;
		if (elems) {
			elems = utils.makeArray(elems);
			items = this.getItems(elems);
		} else {
			// update all items if no elems provided
			items = this.items;
		}

		this._getSorters();
		this._updateItemsSortData(items);
	};

	proto._getSorters = function() {
		var getSortData = this.options.getSortData;
		for (var key in getSortData) {
			var sorter = getSortData[key];
			this._sorters[key] = mungeSorter(sorter);
		}
	};

	/**
	 * @params {Array} items - of Isotope.Items
	 * @private
	 */
	proto._updateItemsSortData = function(items) {
		// do not update if no items
		var len = items && items.length;

		for (var i = 0; len && i < len; i++) {
			var item = items[i];
			item.updateSortData();
		}
	};

	// ----- munge sorter ----- //

	// encapsulate this, as we just need mungeSorter
	// other functions in here are just for munging
	var mungeSorter = (function() {
		// add a magic layer to sorters for convienent shorthands
		// `.foo-bar` will use the text of .foo-bar querySelector
		// `[foo-bar]` will use attribute
		// you can also add parser
		// `.foo-bar parseInt` will parse that as a number
		function mungeSorter(sorter) {
			// if not a string, return function or whatever it is
			if (typeof sorter != 'string') {
				return sorter;
			}
			// parse the sorter string
			var args = trim(sorter).split(' ');
			var query = args[0];
			// check if query looks like [an-attribute]
			var attrMatch = query.match(/^\[(.+)\]$/);
			var attr = attrMatch && attrMatch[1];
			var getValue = getValueGetter(attr, query);
			// use second argument as a parser
			var parser = Isotope.sortDataParsers[args[1]];
			// parse the value, if there was a parser
			sorter = parser ? function(elem) {
					return elem && parser(getValue(elem));
				} :
				// otherwise just return value
				function(elem) {
					return elem && getValue(elem);
				};

			return sorter;
		}

		// get an attribute getter, or get text of the querySelector
		function getValueGetter(attr, query) {
			// if query looks like [foo-bar], get attribute
			if (attr) {
				return function getAttribute(elem) {
					return elem.getAttribute(attr);
				};
			}

			// otherwise, assume its a querySelector, and get its text
			return function getChildText(elem) {
				var child = elem.querySelector(query);
				return child && child.textContent;
			};
		}

		return mungeSorter;
	})();

	// parsers used in getSortData shortcut strings
	Isotope.sortDataParsers = {
		'parseInt': function(val) {
			return parseInt(val, 10);
		},
		'parseFloat': function(val) {
			return parseFloat(val);
		}
	};

	// ----- sort method ----- //

	// sort filteredItem order
	proto._sort = function() {
		if (!this.options.sortBy) {
			return;
		}
		// keep track of sortBy History
		var sortBys = utils.makeArray(this.options.sortBy);
		if (!this._getIsSameSortBy(sortBys)) {
			// concat all sortBy and sortHistory, add to front, oldest goes in last
			this.sortHistory = sortBys.concat(this.sortHistory);
		}
		// sort magic
		var itemSorter = getItemSorter(this.sortHistory, this.options.sortAscending);
		this.filteredItems.sort(itemSorter);
	};

	// check if sortBys is same as start of sortHistory
	proto._getIsSameSortBy = function(sortBys) {
		for (var i = 0; i < sortBys.length; i++) {
			if (sortBys[i] != this.sortHistory[i]) {
				return false;
			}
		}
		return true;
	};

	// returns a function used for sorting
	function getItemSorter(sortBys, sortAsc) {
		return function sorter(itemA, itemB) {
			// cycle through all sortKeys
			for (var i = 0; i < sortBys.length; i++) {
				var sortBy = sortBys[i];
				var a = itemA.sortData[sortBy];
				var b = itemB.sortData[sortBy];
				if (a > b || a < b) {
					// if sortAsc is an object, use the value given the sortBy key
					var isAscending = sortAsc[sortBy] !== undefined ? sortAsc[sortBy] : sortAsc;
					var direction = isAscending ? 1 : -1;
					return (a > b ? 1 : -1) * direction;
				}
			}
			return 0;
		};
	}

	// -------------------------- methods -------------------------- //

	// get layout mode
	proto._mode = function() {
		var layoutMode = this.options.layoutMode;
		var mode = this.modes[layoutMode];
		if (!mode) {
			// TODO console.error
			throw new Error('No layout mode: ' + layoutMode);
		}
		// HACK sync mode's options
		// any options set after init for layout mode need to be synced
		mode.options = this.options[layoutMode];
		return mode;
	};

	proto._resetLayout = function() {
		// trigger original reset layout
		Outlayer.prototype._resetLayout.call(this);
		this._mode()._resetLayout();
	};

	proto._getItemLayoutPosition = function(item) {
		return this._mode()._getItemLayoutPosition(item);
	};

	proto._manageStamp = function(stamp) {
		this._mode()._manageStamp(stamp);
	};

	proto._getContainerSize = function() {
		return this._mode()._getContainerSize();
	};

	proto.needsResizeLayout = function() {
		return this._mode().needsResizeLayout();
	};

	// -------------------------- adding & removing -------------------------- //

	// HEADS UP overwrites default Outlayer appended
	proto.appended = function(elems) {
		var items = this.addItems(elems);
		if (!items.length) {
			return;
		}
		// filter, layout, reveal new items
		var filteredItems = this._filterRevealAdded(items);
		// add to filteredItems
		this.filteredItems = this.filteredItems.concat(filteredItems);
	};

	// HEADS UP overwrites default Outlayer prepended
	proto.prepended = function(elems) {
		var items = this._itemize(elems);
		if (!items.length) {
			return;
		}
		// start new layout
		this._resetLayout();
		this._manageStamps();
		// filter, layout, reveal new items
		var filteredItems = this._filterRevealAdded(items);
		// layout previous items
		this.layoutItems(this.filteredItems);
		// add to items and filteredItems
		this.filteredItems = filteredItems.concat(this.filteredItems);
		this.items = items.concat(this.items);
	};

	proto._filterRevealAdded = function(items) {
		var filtered = this._filter(items);
		this.hide(filtered.needHide);
		// reveal all new items
		this.reveal(filtered.matches);
		// layout new items, no transition
		this.layoutItems(filtered.matches, true);
		return filtered.matches;
	};

	/**
	 * Filter, sort, and layout newly-appended item elements
	 * @param {Array or NodeList or Element} elems
	 */
	proto.insert = function(elems) {
		var items = this.addItems(elems);
		if (!items.length) {
			return;
		}
		// append item elements
		var i, item;
		var len = items.length;
		for (i = 0; i < len; i++) {
			item = items[i];
			this.element.appendChild(item.element);
		}
		// filter new stuff
		var filteredInsertItems = this._filter(items).matches;
		// set flag
		for (i = 0; i < len; i++) {
			items[i].isLayoutInstant = true;
		}
		this.arrange();
		// reset flag
		for (i = 0; i < len; i++) {
			delete items[i].isLayoutInstant;
		}
		this.reveal(filteredInsertItems);
	};

	var _remove = proto.remove;
	proto.remove = function(elems) {
		elems = utils.makeArray(elems);
		var removeItems = this.getItems(elems);
		// do regular thing
		_remove.call(this, elems);
		// bail if no items to remove
		var len = removeItems && removeItems.length;
		// remove elems from filteredItems
		for (var i = 0; len && i < len; i++) {
			var item = removeItems[i];
			// remove item from collection
			utils.removeFrom(this.filteredItems, item);
		}
	};

	proto.shuffle = function() {
		// update random sortData
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			item.sortData.random = Math.random();
		}
		this.options.sortBy = 'random';
		this._sort();
		this._layout();
	};

	/**
	 * trigger fn without transition
	 * kind of hacky to have this in the first place
	 * @param {Function} fn
	 * @param {Array} args
	 * @returns ret
	 * @private
	 */
	proto._noTransition = function(fn, args) {
		// save transitionDuration before disabling
		var transitionDuration = this.options.transitionDuration;
		// disable transition
		this.options.transitionDuration = 0;
		// do it
		var returnValue = fn.apply(this, args);
		// re-enable transition for reveal
		this.options.transitionDuration = transitionDuration;
		return returnValue;
	};

	// ----- helper methods ----- //

	/**
	 * getter method for getting filtered item elements
	 * @returns {Array} elems - collection of item elements
	 */
	proto.getFilteredItemElements = function() {
		return this.filteredItems.map(function(item) {
			return item.element;
		});
	};

	// -----  ----- //

	return Isotope;

}));


/*------------------------------------------------------------------*/
/*	 WAYPOINTS
/*------------------------------------------------------------------*/

/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
! function() {
	"use strict";

	function t(o) {
		if (!o) throw new Error("No options passed to Waypoint constructor");
		if (!o.element) throw new Error("No element option passed to Waypoint constructor");
		if (!o.handler) throw new Error("No handler option passed to Waypoint constructor");
		this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
			name: this.options.group,
			axis: this.axis
		}), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1
	}
	var e = 0,
		i = {};
	t.prototype.queueTrigger = function(t) {
		this.group.queueTrigger(this, t)
	}, t.prototype.trigger = function(t) {
		this.enabled && this.callback && this.callback.apply(this, t)
	}, t.prototype.destroy = function() {
		this.context.remove(this), this.group.remove(this), delete i[this.key]
	}, t.prototype.disable = function() {
		return this.enabled = !1, this
	}, t.prototype.enable = function() {
		return this.context.refresh(), this.enabled = !0, this
	}, t.prototype.next = function() {
		return this.group.next(this)
	}, t.prototype.previous = function() {
		return this.group.previous(this)
	}, t.invokeAll = function(t) {
		var e = [];
		for (var o in i) e.push(i[o]);
		for (var n = 0, r = e.length; r > n; n++) e[n][t]()
	}, t.destroyAll = function() {
		t.invokeAll("destroy")
	}, t.disableAll = function() {
		t.invokeAll("disable")
	}, t.enableAll = function() {
		t.Context.refreshAll();
		for (var e in i) i[e].enabled = !0;
		return this
	}, t.refreshAll = function() {
		t.Context.refreshAll()
	}, t.viewportHeight = function() {
		return window.innerHeight || document.documentElement.clientHeight
	}, t.viewportWidth = function() {
		return document.documentElement.clientWidth
	}, t.adapters = [], t.defaults = {
		context: window,
		continuous: !0,
		enabled: !0,
		group: "default",
		horizontal: !1,
		offset: 0
	}, t.offsetAliases = {
		"bottom-in-view": function() {
			return this.context.innerHeight() - this.adapter.outerHeight()
		},
		"right-in-view": function() {
			return this.context.innerWidth() - this.adapter.outerWidth()
		}
	}, window.Waypoint = t
}(),
function() {
	"use strict";

	function t(t) {
		window.setTimeout(t, 1e3 / 60)
	}

	function e(t) {
		this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
			x: this.adapter.scrollLeft(),
			y: this.adapter.scrollTop()
		}, this.waypoints = {
			vertical: {},
			horizontal: {}
		}, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, n.windowContext || (n.windowContext = !0, n.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
	}
	var i = 0,
		o = {},
		n = window.Waypoint,
		r = window.onload;
	e.prototype.add = function(t) {
		var e = t.options.horizontal ? "horizontal" : "vertical";
		this.waypoints[e][t.key] = t, this.refresh()
	}, e.prototype.checkEmpty = function() {
		var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
			e = this.Adapter.isEmptyObject(this.waypoints.vertical),
			i = this.element == this.element.window;
		t && e && !i && (this.adapter.off(".waypoints"), delete o[this.key])
	}, e.prototype.createThrottledResizeHandler = function() {
		function t() {
			e.handleResize(), e.didResize = !1
		}
		var e = this;
		this.adapter.on("resize.waypoints", function() {
			e.didResize || (e.didResize = !0, n.requestAnimationFrame(t))
		})
	}, e.prototype.createThrottledScrollHandler = function() {
		function t() {
			e.handleScroll(), e.didScroll = !1
		}
		var e = this;
		this.adapter.on("scroll.waypoints", function() {
			(!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t))
		})
	}, e.prototype.handleResize = function() {
		n.Context.refreshAll()
	}, e.prototype.handleScroll = function() {
		var t = {},
			e = {
				horizontal: {
					newScroll: this.adapter.scrollLeft(),
					oldScroll: this.oldScroll.x,
					forward: "right",
					backward: "left"
				},
				vertical: {
					newScroll: this.adapter.scrollTop(),
					oldScroll: this.oldScroll.y,
					forward: "down",
					backward: "up"
				}
			};
		for (var i in e) {
			var o = e[i],
				n = o.newScroll > o.oldScroll,
				r = n ? o.forward : o.backward;
			for (var s in this.waypoints[i]) {
				var a = this.waypoints[i][s];
				if (null !== a.triggerPoint) {
					var l = o.oldScroll < a.triggerPoint,
						h = o.newScroll >= a.triggerPoint,
						p = l && h,
						u = !l && !h;
					(p || u) && (a.queueTrigger(r), t[a.group.id] = a.group)
				}
			}
		}
		for (var c in t) t[c].flushTriggers();
		this.oldScroll = {
			x: e.horizontal.newScroll,
			y: e.vertical.newScroll
		}
	}, e.prototype.innerHeight = function() {
		return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight()
	}, e.prototype.remove = function(t) {
		delete this.waypoints[t.axis][t.key], this.checkEmpty()
	}, e.prototype.innerWidth = function() {
		return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth()
	}, e.prototype.destroy = function() {
		var t = [];
		for (var e in this.waypoints)
			for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
		for (var o = 0, n = t.length; n > o; o++) t[o].destroy()
	}, e.prototype.refresh = function() {
		var t, e = this.element == this.element.window,
			i = e ? void 0 : this.adapter.offset(),
			o = {};
		this.handleScroll(), t = {
			horizontal: {
				contextOffset: e ? 0 : i.left,
				contextScroll: e ? 0 : this.oldScroll.x,
				contextDimension: this.innerWidth(),
				oldScroll: this.oldScroll.x,
				forward: "right",
				backward: "left",
				offsetProp: "left"
			},
			vertical: {
				contextOffset: e ? 0 : i.top,
				contextScroll: e ? 0 : this.oldScroll.y,
				contextDimension: this.innerHeight(),
				oldScroll: this.oldScroll.y,
				forward: "down",
				backward: "up",
				offsetProp: "top"
			}
		};
		for (var r in t) {
			var s = t[r];
			for (var a in this.waypoints[r]) {
				var l, h, p, u, c, d = this.waypoints[r][a],
					f = d.options.offset,
					w = d.triggerPoint,
					y = 0,
					g = null == w;
				d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))), l = s.contextScroll - s.contextOffset, d.triggerPoint = Math.floor(y + l - f), h = w < s.oldScroll, p = d.triggerPoint >= s.oldScroll, u = h && p, c = !h && !p, !g && u ? (d.queueTrigger(s.backward), o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward), o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward), o[d.group.id] = d.group)
			}
		}
		return n.requestAnimationFrame(function() {
			for (var t in o) o[t].flushTriggers()
		}), this
	}, e.findOrCreateByElement = function(t) {
		return e.findByElement(t) || new e(t)
	}, e.refreshAll = function() {
		for (var t in o) o[t].refresh()
	}, e.findByElement = function(t) {
		return o[t.waypointContextKey]
	}, window.onload = function() {
		r && r(), e.refreshAll()
	}, n.requestAnimationFrame = function(e) {
		var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
		i.call(window, e)
	}, n.Context = e
}(),
function() {
	"use strict";

	function t(t, e) {
		return t.triggerPoint - e.triggerPoint
	}

	function e(t, e) {
		return e.triggerPoint - t.triggerPoint
	}

	function i(t) {
		this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this
	}
	var o = {
			vertical: {},
			horizontal: {}
		},
		n = window.Waypoint;
	i.prototype.add = function(t) {
		this.waypoints.push(t)
	}, i.prototype.clearTriggerQueues = function() {
		this.triggerQueues = {
			up: [],
			down: [],
			left: [],
			right: []
		}
	}, i.prototype.flushTriggers = function() {
		for (var i in this.triggerQueues) {
			var o = this.triggerQueues[i],
				n = "up" === i || "left" === i;
			o.sort(n ? e : t);
			for (var r = 0, s = o.length; s > r; r += 1) {
				var a = o[r];
				(a.options.continuous || r === o.length - 1) && a.trigger([i])
			}
		}
		this.clearTriggerQueues()
	}, i.prototype.next = function(e) {
		this.waypoints.sort(t);
		var i = n.Adapter.inArray(e, this.waypoints),
			o = i === this.waypoints.length - 1;
		return o ? null : this.waypoints[i + 1]
	}, i.prototype.previous = function(e) {
		this.waypoints.sort(t);
		var i = n.Adapter.inArray(e, this.waypoints);
		return i ? this.waypoints[i - 1] : null
	}, i.prototype.queueTrigger = function(t, e) {
		this.triggerQueues[e].push(t)
	}, i.prototype.remove = function(t) {
		var e = n.Adapter.inArray(t, this.waypoints);
		e > -1 && this.waypoints.splice(e, 1)
	}, i.prototype.first = function() {
		return this.waypoints[0]
	}, i.prototype.last = function() {
		return this.waypoints[this.waypoints.length - 1]
	}, i.findOrCreate = function(t) {
		return o[t.axis][t.name] || new i(t)
	}, n.Group = i
}(),
function() {
	"use strict";

	function t(t) {
		this.$element = e(t)
	}
	var e = window.jQuery,
		i = window.Waypoint;
	e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function(e, i) {
		t.prototype[i] = function() {
			var t = Array.prototype.slice.call(arguments);
			return this.$element[i].apply(this.$element, t)
		}
	}), e.each(["extend", "inArray", "isEmptyObject"], function(i, o) {
		t[o] = e[o]
	}), i.adapters.push({
		name: "jquery",
		Adapter: t
	}), i.Adapter = t
}(),
function() {
	"use strict";

	function t(t) {
		return function() {
			var i = [],
				o = arguments[0];
			return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function() {
				var n = t.extend({}, o, {
					element: this
				});
				"string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n))
			}), i
		}
	}
	var e = window.Waypoint;
	window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}();

// https://github.com/bsehovac/shader-program

class ShaderProgram {

	constructor(holder, options = {}) {

		options = Object.assign({
			antialias: false,
			depthTest: false,
			mousemove: false,
			autosize: true,
			side: 'front',
			vertex: `
        precision highp float;

        attribute vec4 a_position;
        attribute vec4 a_color;

        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mousemove;
        uniform mat4 u_projection;

        varying vec4 v_color;

        void main() {

          gl_Position = u_projection * a_position;
          gl_PointSize = (10.0 / gl_Position.w) * 100.0;

          v_color = a_color;

        }`,
			fragment: `
        precision highp float;

        uniform sampler2D u_texture;
        uniform int u_hasTexture;

        varying vec4 v_color;

        void main() {

          if ( u_hasTexture == 1 ) {

            gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);

          } else {

            gl_FragColor = v_color;

          }

        }`,
			uniforms: {},
			buffers: {},
			camera: {},
			texture: null,
			onUpdate: (() => {}),
			onResize: (() => {}),
		}, options)

		const uniforms = Object.assign({
			time: {
				type: 'float',
				value: 0
			},
			hasTexture: {
				type: 'int',
				value: 0
			},
			resolution: {
				type: 'vec2',
				value: [0, 0]
			},
			mousemove: {
				type: 'vec2',
				value: [0, 0]
			},
			projection: {
				type: 'mat4',
				value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
			},
		}, options.uniforms)

		const buffers = Object.assign({
			position: {
				size: 3,
				data: []
			},
			color: {
				size: 4,
				data: []
			},
		}, options.buffers)

		const camera = Object.assign({
			fov: 60,
			near: 1,
			far: 10000,
			aspect: 1,
			z: 100,
			perspective: true,
		}, options.camera)

		const canvas = document.createElement('canvas')
		const gl = canvas.getContext('webgl', {
			antialias: options.antialias
		})

		if (!gl) return false

		this.count = 0
		this.gl = gl
		this.canvas = canvas
		this.camera = camera
		this.holder = holder
		this.onUpdate = options.onUpdate
		this.onResize = options.onResize
		this.data = {}

		holder.appendChild(canvas)

		this.createProgram(options.vertex, options.fragment)

		this.createBuffers(buffers)
		this.createUniforms(uniforms)

		this.updateBuffers()
		this.updateUniforms()

		this.createTexture(options.texture)

		gl.enable(gl.BLEND)
		gl.enable(gl.CULL_FACE)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
		gl[options.depthTest ? 'enable' : 'disable'](gl.DEPTH_TEST)

		if (options.autosize)
			window.addEventListener('resize', e => this.resize(e), false)
		if (options.mousemove)
			window.addEventListener('mousemove', e => this.mousemove(e), false)

		this.resize()

		this.update = this.update.bind(this)
		this.time = {
			start: performance.now(),
			old: performance.now()
		}
		this.update()

	}

	mousemove(e) {

		let x = e.pageX / this.width * 2 - 1
		let y = e.pageY / this.height * 2 - 1

		this.uniforms.mousemove = [x, y]

	}

	resize(e) {

		const holder = this.holder
		const canvas = this.canvas
		const gl = this.gl

		const width = this.width = holder.offsetWidth
		const height = this.height = holder.offsetHeight
		const aspect = this.aspect = width / height
		const dpi = devicePixelRatio

		canvas.width = width * dpi
		canvas.height = height * dpi
		canvas.style.width = width + 'px'
		canvas.style.height = height + 'px'

		gl.viewport(0, 0, width * dpi, height * dpi)
		gl.clearColor(0, 0, 0, 0)

		this.uniforms.resolution = [width, height]
		this.uniforms.projection = this.setProjection(aspect)

		this.onResize(width, height, dpi)

	}

	setProjection(aspect) {

		const camera = this.camera


		if (camera.perspective) {

			camera.aspect = aspect

			const fovRad = camera.fov * (Math.PI / 180)
			const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad)
			const rangeInv = 1.0 / (camera.near - camera.far)

			const matrix = [
				f / camera.aspect, 0, 0, 0,
				0, f, 0, 0,
				0, 0, (camera.near + camera.far) * rangeInv, -1,
				0, 0, camera.near * camera.far * rangeInv * 2, 0
			]

			matrix[14] += camera.z
			matrix[15] += camera.z

			return matrix

		} else {

			return [
				2 / this.width, 0, 0, 0,
				0, -2 / this.height, 0, 0,
				0, 0, 1, 0,
				-1, 1, 0, 1,
			]

		}

	}

	createShader(type, source) {

		const gl = this.gl
		const shader = gl.createShader(type)

		gl.shaderSource(shader, source)
		gl.compileShader(shader)

		if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

			return shader

		} else {

			console.log(gl.getShaderInfoLog(shader))
			gl.deleteShader(shader)

		}

	}

	createProgram(vertex, fragment) {

		const gl = this.gl

		const vertexShader = this.createShader(gl.VERTEX_SHADER, vertex)
		const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragment)

		const program = gl.createProgram()

		gl.attachShader(program, vertexShader)
		gl.attachShader(program, fragmentShader)
		gl.linkProgram(program)

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) {

			gl.useProgram(program)
			this.program = program

		} else {

			console.log(gl.getProgramInfoLog(program))
			gl.deleteProgram(program)

		}

	}

	createUniforms(data) {

		const gl = this.gl
		const uniforms = this.data.uniforms = data
		const values = this.uniforms = {}

		Object.keys(uniforms).forEach(name => {

			const uniform = uniforms[name]

			uniform.location = gl.getUniformLocation(this.program, 'u_' + name)

			Object.defineProperty(values, name, {
				set: value => {

					uniforms[name].value = value
					this.setUniform(name, value)

				},
				get: () => uniforms[name].value
			})

		})

	}

	setUniform(name, value) {

		const gl = this.gl
		const uniform = this.data.uniforms[name]

		uniform.value = value

		switch (uniform.type) {
			case 'int': {
				gl.uniform1i(uniform.location, value)
				break
			}
			case 'float': {
				gl.uniform1f(uniform.location, value)
				break
			}
			case 'vec2': {
				gl.uniform2f(uniform.location, ...value)
				break
			}
			case 'vec3': {
				gl.uniform3f(uniform.location, ...value)
				break
			}
			case 'vec4': {
				gl.uniform4f(uniform.location, ...value)
				break
			}
			case 'mat2': {
				gl.uniformMatrix2fv(uniform.location, false, value)
				break
			}
			case 'mat3': {
				gl.uniformMatrix3fv(uniform.location, false, value)
				break
			}
			case 'mat4': {
				gl.uniformMatrix4fv(uniform.location, false, value)
				break
			}
		}

		// ivec2       : uniform2i,
		// ivec3       : uniform3i,
		// ivec4       : uniform4i,
		// sampler2D   : uniform1i,
		// samplerCube : uniform1i,
		// bool        : uniform1i,
		// bvec2       : uniform2i,
		// bvec3       : uniform3i,
		// bvec4       : uniform4i,

	}

	updateUniforms() {

		const gl = this.gl
		const uniforms = this.data.uniforms

		Object.keys(uniforms).forEach(name => {

			const uniform = uniforms[name]

			this.uniforms[name] = uniform.value

		})

	}

	createBuffers(data) {

		const gl = this.gl
		const buffers = this.data.buffers = data
		const values = this.buffers = {}

		Object.keys(buffers).forEach(name => {

			const buffer = buffers[name]

			buffer.buffer = this.createBuffer('a_' + name, buffer.size)

			Object.defineProperty(values, name, {
				set: data => {

					buffers[name].data = data
					this.setBuffer(name, data)

					if (name == 'position')
						this.count = buffers.position.data.length / 3

				},
				get: () => buffers[name].data
			})

		})

	}

	createBuffer(name, size) {

		const gl = this.gl
		const program = this.program

		const index = gl.getAttribLocation(program, name)
		const buffer = gl.createBuffer()

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.enableVertexAttribArray(index)
		gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0)

		return buffer

	}

	setBuffer(name, data) {

		const gl = this.gl
		const buffers = this.data.buffers

		if (name == null && !gl.bindBuffer(gl.ARRAY_BUFFER, null)) return

		gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name].buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

	}

	updateBuffers() {

		const gl = this.gl
		const buffers = this.buffers

		Object.keys(buffers).forEach(name =>
			buffers[name] = buffer.data
		)

		this.setBuffer(null)

	}

	createTexture(src) {

		const gl = this.gl
		const texture = gl.createTexture()

		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))

		this.texture = texture

		if (src) {

			this.uniforms.hasTexture = 1
			this.loadTexture(src)

		}

	}

	loadTexture(src) {

		const gl = this.gl
		const texture = this.texture

		const textureImage = new Image()

		textureImage.onload = () => {

			gl.bindTexture(gl.TEXTURE_2D, texture)

			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage)

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		}

		textureImage.src = src

	}

	update() {

		const gl = this.gl

		const now = performance.now()
		const elapsed = (now - this.time.start) / 5000
		const delta = now - this.time.old
		this.time.old = now

		this.uniforms.time = elapsed

		if (this.count > 0) {
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.drawArrays(gl.POINTS, 0, this.count)
		}

		this.onUpdate(delta)

		requestAnimationFrame(this.update)

	}

}

const pointSize = 2.5

const waves = new ShaderProgram(document.querySelector('.waves'), {
	texture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMAC/goGvDhmwcExrVjWzrm29TRqqSKenRXVklANSIUE8mRkGpv+HOfAAABCElEQVQ4y4VT13LDMAwLrUHteO+R9f/fWMfO6dLaPeKVEECRxOULWsEGpS9nULDwia2Y+ALqUNbAWeg775zv+sA4/FFRMxt8U2FZFCVWjR/YrH4/H9sarclSKdPMWKzb8VsEeHB3m0shkhVCyNzeXeAQ9Xl4opEieX2QCGnwGbj6GMyjw9t1K0fK9YZunPXeAGsfJtYjwzxaBnozGGorYz0ypK2HzQSYx1y8DgSRo2ewOiyh2QWOEk1Y9OrQV0a8TiBM1a8eMHWYnRMy7CZ4t1CmyRkhSUvP3gRXyHOCLBxNoC3IJv//ZrJ/kxxUHPUB+6jJZZHrpg6GOjnqaOmzp4NDR48OLxn/H27SRQ08S0ZJAAAAAElFTkSuQmCC',
	uniforms: {
		size: {
			type: 'float',
			value: pointSize
		},
		field: {
			type: 'vec3',
			value: [0, 0, 0]
		},
		speed: {
			type: 'float',
			value: 5
		},
	},
	vertex: `
    #define M_PI 3.1415926535897932384626433832795

    precision highp float;

    attribute vec4 a_position;
    attribute vec4 a_color;

    uniform float u_time;
    uniform float u_size;
    uniform float u_speed;
    uniform vec3 u_field;
    uniform mat4 u_projection;

    varying vec4 v_color;

    void main() {

      vec3 pos = a_position.xyz;

      pos.y += (
        cos(pos.x / u_field.x * M_PI * 8.0 + u_time * u_speed) +
        sin(pos.z / u_field.z * M_PI * 8.0 + u_time * u_speed)
      ) * u_field.y;

      gl_Position = u_projection * vec4( pos.xyz, a_position.w );
      gl_PointSize = ( u_size / gl_Position.w ) * 100.0;

      v_color = a_color;

    }`,
	fragment: `
    precision highp float;

    uniform sampler2D u_texture;

    varying vec4 v_color;

    void main() {

      gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);

    }`,
	onResize(w, h, dpi) {

		const position = [],
			color = []

		const width = 400 * (w / h)
		const depth = 400
		const height = 3
		const distance = 5

		for (let x = 0; x < width; x += distance) {
			for (let z = 0; z < depth; z += distance) {

				position.push(-width / 2 + x, -30, -depth / 2 + z)
				color.push(0, 1 - (x / width) * 1, 0.5 + x / width * 0.5, z / depth)

			}
		}

		this.uniforms.field = [width, height, depth]

		this.buffers.position = position
		this.buffers.color = color

		this.uniforms.size = (h / 400) * pointSize * dpi

	},
})
