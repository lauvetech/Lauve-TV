"use strict";

class IContainer{
	constructor(){
		this.container = document.createElement("iframe");
		this.mainPath = "";
		this.parent = null;
		this.setProperties();
	}
	showIn(cparent){
		this.parent = cparent;
		cparent.appendChild(this.container);
	}
	show(){
		this.parent.appendChild(this.container);
	}
	load(address){
		this.container.src = address || "apps/"+this.mainPath;
	}
	hide(){
		this.parent.removeChild(this.container);
	}
	setProperties(){
		this.container.style.position = "fixed";
		this.container.style.left = "0";
		this.container.style.top = "0";
		this.container.style.width = "100%";
		this.container.style.height = "100%";
		this.container.style.border = "none";
	}
	getContainer(){
		return this.container
	}
}

class appx extends IContainer{
	constructor(manifestPath,id){
		super();
		this.name = "";
		this.version = "";
		this.state = "";
		this.handle = id || "0";
		this.closed = false;
		this.imagePath = "";
		this.manifestPath = manifestPath;
	}

	start(theParent){
		this.updateFromManifest();
		if (this.handle == "0") {
			console.log("Rogue application, not started.");
			return;
		}
		console.log("Started application " + this.handle);
		if (super.parent != null){
			super.showIn(super.parent);
		}
		else{
			super.showIn(theParent || document.body);
		}
		super.load();
	}

	setParent(parent){
		super.parent = parent;
	}

	returnFileContent(jpath){		
		var filesystem = require("fs");
		return filesystem.readFileSync(jpath,'utf8');
	}

	updateFromManifest(){
		let conf = JSON.parse(this.returnFileContent(this.manifestPath));
		this.name = conf.application.name;
		this.version = conf.application.version;
		this.imagePath = conf.sources.image;
		super.mainPath = conf.application.path;
	}

	tryRevive(){
		super.container = document.createElement("iframe");
		this.closed = false;
	}

	close(){
		this.closed = true;
	}
}