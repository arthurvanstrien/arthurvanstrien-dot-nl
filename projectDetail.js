
var projectDetail = (function() {
	
	var projDetail = {};
	
	
	/*--ALL public methods in the projectDetail.js file----------------------------------------------------*/
	projDetail.load = function(langFile, project) { load(langFile, project); }
	//projDetail.getProjectFromListAndDisplay = function(langFile, projectId) { getProjectFromListAndDisplay(langFile, projectId); }


	var load = function(langFile, project) {
		
		//Check if the recieved data is usefull, if not get the projectsList.
		if(typeof project == 'object' && project != null) {
			
			if(project.projectId == 'undefined' || project.projectId == null) {

				getProjectsList();
			}
			else {
				
				displayProjectDetail(langFile, project);
			}
		}
		else {
			
			getProjectsList();
		}
	}
	
	var getProjectFromListAndDisplay = function(langFile, projectId) {
		
		var found = false;
		
		for(var i = 0; i < Object.keys(langFile.projects).length; i++) {
			
			var project = langFile.projects[i];
			
			if(project.projectId == projectId) {
				
				displayProjectDetail(langFile, project);
				found = true;
			}
		}
		
		if(found == false) {
			
			common.displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
		}
	}
	
	var getProjectsList = function() {
		
		//The previous page was not projects and therefore the projectData is NOT passed directly to this page.
		//Instead we still have to load the list with projects and get the data for this project from that.
		
		var url = new URL(window.location.href);
		
		if(url.searchParams.get("additional")) {
			var id = url.searchParams.get("additional");
			common.getJSONFile("projectsList", common.displayContent, id, getProjectFromListAndDisplay, id);
		}
		else
			common.displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
	}
	
	var displayProjectDetail = function(langFile, project) {
		
		var generatedHTML = "";
		var textContent = project.text;
		
		console.log("displayProjectDetail");
		
		$("#lang_pageTitle").text(common.getFieldLanguage(project.title));
		$("#projectDetail-year").text(project.year);
		$("#projectDetail-category").text(common.getFieldLanguage(project.category));
		$("#projectDetail-programming-languages").text(project.programmingLanguages);
		$("#projectDetail-used-tools").text(project.usedTools);
		$("#projectDetail-motive").text(common.getFieldLanguage(project.motive));
		$("#projectDetail-version-control").text(common.getFieldLanguage(project.versionControl));
		$("#projectDetail-process-framework").text(common.getFieldLanguage(project.processFramework));
		$("#projectDetail-built-by").text(common.getFieldLanguage(project.builtBy));
		
		
		for(var i = 0; i < Object.keys(textContent).length; i++) {
		
			generatedHTML = generatedHTML + common.getHTMLElement(textContent[i], i);
		}
		
		$(generatedHTML).insertAfter("#project-text-anker");
		
		//Display the varlues from the default fields from the JSON file in the HTML.
		//THe displayContent function already does that so we dont have to build a custom function here.
		common.displayContent(langFile);
	}
	
	return projDetail;
	
})();
