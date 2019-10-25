
var engineerTech = (function() {
	
	var engineerTechMethods = {};
	
	/*---Engineer Tech Public function---------------------------------------------------------------------------------------------------------------*/
	engineerTechMethods.changeLanguage = function() { changeLanguage(); }
	
	
	var changeLanguage = function(langFile) { 
	
		common.displayContent(langFile);
	}
	
	return engineerTechMethods;
})();