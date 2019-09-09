function loadProjectdetailFunction(langFile) {
	
	var url = new URL(window.location.href);
	
	if(url.searchParams.get("additional")) {
		var id = url.searchParams.get("additional");
		getJSONFile("projects-list", displayProjectDetail, id, null);
	}
	else
		displayErrorMessage(errorMessagesLanguageFile, "project-id-not-found");
}

function displayProjectDetail(langFile, projectId) {
	
	
}
