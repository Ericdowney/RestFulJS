RestFulJS
=========

Intro
=========
​
    RestFulJS gives the user the power to define Ajax in HTML.  With Ajax in HTML you can focus on the look and feel of your website without having to worry about writing javascript and setting up a custom ajax call.  For the purpose of this documentation, I will be using an API provided by http://www.geonames.org. Register an account and provide your username in the examples.  The url will be "http://api.geonames.org/postalCodeLookupJSON".

Getting Started
=========
​
    To get started, download RestFulJS and the latest version of JQuery at http://jquery.com/download/. Include them in your HTML file.

     <script src="RestFulJS.min.js"></script>
     <script src="jquery.min.js"></script>

	After these two files are included, create a "rest-ful" tag in the body of your HTML.

	<rest-ful></rest-ful>

	Now that you have the "rest-ful" tag in your HTML, it is time to give your tag some attributes.  You will need to give your tag a url.  Add the attribute "data-rest-url" to your "rest-ful" tag.

	<rest-ful data-rest-url="<your-url-here>"></rest-ful>

	Once the tag has a url, you will be able to go to your html page and the "rest-ful" tag will call out to the specified url.  However, you will not see anything happen because we have not hooked up the "rest-ful" tag to display any data.  If you open your browser's console you should see a log that says "Before AJAX" and no errors.  If there are errors present in your console, it will most likely be a CORS (Cross-Origin) error. To fix this, you will need to add another attribute to the "rest-ful" tag.

	<rest-ful data-rest-url="<your-url-here>" data-rest-cross-domain="true"></rest-ful>

	So now that the "rest-ful" tag is working without errors, lets move on to some basic parameters.  The url http://api.geonames.org/postalCodeLookupJSON sends back zip codes based on the parameters you give it.  To add parameters to the "rest-ful" tag, put open and close brackets ( { } ) inside the "rest-ful" tag.  You can then add "postalcode" and "username" separated by a comma.  Any string in your parameters must have quotes around them.

	<rest-ful 
	data-rest-url="http://api.geonames.org/postalCodeLookupJSON" 
	data-rest-cross-domain="true">
	{
	     postalcode: 6600,
	     username: "<your-username-here>"
	}
	</rest-ful>

Handlebars Integration
=========
​
     "Handlebars provides the power necessary to let you build semantic templates effectively with no frustration." (http://handlebarsjs.com/) Handlebars is a way to create HTML templates and bind data to those templates. When integrated with RestFulJS, the data that is returned by the ajax call will be bound to your handlebars template.  To add Handlebars to the "rest-ful" tag you will need to first download the latest HandlebarsJS at http://handlebarsjs.com/ and then add these two attributes.

    data-rest-handlebars-template="<template-name>"
	data-rest-handlebars-content="<content-name>"

	You will then need to add a Handlebars script where the "id" of the script matches the name given in the "handlebars-template" attribute.  Another element is necessary for the Handlebars content.  The "id" of the element must match the "handlebars-content" attribute.

	<script id="<template-name>" type="text/x-handlebars-template">  
	{{#postalcodes}}   
	     <div>Postal Code:</div>   
	           <ul>    
	               <li>{{placeName}}</li>    
	               <li>{{postalcode}}</li>    
	               <li>{{countryCode}}</li>    
	               <li>{{lat}}</li>    
	               <li>{{lng}}</li>   
	          </ul>   
	     {{/postalcodes}}  
	</script>  
	<div id="<content-name>"> </div>

	Now, when you visit your HTML page, the "rest-ful" tag will bind the data that is returned to the Handlebars template and display the information inside the Handlebars content.	

Advanced
=========

	So far you have seen how to get started with RestFulJS and even how to integrate with Handlebars.  Hopefully, its been simple so far because it's about to get complicated.  Up until now, when you have been using the "rest-ful" tag, it has been using the default class "pull".  This default class means the "rest-ful" tag will make the ajax call when the Dom loads.  There is a second class for the "rest-ful" tag that allows the tag to wait for an action to occur. This class is the "send" class.  To change the class of your "rest-ful" tag, add the attribute

	data-rest-class="pull" OR data-rest-class="send"

	The purpose of this second class is to wait for input to allow for dynamic parameters.  So now, we are going to create a form that will bind the parameters from input tags to the "rest-ful" tag and send it off to our postalcode api.  Add the following code to your HTML file.

	Country Initials: <input data-rest-parameter="country">
	Zip Code: <input data-rest-parameter="postalcode">
	Username: <input data-rest-parameter="username">
	<button data-rest-action="click" data-rest-action-for="zipCodeForm">Submit</button>

	The value of the zip code parameter should look familar, but the postalcode api you have been using also allows you to specify the country initials (i.e. US = United States).  The new attribute

	data-rest-parameter

	specifies the name of the parameter to be set by this element.  Note, any parameters that you specify inside your "rest-ful" tag will be saved if there are more parameters from your HTML and all parameters will be used when the "rest-ful" tag makes the ajax call.  Lastly, we have the button element which has two new attributes.

	data-rest-action & data-rest-action-for

	These two attributes define the type of action listener (in this case, it listens for a click event) and the "rest-ful" tag name with action-for.  So now we have to add an attribute to our "rest-ful" tag.

	data-rest-name="zipCodeForm"

	The value of the action-for attribute must match the value of the rest-name attribute for the action to run the "rest-ful" tag.  Now that you know how to add parameters, you can repeat this for any api and any number of parameters.  Now the question is: what if you need the url or other "rest-ful" tag attributes to be dynamic like the parameters.  Well, you can add the attribute:

	data-rest-attribute="url"

	to any "input" tag.  Here is a list of attributes you can set:

	data-rest-attribute= "url", "type", "username", "password", "crossDomain", "isLocal", "timeout"

	Please note that the attribute "username" is different than the "username" parameter we have been passing to the api.  The "username" attribute is an ajax specific attribute and the "username" parameter is a query parameter.

	That's it!  You now have all the tools necessary to effectively use RestFulJS in any of your HTML pages for any of your ajax needs.  Now try all different kinds of configurations and different Rest api's.

Attribute & Parameter Reference
=========

	Attributes on "rest-ful" tag
		data-rest-class= "pull", "send"
		data-rest-name="<your-name-here>"
		data-rest-url="<your-url-here>"
		data-rest-type= "GET", "POST, "PUT", "DELETE"
		data-rest-username="<your-username-here>"
		data-rest-password="<your-password-here>"
		data-rest-cross-domain= "true", "false"
		data-rest-is-local= "true", "false"
		data-rest-timeout= "Number" in milliseconds
		data-rest-handlebars-template="<your-handlebars-template-name-here>"
		data-rest-handlebars-content="<your-handlebars-content-name-here>"
		data-rest-on-before="<your-before-ajax-name-here>"  Javascript Function
		data-rest-on-success="<your-succes-ajax-name-here>"  Javascript Function
		data-rest-on-error="<your-error-ajax-name-here>"  Javascript Function

	Attributes on other elements
		data-rest-attribute="<your-attribute-name-here>"
		data-rest-parameter="<your-parameter-name-here>"
		data-rest-get="<your-html-value-name-here>"  innerHTML, innerText, value Default is value
		data-rest-action="<your-action-name-here>" click, input, focus, blur, etc.
		data-rest-action-for="<your-rest-ful-tag-name-here>"

