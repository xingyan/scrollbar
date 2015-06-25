/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./example";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	
	
	"use strict";
	console.log(__webpack_require__(2));
	
	var
	  
	  base = __webpack_require__(4),
	
	  
	  Events = base.dispatcher,
	
	  
	  util = base.util,
	
	  
	  widgetDefine = __webpack_require__(2).widgetDefine;
	
	
	
	var scrollbar = widgetDefine("scrollBar", {
	  
	  wheelSpeed: 50,
	
	  
	  overflow: false,
	
	  
	  scrollBox: null,
	
	  
	  hasArrow: true,
	
	  
	  upArrow: null,
	
	  
	  downArrow: null,
	
	  
	  track: null,
	
	  
	  trackBox: null,
	
	  
	  trackOnDrag: false,
	
	  
	  dragMerge: 0,
	
	  
	  dragMergeY: 0,
	
	  
	  trackHeight: 0,
	
	  
	  blockHeight: 0,
	
	  
	  ie: false,
	
	  
	  onChangeTimer: 0,
	
	  
	  lastHeight: 0,
	  
	  initialize: function(container, options) {
	    this.addOptions(options);
	    this.ie = /msie/i.test(navigator.userAgent);
	    this.container = $(container);
	    this.event = new Events(this);
	    this.el = $(this.el);
	    this.el.css("overflow", "hidden");
	    this.buildEl();
	    this.addEvent();
	    return this;
	  },
	  
	  addEvent: function() {
	    if(this.hasArrow) {
	      
	      this.addArrowEvent();
	    }
	    
	    this.trackBox.on("mouseover mouseout mousedown mouseup", util.bind(this.dispatchTrackEvent, this));
	    $(document).on("mousedown", util.bind(this.downFunc, this));
	    $(document).on("mousemove", util.bind(this.moveFunc, this));
	    $(document).on("mouseup", util.bind(this.upFunc, this));
	    
	    this.track.on("mousedown", util.bind(this.onClickTrack, this));
	    
	    this.el.on("mousewheel DOMMouseScroll", util.bind(this.onWheel, this));
	    this.scrollBox.on("mousewheel DOMMouseScroll", util.bind(this.onWheel, this));
	    
	    this.onChangeTimer = window.setInterval(util.bind(this.onTimer, this), 32);
	  },
	
	  
	  onTimer: function() {
	    var h = this.el[0].scrollHeight;
	    if(this.lastHeight == h)    return;
	    this.lastHeight = h;
	    if(this.trackOnDrag) {
	      this.blockHeight = this.trackBox[0].clientHeight;
	    }
	    this.checkShow("listen");
	  },
	
	  
	  onWheel: function(e) {
	    if(!this.overflow)  return;
	    var evt = e.originalEvent || window.event;
	    evt.stopPropagation && (evt.preventDefault(), evt.stopPropagation()) || (evt.cancelBubble = true, evt.returnValue = false);
	    var scroll = (evt.wheelDelta/120 * -1 || evt.detail / 3) * this.wheelSpeed;
	    this.el[0].scrollTop += scroll;
	    this.checkTrackBlock();
	  },
	
	  
	  onClickTrack: function(e) {
	    var el = e.target || e.srcElement,
	      needReturn = this.ie ? e.button != 1 : e.button != 0;
	    if(needReturn || (el.parentNode == this.trackBox[0] || el == this.trackBox[0])) return;
	    var tbPos = this.getPosition(this.trackBox[0]).top,
	      tPos = this.getPosition(this.track[0]).top,
	      trackPoint = e.clientY - tPos,
	      blockPoint = tbPos - tPos,
	      blockHeight = this.trackBox[0].clientHeight,
	      rt,
	      st;
	    if(trackPoint < blockPoint){
	      rt = trackPoint + 'px';
	      st = parseInt(trackPoint / this.track[0].clientHeight * this.el[0].scrollHeight);
	    }else if(trackPoint > blockHeight + blockPoint){
	      rt = trackPoint - blockHeight + 'px';
	      st = parseInt((trackPoint - blockHeight) / this.track[0].clientHeight * this.el[0].scrollHeight);
	    }
	    this.trackBox[0].style.top = rt;
	    this.el[0].scrollTop = st;
	  },
	  
	  downFunc: function(e) {
	    var el = e.target || e.srcElement,
	      needReturn = this.ie ? e.button != 1 : e.button != 0;
	    if(needReturn || (el.parentNode != this.trackBox[0] && el != this.trackBox[0])) return;
	    if(this.ie && this.trackBox[0].setCapture) {
	      this.trackBox[0].setCapture();
	    } else {
	      e.preventDefault();
	    }
	    var tbPos = this.getPosition(this.trackBox[0]),
	      tPos = this.getPosition(this.track[0]);
	    this.dragMerge = tPos.top;
	    this.dragMergeY = e.clientY - tbPos.top;
	    this.trackHeight = this.track[0].clientHeight;
	    this.blockHeight = this.trackBox[0].clientHeight;
	    this.trackOnDrag = true;
	  },
	
	  
	  moveFunc: function(e) {
	    if(!this.trackOnDrag)   return;
	    var t = e.clientY - this.dragMerge - this.dragMergeY,
	      s = 0,
	      eScroll = this.el[0].scrollHeight;
	    if(t < 0) {
	      t = 0;
	    } else if(t > this.trackHeight - this.blockHeight) {
	      t = this.trackHeight - this.blockHeight;
	      s = eScroll - this.container[0].clientHeight;
	    } else {
	      s = parseInt(t / this.trackHeight * eScroll);
	    }
	    this.trackBox[0].style.top = t + "px";
	    this.el[0].scrollTop = s;
	  },
	
	  
	  upFunc: function(e) {
	    if(!this.trackOnDrag)   return;
	    if(this.ie && this.trackBox[0].releaseCapture) {
	      this.trackBox[0].releaseCapture();
	    }
	    this.trackOnDrag = false;
	    this.trackBox[0].className = "scaredrelic-scrollbox-trackmouseup";
	  },
	
	  
	  dispatchTrackEvent: function(e) {
	    var type = e.type,
	      button = e.button || 0,
	      className = "",
	      w = e.which || 1;
	    switch(type) {
	      case "mouseout":
	        className = "scaredrelic-scrollbox-trackblock";
	        break;
	      case "mouseover":
	      case "mouseup":
	      case "mousedown":
	        className = "scaredrelic-scrollbox-track" + type;
	        break;
	      default:
	        break;
	    }
	    if((button != 0 && w != 1) || className == "") return;
	    if(!this.trackOnDrag) {
	      this.trackBox[0].className = className;
	    }
	  },
	
	  
	  addArrowEvent: function() {
	    this.upArrow.on("mouseover mouseout mousedown", util.bind(this.dispatchArrowEvent, this));
	  },
	
	  
	  dispatchArrowEvent: function(e) {
	    var type = e.type;
	    switch(type) {
	      case "mouseout":
	        this.arrowButtonOnMouseOut(e);
	        break;
	      case "mouseover":
	        this.arrowButtonOnMouseOver(e);
	        break;
	      case "mousedown":
	        this.arrowButtonOnMouseDown(e);
	        break;
	      default:
	        break;
	    }
	  },
	
	  
	  arrowButtonOnMouseOut: function(e) {
	    
	
	  },
	
	  
	  arrowButtonOnMouseOver: function(e) {
	    
	
	  },
	
	  
	  arrowButtonOnMouseDown: function(e) {
	    
	
	  },
	
	
	  
	  buildEl: function() {
	    this.scrollBox = $("<div class='sacredrelic-scrollbox-box'></div>");
	    if(this.hasArrow) {
	      this.upArrow = $("<div class='scaredrelic-scrollbox-uparrow'></div>");
	      this.downArrow = $("<div class='scaredrelic-scrollbox-downarrow'></div>");
	      this.scrollBox.append(this.upArrow);
	    }
	    this.track = $("<div class='scaredrelic-scrollbox-track'>");
	    this.trackBox = $("<div class='scaredrelic-scrollbox-trackblock'><div class='scaredrelic-scrollbox-trackblocktop'></div><div class='scaredrelic-scrollbox-trackblockbody'></div><div class='scaredrelic-scrollbox-trackblockbottom'></div></div>");
	    this.track.append(this.trackBox);
	    this.scrollBox.append(this.track);
	    if(!!this.downArrow) {
	      this.scrollBox.append(this.downArrow);
	    }
	    this.container.append(this.scrollBox);
	  },
	
	  
	  checkShow: function(opt) {
	    var 
	      uAHeight = this.hasArrow ? this.upArrow[0].clientHeight : 0,
	    
	      dAHeight = this.hasArrow ? this.downArrow[0].clientHeight : 0,
	    
	      cCHeight = this.container[0].clientHeight,
	    
	      cCWidth = this.container[0].clientWidth,
	    
	      eSHeight = this.el[0].scrollHeight,
	    
	      eSTop = this.el[0].scrollTop,
	    
	      eWidth = cCWidth,
	      eHeight = cCHeight;
	    if(cCHeight < eSHeight) {
	      this.overflow = true;
	      this.scrollBox.css({
	        "display": "",
	        "height": cCHeight + "px"
	      });
	      this.track.css("height", cCHeight - uAHeight - dAHeight + "px");
	      if(cCHeight + eSTop > eSHeight) {
	        this.el[0].scrollTop = eSHeight - cCHeight;
	      }
	      eWidth = cCWidth - this.scrollBox[0].clientWidth;
	      eHeight = cCHeight;
	      this.checkTrackBlock({
	        cH: cCHeight,
	        rS: eSHeight,
	        sT: eSTop
	      });
	    } else {
	      this.overflow = false;
	      this.scrollBox.hide();
	      this.el[0].scrollTop = 0;
	    }
	    this.el.css({
	      "width": eWidth + "px",
	      "height": eHeight + "px"
	    });
	  },
	
	  
	  checkTrackBlock: function(opts) {
	    opts = opts || {};
	    var cH = opts.cH || this.container[0].clientHeight,
	      rS = opts.rS || this.el[0].scrollHeight,
	      sT = opts.sT || this.el[0].scrollTop,
	      tH = this.track[0].clientHeight;
	    var curH = (tH * cH / rS) >> 0,
	      bHeight = curH < 6 ? 6 : curH;
	    this.trackBox.css("height", bHeight + "px");
	    this.trackBox.find("div")[1].style.height = bHeight - 4 + "px";
	    var t = (tH * sT / rS) >> 0;
	    this.trackBox.css("top", t + "px");
	  },
	
	  
	  getPosition: function(el){
	    var ua = navigator.userAgent.toLowerCase();
	    var parent = null;
	    var pos = [];
	    var box;
	    if (el.getBoundingClientRect){ 
	      box = el.getBoundingClientRect();
	      var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	      var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
	      return {
	        left: box.left + scrollLeft,
	        top: box.top + scrollTop
	      };
	    }else if (document.getBoxObjectFor){ 
	      box = document.getBoxObjectFor(el);
	      var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
	      var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
	      pos = [box.x - borderLeft, box.y - borderTop];
	    }else{ 
	      pos = [el.offsetLeft, el.offsetTop];
	      parent = el.offsetParent;
	      if (parent != el) {
	        while (parent) {
	          pos[0] += parent.offsetLeft;
	          pos[1] += parent.offsetTop;
	          parent = parent.offsetParent;
	        }
	      }
	      if (/opera/.test(ua) || (/safari/.test(ua) && el.style.position == 'absolute')) {
	        pos[0] -= document.body.offsetLeft;
	        pos[1] -= document.body.offsetTop;
	      }
	    }
	    el.parentNode ? parent = el.parentNode : parent = null;
	    while (parent && parent.tagName.toUpperCase() != 'BODY' && parent.tagName.toUpperCase() != 'HTML') { 
	      pos[0] -= parent.scrollLeft;
	      pos[1] -= parent.scrollTop;
	      parent.parentNode ? parent = parent.parentNode : parent = null;
	    }
	    return {
	      left: pos[0],
	      top: pos[1]
	    }
	  },
	
	  
	  resize: function() {
	    this.checkShow();
	    this.el.css("height", this.container[0].clientHeight + "px");
	  },
	
	  
	  scrollTo: function(v) {
	    this.el[0].scrollTop = v;
	    this.checkTrackBlock();
	  },
	
	  
	  scrollToTop: function() {
	    this.scrollTo(0);
	  },
	
	  
	  scrollToBottom: function() {
	    this.scrollTo(this.el[0].scrollHeight - this.container[0].clientHeight)
	  },
	
	  
	  dispose: function() {
	    window.clearInterval(this.onChangeTimer);
	    if(this.overflow) {
	      this.el.css("width", this.container[0].clientWidth + "px");
	    }
	    $(document).off("mousedown", util.bind(this.downFunc, this));
	    $(document).off("mousemove", util.bind(this.moveFunc, this));
	    $(document).off("mouseup", util.bind(this.upFunc, this));
	    this.el.off("mousewheel DOMMouseScroll", util.bind(this.onWheel, this));
	    this.scrollBox.off("mousewheel DOMMouseScroll", util.bind(this.onWheel, this));
	    this.scrollBox.remove();
	    for(var item in this){
	      this[item] = null;
	    }
	  },
	
	  CLASS_NAME: "SacredRelic.ScrollBar"
	});
	
	module.exports = scrollbar;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * game-hot-widget main
	 */
	
	module.exports.widgetDefine = __webpack_require__(3);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * abstract class, provides base ui
	 *
	 * @module Widget
	 * @version 0.0.3
	 */
	
	"use strict";
	
	if(!$ && !JQuery) {
	  throw new Error('jQuery is undefined');
	}
	
	var
	  /**
	   * @desc 团队工具包
	   * @type {exports}
	   */
	  base = __webpack_require__(4),
	
	  /**
	   * @desc 类定义
	   * @type {exports}
	   */
	  define = base.define,
	
	  /**
	   * @desc 自定义事件类
	   * @type {exports.dispatcher|*}
	   */
	  Events = base.dispatcher,
	
	  /**
	   * @desc 工具
	   * @type {exports.util|*}
	   */
	  utils = base.util;
	
	var BaseWidgetClass = define({
	  /**
	   * @property container
	   * @type DOMElement
	   */
	  container: null,
	
	  /**
	   * @property el
	   * @type DOMElement
	   */
	  el: null,
	
	  /**
	   * @property options
	   * @type Object
	   */
	  options: null,
	
	  /**
	   * @property id
	   * @type String
	   */
	  id: null,
	
	  /**
	   * @property event
	   * @type Event
	   * @see events.js
	   */
	  event: null,
	
	  /**
	   * @constructor
	   * @param el {DOMElement|String}
	   * @param options {Object}
	   */
	  initialize: function(container, options) {
	    this.container = $(container);
	    this.addOptions(options);
	    this.event = new Events(this);
	    this.id = this.id || utils.createUniqueID(this.CLASS_NAME + "_");
	    this.el = $("<div></div>").attr("id", this.id);
	    this.render();
	    return this;
	  },
	  /**
	   * @method on
	   */
	  on: function(ev, callback) {
	    this.event.on(ev, callback, this);
	    return this;
	  },
	
	  /**
	   * @method off
	   */
	  un: function(ev, callback) {
	    this.event.un(ev, callback, this);
	    return this;
	  },
	
	
	  /**
	   * @method trigger
	   */
	  trigger: function(ev, data) {
	    this.event.triggerEvent(ev, data);
	    return this;
	  },
	
	  /**
	   * @method render
	   */
	  render: function() {
	    var len = arguments.length;
	    if(len == 0) {
	      this.container = this.container || $(document.body);
	    } else {
	      this.container = $(arguments[0]);
	    }
	    this.container.append(this.el);
	  },
	  /**
	   * @method root
	   */
	  root: function(el) {
	    return this.el = el || this.el;
	  },
	
	  /**
	   * @public
	   * @method Widget.show
	   */
	  show: function() {
	    this.el.show();
	  },
	
	  /**
	   * @public
	   * @method Widget.hide
	   */
	  hide: function() {
	    this.el.hide();
	  },
	
	  /**
	   * @public
	   * @method Widget.toggle
	   */
	  toggle: function() {
	    this.el.toggle();
	  },
	
	  /**
	   * 深度绑定
	   *
	   * @method addOptions
	   * @priavate
	   * @param newOptions {Object}
	   */
	  addOptions: function(newOptions) {
	    if (this.options == null) {
	      this.options = {};
	    }
	    $.extend(this.options, newOptions);
	    $.extend(this, newOptions);
	  },
	
	  /**
	   * @property CLASS_NAME
	   * @type String
	   */
	  CLASS_NAME: "Widget"
	});
	
	/**
	 * 派生
	 *
	 * @method addOptions
	 * @priavate
	 * @param newOptions {Object}
	 */
	module.exports = function() {
	  var ars = Array.prototype.slice.call(arguments).slice(0, 2),
	    len = ars.length;
	  if(len < 2) throw new Error("Illegal arguments!");
	  var N = ars[0],
	      P = ars[1];
	  var C = define(BaseWidgetClass, P);
	  $.fn[N] = function(opts) {
	    return this.each(function() {
	      var widget = $.data(this, "SacredRelic_ui_" + N);
	      if(!widget) {
	        widget = new C($(this), opts);
	        $.data(this, "SacredRelic_ui_" + N, widget);
	      }
	    });
	  }
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 模块入口
	 * @type {exports}
	 */
	module.exports.define = __webpack_require__(5);
	module.exports.dispatcher = __webpack_require__(7);
	module.exports.util = __webpack_require__(6);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file
	 * webapp组件基础库文件，主要用于通用组件的类结构声明
	 */
	
	var util = __webpack_require__(6);
	
	var superclass = function(sp) {
	  var s = function() {
	    var name = (s.caller || {}).name;
	    var len = arguments.length, t = this;
	    var supper = arguments.callee.superclass;
	    if (!name) {
	      for(var n in t) {
	        if(t[n] == s.caller) {
	          name = n;
	          break;
	        }
	      }
	    }
	    if(len > 0 && name) {
	      var callArgs = Array.prototype.slice.call(arguments, 0);
	      Array.prototype.splice.apply(callArgs, [0, 1]);
	      return supper[name](callArgs);
	    }
	    return supper;
	  }
	  s.superclass = sp;
	  return s;
	};
	
	function inherit(child, father) {
	  var f = function() {},
	    cp,
	    fp = father.prototype;
	  f.prototype = fp;
	  cp = child.prototype = new f;
	  cp.constructor = child;
	  $.each(Array.prototype.slice.apply(arguments, [2]), function(index, item) {
	    if(typeof item === "function") {
	      item = item.prototype;
	    }
	    util.mixin(child.prototype, item);
	  });
	  cp.superclass = superclass(fp);
	}
	
	
	var define = module.exports = function() {
	  var len = arguments.length,
	    s = arguments[0],
	    i = arguments[len - 1];
	  var nc = typeof i.initialize == "function" ? i.initialize :
	    function() {
	      s.apply && s.apply(this, arguments);
	    };
	  if(len > 1) {
	    var newArgs = [nc, s].concat(Array.prototype.slice.call(arguments).slice(1, len - 1), i);
	    inherit.apply(null, newArgs);
	  } else {
	    nc.prototype = i;
	    nc.prototype.constructor = nc;
	  }
	  return nc;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * @file util group
	 */
	var
	  /**
	   * @desc util.createUniqueID的初始值
	   * @type {number}
	   */
	  lastSeqId = 0,
	
	  /**
	   * 转义map
	   */
	  escapeMap = {
	    "\b": '\\b',
	    "\t": '\\t',
	    "\n": '\\n',
	    "\f": '\\f',
	    "\r": '\\r',
	    '"': '\\"',
	    "\\": '\\\\'
	  };
	
	/**
	 * @desc 转义日期对象 for util.jsonEncode
	 * @param source
	 * @returns {string}
	 */
	function encodeDate(source) {
	  return ['"', +source, '"'].join("");
	}
	
	/**
	 * @desc 转义数组对象 for util.jsonEncode
	 * @param source
	 * @returns {string}
	 */
	function encodeArray(source) {
	  var result = ["["], l = source.length, preComma, i, item;
	  for (i = 0; i < l; i++) {
	    item = source[i];
	    switch (typeof item) {
	      case "undefined":
	      case "function":
	      case "unknown":
	        break;
	      default:
	        if (preComma) {
	          result.push(',');
	        }
	        result.push(util.jsonEncode(item));
	        preComma = 1;
	        break;
	    }
	  }
	  result.push("]");
	  return result.join("");
	}
	
	/**
	 * @desc 转义字符串对象 for util.jsonEncode
	 * @param source
	 * @returns {string}
	 */
	function encodeString(source) {
	  if (/["\\\x00-\x1f]/.test(source)) {
	    source = source.replace(/["\\\x00-\x1f]/g, function (match) {
	      var c = escapeMap[match];
	      if (c) {
	        return c;
	      }
	      c = match.charCodeAt();
	      return "\\u00" +
	        Math.floor(c / 16).toString(16) +
	        (c % 16).toString(16);
	    });
	  }
	  return ['"', source, '"'].join("");
	}
	
	var util = module.exports = {
	
	  mixin: function (destination, source) {
	    destination = destination || {};
	    if(source) {
	      for(var property in source) {
	        var value = source[property];
	        if(value !== undefined) {
	          destination[property] = value;
	        }
	      }
	      var sourceIsEvt = typeof window.Event == "function"
	        && source instanceof window.Event;
	
	      if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty("toString")) {
	        destination.toString = source.toString;
	      }
	    }
	    return destination;
	  },
	
	  /**
	   * @method util.bind
	   * @param func {Function}
	   * @param object {Object}
	   */
	  bind: function(func, object) {
	    // create a reference to all arguments past the second one
	    var args = Array.prototype.slice.apply(arguments, [2]);
	    return function() {
	      // Push on any additional arguments from the actual function call.
	      // These will come after those sent to the bind call.
	      var newArgs = args.concat(
	        Array.prototype.slice.apply(arguments, [0])
	      );
	      return func.apply(object, newArgs);
	    };
	  },
	
	  /**
	   * @method util.bindAsEventListener
	   * @param func {Function} 作为事件监听的函数
	   * @param object {Object} 作用域
	   */
	  bindAsEventListener: function(func, object) {
	    return function(event) {
	      return func.call(object, event || window.event);
	    };
	  },
	
	  /**
	   * @method util.createUniqueID
	   * @param prefix {String} 前缀
	   * @return {String} 全局唯一的一个字符串
	   */
	  createUniqueID: function(prefix) {
	    prefix = (prefix === null || prefix === undefined) ? "pc_game_" : prefix.replace(/\./g, "_");
	    return prefix + (lastSeqId++);
	  },
	
	  /**
	   * @method util.g
	   * @param el
	   * @desc 靠id拿个节点 由于只是简单支持 没有必要写得那么高级
	   */
	  g: function(el) {
	    var el = ('[object String]' == Object.prototype.toString.call(el) ?
	      document.getElementById(el) : (!!(el && 'object' == typeof el) && el));
	    return el || null;
	  },
	
	  /**
	   * @method util.jsonEncode
	   */
	  jsonEncode: function(val) {
	    switch (typeof val) {
	      case 'undefined':
	        return '""';
	      case 'number':
	        return ['"', val, '"'].join("");
	      case 'string':
	        return encodeString(val);
	      case 'boolean':
	        return ['"', val, '"'].join("");
	      default:
	        if(val === null) {
	          return '""';
	        } else if(val instanceof Array) {
	          return encodeArray(val);
	        } else if(val instanceof Date) {
	          return encodeDate(val);
	        } else {
	          var result = ['{'], preComma, item;
	          for (var key in val) {
	            if (val.hasOwnProperty(key)) {
	              item = val[key];
	              switch(typeof item) {
	                case 'undefined':
	                case 'unknown':
	                case 'function':
	                  break;
	                default:
	                  if(preComma) {
	                    result.push(',');
	                  }
	                  preComma = 1;
	                  result.push(util.jsonEncode(key) + ':' + util.jsonEncode(item));
	              }
	            }
	          }
	          result.push('}');
	          return result.join('');
	        }
	        break;
	    }
	  },
	
	  /**
	   * @param str
	   * @returns {string}
	   */
	  trim: function(str) {
	    str = String(str);
	    return !!str.trim ? str.trim() : str.replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"), '');
	  },
	
	  /**
	   * @decs method util.camelCase
	   */
	  camelCase: function(str) {
	    str = util.trim(str);
	    if (str.length === 1 || !(/[_.\- ]+/).test(str) ) {
	      return str;
	    }
	    return str
	      .replace(/^[_.\- ]+/, '')
	      .replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
	        return p1.toUpperCase();
	      });
	  },
	
	  /**
	   * @desc 获取时间
	   * @param {int} dateNum 日期秒数
	   * @param {Boolean} isFull 是否显示完整时间
	   * @returns {string}
	   */
	  getTime: function(dateNum, isFull) {
	    var d = new Date(dateNum * 1000),
	      now = new Date(),
	      curYear = d.getUTCFullYear(),
	      nowYear = now.getUTCFullYear(),
	      curMonth = d.getUTCMonth() + 1,
	      nowMonth = now.getUTCMonth() + 1,
	      curDate = d.getDate(),
	      nowDate = now.getDate(),
	      curHour = d.getHours(),
	      curMin = d.getMinutes(),
	      curSec = d.getSeconds();
	
	    var needFull = !(curYear == nowYear && curMonth == nowMonth && curDate == nowDate) || isFull,
	      fullTime = curYear + '-' + (curMonth < 10 ? '0' + curMonth: curMonth) + '-' + (curDate < 10 ? '0' + curDate: curDate) + ' ' + (curHour < 10 ? '0' + curHour: curHour) + ':' + (curMin < 10 ? '0' + curMin: curMin) + ':' + (curSec < 10 ? '0' + curSec: curSec),
	      shortTime = (curHour < 10 ? '0' + curHour: curHour) + ':' + (curMin < 10 ? '0' + curMin: curMin) + ':' + (curSec < 10 ? '0' + curSec: curSec);
	    return needFull ? fullTime: shortTime;
	  },
	
	  /**
	   * @desc 在textarea框里光标所在处插入value
	   * @method insert2TextArea
	   * @param el {DOMElement} input框
	   * @param value {String} 要插入的值
	   */
	  insert2TextArea: function(el, value) {
	    if(document.selection) {
	      el.focus();
	      var sel = document.selection.createRange();
	      sel.txt = value;
	      el.focus();
	    } else if(el.selectionStart || el.selectionStart == "0") {
	      var spos = el.selectionStart,
	        epos = el.selectionEnd,
	        scrollT = el.scrollTop;
	      el.value = el.value.substring(0, spos) + value + el.value.substring(epos, el.value.length);
	      el.focus();
	      el.selectionStart = spos + value.length;
	      el.selectionEnd = spos + value.length;
	      el.scrollTop = scrollT;
	    } else {
	      el.value += value;
	      el.focus();
	    }
	  }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var define = __webpack_require__(5);
	var util = __webpack_require__(6);
	
	/**
	 * 定义库内事件支撑
	 * @namespace event
	 * @type {object}
	 */
	var event = {
	
	  /**
	   * @property observers
	   * @desc 一个缓存事件监听的hash表
	   * @type {object}
	   */
	  observers: null,
	
	  /**
	   * @method octopus.event.element
	   * @desc 返回事件的节点
	   * @param e {window.event}
	   * @return 触发事件的节点 {DOMElement}
	   */
	  element: function(e) {
	    return e.target || e.srcElement;
	  },
	
	  /**
	   * @method event.stop
	   * @desc 把事件停了
	   * @param e {window.event}
	   * @param allowDefault {Boolean} -   是否把默认响应停了
	   */
	  stop: function(e, allowDefault) {
	    if(!allowDefault) {
	      if(e.preventDefault) {
	        e.preventDefault();
	      } else {
	        e.returnValue = false;
	      }
	    }
	
	    if(e.stopPropagation) {
	      e.stopPropagation();
	    } else {
	      e.cancelBubble = true;
	    }
	  },
	
	  /**
	   * @method event.on
	   * @desc 监听事件
	   * @param dom {String | DOMElement}
	   * @param name {String}
	   * @param fn {Function}
	   * @param useCapture {Boolean}
	   */
	  on: function(dom, name, fn, useCapture) {
	    var names = name.split(" "),
	      len = names.length,
	      i = len;
	    if(len == 0)    return false;
	    var element = util.g(dom),
	      that = event;
	    useCapture = useCapture || false;
	    if(!that.observers) {
	      that.observers = {};
	    }
	    if(!element._eventCacheID) {
	      var idPrefix = "eventCacheID_";
	      if (element.id) {
	        idPrefix = element.id + "_" + idPrefix;
	      }
	      element._eventCacheID = util.createUniqueID(idPrefix);
	    }
	    for(; i--; ) {
	      that._on(element, names[i], fn, useCapture);
	    }
	    return element;
	  },
	
	  /**
	   * @private
	   * @method event._on
	   * @desc 监听事件
	   * @param el {DOMElement}
	   * @param name {String}
	   * @param fn {Function}
	   * @param useCapture {Boolean}
	   */
	  _on: function(el, name, fn, useCapture) {
	    var cacheID = el._eventCacheID,
	      that = event;
	    if(!that.observers[cacheID]) {
	      that.observers[cacheID] = [];
	    }
	    that.observers[cacheID].push({
	      'element': el,
	      'name': name,
	      'observer': fn,
	      'useCapture': useCapture
	    });
	    if(el.addEventListener) {
	      el.addEventListener(name, fn, useCapture);
	    } else if (el.attachEvent) {
	      el.attachEvent('on' + name, fn);
	    }
	  },
	
	  /**
	   * @method event.stopObservingElement
	   * @desc 把指定节点的所有事件监听停掉
	   * @param dom {DOMElement}
	   */
	  stopObservingElement: function(dom) {
	    var element = util.g(dom);
	    var cacheID = element._eventCacheID;
	    this._removeElementObservers(o.event.observers[cacheID]);
	  },
	
	  /**
	   * @method event.stopEventObserver
	   * @param dom {DOMElement}
	   * @param e {String} 指定停掉的事件类型
	   * @desc 此方法会将指定节点上的指定方法的所有事件监听停掉 慎用
	   */
	  stopEventObserver: function(dom, e) {
	    var cacheID = util.g(dom)._eventCacheID,
	      that = event,
	      elementObservers = that.observers[cacheID];
	    if (elementObservers) {
	      var i = elementObservers.length;
	      for(; i--; ) {
	        var entry = elementObservers[i];
	        if(e == entry.name) {
	          var args = new Array(entry.element,
	            entry.name,
	            entry.observer,
	            entry.useCapture);
	          that.un.apply(this, args);
	        }
	      }
	    }
	  },
	
	  /**
	   * @private
	   * @method _removeElementObservers
	   * @desc具体做事情的方法
	   * @param elementObservers {Array} 一堆事件缓存对象
	   */
	  _removeElementObservers: function(elementObservers) {
	    if (elementObservers) {
	      var i =  elementObservers.length;
	      for( ; i--; ) {
	        var entry = elementObservers[i];
	        var args = new Array(entry.element,
	          entry.name,
	          entry.observer,
	          entry.useCapture);
	        event.un.apply(this, args);
	      }
	    }
	  },
	
	  /**
	   * @method event.un
	   * @desc 单删一个指定事件监听
	   * @param dom {String | DOMElement}
	   * @param name {String}
	   * @param fn {Function}
	   * @param useCapture {Boolean}
	   * @return {Boolean} 返回解除监听是否成功
	   */
	  un: function(dom, name, fn, useCapture) {
	    var names = name.split(" "),
	      len = names.length,
	      i = len;
	    if(len == 0)    return false;
	    var element = util.g(dom),
	      cacheID = element._eventCacheID,
	      foundEntry = false;
	    useCapture = useCapture || false;
	    for(; i--; ) {
	      foundEntry = event._un(element, names[i], fn, useCapture, cacheID);
	    }
	    return foundEntry;
	  },
	
	  /**
	   * @private
	   * @method event._un
	   * @desc 单删一个指定事件监听
	   * @param el {DOMElement}
	   * @param name {String}
	   * @param fn {Function}
	   * @param useCapture {Boolean}
	   * @param id {String}
	   * @return {Boolean} 返回解除监听是否成功
	   */
	  _un: function(el, name, fn, useCapture, id) {
	    if(name == 'keypress') {
	      if( navigator.appVersion.match(/Konqueror|Safari|KHTML/) ||
	        el.detachEvent) {
	        name = 'keydown';
	      }
	    }
	    var foundEntry = false,
	      elementObservers = event.observers[id];
	    if (elementObservers) {
	      var i=0;
	      while(!foundEntry && i < elementObservers.length) {
	        var cacheEntry = elementObservers[i];
	        if ((cacheEntry.name == name) &&
	          (cacheEntry.observer == fn) &&
	          (cacheEntry.useCapture == useCapture)) {
	          elementObservers.splice(i, 1);
	          if (elementObservers.length == 0) {
	            event.observers[id] = null;
	          }
	          foundEntry = true;
	          break;
	        }
	        i++;
	      }
	    }
	    if (foundEntry) {
	      if (el.removeEventListener) {
	        el.removeEventListener(name, fn, useCapture);
	      } else if (el && el.detachEvent) {
	        el.detachEvent('on' + name, fn);
	      }
	    }
	    return foundEntry;
	  },
	
	  /**
	   * @property unloadCache
	   * @desc 页面销毁的时候希望可以释放掉所有监听
	   */
	  unloadCache: function() {
	    if (event && event.observers) {
	      for (var cacheID in event.observers) {
	        var elementObservers = event.observers[cacheID];
	        event._removeElementObservers.apply(this,
	          [elementObservers]);
	      }
	      event.observers = false;
	    }
	  }
	};
	
	/**
	 * @class Events
	 * @desc 自定义事件类
	 * @param object {Object} 观察订阅事件的对象 必需
	 * @param fallThrough {Boolean}
	 * @param options {Object}
	 */
	var Events = module.exports = define({
	
	  /**
	   * @private
	   * @constant Events.BROWSER_EVENTS
	   * @desc 常规的浏览器事件
	   */
	  BROWSER_EVENTS: [
	    "mouseover", "mouseout", "mousedown", "mouseup", "mousemove",
	    "click", "dblclick", "rightclick", "dblrightclick",
	    "resize",
	    "focus", "blur",
	    "touchstart", "touchmove", "touchend",
	    "keydown"
	  ],
	
	  /**
	   * @private
	   * @property listeners
	   * @type {object}
	   * @desc 事件监听的hash表
	   */
	  listeners: null,
	
	  /**
	   * @private
	   * @property obj
	   * @type {object}
	   * @desc 事件对象所属的主体
	   */
	  obj: null,
	
	  /**
	   * @private
	   * @constructor: Events.initialize
	   * @param obj {Object} 观察订阅事件的对象 必需
	   * @param options {Object}
	   */
	  initialize: function(obj, options) {
	    util.mixin(this, options);
	    this.obj = obj;
	    this.listeners = {};
	    if (this.el != null) {
	      this.fallThrough = this.fallThrough || false;
	      this.attachToElement();
	    }
	  },
	
	  /**
	   * @private
	   * @method attachToElement
	   * @param el {DOMElement}
	   */
	  attachToElement: function() {
	    if (this.el) {
	      event.stopObservingElement(this.el);
	    } else {
	      this.eventHandler = util.bindAsEventListener(this.handleBrowserEvent, this);
	    }
	    var i = 0,
	      len = this.BROWSER_EVENTS.length;
	    for (; i < len; i++) {
	      event.on(this.BROWSER_EVENTS[i], this.eventHandler);
	    }
	    // 不去掉ie下会2掉
	    event.on("dragstart", event.stop);
	  },
	
	  /**
	   * @private
	   * @method handleBrowserEvent
	   * @desc 在指定dom节点的情况下 封装该dom触发的event属性
	   */
	  handleBrowserEvent: function(evt) {
	    var type = evt.type,
	      listeners = this.listeners[type];
	    if(!listeners || listeners.length == 0) return;
	    var touches = evt.touches;
	    if (touches && touches[0]) {
	      var x = 0,
	        y = 0,
	        num = touches.length,
	        touch,
	        i = 0;
	      for (; i < num; ++i) {
	        touch = touches[i];
	        x += touch.clientX;
	        y += touch.clientY;
	      }
	      evt.clientX = x / num;
	      evt.clientY = y / num;
	    }
	    this.triggerEvent(type, evt);
	  },
	
	  /**
	   * @method Events.destroy
	   * @public
	   * @desc 创建的事件对象自我解脱
	   */
	  destroy: function () {
	    this.listeners = null;
	    this.obj = null;
	    this.fallThrough = null;
	  },
	
	  /**
	   * @method Events.on
	   * @public
	   * @desc 添加自定义事件监听
	   * @param type {String} 事件类型
	   * @param func {Function} 回调
	   * @param obj {Object} 事件绑定的对象 默认为this.object
	   */
	  on: function(type, func, obj) {
	    if (func != null) {
	      if (obj == null || obj == undefined)  {
	        obj = this.obj;
	      }
	      var listeners = this.listeners[type];
	      if (!listeners) {
	        listeners = [];
	        this.listeners[type] = listeners;
	      }
	      var listener = {obj: obj, func: func};
	      listeners.push(listener);
	    }
	  },
	
	  /**
	   * @method Events.un
	   * @public
	   * @desc 取消自定义事件的监听
	   * @param type {String} 事件类型
	   * @param func {Function} 触发回调
	   * @param obj {Object} 默认自身
	   */
	  un: function(type, func, obj) {
	    if (obj == null)  {
	      obj = this.obj;
	    }
	    var listeners = this.listeners[type];
	    if (listeners != null) {
	      for (var i=0, len=listeners.length; i<len; i++) {
	        if (listeners[i].obj == obj && listeners[i].func == func) {
	          listeners.splice(i, 1);
	          break;
	        }
	      }
	    }
	  },
	
	  /**
	   * @method Events.triggerEvent
	   * @desc 触发事件
	   * @param type {String} 触发事件类型
	   * @param evt {Object}
	   */
	  triggerEvent: function(type, evt) {
	    var listeners = this.listeners[type];
	    if(!listeners || listeners.length == 0) return undefined;
	    if (evt == null) {
	      evt = {};
	    }
	    evt.obj = this.obj;
	    evt.el = this.el;
	    if(!evt.type) {
	      evt.type = type;
	    }
	    //clone一份
	    listeners = listeners.slice();
	    var continueChain,
	      i = 0,
	      len = listeners.length;
	    for (; i < len; i++) {
	      var callback = listeners[i];
	      continueChain = callback.func.apply(callback.obj, [evt]);
	      if (continueChain === false) {
	        break;
	      }
	    }
	    if (!this.fallThrough) {
	      event.stop(evt);
	    }
	    return continueChain;
	  },
	
	  /**
	   * @method Events.remove
	   * @public
	   * @desc 直接把指定事件类型的监听回调置空
	   * @param type {String}
	   */
	  remove: function(type) {
	    if (this.listeners[type] != null) {
	      this.listeners[type] = [];
	    }
	  },
	
	  /**
	   * @method Events.register
	   * @desc 批量增加事件
	   * @param evs {Object}
	   */
	  register: function(evs) {
	    for(var type in evs) {
	      if(type != "scope" && evs.hasOwnProperty(type)) {
	        this.on(type, evs[type], evs.scope);
	      }
	    }
	  },
	
	  /**
	   * @method Events.unregister
	   * @desc 批量去除事件
	   * @param evs {Object}
	   */
	  unregister: function(evs) {
	    for(var type in evs) {
	      if(type != "scope" && evs.hasOwnProperty(type)) {
	        this.un(type, evs[type], evs.scope);
	      }
	    }
	  }
	});

/***/ }
/******/ ]);
//# sourceMappingURL=scrollbar.js.map