
var projectsList;

var projects = (function() {
	
	var projectsMethods = {};
	
	/*--ALL public methods in the projects.js file----------------------------------------------------*/
	projectsMethods.load = function(langFile) { load(langFile); }
	projectsMethods.gotoProjectDetail = function(projectCounter) { gotoProjectDetail(projectCounter); }

	var load = function(langFile) {
		
		projectsList = langFile.projects;
		
		for(var i = 0; i < Object.keys(langFile.projects).length; i++) {
			
			var html = "";
			var project = langFile.projects[i];
			
			//Add "" around the projectId and page so Javascript will interpret the value as a string instead as a variable.
			var page = '"' + "projectDetail" + '"';
			var projectId = '"' + project.projectId + '"'; 
			
			//Build the HTML for a project menu and fill it with JSON.
			html = html + 
			"<span onClick='projects.gotoProjectDetail(" + i + ")' class='projectsMenu-container'>" + 
			"<h2 id='lang_project-title'>" + common.getFieldLanguage(project.title) + "</h2>" +
			"<span class='projectsMenu-th'><span class='projectsMenu-td' id='lang_projectsMenu-year'>Year: </span><span>" + project.year + "</span></span>" +
			"<span class='projectsMenu-th'><span class='projectsMenu-td' id='lang_projectsMenu-category'>Type: </span><span>" + common.getFieldLanguage(project.category) + "</span></span>";

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
	
	
	var gotoProjectDetail = function(projectCounter) {
		
		common.changePage("projectDetail", projectsList[projectCounter].projectId, projectsList[projectCounter]);
	}
	
	return projectsMethods;
	
})();