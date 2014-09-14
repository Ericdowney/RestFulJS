

// QUnit Tests


(function (window) {
	var QTest = function(name, test) {
		QUnit.test(name, function( assert ) {
			test( assert );
		});
	}

	QTest( "Rest Tag not null", function (assert) {
		var restTag = document.createElement("rest-ful");
		assert.notEqual( restTag, null, "I expect the value to not be null.");
	});

	QTest( "test_construct_noParameters_noAttributes", function (assert) {
		// Setup
		var restTag1 = document.createElement("rest-ful");

		// Action
		var tag1 = restTag1.construct("url-1", {}, {});

		// Assert
		assert.notEqual( tag1, null, "I expect the value to not be null.");
		assert.equal( $( tag1 ).data("restUrl"), "url-1", "I expect the url attribute to be equal to 'url-1'.");
		assert.equal( tag1.innerHTML, "{}", "I expect the innerHTML to be empty.");
	});

	QTest( "test_construct_withParameters_noAttributes", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful"),
			parameters = {
				param1: "parameter-1",
				param2: "parameter-2",
		};

		// Action
		var tag1 = restTag.construct("url-2", parameters, {});

		// Assert
		assert.notEqual( tag1, null, "I expect the value to not be null.");
		assert.equal( $( tag1 ).data("restUrl"), "url-2", "I expect the url attribute to be equal to 'url-1'.");
		assert.equal( tag1.innerHTML, JSON.stringify(parameters), "I expect the innerHTML to contain the parameters.");
	});

	QTest( "test_construct_noParameters_withAttributes", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful"),
			attributes = {
				"data-param1": "parameter-1",
				"data-param2": "parameter-2",
		};

		// Action
		var tag1 = restTag.construct("url-3", {}, attributes);

		// Assert
		assert.notEqual( tag1, null, "I expect the value to not be null.");
		assert.equal( $( tag1 ).data("restUrl"), "url-3", "I expect the url attribute to be equal to 'url-1'.");

		assert.equal( $( tag1 ).data("param1"), "parameter-1", "I expect the attribute to be equal to 'parameter-1'.");
		assert.equal( $( tag1 ).data("param2"), "parameter-2", "I expect the attribute to be equal to 'parameter-2'.");
	});

	QTest( "test_construct_withParameters_withAttributes", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful"),
			parameters = {
				param1: "parameter-1",
				param2: "parameter-2",
			},
			attributes = {
				"data-param1": "parameter-1",
				"data-param2": "parameter-2",
		};

		// Action
		var tag1 = restTag.construct("url-3", parameters, attributes);

		// Assert
		assert.notEqual( tag1, null, "I expect the value to not be null.");
		assert.equal( $( tag1 ).data("restUrl"), "url-3", "I expect the url attribute to be equal to 'url-1'.");
		assert.equal( tag1.innerHTML, JSON.stringify(parameters), "I expect the innerHTML to contain the parameters.");

		assert.equal( $( tag1 ).data("param1"), "parameter-1", "I expect the attribute to be equal to 'parameter-1'.");
		assert.equal( $( tag1 ).data("param2"), "parameter-2", "I expect the attribute to be equal to 'parameter-2'.");
	});

	QTest( "test_setupTagProto", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful");
		restTag.innerHTML = "Hello";

		// Action
		window._setupTagProto(restTag);

		// Assert
		assert.notEqual( restTag, null, "I expect the value to not be null.");
		assert.equal( restTag.oldInnerHTML, "Hello", "I expect the value of oldInnerHTML to be 'Hello'.");
	});

	QTest( "test_tagFunctions", function (assert) {
		// Setup
		var tagFunctions = null;

		// Action
		tagFunctions = window._tagFunctions();

		// Assert
		assert.notEqual( tagFunctions, null, "I expect the value to not be null.");
		assert.notEqual( tagFunctions["pull"], null, "I expect the value to not be null.");
		assert.notEqual( tagFunctions["send"], null, "I expect the value to not be null.");
	});

	QTest( "test_getParameters", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful"),
			param1 = document.createElement("input"),
			param2 = document.createElement("input"),
			pars = {
				restParam1: "hello",
				restParam2: "goodbye"
			};

		param1.setAttribute("data-rest-parameter", "restParam1");
		param2.setAttribute("data-rest-parameter", "restParam2");

		param1.value = "hello";
		param2.value = "goodbye";

		document.body.appendChild(param1);
		document.body.appendChild(param2);

		// Action
		var parameters = window._getParameters(restTag);

		// Assert
		assert.notEqual( parameters, null, "I expect the value to not be null.");
		assert.equal( parameters, JSON.stringify(pars), "I expect the value of parameters to equal pars");

		// Cleanup
		document.body.removeChild(param1);
		document.body.removeChild(param2);
	});

	QTest( "test_bindAttributeParameters", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful"),
			param1 = document.createElement("input"),
			param2 = document.createElement("input");

		param1.setAttribute("data-rest-attribute", "url");
		param2.setAttribute("data-rest-attribute", "type");

		param1.value = "url-1";
		param2.value = "GET";

		document.body.appendChild(param1);
		document.body.appendChild(param2);

		// Action
		window._bindAttributeParameters(restTag);

		// Assert
		assert.notEqual( restTag, null, "I expect the value to not be null.");
		assert.equal( $( restTag ).data("restUrl"), "url-1", "I expect the url attribute to be 'url-1'.")
		assert.equal( $( restTag ).data("restType"), "GET", "I expect the type attribute to be 'GET'.")

		// Cleanup
		document.body.removeChild(param1);
		document.body.removeChild(param2);
	});

	QTest( "test_getAttrName", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful"),
			urlName = "",
			typeName = "",
			usernameName = "",
			passwordName = "",
			crossDomainName = "",
			isLocalName = "",
			timeoutName = "";

		// Action
		urlName = window._getAttrName("url");
		typeName = window._getAttrName("type");
		usernameName = window._getAttrName("username");
		passwordName = window._getAttrName("password");
		crossDomainName = window._getAttrName("crossDomain");
		isLocalName = window._getAttrName("isLocal");
		timeoutName = window._getAttrName("timeout");

		// Assert
		assert.notEqual( restTag, null, "I expect the value to not be null.");

		assert.equal( urlName, "data-rest-url", "I expect urlName to be 'data-rest-url'.");
		assert.equal( typeName, "data-rest-type", "I expect urlName to be 'data-rest-type'.");
		assert.equal( usernameName, "data-rest-username", "I expect urlName to be 'data-rest-username'.");
		assert.equal( passwordName, "data-rest-password", "I expect urlName to be 'data-rest-password'.");
		assert.equal( crossDomainName, "data-rest-cross-domain", "I expect urlName to be 'data-rest-cross-domain'.");
		assert.equal( isLocalName, "data-rest-is-local", "I expect urlName to be 'data-rest-is-local'.");
		assert.equal( timeoutName, "data-rest-timeout", "I expect urlName to be 'data-rest-url'.");
	});

	QTest( "test_restOptions", function (assert) {
		// Setup
		var restTag = document.createElement("rest-ful"),
			options = null;

		// Action
		options = window._restOptions(restTag);

		// Assert
		assert.notEqual( options, null, "I expect the value to not be null.");
	});

	QTest( "test_isHandlebarsPresent_false", function (assert) {
		// Setup
		var handlebarsAvailable = true;

		// Action
		handlebarsAvailable = window._isHandlebarsPresent();

		// Assert
		assert.equal( handlebarsAvailable, false, "I expect the value to not be null.");
	});

	QTest( "test_isHandlebarsPresent_true", function (assert) {
		// Setup
		var handlebarsScript = document.createElement("script");
		handlebarsScript.setAttribute("type", "text/x-handlebars-template");
		document.body.appendChild(handlebarsScript);
		var handlebarsAvailable = false;

		// Action
		handlebarsAvailable = window._isHandlebarsPresent();

		// Assert
		assert.equal( handlebarsAvailable, true, "I expect the value to not be null.");

		// Cleanup
		document.body.removeChild(handlebarsScript);
	});
})(this);