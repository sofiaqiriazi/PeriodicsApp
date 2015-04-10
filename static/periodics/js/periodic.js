function loadMainApplications(){
    $.get('/nightlies-periodic/mainProjects/', function(input){
            var data = jQuery.parseJSON(input);
        
            ulist = $('.etabs');

            for (var i in data){
                ulist.append('<li class="tab"><a href="#tabs1-'+data[i]+'">'+data[i]+'</a></li>');
                console.log(data[i]);
                loadApplicationContainer(data[i]);
            }
            
            
    }).done(function(){
            $('#tab-container').easytabs();
    });
}

function loadApplicationContainer(application){
            var container = $('#tab-container');
            container.append('<div id="tabs1-' + application +'"><h2>'+ "the "+ application+'</h2></div>');
            
            var tab = $('#tabs1-'+ application);
            console.log(tab);
            tab.append('<div style="border:solid;" class="slidee" id="slidee-'+ application +'">'+
                       '<ul class="app-items" id="app-items-'+application +'"></ul>'+
                        '</div>');

            $.get('/nightlies-periodic/applicationNews/'+application,function(data){
                    var ulist = $('#app-items-'+application);
                    data = jQuery.parseJSON(data);
                    console.log(data);
                    for (var i in data){
                        console.log(i);
                        console.log(data[i].filename);
                        ulist.append('<li>'+data[i]._id+'</li>');
                    }

                    tabid = 'slidee-' + application;
              }).done(function(){
                    loadSubSlidee(tabid);
                    });
}

function loadLatestNews(){
    $.get('/nightlies-periodic/latestNews/',function(input){
            var data = jQuery.parseJSON(input);

            var ulist = $('.items');
            data=[ 'Brunel','Moore', 'DaVinci', 'Gauss'];

            for(var i in data){
                ulist.append('<li>'+data[i]+'</li>');
            }
			loadSlidee();
	});

}

function loadSubSlidee(tabid){
	var $frame = $("#"+tabid);
    var $slidee = $frame.children('ul').eq(0);

	$frame.sly({
		itemNav: 'basic',
		smart: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 0,
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1,
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1

	});
}

function loadSlidee(){

	var $frame = $('#smart');
    var $slidee = $frame.children('ul').eq(0);
	var $wrap  = $frame.parent();

	$frame.sly({
		itemNav: 'basic',
		smart: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 3,
		scrollBar: $wrap.find('.scrollbar'),
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1,
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1,

        //Buttons
        prev: $wrap.find('.prev'),
        next: $wrap.find('.next')
	});
}

$(document).ready(function($){
		console.log("ready to start");
		loadMainApplications();
        loadLatestNews();
});
