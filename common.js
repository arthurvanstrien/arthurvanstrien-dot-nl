
var page;
var language;
var errorMessagesLanguageFile;
var loadedSuccesfull = false;
var defaultPage = "home";
var defaultLanguage = "nl";

$( document ).ready(function() {
	
	language = getURLLanguage();
	
	//The change page must be run before other functions.
	page = getURLPage();
	changePage(page);
	
	getCommonLanguageFile();
	getErrorMessageLanguageFile();
	
	setURL(page, language, getURLAdditional());
	
	updateFooterYear();
});

/*--Functions for the variables and URL----------------------------------------------------*/
//Below here two important common functions that are likely to be changed when pages are added.
function resetVariables() {
	
	loadedSuccesfull = false;
}

function setURL(page, lang, additional) {
	
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

function getJSONFile(jsonFileName, functionToCall, functionToCallOptionalValue, optionalFunctionToCall) {
	
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
//Second it will append the page parameter in the URL with the loaded page.
//Third it will check if the page exist and load the corresponding HTML file into the .content div.
//Final this function will call a function for the retrieval of the language files corresponding to this page.
function changePage(newPage, additionalParameter) {
	
	resetVariables();
	page = newPage;
	
	if(page == "home") {
		setURL(page, language, null);
		$('#content').load("home.html");
		getLanguageFile(null); //Get the language file that belongs to this page with an optional JS function executed when loaded.
	}
	else if(page == "projects") {
		setURL(page, language, null);
		$('#content').load("projects.html");
		getLanguageFile(loadProjectsFunction); //pass the loadProjects function to call after the JSON has loaded.
	}
	else if(page == "project-detail") {
		setURL(page, language, additionalParameter);
		$('#content').load("project-detail.html");
		getLanguageFile(loadProjectdetailFunction);
	}
	else if(page == "photography") {
		setURL(page, language, null);
		$('#content').load("photography.html");
		getLanguageFile(null);
	}
	else if(page == "aboutme") {
		setURL(page, language, null);
		$('#content').load("aboutme.html");
		getLanguageFile(null);
	}
	else if(page == "gallery") {
		setURL(page, language, null);
		$('#content').load("gallery.html");
		getLanguageFile(null);
	}
	else if(page == "ti") {
		setURL(page, language, null);
		$('#content').load("ti.html");
		getLanguageFile(null);
	}
	else {
		page = defaultPage;
		setURL(page, language, null);
		$('#content').load(defaultPage + ".html");
		getLanguageFile(null);
	}
}

//This function gets the value of the lang parameter from the URL.
function getURLPage() {
		
	var url = new URL(window.location.href);
	
	if(url.searchParams.get("page"))
		return url.searchParams.get("page");
	else
		return defaultPage;
}

function getURLAdditional() {
		
	var url = new URL(window.location.href);
	
	if(url.searchParams.get("additional"))
		return url.searchParams.get("additional");
	else
		return null;
}


/*---Functions for changing the language----------------------------------------------------*/
//This function is the main function to start the process of changing the language on a page.
//This function should NOT be called when a page loads.
function changeLanguage(lang) {
	
	language = lang;
	displayLanguage(commonLanguageFile, false);
	displayLanguage(languageFile, true);
	changeURLLanguage();
}

function getURLLanguage() {
		
	var url = new URL(window.location.href);
	
	if(url.searchParams.get("language"))
		return url.searchParams.get("language");
	else
		return defaultLanguage;
}

function changeURLLanguage() {
	
	setURL(page, language, getURLAdditional());
}

function getLanguageFile(optionalSuccesFunction) {
	
	getJSONFile(page, displayLanguage, true, optionalSuccesFunction);
}

function getCommonLanguageFile() {

	getJSONFile("common", displayLanguage, false, null);
}

function getErrorMessageLanguageFile() {
	
	getJSONFile("errorMessages", setErrorMessageLanguageFile, false, null);
}

function setErrorMessageLanguageFile(langFile) {
	
	errorMessagesLanguageFile = langFile;
}

function displayLanguage(langFile, changeTitle) {
	
	//In case the onload failed another attempt is made when the language is switched.
	if(loadedSuccesfull == false) {
		
		log("ERROR: Loaded successfull was false. Loading default page instead.");
		changePage(page); //Start process from beginning in case the user changed the page name. This will check if the page name exists and load defaults if not.
	}
	else {
	
		var fieldName;
		var fields = langFile.fields;
		
		for(var i = 0; i < Object.keys(langFile.fields).length; i++) {
			
			fieldName = "#" + fields[i].name;
			$(fieldName).text(getFieldLanguage(fields[i]));
		}
		
		if(changeTitle) {
			
			if(language == "nl")
				$(document).prop("title", langFile.tabTitle.nl);
			else if(language == "en")
				$(document).prop("title", langFile.tabTitle.en);
		}
	}
}

//This function gets the selected language from the field in the JSON. 
//This function also checks if the field is empty and will return a default value when it is.
function getFieldLanguage(field) {
	
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

/*---Common functions--------------------------------------------------------------*/

function updateFooterYear() {
	
	$("#year_footer").text(getYearString());
}

function getYearString() {
	
	var date = new Date();
	return date.getFullYear().toString();
}

function log(text) {
	
	console.log(text);
}

function displayErrorMessage(file, fieldName) {
	
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

