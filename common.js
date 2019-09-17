
var page;
var language;
var languageFile;
var commonLanguageFile;
var errorMessagesLanguageFile;
var loadedSuccesfull = false;
var defaultPage = "home";
var defaultLanguage = "nl";

$( document ).ready(function() {
	
	common.firstLoad();
});

var common = (function() {
	
	//This variable will contain the public methods that are returned and can be accessed.
	var common = {};
	
	/*--ALL public methods in common:------------------------------------------------------------*/
	common.firstLoad = function() { firstLoad(); }
	common.changePage = function(newPage, additionalParameter) { changePage(newPage, additionalParameter); }
	common.changeLanguage = function(lang) { changeLanguage(lang); }
	common.getFieldLanguage = function(field) { return getFieldLanguage(field); }
	common.log = function(text) { log(text); }
	common.displayErrorMessage = function(file, fieldName) { displayErrorMessage(file, fieldName); }
	
	
	/*--Functions for the variables and URL----------------------------------------------------*/
	//Below here are import private functions used extensively in this javascript file.
	
	var firstLoad = function() {
		
		language = getURLLanguage();
	
		//The change page must be run before other functions.
		page = getURLPage();
		changePage(page);
		getUniversalLanguageFiles();
		setURL(page, language, getURLAdditional());
		updateFooterYear();
	}
	
	var setURL = function(page, lang, additional) {
		
		var url = new URL(window.location.href);
		
		url.searchParams.delete("lang");
		url.searchParams.delete("page");
		
		if(url.searchParams.get("additional"))
			url.searchParams.delete("additional");
		
		url.searchParams.append("lang", lang);
		url.searchParams.append("page", page);
		
		if(additional != null)
			url.searchParams.append("additional", additional);
		
		history.pushState("Page", "Page", url);
	}

	var getJSONFile = function(jsonFileName, functionToCall, functionToCallOptionalValue, optionalFunctionToCall) {
		
		$.ajax({ 
		url:  'language/' +  jsonFileName + '.json', 
		dataType: 'json', async: true, dataType: 'json', 
		success: function (file) { 
			log("language file: " + jsonFileName + " retrieved.");
			loadedSuccesfull = true;
			
			functionToCall(file, functionToCallOptionalValue);
			
			if(optionalFunctionToCall != null)
				optionalFunctionToCall(file);
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
			log("An error occured retrieving the language file: " + jsonFileName + ".");
			log(textStatus);
			log(errorThrown);
			loadedSuccesfull = false;
			
			displayErrorMessage(errorMessagesLanguageFile, "json-load-failed");
		}
		});
	}


	/*--Functions for changing the page----------------------------------------------------*/
	//This function will start the process of changing the page.
	//First it will retrieve the URL and remove the page parameter.
	//Second it will append the page parameter in the URL with the new page.
	//Third it will check if the page exist and load the corresponding HTML file into the .content div.
	//Final this function will call a function for the retrieval of the language files corresponding to this page 
	//and that function will display the data in it.
	var changePage = function(newPage, additionalParameter) {

		page = newPage;
		
		if(page == "home") {
			setURL(page, language, null);
			$('#content').load("home.html");
			loadPageContent("home", null, null); //Get the language file that belongs to this page with an optional JS function executed when loaded.
		}
		else if(page == "projects") {
			setURL(page, language, null);
			$('#content').load("projects.html");
			loadPageContent("projects", null, null); //pass the loadProjects function to call after the JSON has loaded.
			loadPageContent("projectsList", null, projects.load);
		}
		else if(page == "projectDetail") {
			setURL(page, language, additionalParameter);
			$('#content').load("project-detail.html");
			loadPageContent("projectDetail", null, loadProjectdetailFunction);
		}
		else if(page == "photography") {
			setURL(page, language, null);
			$('#content').load("photography.html");
			loadPageContent("photography", null, null);
		}
		else if(page == "aboutme") {
			setURL(page, language, null);
			$('#content').load("aboutme.html");
			loadPageContent("aboutme", null, null);
		}
		else if(page == "gallery") {
			setURL(page, language, null);
			$('#content').load("gallery.html");
			loadPageContent("gallery", "gallery-anchor", null);
		}
		else if(page == "ti") {
			setURL(page, language, null);
			$('#content').load("ti.html");
			loadPageContent("ti", null, null);
		}
		else {
			page = defaultPage;
			setURL(page, language, null);
			$('#content').load(defaultPage + ".html");
			loadPageContent(page, null, null);
		}
	}
	
	var loadPageContent = function(file, idToAppendContentTo, optionalSuccesFunction) { 
	
		getJSONFile(file, generateAndDisplayContent, idToAppendContentTo, optionalSuccesFunction); 
	}
		
	var generateAndDisplayContent = function(langFile, idToAppendContentTo) {
		
		languageFile = langFile;
		var generatedHTML = "";
		var content = langFile.content;
		
		
		//Display the default elements first.
		if(typeof langFile.tabTitle !== 'undefined')
			$(document).prop("title", getFieldLanguage(langFile.tabTitle));
		
		if(typeof langFile.pageTitle !== 'undefined')
			$("#lang_pageTitle").text(getFieldLanguage(langFile.pageTitle));
				
		//Loop through the content, generate HTML and display the HTML after the anchor.
		if(typeof langFile.content !== 'undefined') {
			
			for(var i = 0; i < Object.keys(content).length; i++) {
				
				generatedHTML = generatedHTML + getHTMLElement(content[i], i);
			}
		}
		
		//Fill the already present fields in the HTML file with data.
		//NOTE: this MUST be done AFTER the content is looped and the HTML is generated.
		//This is because during the generation of the HTML, elements with default field values can be added to the HTML.
		if(typeof langFile.fields !== 'undefined') {
			
			var fields = langFile.fields;
			
			for(var i = 0; i < Object.keys(fields).length; i++) {
					
				fieldName = "#" + fields[i].name;
				$(fieldName).text(getFieldLanguage(fields[i]));
			}
		}
		
		$(generatedHTML).insertAfter("#" + idToAppendContentTo);
	}
	
	var getHTMLElement = function(content, elemCounter) {
		
		var elem = "";
		var elementType = content.type;
		var elemClass = content.class;
		var elemOnClick = content.onClick;
		
		var id = " id='" + getElementId(elemCounter) + "'";
		
		if(elemClass != "")
			elemClass = " class='" + elemClass + "'";
		
		if(elemOnClick != "")
			elemOnClick = " onClick='" + elemOnClick + "'";
		
		
		if(elementType == "div-parent")
			elem = "<div" + id + elemClass + elemOnClick + ">" + getNestedElements(content, elemCounter) + "</div>";
		else if(elementType == "span-parent")
			elem = "<span" + id + elemClass + elemOnClick + ">" + getNestedElements(content, elemCounter) + "</span>";
		else if(elementType == "div")
			elem = "<div" + id + "'" + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</div>";
		else if(elementType == "span")
			elem = "<span" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</span>";
		else if(elementType == "paragraph")
			elem = "<p" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</p>";
		else if(elementType == "image")
			elem = "<img" + id + elemClass + elemOnClick + " src='" + content.path + "'/>";
		else if(elementType == "header1")
			elem = "<h1" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</h1>";
		else if(elementType == "header2")
			elem = "<h2>" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</h2>";
		else if(elementType == "header3")
			elem = "<h3" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</h3>";
		
		return elem;
	}
	
	var getNestedElements = function(content, elemId) {
		
		var elem = "";
		var id = "";
			
		for(var i = 0; i < Object.keys(content).length; i++) {
			
			id = elemId + "_" + i;
			elem = elem + getHTMLElement(content[i], id);
		}
		
		return elem;
	}
	
	var getElementId = function(elemId) {
		
		return "lang_" + page + "_" + elemId;
	}


	/*---Functions for changing the language----------------------------------------------------*/
	//This function is the main function to start the process of changing the language on a page.
	//This function should NOT be called when a page loads.
	var changeLanguage = function(lang) {
		
		language = lang;
		
		displayLanguage(commonLanguageFile);
		displayLanguage(languageFile);
		changeURLLanguage();
	}
	
	var displayLanguage = function(langFile) {
		
		if(typeof langFile.tabTitle !== 'undefined')
			$(document).prop("title", getFieldLanguage(langFile.tabTitle));
		
		if(typeof langFile.pageTitle !== 'undefined')
			$("#lang_pageTitle").text(getFieldLanguage(langFile.pageTitle));
		
		if(typeof langFile.content !== 'undefined')
			displayContent(langFile.content);
		
		if(typeof langFile.fields !== 'undefined') {
			
			var fields = langFile.fields;
			
			for(var i = 0; i < Object.keys(fields).length; i++) {
					
				fieldName = "#" + fields[i].name;
				$(fieldName).text(getFieldLanguage(fields[i]));
			}
		}
	}
	
	var displayContent = function(content) {
		
		var elem;
		
		for(var i = 0; i < Object.keys(content).length; i++) {
			
			displayElement(content[i], i);
		}
	}
	
	var displayElement = function(elem, id) {
			
		if(elem.type == "div-parent" || elem.type == "span-parent") {
			
			for(var j = 0; j < Object.keys(elem.content).length; j++) {
				
				displayElement(elem.content[j], (id + "_" + j));
			}
		}
		else if(elem.type == "image") {
			//Do Nothing images are not different in other languages...
		}
		else {
			$(("#" + getElementId(id))).text(getFieldLanguage(elem));
		}	
	}
	
	//This function gets the selected language from the field in the JSON. 
	//This function also checks if the field is empty and will return a default value when it is.
	var getFieldLanguage = function(field) {
		
		if(language == "nl") {
			
			if(field.nl == "")
				return "Er is op dit moment geen Nederlandse vertaling beschikbaar.";
			else
				return field.nl;
		}
		else if(language == "en") {
			
			if(field.en == "")
				return "There is currently no English translation available.";
			else
				return field.en;
		}
		else {
			log("ERROR: loading the requested language. The requested language does not exist! Loading default language instead.");
			changeLanguage(defaultLanguage);
		}
	}

	var getURLLanguage = function() {
			
		var url = new URL(window.location.href);
		
		if(url.searchParams.get("language"))
			return url.searchParams.get("language");
		else
			return defaultLanguage;
	}

	var changeURLLanguage = function() {
		
		setURL(page, language, getURLAdditional());
	}
	
	var getUniversalLanguageFiles = function() {
		
		getJSONFile("common", setCommonLanguageFile, null, displayLanguage);
		getJSONFile("errorMessages", setErrorMessagesLanguageFile, languageFile, null);
	}
	
	var setCommonLanguageFile = function(langFile) { commonLanguageFile = langFile; }
	var setErrorMessagesLanguageFile = function(langFile) { errorMessageLanguageFile = langFile; }


	/*---Other functions---------------------------------------------------------------------------------------------------*/

	var updateFooterYear = function() {
		
		$("#year_footer").text(getYearString());
	}

	var getYearString = function() {
		
		var date = new Date();
		return date.getFullYear().toString();
	}
	
	var getURLPage = function() {
			
		var url = new URL(window.location.href);
		
		if(url.searchParams.get("page"))
			return url.searchParams.get("page");
		else
			return defaultPage;
	}

	var getURLAdditional = function() {
			
		var url = new URL(window.location.href);
		
		if(url.searchParams.get("additional"))
			return url.searchParams.get("additional");
		else
			return null;
	}

	var log = function(text) {
		
		console.log(text);
	}

	var displayErrorMessage = function(file, fieldName) {
		
		log("ERROR: " + fieldName);
		/*
		errorMessagesLanguageFile = file;
		
		log("fieldname: " + fieldName);
		
		var message;
		
		if(typeof errorMessagesLanguageFile === 'object') {
			
			var match = false;
			
			for(var i = 0; i < Object.keys(errorMessagesLanguageFile).length; i++) {
				
				if(errorMessageLanguageFile.i.name == fieldName) {
					log("FieldJson: " +  errorMessageLanguageFile.i.name);
					message = getYearString(errorMessagesLanguageFile.i);
					match = true;
				}
			}
			
			if(match == false)
				log("Error message not found. Something went wrong but the error could not be displayed.");
		}
		else {
			
			log("Empty so get file");
			getJSONFile("errorMessages", displayErrorMessage, fieldName, null);
		}
		
		$("#content").html("<p id='errorMessage'>" + message + "</p>");
		log(message);
		*/
	}
	
	
	//After all methods are added, return the public ones.
	return common;
})();