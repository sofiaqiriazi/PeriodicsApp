function loadMainApplications(){
    //ask for the main applications 
    $.get('/nightlies-periodic/mainProjects/', function(data){
            data = jQuery.parseJSON(data);

            ulist = $('.etabs');
            //create one tab for each main application
            for (var i in data){
                ulist.append('<li class="tab"><a href="#tabs1-'+data[i]+'">'+data[i]+'</a></li>');
                //fill the specified tab's container with a slideshow of configs
                loadApplicationContainer(data[i]);
            }
        }).done(function(){
                $('#tab-container').easytabs();
        });
}

function loadApplicationContainer(application){
    //initialize container
    var container = $('#tab-container');
    container.append('<div id="tabs1-' + application +'"></div>');

    var tab = $('#tabs1-'+ application);
    tab.append('<div class="slidee" id="slidee-'+ application +'">'+
            '<ul class="app-items" id="app-items-'+application +'"></ul>'+
            '</div>');
    
    //ask for the specified application's latest events
    $.get('/nightlies-periodic/applicationNews/'+application,function(data){
            data = jQuery.parseJSON(data);
            //for each result returned
            for (var i in data){
                //create a detailed description of the entry
                loadDetails(data[i],application);
            }

            tabid = 'slidee-' + application;
        }).done(function(){
                loadSubSlidee(tabid);
                loadPageSlidee('.nonitembased');
        });
}

function loadTestResults(utable,filename,schedule_time){ 
    
    content = filename + '|' + schedule_time;
    $.get('/nightlies-periodic/'+content, function(data){
            data = jQuery.parseJSON(data);
            //CREATE A SLIDEE OF TRIANGLE
            if (data.length > 0){
                 
                var slidee = $('.countwrap').clone();
                console.log(slidee);
                slidee.addClass("timewrap");
                $(slidee).removeClass("countwrap");
        
                var ulist = document.createElement('ul');
                var listitem = document.createElement('li');
                listitem.setAttribute("class","counts");

                for (var d in data){
                    $(ulist).append('<li>'+data[d].value.trigger_on+'</li>');
                }    

                $(slidee.children(' .frame ')).append(ulist);
                $(listitem).append(slidee);
                $(utable).append(listitem);
            }
    }).done(function(){
            loadTimeSlidee();    
    });

}

function loadDetails(data,application){
    
    //initialize the dom elements
    var ulist = $('#app-items-'+application);

    var table  = document.createElement('li');
    table.setAttribute("id","wrap-"+application);
    table.setAttribute("class","appwrap");

    var utable = document.createElement('ul');
    utable.setAttribute("id",data.value.hash_key);
    utable.setAttribute("class","tablet");

    ulist.append(table);
    $(table).append(utable);

    fixed_types = ["build_id", "slot", "handlers", "platform","test_env","test_group"]; 
    var type = ""; 
    var tableitem = "";
    var content = "";

    
    //only tale the fixed variables information

    for (var j in fixed_types){
        type = fixed_types[j];
        content = data.value[type];
        //if the type corresponds to an array
        var listitem = document.createElement('li');
        var bottom = document.createElement('div');
        bottom.setAttribute("class","bottom");
        var toppom = document.createElement('div');
        toppom.setAttribute("class","top");

        $(toppom).append('<h1>'+type+'</h1>');


        
        var fullline = '';
        if( Object.prototype.toString.call( content ) === '[object Array]' ) {
    
            for (var a in content){
                fullline =  fullline+'<p>'+content[a]+'</p>';

            }
            var wrap = $('.newwrap').clone();
            wrap.addClass("pagewrap");
            $(wrap).removeClass("newwrap");
            $((wrap.children(' .frame ')).children('.slidee')).append(fullline);

            $(bottom).append(wrap);
            $(bottom).append(wrap);
        }
        else{
            fullline = content;
            $(bottom).append('<div>'+fullline+'</div>');
        }

        $(listitem).append(toppom);
        $(listitem).append(bottom);            
 
        $(utable).append(listitem);

    }
    //schedule time is undefined because the configuration file doesnt exist
    loadTestResults(utable,data.value.filename,data.value.schedule_time);

}

function loadLatestNews(){

    // request for the latest uploaded entries in the database
    $.get('/nightlies-periodic/latestNews/',function(data){
            data = jQuery.parseJSON(data);

            var ulist = $('.items');
            data=[ 'Brunel','Moore', 'DaVinci', 'Gauss'];

            for(var i in data){
                ulist.append('<li>'+data[i]+'</li>');
            }
                loadSlidee();
            });

}

//load the slidees inside the tabs container
function loadTimeSlidee(){
    var $frame = $(".timewrap").children(".frame");
    var $wrap = $(".timewrap");

    $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1
    });
}

//load the slidees inside the tabs container
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

// load the slidee of the latest news
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

//ftiakse autonton kodika na kanei slidee tous handlers
function loadPageSlidee(id){
    var $frame = $(id);
    var $wrap  = $frame.parent();
    $frame.sly({
        speed: 100,
        easing: 'easeOutExpo',
        activatePageOn: 'click',
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 20,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1
    });
}

$(document).ready(function($){
        // load the tabs that coresponde to the main applications
        loadMainApplications();
        // load the news in time order
        loadLatestNews();
});
