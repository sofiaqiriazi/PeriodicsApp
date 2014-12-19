function loadMainApplications(){
    $.get('/nightlies-periodic/mainProjects/', function(data){
            var data = jQuery.parseJSON(data);

            ulist = $('.etabs');

            for (var i in data){
            ulist.append('<li class="tab"><a href="#tabs1-'+data[i]+'">'+data[i]+'</a></li>');
            loadApplicationContainer(data[i]);
            }


            }).done(function(){
                $('#tab-container').easytabs();
                });
}

function loadApplicationContainer(application){
    var container = $('#tab-container');
    container.append('<div id="tabs1-' + application +'"></div>');

    var tab = $('#tabs1-'+ application);
    console.log(tab);
    tab.append('<div style="border:solid;" class="slidee" id="slidee-'+ application +'">'+
            '<ul class="app-items" id="app-items-'+application +'"></ul>'+
            '</div>');

    $.get('/nightlies-periodic/applicationNews/'+application,function(data){
            data = jQuery.parseJSON(data);
            for (var i in data){
                loadDetails(data[i],i,application);
            }

            tabid = 'slidee-' + application;
            }).done(function(){
                loadSubSlidee(tabid);
                });
}

function loadDetails(data,i,application){

    var ulist = $('#app-items-'+application);
    var table = '<li class="appwrap" id=wrap-'+application +'">'+
        '<ul id="'+ data['value']['hash_key']+'" class="tablet"></ul>'+
        '</li>';
    ulist.append(table);
    fixed_types = ["build_id", "slot", "handlers","paltform","test_env","test_group"];
    var type = "";
    var tableitem = "";
    var content = "";
    var utable = $('#'+data['value']['hash_key']);
    
    for (var j in fixed_types){
        type = fixed_types[j];
        content = data['value'][type];

        if( Object.prototype.toString.call( content ) === '[object Array]' ) {
            newslidee = type+"-"+data['value']['hash_key']+'-slidee';
            var fullline = '';
            for (var a in content){
                fullline =  fullline+'<p>'+content[a]+'</p>';
            }
            tableitem = '<li>'+
                        '<div class="top">'+
                        '<h1>'+type+'</h1>'+
                        '</div>'+
                        '<div class="bottom">'+
                        '<div id='+newslidee+'>'+fullline+'</p>'+
                        '</div>'+
                        '</li>';

        }
        else{
            tableitem = '<li>'+
            '<div class="top">'+
            '<h1>'+type+'</h1>'+
            '</div>'+
            '<div class="bottom">'+
            '<p>'+content+'</p>'+
            '</div>'+
            '</li>';
        }
        utable.append(tableitem);

        console.log("appended the item");
    }
}

function loadLatestNews(){
    $.get('/nightlies-periodic/latestNews/',function(data){
            var data = jQuery.parseJSON(data);

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
