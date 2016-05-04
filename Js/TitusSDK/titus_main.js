"use strict";

var appManager = null;

jQuery(document).ready(function() {
	appManager = new TitusApplicationManager(); //prepare the loading mechanism
	appManager.populateApps();
	
});

function launchApplication(appID){
	let path = appManager.getApplicationLaunchPath(appID);
	let inne = appManager.returnFileContent(path);
	appManager.showContainer();

	appManager.appContainer.src = 'data:text/html;charset=utf-8,' + encodeURI(inne);
}

function createHeader(headerName){
	let header = document.createElement("h1");
	header.setAttribute("class","title");
	let textC = document.createTextNode(headerName);
	header.appendChild(textC);
	$("#appcon").append(header);
}

function createAppCategory() {
	let cat = document.createElement("div");
	cat.setAttribute("id","innerapps");
	cat.setAttribute("class","rowchild");
	$("#appcon").append(cat);
}

function createAppTablo(appID,appImgSrc){
	console.log("creating tablo")
	let holder = document.createElement("div");
	holder.setAttribute("class","dpad-focusable appbox");

	let itext = document.createElement("p");
	itext.setAttribute("id","apptitle");
	let itextC = document.createTextNode(appID);
	itext.appendChild(itextC);

	holder.appendChild(itext);

	holder.setAttribute("tabindex","0");
	$("#innerapps").append(holder);
	holder.setAttribute("onclick","launchApplication('"+appID+"')");

	holder.style.backgroundImage = "url('"+appImgSrc+"')";
}