"use strict";

class appManager{
	constructor(){
		this.appsLoaded = [];
		this.lastApplication = undefined;
	}

	loadNew(manifestPath,appid){
		appid = appid || this.createNewID(14);
		var application = new appx(manifestPath,appid);
		this.register(application);
		application.start();
		this.lastApplication = application;
	}

	register(application){
		for (var i = this.appsLoaded.length - 1; i >= 0; i--) {
			if (this.appsLoaded[i].closed == true){
				this.unregister(this.appsLoaded[i].handle);
			}
		}
		this.appsLoaded.push(application);
	}

	hideAll(){
		for (var i = this.appsLoaded.length - 1; i >= 0; i--) {
			this.appsLoaded[i].hide();
		}
	}

	clean(){
		for (var i = this.appsLoaded.length - 1; i >= 0; i--) {
			if (this.appsLoaded[i].closed == true){
				this.unregister(this.appsLoaded[i].handle);
			}
		}
	}

	unregister(id){
		for (var i = this.appsLoaded.length - 1; i >= 0; i--) {
			if (this.appsLoaded[i].handle == id){
				let theParent = this.appsLoaded[i].parent;
				if (theParent != undefined) {theParent.removeChild(this.appsLoaded[i].getContainer())}
				if (this.appsLoaded[i] == this.lastApplication) {this.lastApplication = this.appsLoaded[-1]}
				this.appsLoaded[i] = null;
				this.appsLoaded.splice(i,1);
				console.log("Application "+ id +" closed 0");
			}
		}
	}

	findApplicationByHandle(id){
		for (var i = this.appsLoaded.length - 1; i >= 0; i--) {
			if (this.appsLoaded[i].handle == id){
				return this.appsLoaded[i];
			}
		}
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