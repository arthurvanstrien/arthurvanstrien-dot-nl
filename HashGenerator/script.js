function makeHash() {
	
	var date = new Date();
	
	log("Starting hash");
	var toHash = document.getElementById("hashField").value;
	toHash = toHash + date.getTime();
	log("To Hash: " + toHash);
	var hashed = toHash.hashCode();
	log("Result: " + hashed);
	
	var hex = hashed.toString(32);
	
	$("#hashResult").val(hashed);
	$("#hexResult").val(hex);
	
	document.getElementById("hashField").value = "";
}

function copyToClipboard(fieldId) {
	
	var selectedElement = document.getElementById(fieldId);
	
	selectedElement.select();
	selectedElement.setSelectionRange(0, 99999); /*For mobile devices*/
	
	document.execCommand("copy");
	
	showShortMessage(fieldId + "Copy", 5);
}

String.prototype.hashCode = function() {
	
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
	
	log(hash);
	
	if(hash < 0) {
		
		log("below 0");
		hash = -hash;
	}
	
	log(hash);
	
    return hash;
}

async function showShortMessage(elementId, timeInSeconds) {
	
	$("#" + elementId).text("Succesfully copied!");
	
	log("message shown");
	
	await timeOut((timeInSeconds * 1000), clearElement, elementId);	
}

async function timeOut(milliseconds, functionAfter, parameter) {
	
	setTimeout(function() {
		
		functionAfter(parameter);
		
	}, milliseconds);
	
}

function clearElement(elementId) {
		
	$("#" + elementId).empty();
}

function log(text) {
	
	console.log(text);
}