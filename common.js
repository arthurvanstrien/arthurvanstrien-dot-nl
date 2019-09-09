
var page;
var language;
var errorMessagesLanguageFile;
var defaultPage = "home";
var defaultLanguage = "nl";

$( document ).ready(function() {
	
	language = com_getURLLanguage();
	
	//The change page must be run before other functions.
	page = com_getURLPage();
	com_changePage(page);
	
	com_getCommonLanguageFile();
	com_getErrorMessageLanguageFile();
	
	com_setURL(page, language, com_getURLAdditional());
	
	com_updateFooterYear();
});

/*--Functions for the variables and URL----------------------------------------------------*/
//Below here two important common functions that are likely to be changed when pages are added.

function com_setURL(page, lang, additional) {
	
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

function com_getJSONFile(jsonFileName, functionToCall, functionToCallOptionalValue, optionalFunctionToCall) {
	
	$.ajax({ 
	url:  'language/' +  jsonFileName + '.json', 
	dataType: 'json', async: true, dataType: 'json', 
	success: function (file) { 
		com_log("language file: " + jsonFileName + " retrieved.");
		
		functionToCall(file, functionToCallOptionalValue);
		
		if(optionalFunctionToCall != null)
			optionalFunctionToCall(file);
		
	},
	error: function (jqXHR, textStatus, errorThrown) {
		log("An error occured retrieving the language file: " + jsonFileName + ".");
		log(textStatus);
		log(errorThrown);
		
		com_displayErrorMessage(errorMessagesLanguageFile, "json-load-failed");
	}
	});
}


/*--Functions for changing the page----------------------------------------------------*/
//This function will start the process of changing the page.
//First it will retrieve the URL and remove the page parameter.
//Second it will append the page parameter in the URL with the loaded page.
//Third it will check if the page exist and load the corresponding HTML file into the .content div.
//Final this function will call a function for the retrieval of the language files corresponding to this page.
function com_changePage(newPage, additionalParameter) {
	
	page = newPage;
	
	if(page == "home") {
		com_setURL(page, language, null);
		$('#content').load("home.html");
		com_getLanguageFile(null); //Get the language file that belongs to this page with an optional JS function executed when loaded.
	}
	else if(page == "projects") {
		com_setURL(page, language, null);
		$('#content').load("projects.html");
		com_getLanguageFile(loadProjectsFunction); //pass the loadProjects function to call after the JSON has loaded.
	}
	else if(page == "project-detail") {
		com_setURL(page, language, additionalParameter);
		$('#content').load("project-detail.html");
		com_getLanguageFile(loadProjectdetailFunction);
	}
	else if(page == "photography") {
		com_setURL(page, language, null);
		$('#content').load("photography.html");
		com_getLanguageFile(null);
	}
	else if(page == "aboutme") {
		com_setURL(page, language, null);
		$('#content').load("aboutme.html");
		com_getLanguageFile(null);
	}
	else if(page == "gallery") {
		com_setURL(page, language, null);
		$('#content').load("gallery.html");
		com_getLanguageFile(null);
	}
	else if(page == "ti") {
		com_setURL(page, language, null);
		$('#content').load("ti.html");
		com_getLanguageFile(null);
	}
	else {
		page = defaultPage;
		com_setURL(page, language, null);
		$('#content').load(defaultPage + ".html");
		com_getLanguageFile(null);
	}
}

//This function gets the value of the lang parameter from the URL.
function com_getURLPage() {
		
	var url = new URL(window.location.href);
	
	if(url.searchParams.get("page"))
		return url.searchParams.get("page");
	else
		return defaultPage;
}

function com_getURLAdditional() {
		
	var url = new URL(window.location.href);
	
	if(url.searchParams.get("additional"))
		return url.searchParams.get("additional");
	else
		return null;
}


/*---Functions for changing the language----------------------------------------------------*/
//This function is the main function to start the process of changing the language on a page.
//This function should NOT be called when a page loads.
function com_changeLanguage(lang) {
	
	language = lang;
	com_displayLanguageFields(commonLanguageFile, false);
	com_displayLanguageFields(languageFile, true);
	com_changeURLLanguage();
}

function com_getURLLanguage() {
		
	var url = new URL(window.location.href);
	
	if(url.searchParams.get("language"))
		return url.searchParams.get("language");
	else
		return defaultLanguage;
}

function com_changeURLLanguage() {
	
	com_setURL(page, language, getURLAdditional());
}

function com_getLanguageFile(optionalSuccesFunction) {
	
	com_getJSONFile(page, com_displayLanguageFields, true, optionalSuccesFunction);
}

function com_getCommonLanguageFile() {

	com_getJSONFile("common", com_displayLanguageFields, false, null);
}

function com_getErrorMessageLanguageFile() {
	
	com_getJSONFile("errorMessages", com_setErrorMessageLanguageFile, false, null);
}

function com_setErrorMessageLanguageFile(langFile) {
	
	errorMessagesLanguageFile = langFile;
}

function com_displayLanguageFields(langFile, changeTitle) {
	
	if(typeof langFile === 'object') {
		
		var fieldName;
		var fields = langFile.fields;
		
		for(var i = 0; i < Object.keys(langFile.fields).length; i++) {
			
			fieldName = "#" + fields[i].name;
			$(fieldName).text(com_getFieldLanguage(fields[i]));
		}
		
		if(changeTitle) {
			
			if(language == "nl")
				$(document).prop("title", langFile.tabTitle.nl);
			else if(language == "en")
				$(document).prop("title", langFile.tabTitle.en);
		}
	}
	else {
		
		com_log("ERROR: There was a problem loading the language file.");
		//TODO open ERROR page.
	}
}

//This function gets the selected language from the field in the JSON. 
//This function also checks if the field is empty and will return a default value when it is.
function com_getFieldLanguage(field) {
	
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
		com_log("ERROR: loading the requested language. The requested language does not exist! Loading default language instead.");
		com_changeLanguage(defaultLanguage);
	}
}

/*---Common functions--------------------------------------------------------------*/

function com_updateFooterYear() {
	
	$("#year_footer").text(com_getYearString());
}

function com_getYearString() {
	
	var date = new Date();
	return date.getFullYear().toString();
}

function com_log(text) {
	
	console.log(text);
}

function com_displayErrorMessage(file, fieldName) {
	
	com_log("ERROR: " + fieldName);
	/*
	errorMessagesLanguageFile = file;
	
	com_log("fieldname: " + fieldName);
	
	var message;
	
	if(typeof errorMessagesLanguageFile === 'object') {
		
		var match = false;
		
		for(var i = 0; i < Object.keys(errorMessagesLanguageFile).length; i++) {
			
			if(errorMessageLanguageFile.i.name == fieldName) {
				com_log("FieldJson: " +  errorMessageLanguageFile.i.name);
				message = com_getYearString(errorMessagesLanguageFile.i);
				match = true;
			}
		}
		
		if(match == false)
			com_log("Error message not found. Something went wrong but the error could not be displayed.");
	}
	else {
		
		com_log("Empty so get file");
		com_getJSONFile("errorMessages", displayErrorMessage, fieldName, null);
	}
	
	$("#content").html("<p id='errorMessage'>" + message + "</p>");
	com_log(message);
	*/
}

