/*!
 * restfulJS v1.0.0


 * Copyright (c) 2014 Eric Downey
 * Released under the MIT license
  * http://www.restfuljs.com
*/

(function (window) {

	if (!window.$) {
		console.error("Dependency Error: JQuery not available");
	}

	// Constants
	// ----------

	var RESTFUL_TAG 			= "rest-ful",
		CLASS_PULL 				= "pull",
		CLASS_SEND 				= "send",
		SCRIPT_TAG				= "script",
	// HTML Attributes
		HTML_ATTR_TYPE			= "type",
	// RestFul Attributes
		ATTR_DATA_URL			= "data-rest-url",
		ATTR_URL				= "restUrl",
		ATTR_GET 				= "restGet",
		ATTR_NAME 				= "restName",
		ATTR_TYPE				= "restType",
		ATTR_CLASS 				= "restClass",
		ATTR_ACTION 			= "restAction",
		ATTR_TIMEOUT			= "restTimeout",
		ATTR_USERNAME			= "restUsername",
		ATTR_PASSWORD			= "restPassword",
		ATTR_IS_LOCAL			= "restIsLocal",
		ATTR_PARAMETER 			= "restParameter",
		ATTR_ACTION_FOR			= "restActionFor",
		ATTR_ATTRIBUTE			= "restAttribute",
		ATTR_HANDLEBARS_TEMPLATE = "restHandlebarsTemplate",
		ATTR_HANDLEBARS_CONTENT	= "restHandlebarsContent",
		ATTR_CROSS_DOMAIN		= "restCrossDomain",
	// RestFul Query Attributes
		QUERY_PARAMETER 		= "[data-rest-parameter]",
		QUERY_ACTION_FOR 		= "[data-rest-action-for]",
		QUERY_ATTR_PARAMETER 	= "[data-rest-attribute]";
	// RestFul Function Attributes
		ATTR_FUNC_ON_BEFORE		= "restOnBefore";
		ATTR_FUNC_ON_SUCCESS	= "restOnSuccess";
		ATTR_FUNC_ON_ERROR		= "restOnError";

	// Setup RestFulPrototype
	// ----------

	var RestFulPrototype 			= Object.create(HTMLElement.prototype);
	RestFulPrototype.url 			= "";
	RestFulPrototype.type 			= "";
	RestFulPrototype.parameters 	= {};
	RestFulPrototype.restData 		= {};
	RestFulPrototype.onAjaxBefore 	= {};
	RestFulPrototype.onAjaxSuccess	= {};
	RestFulPrototype.onAjaxError 	= {};
	RestFulPrototype.oldInnerHTML	= "";

	RestFulPrototype.construct = function(url, parameters, attributes) {
		$( this ).attr(ATTR_DATA_URL, url);
		this.innerHTML = JSON.stringify(parameters == null || parameters == "" ? {} : parameters);
		for (var attr in attributes) {
			$( this ).attr(attr, attributes[attr]);
		}
		return this;
	};

	RestFulPrototype.run = function() { ajax( restOptions( this )); };

	RestFulPrototype.compileAndRun = function() { compileAndRun(this); };

	RestFulPrototype._before = function (xhr) {
		console.log("Before AJAX");
		if (this.onAjaxBefore != "" && this.onAjaxBefore != null) 
			{ window[this.onAjaxBefore](this, xhr); }
	};
	RestFulPrototype._success = function (data, textStatus, jqXHR) {
		if ( isHandlebarsPresent() ) { bindHandlebarsData(this, data); }
		this.restData = data;
		if (this.onAjaxSuccess != "" && this.onAjaxSuccess != null) 
			{ window[this.onAjaxSuccess](this, data, textStatus, jqXHR); }
	};
	RestFulPrototype._error = function (jqXHR, textStatus, errorThrown) {
		console.error("Error\nErrorThrown: " + errorThrown + "\n" + jqXHR);
		if (this.onAjaxError != "" && this.onAjaxError != null) 
			{ window[this.onAjaxError](this, jqXHR, textStatus, errorThrown); }
	};

	var RestFul = document.registerElement( RESTFUL_TAG , { prototype: RestFulPrototype });

	// Walk the DOM for rest-ful tags
	// ----------

	$(document).ready(function() {
		$(RESTFUL_TAG).each( function (index) {
			setupTagProto(this);
			tagFunctions()[ $(this).data(ATTR_CLASS) != "" && $(this).data(ATTR_CLASS) != null ? $(this).data(ATTR_CLASS) : CLASS_PULL ](this);
		});
	});

	var setupTagProto = function (tag) {
		tag.__proto__ = RestFulPrototype;
		tag.oldInnerHTML = tag.innerHTML === null ? "" : tag.innerHTML;
		tag.onAjaxBefore = $(tag).data(ATTR_FUNC_ON_BEFORE)	  == null ? null : $(tag).data(ATTR_FUNC_ON_BEFORE);
		tag.onAjaxSuccess = $(tag).data(ATTR_FUNC_ON_SUCCESS) == null ? null : $(tag).data(ATTR_FUNC_ON_SUCCESS);
		tag.onAjaxError = $(tag).data(ATTR_FUNC_ON_ERROR)	  == null ? null : $(tag).data(ATTR_FUNC_ON_ERROR);
	};

	var tagFunctions = function () {
		var funcs = {};
		funcs[CLASS_PULL] = function (tag) { compileAndRun(tag); };
		funcs[CLASS_SEND] = function (tag) { sendAction(tag); };
		return funcs;
	};

	// Actions
	// ----------

	var compileAndRun = function (tag) {
		tag.innerHTML = getParameters(tag);
		bindAttributeParameters(tag);
		ajax( restOptions( tag ));
	};

	var sendAction = function (tag) {
		var actFor = document.querySelectorAll( QUERY_ACTION_FOR );
		for (var i = 0; i < actFor.length; ++i) {
			var tagName = $( actFor[i] ).data( ATTR_ACTION_FOR );
			if ( tagName == $(tag).data( ATTR_NAME ) ) {
				actFor[i].addEventListener( $( actFor[i] ).data( ATTR_ACTION ), function () { compileAndRun(tag); });
			}
		}
	};

	// Parameters
	// ----------

	var getParameters = function (tag) {
		var paramElems = document.querySelectorAll( QUERY_PARAMETER ),
			params = tag.oldInnerHTML.trim() !== "" ? eval("(" + tag.oldInnerHTML + ")") : {};

		for (var k = 0; k < paramElems.length; ++k) {
			var getAttr = $( paramElems[k] ).data( ATTR_GET );
			params[ $( paramElems[k] ).data( ATTR_PARAMETER ) ] = paramElems[k][ getAttr != "" && getAttr != null ? getAttr : "value"];
		}
		return JSON.stringify(params);
	};

	var bindAttributeParameters = function (tag) {
		var spParams = document.querySelectorAll( QUERY_ATTR_PARAMETER );
		for (var i = 0; i < spParams.length; ++i) {
			var attrName = getAttrName( $( spParams[i] ).data( ATTR_ATTRIBUTE ) ),
				getAttr = $( spParams[i] ).data( ATTR_GET );
			tag.setAttribute(attrName, spParams[i][ getAttr != "" && getAttr != null ? getAttr : "value"]);
		}
	};

	var getAttrName = function (str) {
		return {
			url: 			"data-rest-url",
			type: 			"data-rest-type",
			username: 		"data-rest-username",
			password: 		"data-rest-password",
			crossDomain: 	"data-rest-cross-domain",
			isLocal: 		"data-rest-is-local",
			timeout: 		"data-rest-timeout"
		}[str];
	};

	// AJAX
	// ----------

	var restOptions = function (tag) {
		return {
			tag: 			tag,
			url: 			$(tag).data( ATTR_URL ),
			type: 			$(tag).data( ATTR_TYPE ) == "" || $(tag).data( ATTR_TYPE ) == null ? "GET" : $(tag).data( ATTR_TYPE ),
			parameters: 	tag.innerHTML != "" ? eval("(" + tag.innerHTML + ")") : {},
			crossDomain: 	Boolean($(tag).data( ATTR_CROSS_DOMAIN )) == true ? Boolean($(tag).data( ATTR_CROSS_DOMAIN )) : false,
			username: 		$(tag).data( ATTR_USERNAME ),
			password: 		$(tag).data( ATTR_PASSWORD ),
			isLocal: 		Boolean($(tag).data( ATTR_IS_LOCAL )) == true ? Boolean($(tag).data( ATTR_IS_LOCAL )) : false,
			timeout: 		Number($(tag).data( ATTR_TIMEOUT )) == 0 ? 0 : Number($(tag).data( ATTR_TIMEOUT ))
		};
	};

	var ajax = function (opts) {
		$.ajax({
		    url: 			opts.url,
		    type: 			opts.type,
		    data : 			opts.parameters,
		    crossDomain: 	opts.crossDomain,
		    username: 		opts.username,
		    password: 		opts.password,
		    isLocal: 		opts.isLocal,
		    timeout: 		opts.timeout,
		    beforeSend: 	function(xhr) { opts.tag._before(xhr); },
		    success: 		function(data, textStatus, jqXHR) { opts.tag._success(data, textStatus, jqXHR); },
		    error: 			function (jqXHR, textStatus, errorThrown) { opts.tag._error(jqXHR, textStatus, errorThrown); }
		});
	};

	// Handlebars
	// ----------

	var isHandlebarsPresent = function () {
		var isHandlebars = false;
		$( SCRIPT_TAG ).each( function (index) {
			if ( $( this ).attr( HTML_ATTR_TYPE ) == "text/x-handlebars-template") {
				isHandlebars = true;
			}
		});
		return isHandlebars;
	};

	var bindHandlebarsData = function (tag, data) {
		var templateId	= "#" + $(tag).data( ATTR_HANDLEBARS_TEMPLATE ),
			contentId 	= "#" + $(tag).data( ATTR_HANDLEBARS_CONTENT ),
			source 		= $( templateId ).html(),
	  		template 	= Handlebars.compile(source);
	  	$( contentId ).html(template(data));
	};

	// Append local functions to the window
	// for QUnit testing
	window._getAttrName				= getAttrName;
	window._restOptions				= restOptions;
	window._tagFunctions			= tagFunctions;
	window._setupTagProto			= setupTagProto;
	window._getParameters			= getParameters;
	window._isHandlebarsPresent		= isHandlebarsPresent;
	window._bindAttributeParameters	= bindAttributeParameters;

})(this);