

$( document ).ready(function() {
	
	common.firstLoad();
	
	//This event listener detects an URL change when for example the browser back button is pressed.
	window.addEventListener('popstate', function(event) {
		// The popstate event is fired each time when the current history entry changes.
		
		common.changePage(common.getURLPage(), common.getURLAdditional(), null);

	}, false);
});

var common = (function() {
	
	var page;
	var language;
	var languageFile;
	var commonLanguageFile;
	var additionalLanguageFile;
	var customLanguageFunction;
	var errorMessagesLanguageFile;
	var defaultPage = "home";
	var defaultLanguage = "nl";
	var errorLoopDetection = false;
	var previousPage;
	
	//This variable will contain the public methods that are returned and can be accessed.
	var common = {};
	
	/*--ALL public methods in common:------------------------------------------------------------*/
	common.firstLoad = function() { firstLoad(); }
	common.changePage = function(newPage, additionalURLParam, additionalData) { changePage(newPage, additionalURLParam, additionalData); }
	common.changeLanguage = function(lang) { changeLanguage(lang); }
	common.getFieldLanguage = function(field) { return getFieldLanguage(field); }
	common.log = function(text) { log(text); }
	common.displayErrorMessage = function(fieldName) { displayErrorMessage(fieldName); }
	common.getHTMLElement = function(content, elemCounter) { return getHTMLElement(content, elemCounter); }
	common.displayContent = function(langFile) { displayContent(langFile); }
	common.generateAndDisplayContent = function(langFile, idToAppendContentTo) { generateAndDisplayContent(langFile, idToAppendContentTo); }
	common.getJSONFile = function(jsonFileName, funcToCall, funcToCallOptionalParam, optionalFuncToCall, optionalFuncToCallOptionalParam) {
		getJSONFile(jsonFileName, funcToCall, funcToCallOptionalParam, optionalFuncToCall, optionalFuncToCallOptionalParam);
	}
	
	common.setAdditionalLanguageFile = function(langFile) { setAdditionalLanguageFile(langFile); }
	common.getAdditionalLanguageFile = function() { return getAdditionalLanguageFile(); }
	
	common.getURLPage = function() { return getURLPage(); }
	common.getURLLanguage = function() { return getURLLanguage(); }
	common.getURLPrev = function() { return getURLPrev(); }
	common.getURLAdditional = function() { return getURLAdditional(); }
	
	
	
	/*--Important functions that are commonly used-------------------------------------------------------------------------------------------------*/
	//Below here are import private functions used extensively in this javascript file.
	
	var firstLoad = function() {
		
		//Call the functions that get the language and page from the URL or return their default values.
		language = getURLLanguage();
		page = getURLPrev(); //The changePage function always sets the page variable as the previouspage.
		
		//The change page must be run before other functions.
		//When the page is set, the URL is also changed.
		changePage(getURLPage(), getURLAdditional(), null);
		
		//Get the universal language files that are used on every page.
		getJSONFile("common", setCommonLanguageFile, null, displayContent, null);
		getJSONFile("errorMessages", setErrorMessagesLanguageFile, languageFile, null, null);
		
		//Call the function that makes sure the footer always displays the current year.
		//I just don't want to update the website the first day of every year just to change the year in the footer.
		updateFooterYear();
	}

	var getJSONFile = function(jsonFileName, funcToCall, funcToCallOptionalParam, optionalFuncToCall, optionalFuncToCallOptionalParam) {
		
		$.ajax({ 
		url:  'language/' +  jsonFileName + '.json', 
		dataType: 'json', async: true, dataType: 'json', 
		success: function (file) { 
			log("language file: " + jsonFileName + " retrieved.");
			
			funcToCall(file, funcToCallOptionalParam);
			
			if(optionalFuncToCall != null)
				optionalFuncToCall(file, optionalFuncToCallOptionalParam);
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
			log("An error occured retrieving the language file: " + jsonFileName + ".");
			log(textStatus);
			log(errorThrown);
			
			displayErrorMessage("json-load-failed");
		}
		});
	}




	/*--Functions for changing the page------------------------------------------------------------------------------------------------------------*/
	//This function will start the process of changing the page.
	//First it will retrieve the URL and remove the page parameter.
	//Second it will append the page parameter in the URL with the new page.
	//Third it will check if the page exist and load the corresponding HTML file into the .content div.
	//Final this function will call a function for the retrieval of the language files corresponding to this page 
	//and that function will display the data in it.
	//
	//This function wil also set all the options for the page, this includes:
	// - If the URL should contain an additional URL parameter.
	// - What HTML file should be loaded in the content div.
	// - What page content should be loaded with the following parameters:
	//	1. The name of the JSON file (without .json)
	//	2. The ID of the HTML element where the JSON content element data should be appended to.
	//	3. An optional function that is called when the JSON file is loaded.
	//	4. The option to pass addional data to the optional function from above.
	// - Optional: Some pages need to load an additional JSON file, code contains another loadPageContent or getJSONFile.
	// - customLanguageFunction, if the JSON file contains data that cannot be displayed with the universal functions, 
	//	 a custom function can be set here. This function should be located in the js file corresponding with the page and be called "changeLanguage".
	
	var changePage = function(newPage, additionalURLParam, additionalData) {
		
		previousPage = page;
		page = newPage;
		
		if(page == "home") {
			
			setURL(page, previousPage, language, null);
			$('#content').load("home.html", function() {
				
				loadPageContent("home", "home-anchor", null, null); //Get the language file that belongs to this page with an optional JS function executed when loaded.
				customLanguageFunction = null;
			});
		}
		else if(page == "projects") {
			
			setURL(page, previousPage, language, null);
			$('#content').load("projects.html", function() {
				
				loadPageContent("projects", "projects-anchor", null, null); 
				getJSONFile("projectsList", projects.load, null, null, null); //pass the loadProjects function to call after the JSON has loaded.
				customLanguageFunction = projects.changeLanguage;
			});
		}
		else if(page == "projectDetail") {
			
			setURL(page, previousPage, language, additionalURLParam);
			$('#content').load("projectDetail.html", function() {
				
				loadPageContent("projectDetail", "projectDetail-anchor", projectDetail.load, additionalData);
				customLanguageFunction = projectDetail.changeLanguage;
			});
		}
		else if(page == "article")
		{
			var articleFile = null;
			
			setURL(page, previousPage, language, additionalURLParam);
			$('#content').load("article.html", function() {
				
				loadPageContent("article", "article-anchor", null, null);
				
				if(previousPage == "engineerTech")
					articleFile = "engineerTechArticles";
				

				if(articleFile == null)
					changePage("404", null, null);
				else {
					
					article.load(articleFile, "article-anchor", additionalData);
					customLanguageFunction = article.changeLanguage;
				}
			});
		}
		else if(page == "photography") {
			
			setURL(page, previousPage, language, null);
			$('#content').load("photography.html", function() {
				
				loadPageContent("photography", "photography-anchor", null, null);
				customLanguageFunction = null;
			});
		}
		else if(page == "aboutme") {
			
			setURL(page, previousPage, language, null);
			$('#content').load("aboutme.html", function() {
				
				loadPageContent("aboutme", "aboutme-anchor", null, null);
				customLanguageFunction = null;
			});
		}
		else if(page == "gallery") {
			
			setURL(page, previousPage, language, null);
			$('#content').load("gallery.html", function() {
			
				loadPageContent("gallery", "gallery-anchor", null, null);
				customLanguageFunction = null;
			});
		}
		else if(page == "engineerTech") {
			
			setURL(page, previousPage, language, null);
			$('#content').load("engineerTech.html", function() {
				
				loadPageContent("engineerTech", "engineer-tech-anchor", null, null);
				loadPageContent("engineerTechArticles", "engineer-tech-anchor", setAdditionalLanguageFile, null);
				customLanguageFunction = engineerTech.changeLanguage;
			});
		}
		else if(page == "404") {
			
			setURL(page, previousPage, language, null);
			$('#content').load("404.html", function() {
				
				loadPageContent("404", "404-anchor", null, null);
				customLanguageFunction = null;
			});
		}
		else
		{
			changePage("404", null, null);
		}
	}
	
	
	
	
	//The function loadPageContent is made to load the content in the default JSON file that belongs to the page.
	//This function can not be used to load additional JSON files with content.
	//For loading additional JSON files, please use the getJSONFile function and displayContent function.
	var loadPageContent = function(file, idToAppendContentTo, optionalSuccesFunc, optionalSuccesFuncData) { 
	
		getJSONFile(file, generateAndDisplayContent, idToAppendContentTo, optionalSuccesFunc, optionalSuccesFuncData); 
	}
		
	var generateAndDisplayContent = function(langFile, idToAppendContentTo) {
		
		languageFile = langFile;
		var content = langFile.content;
		
		//Display the default elements first.
		if(typeof langFile.tabTitle !== 'undefined')
			$(document).prop("title", getFieldLanguage(langFile.tabTitle));
		
		if(typeof langFile.title !== 'undefined')
			$("#lang_pageTitle").text(getFieldLanguage(langFile.title));
				
		//Loop through the content, generate HTML and display the HTML after the anchor.
		if(typeof langFile.content != 'undefined') {
			
			var generatedHTML = "";
			
			for(var i = 0; i < Object.keys(content).length; i++) {
				
				generatedHTML = generatedHTML + getHTMLElement(content[i], i, 0);
			}
			
			$(generatedHTML).insertAfter("#" + idToAppendContentTo);
		}
		
		//Fill the already present fields in the HTML file with data.
		//NOTE: this MUST be done AFTER the content is looped and the HTML is inserted!
		//This is because during the generation of the HTML, elements with default field values can be added to the HTML.
		if(typeof langFile.fields !== 'undefined') {
			
			var fields = langFile.fields;
			
			for(var i = 0; i < Object.keys(fields).length; i++) {
					
				fieldName = "#" + fields[i].name;

				
				$(fieldName).html($.parseHTML(getFieldLanguage(fields[i])));
			}
		}
	}
	
	var getHTMLElement = function(content, elemCounter, nestedLevel) {
		
		var elem = "";
		var elementType = content.type;
		var elemClass = content.class;
		var elemOnClick = content.onClick;
		
		var id = " id='" + getElementId(elemCounter) + "'";
		
		if(elemOnClick != "")
			elemOnClick = " onClick='" + elemOnClick + "'";
		
		
		if(elementType == "div-parent") {
			
			if(elemClass == null || elemClass == "")
				elemClass = "";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<div" + id + elemClass + elemOnClick + ">" + getNestedElements(content, elemCounter, nestedLevel) + "</div>";
		}
		else if(elementType == "span-parent") {
			
			if(elemClass == null || elemClass == "")
				elemClass = "";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<span" + id + elemClass + elemOnClick + ">" + getNestedElements(content, elemCounter, nestedLevel) + "</span>";
		}
		else if(elementType == "div") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-div'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<div" + id + "'" + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</div>";
		}
		else if(elementType == "span") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-span'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<span" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</span>";
		}
		else if(elementType == "paragraph") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-paragraph'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<p" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</p>";
		}
		else if(elementType == "image") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-pictureHalfLeft'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<img" + elemClass + elemOnClick + " src='" + content.path + "'/>";
		}
		else if(elementType == "header1") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-h1'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<h1" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</h1>";
		}
		else if(elementType == "header2") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-h2'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<h2" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</h2>";
		}
		else if(elementType == "header3") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-h3'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<h3" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</h3>";
		}
		else if(elementType == "listItem") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-listItem'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<table class='shared-content-listItemWrapper'><tr><td class='shared-content-listItemDash'>-</td><td" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content) + "</td></tr></table>";
		}
		else if(elementType == "table") {
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-table'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<table " + elemClass + elemOnClick + ">";
			
			if(content.rowHeaders != null && content.rowHeaders != "") {
				
				elem = elem + "<tr>"; 
				
				for(var i = 0; i < Object.keys(content.rowHeaders).length; i++) {
					
					elem = elem + "<th>" + getFieldLanguage(content.rowHeaders[i]) + "</th>";
				}
				
				elem = elem + "</tr>";
			}
			
			for(var i = 0; i < Object.keys(content.rowData).length; i++) {
				
				elem = elem + "<tr>";
				
				for(var j = 0; j < Object.keys(content.rowData[i]).length; j++) {
					
					elem = elem + "<td>" + getFieldLanguage(content.rowData[i][j]) + "</td>";
				}
				
				elem = elem + "<tr>";
			}
			
			elem = elem + "</table>";
		}
		else if(elementType == "articleGroup") {
			//This generates the menu for an article.
			
			//0 means no menu is being generated.
			//The article group is only generated when a menu is made, in case it is 0, we are starting a new menu.
			//Therefore the level is set to menu level 1. In case it is higher than 0, we generate a higher level.
			nestedLevel++;
			
			if(elemClass == "" || elemClass == null)
				elemClass = " class='shared-content-articleGroup'";
			else
				elemClass = " class='" + elemClass + "'";
			
			elem = "<div" + elemClass + elemOnClick + ">";
			
			
			if(nestedLevel == 1)
				elem = elem + "<h1" + id + ">" + getFieldLanguage(content.title) + "</h1>";
			else if(nestedLevel == 2)
				elem = elem + "<h2" + id + ">" + getFieldLanguage(content.title) + "</h2>";
			else if(nestedLevel == 3)
				elem = elem + "<h3" + id + ">" + getFieldLanguage(content.title) + "</h3>";
			else if(nestedLevel == 4)
				elem = elem + "<h4" + id + ">" + getFieldLanguage(content.title) + "</h4>";
			else if(nestedLevel == 5)
				elem = elem + "<h5" + id + ">" + getFieldLanguage(content.title) + "</h5>";
			else
				elem = elem + "<h6" + id + ">" + getFieldLanguage(content.title) + "</h6>";
			
			
			for(var i = 0; i < Object.keys(content.content).length; i++) {
				
				elemCounter = elemCounter + "_" + i;
				elem = elem + getHTMLElement(content.content[i], elemCounter, nestedLevel)
			}
			
			elem = elem + "</div>";
		}
		else if(elementType == "article") {
			
			if(nestedLevel > 0) {
				//Generate the link to the article instead of rendering the article.
				
				if(elemClass == "" || elemClass == null)
					elemClass = " class='shared-content-articleLink'";
				else
					elemClass = " class='" + elemClass + "'";
				
				elemOnClick = " onClick='common.changePage(\"article\", \"" + content.articleId + "\", \"" + elemCounter + "\")'";
				
				elem = "<span" + id + elemClass + elemOnClick + ">" + getFieldLanguage(content.title) + "</span>";
			}
			else {
				//Generate the article.
				
				if(elemClass == "" || elemClass == null)
					elemClass = "class='shared-content-article' ";
				else
					elemClass = " class='" + elemClass + "'";
				
				for(var i = 0; i < Object.keys(content.content).length; i++) {
				
					counter = elemCounter + "_" + i;
					elem = elem + getHTMLElement(content.content[i], counter, nestedLevel)
				}
			}
		}
		else if(elementType == "youtubeVideo") {
			
			var id = "id='" + content.id + "'";
			var youtubeSource = "src='https://www.youtube-nocookie.com/embed/" + content.videoId + "?controls=0'";
			var youtubeSettings = "allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'";
			elem = "<iframe " + id + " " + youtubeSource + " frameborder='0' " + youtubeSettings + " allowfullscreen></iframe>";
		}
		
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
	
	
	
		
	/*---Functions for displaying the content WITHOUT rendering elements first---------------------------------------------------------------------*/
	//This functions should be used when the page HTML is already generated or the page is build from existing elements that are not -
	//generated by javascript code first.
	//NOTE: this code should be run AFTER the elements are rendered, otherwise the code cannot find the ID in the HTML that corresponts -
	//with the ID from the JSON.
	var displayContent = function(langFile) {
		
		if(typeof langFile.tabTitle !== 'undefined')
			$(document).prop("title", getFieldLanguage(langFile.tabTitle));
		
		if(typeof langFile.title !== 'undefined')
			$("#lang_pageTitle").text(getFieldLanguage(langFile.title));
		
		if(typeof langFile.content !== 'undefined') {
			
			for(var i = 0; i < Object.keys(langFile.content).length; i++) {
			
				displayElement(langFile.content[i], i);
			}
		}
		
		if(typeof langFile.fields !== 'undefined') {
			
			var fields = langFile.fields;
			
			for(var i = 0; i < Object.keys(fields).length; i++) {
					
				fieldName = "#" + fields[i].name;
				
				$(fieldName).html(getFieldLanguage(fields[i]));
			}
		}
	}
	
	var displayElement = function(elem, id) {
			
		if(elem.type == "div-parent" || elem.type == "span-parent" || elem.type == "articleGroup") {
			
			for(var j = 0; j < Object.keys(elem.content).length; j++) {
				
				displayElement(elem.content[j], (id + "_" + j));
			}
		}
		else if(elem.type == "image") {
			//Do Nothing images are not different in other languages...
		}
		else {
			$(("#" + getElementId(id))).html(getFieldLanguage(elem));
		}	
	}




	/*---Functions for changing the language-------------------------------------------------------------------------------------------------------*/
	//This function is the main function to start the process of changing the language on a page.
	//This function should NOT be called when a page loads.
	var changeLanguage = function(lang) {
		
		language = lang;
		
		displayContent(commonLanguageFile);
		displayContent(languageFile);
		
		//The customLanguageFunction is a function that changes the language from a custom JSON part.
		//This function is set in the changePage function and the custom function should be located in the js file corresponding with the page name.
		if(customLanguageFunction != null && customLanguageFunction != "") {
			customLanguageFunction(additionalLanguageFile);
		}
		
		setURL(page, previousPage, language, getURLAdditional());
	}
	
	//This function gets the selected language from the field in the JSON. 
	//This function also checks if the field is empty and will return a default value when it is.
	var getFieldLanguage = function(field) {
		
		if(field == 'undefined' || field == null) {
			
			displayErrorMessage("something-unexpected-happened");
		}
		else {
			
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
	}
	
	//The functions below are setters for the shared variables that contain the language files that are used on every page.
	var setCommonLanguageFile = function(langFile) { commonLanguageFile = langFile; }
	var setErrorMessagesLanguageFile = function(langFile) { errorMessagesLanguageFile = langFile; }
	var setAdditionalLanguageFile = function(langFile) { additionalLanguageFile = langFile; }
	var getAdditionalLanguageFile = function() { return additionalLanguageFile; }
	
	
	
	
	/*---Functions for changing or getting parameters in the URL-----------------------------------------------------------------------------------*/
	//The functions below update the parameters in the URL or get the values from the parameters in the URL en return them.
	
	var setURL = function(page, previousPage, lang, additional) {
		
		var url = window.location.href;
		
		if(getURLPage() == page && getURLPrev == previousPage && getURLLanguage() == lang && getURLAdditional() == additional) {
			
			//Do nothing, the URL is already the same URL as the new URL.
			//This can happen when the browser back and forward buttons are used because they already change the URL.
		}
		else {
		
			var baseUrl = url.split("?")[0];
			
			url = baseUrl + "?lang=" + lang + "&page=" + page;
			
			if(previousPage != null && previousPage != "")
				url = url + "&prev=" + previousPage;
			
			if(additional != null)
				url = url + "&additional=" + additional;
			
			history.pushState("Page", page, url);
		}
	}
	
	var getURLLanguage = function() {
		
		var language = null;
		
		var str = window.location.href;
		var splitStr = str.split("?");
		
		if(splitStr.length > 1) {
			
			var paramArray = splitStr[1].split("&");
		
			for(var i = 0; i < paramArray.length; i++) {
				
				var param = paramArray[i].split("=");
				if(param[0] == "lang")
					language = param[1];
			}
		}
		
		if(language != null)
			return language;
		else
			return defaultLanguage;
	}
	
	var getURLPage = function() {
		
		var page = null;
		
		var str = window.location.href;
		var splitStr = str.split("?");
		
		if(splitStr.length > 1) {
			
			var paramArray = splitStr[1].split("&");
			
			for(var i = 0; i < paramArray.length; i++) {
				
				var param = paramArray[i].split("=");
				if(param[0] == "page")
					page = param[1];
			}
		}
		
		if(page != null)
			return page;
		else
			return defaultPage;
	}

	var getURLAdditional = function() {
		
		var additional = null;
		
		var str = window.location.href;
		var splitStr = str.split("?");
		
		if(splitStr.length  > 1) {
			
			var paramArray = splitStr[1].split("&");
			
			for(var i = 0; i < paramArray.length; i++) {
				
				var param = paramArray[i].split("=");
				if(param[0] == "additional")
					additional = param[1];
			}
		}
		
		return additional; //Will return null if additional is not found in the URL as specified.
	}

	var getURLPrev = function() {
		
		var prev = null;
		
		var str = window.location.href;
		var splitStr = str.split("?");
		
		if(splitStr.length  > 1) {
			
			var paramArray = splitStr[1].split("&");
			
			for(var i = 0; i < paramArray.length; i++) {
				
				var param = paramArray[i].split("=");
				if(param[0] == "prev")
					prev = param[1];
			}
		}
		
		return prev;
	}
	
	


	/*---Other functions---------------------------------------------------------------------------------------------------------------------------*/
	//The functions below here are functions that do not belong with the functions that change the page or the language.
	//The functions below can be public or private, see the list of public functions in the top of this file.
	
	var updateFooterYear = function() {
		
		var date = new Date();
		$("#year_footer").text(date.getFullYear().toString());
	}

	var log = function(text) {
		
		console.log(text);
	}

	var displayErrorMessage = function(fieldName) {
		
		log("ERROR: " + fieldName);
		
		var message;
		var match = false;
		
		if(errorMessagesLanguageFile != null && errorMessagesLanguageFile != "") {
			
			for(var i = 0; i < Object.keys(errorMessagesLanguageFile.errors).length; i++) {
				
				if(errorMessagesLanguageFile.errors[i].name == fieldName) {
					message = getFieldLanguage(errorMessagesLanguageFile.errors[i]);
					match = true;
				}
			}
		}
		else {
			
			getJSONFile("errorMessages", displayErrorMessage, fieldName, null, null);
		}
		
		if(match == false)
			message = "Something went wrong, if this happens again, please contact the administator at arthur@arthurvanstrien.nl";
		
		$("#content").html("<p id='errorMessage'>" + message + "</p>");
		log(message);
	}
	
	var errorMessagesFileLoaded = function(errorMessagesLanguageFile, fieldName) {
		
		errorMessagesLanguageFile = errorMessagesLanguageFile;
		
		if(errorLoopDetection == false) {
			
			errorLoopDetection = true;
			//Try again after displaying the previous load failed.
			displayErrorMessage(fieldName);
			
			//Reset when displaying was succesfull.
			errorLoopDetection = false;
		}
	}
	
	
	/*---After all methods are added, return the public ones---------------------------------------------------------------------------------------*/
	return common;
})();