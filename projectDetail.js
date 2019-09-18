
var projectDetail = (function() {
	
	var projDetail = {};
	
	/*--ALL public methods in the projectDetail.js file----------------------------------------------------*/
	projDetail.load = function(langFile, project) { load(langFile, project); }
	projDetail.getProjectFromListAndDisplay = function(langFile, projectId) { getProjectFromListAndDisplay(langFile, projectId); }

	var load = function(langFile, project) {
		
		//Check if the recieved data is usefull, if not get the projectsList.
		if(typeof project == 'object' && project != null) {
			
			if(project.projectId == 'undefined' || project.projectId == null) {

				getProjectsList();
			}
			else {
				
				displayProjectDetail(project);
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
				
				displayProjectDetail(project);
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
			common.getJSONFile("projectsList", projectDetail.getProjectFromListAndDisplay, id, null, null);
		}
		else
			common.displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
	}
	
	var displayProjectDetail = function(project) {
		
		var generatedHTML = "";
	}
	
	return projDetail;
	
})();
