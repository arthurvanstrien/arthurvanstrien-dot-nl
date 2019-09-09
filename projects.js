function loadProjectsFunction(langFile) {
	
	for(var i = 0; i < Object.keys(langFile.projects).length; i++) {
		
		var html = "";
		var project = langFile.projects[i];
		
		//Add "" around the projectId and page so Javascript will interpret the value as a string instead as a variable.
		var page = '"' + "project-detail" + '"';
		var projectId = '"' + project.projectId + '"'; 
		
		//Build the HTML for a project menu and fill it with JSON.
		html = html + 
		"<span onClick='com_changePage(" + page + ", " + projectId + ")' class='projectsMenu-container'>" + 
		"<h2 id='lang_project-title'>" + com_getFieldLanguage(project.title) + "</h2>" +
		"<p><span class='projectsMenu-th' id='lang_projectsMenu-year'>Year: </span><span>" + project.year + "</span></p>" +
		"<p><span class='projectsMenu-th' id='lang_projectsMenu-type'>Type: </span><span>" + com_getFieldLanguage(project.type) + "</span></p>";

		var numPictures = Object.keys(project.pictures).length;
		
		if(numPictures > 4)
			numPictures = 3; //The for loop starts counting at 0.
		
		for(var j = 0; j < numPictures; j++) {
			
			if(j == 3)
				html = html + "<img src='pic_projects/" + project.pictures[j] + "'>";
			else
				html = html + "<img id='margin' src='pic_projects/" + project.pictures[j] + "'>";
		}
		
		html = html + "</span>";
		
		$(html).insertAfter("#projects-list-anker");
	}
}