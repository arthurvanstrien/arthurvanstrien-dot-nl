
var projectDetail = (function() {
	
	var projDetail = {};
	
	
	/*--ALL public methods in the projectDetail.js file----------------------------------------------------*/
	projDetail.load = function(langFile, project) { load(langFile, project); }
	projDetail.changeLanguage = function(langFile) { changeLanguage(langFile); }
	projDetail.displayProjectDetail = function(langFile, projectId) { displayProjectDetail(langFile, projectId); }


	var load = function(langFile, project) {
		
		//Check if the recieved data is usefull, if not get the projectsList.
		if(typeof project == 'object' && project != null) {
			
			if(project.projectId == 'undefined' || project.projectId == null) {

				getProjectsList();
			}
			else {
				
				displayProjectDetail(common.getAdditionalLanguageFile(), project.projectId, project);
			}
		}
		else {
			
			getProjectsList();
		}
	}
	
	var getProjectFromList = function(langFile, projectId) {
		
		for(var i = 0; i < Object.keys(langFile.projects).length; i++) {
			
			var project = langFile.projects[i];
			
			if(project.projectId == projectId) {
				
				return project;
			}
		}
		
		common.displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
	}
	
	var getProjectsList = function() {
		
		//The previous page was not projects and therefore the projectData is NOT passed directly to this page.
		//Instead we still have to load the list with projects and get the data for this project from that.
		
		if(common.getURLAdditional() != null) {
			var id = common.getURLAdditional();
			common.getJSONFile("projectsList", common.displayContent, id, projectDetail.displayProjectDetail, id);
		}
		else
			common.displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
	}
	
	var displayProjectDetail = function(langFile, projectId, project) {
		
		//Set the additional language file so the language can be changed.
		common.setAdditionalLanguageFile(langFile);
		
		if(project == 'undefined' || project == null || project == "")
			project = getProjectFromList(langFile, projectId);
		
		var generatedHTML = "";
		var textContent = project.content;
		
		$("#lang_pageTitle").text(common.getFieldLanguage(project.title));
		$("#projectDetail-year").text(project.year);
		$("#projectDetail-version").text(project.version);
		$("#projectDetail-category").text(common.getFieldLanguage(project.category));
		$("#projectDetail-programming-languages").text(project.programmingLanguages);
		$("#projectDetail-used-tools").text(common.getFieldLanguage(project.usedTools));
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
	
	//Custom function for changing the custom JSON parts used by the projectDetail page.
	//Displays a single project.
	var changeLanguage = function(langFile) {
		
		var projectId = common.getURLAdditional();
		var project = getProjectFromList(langFile, projectId);
		
		if(project == null || project == "") {
			
			commmon.displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
		}
		else {
		
			$("#projectDetail-year").text(project.year);
			$("#projectDetail-version").text(project.version);
			$("#projectDetail-category").text(common.getFieldLanguage(project.category));
			$("#projectDetail-programming-languages").text(project.programmingLanguages);
			$("#projectDetail-used-tools").text(common.getFieldLanguage(project.usedTools));
			$("#projectDetail-motive").text(common.getFieldLanguage(project.motive));
			$("#projectDetail-version-control").text(common.getFieldLanguage(project.versionControl));
			$("#projectDetail-process-framework").text(common.getFieldLanguage(project.processFramework));
			$("#projectDetail-built-by").text(common.getFieldLanguage(project.builtBy));
			
			common.displayContent(project);
		}
	}
	
	return projDetail;
	
})();
