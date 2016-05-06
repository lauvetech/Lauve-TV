jQuery(document).ready(function() {
	
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
 
        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).fadeIn().siblings().hide();
 
        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });

});


//Dialogue system

;(function(window, document) {

	/*jslint browser: true, onevar: true, undef: true, nomen: false, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
	
	var lauve = {
	  lauvetimeout: [],
	  init: false,
	  zindex: 1000,
	  i: 0,
	
		bodyload: function(id) {
			var ff = document.createElement('div');
					ff.setAttribute('id','lauve-out-'+id);
					ff.className = 'lauve-base';
					ff.style.zIndex = lauve.zindex;
					lauve.zindex++;
					//document.body.appendChild(ff);
					$(ff).hide().appendTo(document.body).fadeIn();
		},
	
		newdialog: function() {
			var newid = new Date().getTime();
					newid = Math.random(1,99) + newid;	
	
			if (!lauve.init) {		
		    lauve.listen(window,"load", function() {
			    lauve.bodyload(newid);
				});
			}else{
		    lauve.bodyload(newid);		
			}
	
			return newid;
		},
	
		forceload: function() {},
	
		build: function (e, f) {
			lauve.i++;
			
			f.stack = lauve.i;
	
			e = e.replace(/\n/g,'<br />');
			e = e.replace(/\r/g,'<br />');
	
			var prompt = '',
			    ok = 'OK',
			    cancel = 'Cancel',
			    classname = '',
			    buttons = '',
			    box;
	
			if (f.type === 'prompt') {
				prompt = 
					'<div class="dialog-prompt">'+
						'<input id="dialog-input-'+f.newid+'" type="text" ' + (f.params.value ? 'value="' + f.params.value + '"' : '') + ' />'+
					'</div>';
			}
	
			if (f.params.ok) {
				ok = f.params.ok;
			}
			
			if (f.params.cancel) {
				cancel = f.params.cancel;
			}
			
			if (f.params.classname) {
				classname = f.params.classname;
			}
	
			if (f.type !== 'signal') {
				buttons = '<div class="dialog-buttons">';
				if (f.type === 'alert') {
					buttons +=
						'<button id="alert-ok-'+f.newid+'">'+ok+'</button>';
				}
				 else if (f.type === 'quiz') {
	
					if (f.params.button_1) {
						buttons +=
							'<button class="quiz-button" id="'+f.type+'-ok1-'+f.newid+'">'+f.params.button_1+'</button>';
					}
	
					if (f.params.button_2) {
						buttons +=
							'<button class="quiz-button" id="'+f.type+'-ok2-'+f.newid+'">'+f.params.button_2+'</button>';
					}
	
					if (f.params.button_3) {
						buttons +=
							'<button class="quiz-button" id="'+f.type+'-ok3-'+f.newid+'">'+f.params.button_3+'</button>';
					}
					if (f.params.button_cancel) {
						buttons +=
							'<button id="'+f.type+'-cancel-'+f.newid+'" class="cancel">'+f.params.button_cancel+'</button>';
					}
	
				}
				
				 else if (f.type === 'prompt' || f.type === 'confirm') {
					if (f.params.reverseButtons) {
						buttons +=
							'<button id="'+f.type+'-ok-'+f.newid+'">'+ok+'</button>' +
							'<button id="'+f.type+'-cancel-'+f.newid+'" class="cancel">'+cancel+'</button>';				
					} else {
						buttons +=
							'<button id="'+f.type+'-cancel-'+f.newid+'" class="cancel">'+cancel+'</button>'+
							'<button id="'+f.type+'-ok-'+f.newid+'">'+ok+'</button>';
					}
				}
				buttons += '</div>';
			}
	
	
			box = 
				'<div id="lauve-bg-'+f.newid+'" class="lauvebg"></div>'+
				'<div class="dialog lauve '+classname+'">'+
					'<div class="dialog-inner">'+
							e+
							prompt+
							buttons+			
					'</div>'+
				'</div>';
	
			if (!lauve.init) {		
				lauve.listen(window,"load", function() {
					lauve.finishbuild(e,f,box);
				});
			} else{
				lauve.finishbuild(e,f,box);
			}
	
		},
	
		finishbuild: function(e, f, box) {
		
			var ff = document.getElementById('lauve-out-'+f.newid);
	
			ff.className = 'lauve-base lauve-visible  lauve-' + f.type;
			ff.innerHTML = box;
					
			while (ff.innerHTML === "") {
				ff.innerHTML = box;
			}
			
			if (lauve.lauvetimeout[f.newid]) {
				clearTimeout(lauve.lauvetimeout[f.newid]);
			}
	
			lauve.listen(
				document.getElementById('lauve-bg-'+f.newid),
				"click", 
				function () {
					lauve.destroy(f.type, f.newid);
					if (f.type === 'prompt' || f.type === 'confirm' || f.type === 'quiz') {
						f.callback(false);
					} else if (f.type === 'alert' && typeof f.callback !== 'undefined') {
						f.callback();
					}	
				}
			);
		
		
			switch (f.type) {
				case 'alert': 
					lauve.finishbuildAlert(e, f, box);
					break;
				case 'confirm':
					lauve.finishbuildConfirm(e, f, box);
					break;
				case 'quiz':
					lauve.finishbuildQuiz(e, f, box);
					break;
				case 'prompt':
					lauve.finishbuildPrompt(e, f, box);
					break;
				case 'signal':
					lauve.finishbuildSignal(e, f, box);
					break;
				default:
					throw "Unknown type: " + f.type;
			}
		},
		
		finishbuildAlert: function (e, f, box) {
			lauve.listen(
				document.getElementById('alert-ok-'+f.newid),
				"click", 
				function () {
					lauve.destroy(f.type, f.newid);
					if (typeof f.callback !== 'undefined') {
						f.callback();
					}
				}
			);
		
			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 27) {
					lauve.destroy(f.type, f.newid);
					if (typeof f.callback !== 'undefined') {
						f.callback();
					}					
				}
			};	
		},
		
		finishbuildConfirm: function (e, f, box) {
			lauve.listen(
				document.getElementById('confirm-cancel-' + f.newid),
				"click", 
				function () 
				{
					lauve.destroy(f.type, f.newid);
					f.callback(false);
				}
			);
			
			lauve.listen(
				document.getElementById('confirm-ok-' + f.newid),
				"click", 
				function () 
				{
					lauve.destroy(f.type, f.newid);
					f.callback(true);
				}
			);
					
			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				if (e.keyCode === 13 || e.keyCode === 32) {
					lauve.destroy(f.type, f.newid);
					f.callback(true);
				} else if (e.keyCode === 27) {
					lauve.destroy(f.type, f.newid);
					f.callback(false);
				}
			};	
		},
		
		finishbuildQuiz: function (e, f, box) {
			var a, b, c;
			
			lauve.listen(
				document.getElementById('quiz-cancel-' + f.newid),
				"click", 
				function () 
				{
					lauve.destroy(f.type, f.newid);
					f.callback(false);
				}
			);
	
	
			if (a = document.getElementById('quiz-ok1-'+f.newid))
			lauve.listen(
				a,
				"click", 
				function () {
					lauve.destroy(f.type, f.newid);
					f.callback(a.innerHTML);
				}
			);
	
	
			if (b = document.getElementById('quiz-ok2-'+f.newid))
			lauve.listen(
				b,
				"click", 
				function () {
					lauve.destroy(f.type, f.newid);
					f.callback(b.innerHTML);
				}
			);
	
	
			if (c = document.getElementById('quiz-ok3-'+f.newid))
			lauve.listen(
				c,
				"click", 
				function () {
					lauve.destroy(f.type, f.newid);
					f.callback(c.innerHTML);
				}
			);
	
			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				if (e.keyCode === 27) {
					lauve.destroy(f.type, f.newid);
					f.callback(false);
				}
			};	
		
		},
		
		finishbuildPrompt: function (e, f, box) {
			var pi = document.getElementById('dialog-input-'+f.newid);
				
			setTimeout(function () {
				pi.focus();
				pi.select();
			}, 100);
		
			lauve.listen(
				document.getElementById('prompt-cancel-'+f.newid),
				"click", 
				function () {
					lauve.destroy(f.type, f.newid);
					f.callback(false);
				}
			);
		
			lauve.listen(
				document.getElementById('prompt-ok-'+f.newid),
				"click", 
				function () {
					lauve.destroy(f.type, f.newid);
					f.callback(pi.value);
				}
			);
					
			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				
				if (e.keyCode === 13) {
					lauve.destroy(f.type, f.newid);
					f.callback(pi.value);
				} else if (e.keyCode === 27) {
					lauve.destroy(f.type, f.newid);
					f.callback(false);
				}
			};
		},
		
		finishbuildSignal: function (e, f, box) {
	
	
			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				if (e.keyCode === 27) {
					lauve.destroy(f.type, f.newid);
					if (typeof f.callback !== 'undefined') {
						f.callback();
					}
				}
			};	
	
			lauve.lauvetimeout[f.newid] = setTimeout(function () {
				lauve.destroy(f.type, f.newid);
				if (typeof f.callback !== 'undefined') {
					f.callback();
				}
			}, f.timeout);
		},
		
				
		destroy: function (type,id) {
	
			var box = document.getElementById('lauve-out-'+id);
	
			if (type !== 'quiz') {
			    var okButton = document.getElementById(type+'-ok-'+id);
			}
	
	    var cancelButton = document.getElementById(type+'-cancel-'+id);
			box.className = 'lauve-base';
	
			if (okButton) {
				lauve.stoplistening(okButton, "click", function() {});
				document.onkeyup = null;
			}
			
			if (type === 'quiz') {
				var quiz_buttons = document.getElementsByClassName("quiz-button");
				for (var i = 0; i < quiz_buttons.length; i++) {
				lauve.stoplistening(quiz_buttons[i], "click", function() {});
				document.onkeyup = null;
				}			
			}
			
			if (cancelButton) {
				lauve.stoplistening(cancelButton, "click", function() {});
			}
			
			lauve.i = 0;
			document.body.removeChild(box);
		},
	
		alert: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}
			
			var id = lauve.newdialog();
			
			lauve.build(e, {
				type:     'alert',
				callback: f,
				params:   g,
				newid:    id
			});
		},
		
		signal: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}		

			var duration = 5000;
			if (g.duration !== 'undefined'){
				duration = g.duration;
			}
			
			var id = lauve.newdialog();
			lauve.build(e, {
				type:    'signal',
				callback: f,
				timeout: duration,
				params:  g,
				newid:   id
			});
		},
		
		confirm: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}
			
			var id = lauve.newdialog();
			lauve.build(e, {
				type:     'confirm',
				callback: f,
				params:   g,
				newid:    id
			});
		},
		
		quiz: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}
			
			var id = lauve.newdialog();
			lauve.build(e, {
				type:     'quiz',
				callback: f,
				params:   g,
				newid:    id
			});
		},
		
		prompt: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}
			
			var id = lauve.newdialog();
			return lauve.build(e,{type:'prompt',callback:f,params:g,newid:id});
		},
		
		listen: function (e, f, g) {
	    if (e.addEventListener) {
	      return e.addEventListener(f, g, false);
	    } 
	    
	    if (e.attachEvent) {
	      return e.attachEvent('on'+f, g);
	    } 
	    
			return false;
		},
		
		stoplistening: function (e, f, g) {	
	    if (e.removeEventListener) {
	      return e.removeEventListener(f, g, false);
	    }
	    
	    if (e.detachEvent) {
	      return e.detachEvent('on'+f, g);
	    }
	    
	    return false;
		}
	};
	
	
	lauve.init = true;

	if (typeof module != 'undefined' && module.exports) {
		module.exports = lauve;
	}
	else if (typeof define === 'function' && define.amd) {
		define('lauve', [], function() {
		    return lauve;
		});
	}
	else {
		this.lauve = lauve;
	}

})(window, document);

//End of Dialogue system