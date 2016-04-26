"use strict";

class TitusApplicationManager{
	constructor(){
		this.appsAvailable = [];
		this.appsAvailable[0] = [];
		this.appsAvailable[1] = [];
		this.appsLoaded = [];
		this.appsLoaded[0] = [];
		this.appsLoaded[1] = [];

		this.appContainer = document.createElement("iframe");
		this.appContainer.src = "#!";
		this.appContainer.style.position = "fixed";
		this.appContainer.style.width = "100%";
		this.appContainer.style.height = "100%";
		this.appContainer.style.zIndex = "9000";
		this.appContainer.style.left = "0";
		this.appContainer.style.right = "0";
		this.appContainer.style.top = "0";
		this.appContainer.style.bottom = "0";
		this.appContainer.style.background = "white";
	}

	showContainer(){
		document.body.insertBefore(this.appContainer,document.getElementById('homeback'));
	}

	hideContainer(){
		document.body.removeChild(this.appContainer);
	}

	loadApplication(jsonPath){
		
	}

	returnFileContent(jpath){		
		var filesystem = require("fs");
		return filesystem.readFileSync(jpath,'utf8');
	}

	getApplicationImage(appID){
		let path = this.getApplicationPath(appID);
		let conf = JSON.parse(this.returnFileContent(path));
		return conf.sources.image;
	}

	getApplicationLaunchPath(appID){
		let path = this.getApplicationPath(appID);
		let conf = JSON.parse(this.returnFileContent(path));
		return conf.application.path;
	}

	populateApps(){
		this.appsAvailable[0] = this.appManifestList();

		if (this.appsAvailable[0].length > 0){
			createHeader("Apps & Games");
			createAppCategory()
		}

		for (var i = this.appsAvailable[0].length - 1; i >= 0; i--) {
			this.appsAvailable[1][i] = this.createNewID(8);
			createAppTablo(this.appsAvailable[1][i],this.getApplicationImage(this.appsAvailable[1][i]));
		}
	}

	getApplicationPath(appID){
		let theIndex = this.appsAvailable[1].indexOf(appID);
		return this.appsAvailable[0][theIndex];
	}

	appManifestList(){
		var filesystem = require("fs");
    	var results = [];
    	var dir = "../lauve-tv/Views"
	
    	filesystem.readdirSync(dir).forEach(function(file) {
	
    	    file = dir+'/'+file;
    	    var stat = filesystem.statSync(file);
	
    	    if (stat && stat.isDirectory()) {
    	        console.log("Found Directory... Ignoring!")
    	    } 
    	    else 
    	    {
    	    	if (file.match(/json$/)){
    	    		results.push(file);
    	    	}
			}
    	});

    	return results;
	}

	unloadApplication(appID){
		this.appsLoaded.splice(this.appsLoaded.indexOf(appID),1);
	}

	createNewID(len,charSet){
		charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    	var randomString = '';
    	for (var i = 0; i < len; i++) {
    		var randomPoz = Math.floor(Math.random() * charSet.length);
    		randomString += charSet.substring(randomPoz,randomPoz+1);
    	}
    	return randomString;
	}
}