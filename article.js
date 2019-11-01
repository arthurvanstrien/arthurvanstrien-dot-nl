
var article = (function() {
	
	var articleId;
	var articlePositionString;
	var loadedArticle;
	
	var articleMethods = {};
	
	/*---Public Functions from the Articles JS-------------------------------------------------------------------------------------------------------*/
	articleMethods.load = function(articlesFileName, idToAppendContentTo, articlePositionStr) { load(articlesFileName, idToAppendContentTo, articlePositionStr); }
	articleMethods.changeLanguage = function() { changeLanguage(); }
	articleMethods.display = function(langFile, idToAppendContentTo) { display(langFile, idToAppendContentTo); }
	
	var load = function(articlesFileName, idToAppendContentTo, articlePositionStr) {
		
		var additionalLanguageFile = common.getAdditionalLanguageFile();
		articleId = common.getURLAdditional();
		articlePositionString = articlePositionStr;
		
		if((articlePositionString == "" || articlePositionString == null) && (articleId == "" || articleId == null)) {
			//We don't know the article ID and file position, impossible to find the article.
			//This happens when the page is loaded fresh to the article and the URL has the additional parameter missing.
			common.changePage("404", null, null); 
		}
		else {
			
			if(additionalLanguageFile == "" || additionalLanguageFile == null)
				common.getJSONFile(articlesFileName, article.display, idToAppendContentTo, null, null);
			else 
				display(additionalLanguageFile, idToAppendContentTo);
		}
	}
	
	var display = function(langFile, idToAppendContentTo) {
		
		var article = null;
		var articlePositionString = null;
		
		if(articlePositionString == null || articlePositionString == "") {
			
			for(var i = 0; i < Object.keys(langFile.content).length; i++) {
				
				article = compareId(langFile.content[i]);
			}
		}
		else {
			
			var articlePositionArray = articlePositionString.split("_");
			var currentContent = langFile.content;
			
			for(var i = 0; i < Object.keys(articlePositionArray).length; i++) {
				
				currentContent = currentContent[articlePositionArray[i]].content;
			}
			
			article = currentContent;
		}
		
		if(article == null) {
			common.changePage("404", null, null);
		}
		else {
			
			$(document).prop("title", common.getFieldLanguage(article.title));
			$("#lang_pageTitle").text(common.getFieldLanguage(article.title));
			$("#lang_articleDate").text(article.lastUpdate);
			$("#lang_articleWriter").text(article.writer);
						
			document.getElementById("lang_backButtonBottom").onclick = function() {
				
				common.changePage(common.getURLPrev(), null, null);
			}
			
			loadedArticle = article;
			$(common.getHTMLElement(article, 0)).insertAfter("#" + idToAppendContentTo);
		}
	}
	
	var compareId = function(content) { 
	
		var result = null;
	
		if(content.type == "articleGroup") {
				
			for(var i = 0; i < Object.keys(content.content).length; i++) {
				
				var article = compareId(content.content[i]);
				
				if(article != null) {
					return article;
				}
			}	
		}
		else if(content.type == "article") {
			
			if(articleId == content.articleId)
				result = content;
		}
		
		return result;
	}
	
	var changeLanguage = function(langFile) {
		
		var article = null;
		
		if(loadedArticle == null || loadedArticle == "") {
			
			for(var i = 0; i < Object.keys(langFile.content).length; i++) {
				
				article = compareId(langFile.content[i]);
			}
		}
		else
			article = loadedArticle;
		
		if(article == null) {
			common.changePage("404", null, null);
		}
		else {
			
			$(document).prop("title", common.getFieldLanguage(article.title));
			$("#lang_pageTitle").text(common.getFieldLanguage(article.title));
			
			common.displayElement(article, 0);
		}
	}
	
	return articleMethods;
})();