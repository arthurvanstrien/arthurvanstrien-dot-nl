
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
		
		return null;
	}
	
	var getProjectsList = function() {
		
		//The previous page was not projects and therefore the projectData is NOT passed directly to this page.
		//Instead we still have to load the list with projects and get the data for this project from that.
		
		if(common.getURLAdditional() != null) {
			var id = common.getURLAdditional();
			common.getJSONFile("projectsList", common.displayContent, id, projectDetail.displayProjectDetail, id);
		}
		else
			common.displayErrorMessage("project-id-not-found");
	}
	
	var displayProjectDetail = function(langFile, projectId, project) {
		
		//Set the additional language file so the language can be changed.
		common.setAdditionalLanguageFile(langFile);
		
		if(project == 'undefined' || project == null || project == "") {
			
			project = getProjectFromList(langFile, projectId);
			
			if(project == null) {
				common.displayErrorMessage("project-id-not-found");
			}
			else {
				displayProjectDetail(langFile, project.id, project);
			}
		}
		else {
		
			var generatedHTML = "";
			var textContent = project.content;
			var headers = langFile.headers;
			
			//First set the specifications headers:
			$("#lang_projectsMenu-overview").text(common.getFieldLanguage(headers.overview));
			$("#lang_projectsMenu-year").text(common.getFieldLanguage(headers.year));
			$("#lang_projectsMenu-version").text(common.getFieldLanguage(headers.version));
			$("#lang_projectsMenu-category").text(common.getFieldLanguage(headers.category));
			$("#lang_projectsMenu-programming-languages").text(common.getFieldLanguage(headers.programmingLanguages));
			$("#lang_projectsMenu-used-tools").text(common.getFieldLanguage(headers.tools));
			$("#lang_projectsMenu-used-materials").text(common.getFieldLanguage(headers.usedMaterials));
			$("#lang_projectsMenu-motive").text(common.getFieldLanguage(headers.motive));
			$("#lang_projectsMenu-version-control").text(common.getFieldLanguage(headers.versionControl));
			$("#lang_projectsMenu-process-framework").text(common.getFieldLanguage(headers.processFramework));
			$("#lang_projectsMenu-built-by").text(common.getFieldLanguage(headers.builtBy));
			
			
			//Secondly set the specifications content:
			$("#lang_pageTitle").text(common.getFieldLanguage(project.title));
			$("#projectDetail-year").text(project.year);
			$("#projectDetail-version").text(project.version);
			$("#projectDetail-category").text(common.getFieldLanguage(project.category));
			$("#projectDetail-programming-languages").text(project.programmingLanguages);
			$("#projectDetail-used-tools").html(common.getFieldLanguage(project.usedTools));
			$("#projectDetail-used-materials").text(common.getFieldLanguage(project.usedMaterials));
			$("#projectDetail-motive").text(common.getFieldLanguage(project.motive));
			$("#projectDetail-version-control").html(common.getFieldLanguage(project.versionControl));
			$("#projectDetail-process-framework").text(common.getFieldLanguage(project.processFramework));
			$("#projectDetail-built-by").text(common.getFieldLanguage(project.builtBy));
			
			for(var i = 0; i < Object.keys(textContent).length; i++) {
			
				generatedHTML = generatedHTML + common.getHTMLElement(textContent[i], i);
			}
			
			$(generatedHTML).insertAfter("#project-text-anker");
		}
	}
	
	//Custom function for changing the custom JSON parts used by the projectDetail page.
	//Displays a single project.
	var changeLanguage = function(langFile) {
		
		var projectId = common.getURLAdditional();
		var project = getProjectFromList(langFile, projectId);
		
		if(project == null || project == "") {
			
			commmon.displayErrorMessage("project-id-not-found");
		}
		else {
			
			var headers = langFile.headers;
			
			//First set the specifications headers:
			$("#lang_projectsMenu-overview").text(common.getFieldLanguage(headers.overview));
			$("#lang_projectsMenu-year").text(common.getFieldLanguage(headers.year));
			$("#lang_projectsMenu-version").text(common.getFieldLanguage(headers.version));
			$("#lang_projectsMenu-category").text(common.getFieldLanguage(headers.category));
			$("#lang_projectsMenu-programming-languages").text(common.getFieldLanguage(headers.programmingLanguages));
			$("#lang_projectsMenu-used-tools").text(common.getFieldLanguage(headers.tools));
			$("#lang_projectsMenu-used-materials").text(common.getFieldLanguage(headers.usedMaterials));
			$("#lang_projectsMenu-motive").text(common.getFieldLanguage(headers.motive));
			$("#lang_projectsMenu-version-control").text(common.getFieldLanguage(headers.versionControl));
			$("#lang_projectsMenu-process-framework").text(common.getFieldLanguage(headers.processFramework));
			$("#lang_projectsMenu-built-by").text(common.getFieldLanguage(headers.builtBy));
			
			//Secondly set the specifications content:
			$("#projectDetail-year").text(project.year);
			$("#projectDetail-version").text(project.version);
			$("#projectDetail-category").text(common.getFieldLanguage(project.category));
			$("#projectDetail-programming-languages").text(project.programmingLanguages);
			$("#projectDetail-used-tools").html(common.getFieldLanguage(project.usedTools));
			$("#projectDetail-used-materials").text(common.getFieldLanguage(project.usedMaterials));
			$("#projectDetail-motive").text(common.getFieldLanguage(project.motive));
			$("#projectDetail-version-control").html(common.getFieldLanguage(project.versionControl));
			$("#projectDetail-process-framework").text(common.getFieldLanguage(project.processFramework));
			$("#projectDetail-built-by").text(common.getFieldLanguage(project.builtBy));
			
			//Third, change the language from the generated content body:
			common.displayContent(project);
		}
	}
	
	return projDetail;
	
})();
