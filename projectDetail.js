
var projectDetail = (function() {
	
	var projDetail = {};
	
	projDetail.load = function(langFile, project) { load(langFile, project); }
	projDetail.getProjectFromListAndDisplay = function(langFile, projectId) { getProjectFromListAndDisplay(langFile, projectId); }

	var load = function(langFile, project) {
		
		//Check if the recieved data is usefull, if not get the projectsList.
		if(typeof project === 'object') {
	
			var url = new URL(window.location.href);
			
			if(project.projectId === 'undefined' || project.projectId === null) {

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
			
			displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
		}
	}
	
	var getProjectsList = function() {
		
		//The previous page was not projects and therefore the projectData is NOT passed directly to this page.
		//Instead we still have to load the list with projects and get the data for this project from that.
		
		if(url.searchParams.get("additional")) {
			var id = url.searchParams.get("additional");
			getJSONFile("projects-list", projectDetail.getProjectFromListAndDisplay, id, null, null);
		}
		else
			displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
	}
	
	var displayProjectDetail = function(project) {
		
		console.log("displayProjectDetail");
	}
	
	return projDetail;
	
})();
