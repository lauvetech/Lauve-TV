var tmdb = "1f7f2a4263f3c1f5a1a48fae83dd86e1";

/*Get Movies on HDD*/

var myarray = [
  {
    "title": "Frozen",
    "year": "2013",
    "poster":  "https://image.tmdb.org/t/p/w500/jIjdFXKUNtdf1bwqMrhearpyjMj.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/irHmdlkdJphmk4HPfyAQfklKMbY.jpg"
  }
];

function displaymovies(arr) {
  var imgpath = "";
var bg="";
  var i;
  for (i = 0; i < arr.length; i++) {
    imgpath = arr[i].poster;
    bg = arr[i].backdrop;
    var movitem = document.createElement("a");

    movitem.className = "movbox dpad-focusable";
    movitem.tabIndex = "0";
    movitem.style.backgroundImage = "url(" + imgpath + ")";
    movitem.style.backgroundColor="transparent";  
      
    var info = document.createElement("div");
    info.id = "movinfo";
    var p1 = document.createElement("p");

    p1.id = "movtitle";
  
    var title = document.createTextNode(arr[i].title);

    p1.appendChild(title);  

    info.appendChild(p1);

    movitem.appendChild(info);
    var innerview = document.getElementById("innermov");
    innerview.appendChild(movitem);
      
  }
    
}
 
/*--------------------------*/



/*Get Movie recommendations*/

function displayrecmovies(arr) {
    var baseurl = "http://image.tmdb.org/t/p/w1000/";
    var imgurl = "";
    var i;
  for (i = 0; i < arr.length; i++) {
    imgurl = arr[i].backdrop_path;
    var recitem = document.createElement("a");
    recitem.className = "recbox dpad-focusable";
    recitem.tabIndex = "0";
    recitem.style.backgroundImage = "url(" + baseurl + imgurl + ")";
    recitem.style.backgroundColor="transparent";  
      
      
    var info = document.createElement("div");
    info.id = "recinfo";
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    p1.id = "rectitle";
    p2.id = "id";
    var title = document.createTextNode(arr[i].title);
    var id = document.createTextNode(arr[i].id);  
    p1.appendChild(title);  
    p2.appendChild(id); 
    info.appendChild(p1);
    info.appendChild(p2);
    recitem.appendChild(info);
    var innerview = document.getElementById("innerrec");
    innerview.appendChild(recitem);
  
  }
    
}

function getrecmovies() {
var array;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
       response = xhttp.responseText;
      var json = JSON.parse( response );
      array = json.results;
      displayrecmovies(array);
    }
	   xhttp.onerror = function onError(e) {
	$('#reccon').css('display', 'none');
}
	  
 };
	
  xhttp.open("GET", 'http://api.themoviedb.org/3/movie/now_playing?api_key=' + tmdb, true);
  xhttp.send();
}
/*-------------------------*/


/*Get Movie Data by ID and shows details screen*/


    function getrecmoviedata(id) {
    
var request = new XMLHttpRequest();
var  response ;
var array;
request.open('GET', 'http://api.themoviedb.org/3/movie/' + id + '?api_key=' + tmdb);

request.setRequestHeader('Accept', 'application/json');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
      var json = JSON.parse( this.responseText);
      showmoviedetail(json);
  }
};

request.send();


  }

    function showmoviedetail(array) {
        
    var overlay = document.getElementById('dim');
    var movdetails =               document.getElementById('movdetails');
    
    var baseurla = "http://image.tmdb.org/t/p/w300";
    var imgurla = array.poster_path;
    var baseurlb = "http://image.tmdb.org/t/p/w1000";
    var imgurlb = array.backdrop_path;
    var title = $(movdetails).find('#title');
    var cast = $(movdetails).find('#cast');
    var plot = $(movdetails).find('#plot');
    var vote = $(movdetails).find('#vote');
    var runtime = $(movdetails).find('#runtime');
    var year = $(movdetails).find('#year');
    var poster = $(movdetails).find('#poster');
    var bg = $(movdetails).find('#bg');
	var year = $(movdetails).find('#year');
		
    $(title).text(array.title); 
    $(cast).text(" ");  
    $(plot).text(array.overview);  
    $(vote).text(array.vote_average);
    $(runtime).text(array.runtime);
    $(year).text((array.release_date).slice(0,4));
        
    $(poster).css('backgroundImage','url('  + baseurla + imgurla + ')');
    $(bg).css('backgroundImage','url('  + baseurlb + imgurlb + ')');
		
    //overlay.style.display = "block";
    //movdetails.style.display = "block";
		$(overlay).fadeIn();
		$(movdetails).fadeIn();
      
  }


/*-------------------------*/


/*Get Rec backdrop on focus*/

    function getrecbgdata(id) {
    
var request = new XMLHttpRequest();
var  response ;
var array;
request.open('GET', 'http://api.themoviedb.org/3/movie/' + id + '/images?api_key=' + tmdb);

request.setRequestHeader('Accept', 'application/json');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
      var json = JSON.parse( this.responseText);
	  array = json.backdrops;
      showrecbg(array);
  }
};

request.send();


  }

    function showrecbg(array) {
        

    var baseurl = "http://image.tmdb.org/t/p/w1000";
    var imgurl = array[0].file_path;

   $('#homebg').css('backgroundImage','url('  + baseurl + imgurl + ')');
	$("#homeback").fadeIn(200);
 
  }

/*-------------------------*/

/*Get time*/

function gettime(){
	
	var time= moment().format("h:mm");
	$("#time").text(time);
}

/*------------------------*/


$(document).ready(function() {
	
	gettime();
	setInterval(gettime, 1000);
	displaymovies(myarray);
    getrecmovies();
 
});


$("#innerrec").on( 'click', '.recbox', function() {

    var id = $(this ).find('#id').text();
   getrecmoviedata(id);

	$("#homeback").fadeOut(200);
    
});

$("#innerrec").on( 'focus', '.recbox', function() {
		//var id = $(this ).find('#id').text();
    	//alert(id);
		//getrecbgdata(id);
});

$(document).on( 'focus', '.movbox', function() {
	$("#homeback").fadeOut(200);
});

$(document).on( 'focus', '.appbox', function() {
	$("#homeback").fadeOut(200);
});

$(document).on( 'focus', '#searchbar', function() {
	$("#homeback").fadeOut(200);
});

$(document).on( 'click', '#searchbar', function() {
	//$(".app-container").fadeIn(500);
//setTimeout(setFocusThickboxIframe, 100);
	
});

$( document ).on( 'keydown', function(e) {
    if ( e.keyCode === 27 ) {
        $('#movdetails').fadeOut();
        $('#dim').fadeOut();
    }
});
