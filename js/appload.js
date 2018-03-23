var zoomBool = 0;
var zoomLevel = 2;


var highRes = false;
var current_catalog;
var catalogPagesObj;
var cat_id = 1;
var cat_name = "Company Profile";
var cat_desc = "Catalogue Description Page 1";
var cat_minzoom = 1;
var cat_maxzoom;
var cat_totalpages = 12;
var cat_front = true;
var cat_back = false;
var cat_mode = "single";
var cat_download = "http://google.co.in";
var cat_url = "http://google.co.in";
var cat_width = 922;
var cat_height = 600;
var cat_duration = 1000;
var cat_autocenter = true;
var cat_gradient = true;
var cat_elevation = 50;
var cat_navcolor = "#333";
var cat_buttoncolor = "#fff";
var cat_bodycolor = "#fefefe";

$('.zoom-dropup').hide();

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function initCatalog() {

    if(getUrlParameter('id')){
        cat_id = getUrlParameter('id');
    }
    if(getUrlParameter('l')){
        zoomLevel = getUrlParameter('l');
        console.log("Zoom Level ", zoomLevel);
    }
    if(getUrlParameter('z')){
        zoomBool = getUrlParameter('z');
        console.log("Zoom Bool ", zoomBool);
    }
 
   // $('.zoom-out-button').hide();
   
    $.getJSON('catalog.json').
    done(function(data) {
        $.each(data, function(key, value) {
            if(value.id == cat_id){

                current_catalog = value;
                console.log("Fetched Object is :");
                console.log(current_catalog);

                console.log("Starting Object Assignment");
                cat_name = current_catalog.name;
                cat_desc = current_catalog.desc;
                cat_minzoom = current_catalog.minZoom;
                cat_maxzoom = current_catalog.maxZoom;
                cat_totalpages = current_catalog.totalPages;
                cat_front = current_catalog.front;
                cat_back = current_catalog.back;
                cat_mode = current_catalog.mode;
                cat_download = current_catalog.download;
                cat_url = current_catalog.url;
                cat_width = current_catalog.width;
                cat_height = current_catalog.height;
                cat_duration = current_catalog.duration;
                cat_autocenter = current_catalog.autoCenter;
                cat_gradient = current_catalog.gradient;
                cat_elevation = current_catalog.elevation;
                cat_navcolor = current_catalog.navColor;
                cat_buttoncolor = current_catalog.buttonColor;
                cat_bodycolor = current_catalog.pageColor;
                console.log("Done Object Assignment");

                console.log("Assigning Pages Object");
                catalogPagesObj = current_catalog.catalogPages;
                console.log(catalogPagesObj);
                console.log("Done Pages Object");

                $('body').css("background",cat_bodycolor);
                $('.navbar').css({
                    "background":cat_navcolor,
                    "border-color":"#ccc",
                    "min-height": "auto"
                });
                $('button').css({
                    "color":cat_buttoncolor,
                    "background": "transparent",
                    "border":"none",
                    "font-size": "18px"
                });
                $('.catalogName').css({
                    "color":cat_buttoncolor,
                    "font-size": "16px"
                });
                $('.page_no').css({
                    "color":cat_buttoncolor,
                    "width":"120px"
                });
                $('.caret').css({
                    "border":"none"

                });

                $('.navbar').show();

                loadApp(catalogPagesObj);
            }
        });
    });
    
}



function loadApp(pagesObj) {

    $('#canvas').fadeIn(1000);

    var flipbook = $('.magazine');

    // Check if the CSS was already loaded
    
    if (flipbook.width()==0 || flipbook.height()==0) {
        setTimeout(loadApp, 10);
        return;
    }
    
    // Create the flipbook

    flipbook.turn({
            
            // Magazine width

            width: cat_width,

            // Magazine height

            height: cat_height,

            // Duration in millisecond

            duration: cat_duration,

            // Hardware acceleration

            acceleration: !isChrome(),

            // Enables gradients

            gradients: cat_gradient,
            
            // Auto center this flipbook

            autoCenter: cat_autocenter,

            // Elevation from the edge of the flipbook when turning a page

            elevation: cat_elevation,

            // The number of pages

            pages: cat_totalpages,

            // Events

            when: {
                turning: function(event, page, view) {
                    
                    var book = $(this),
                    currentPage = book.turn('page'),
                    pages = book.turn('pages');
            
                    // Update the current URI
                    Hash.go('page/' + page).update();

                    // Show and hide navigation buttons

                    disableControls(page);

                    $('.thumbnails .page-'+currentPage).
                        parent().
                        removeClass('current');

                    $('.thumbnails .page-'+page).
                        parent().
                        addClass('current');



                },

                turned: function(event, page, view) {

                    disableControls(page);

                    if(page==1){
                        $('.page_no').html(1 + " / " + $('.magazine').turn('pages'));
                    }
                    else if (page==$('.magazine').turn('pages')){
                        $('.page_no').html($('.magazine').turn('pages') + " / " + $('.magazine').turn('pages'));
                    } else {
                        $('.page_no').html(page+' - '+ parseInt(page +1) + " / " + $('.magazine').turn('pages'));
                    }
                    $(this).turn('center');

                    if (page==1) { 
                        $(this).turn('peel', 'br');
                    }

                },

                missing: function (event, pages) {

                    // Add pages that aren't in the magazine

                    for (var i = 0; i < pages.length; i++)
                        addPage(pages[i], $(this));

                }
            }

    });
 
    var $drop_ul =  $("<ul/>",{
         class:"dropdown-menu catalog-pages",
         "aria-labelledby":"dropdownMenu2"
    });
   
    $.getJSON('catalog.json').
    done(function(data) {
        $.each(data, function(key, value) {
            var $li = $("<li/>");
            var $a = $("<a/>", {
                href: "index.html?id="+value.id
            });
            var $a_text = value.name;
            $a.html($a_text);
            $li.append($a);
            $drop_ul.append($li);
        });
    });

    $(".catalog-pages").append($drop_ul);

    // Zoom.js

    $('.magazine-viewport').zoom({
        flipbook: $('.magazine'),
        max: parseInt(zoomLevel),
        /*
        max: function() { 
            
            return cat_maxzoom/$('.magazine').width();

        }, 
        */
        when: {

            swipeLeft: function() {

              //  $(this).zoom('flipbook').turn('next');
                $('.magazine').turn('next');
            },

            swipeRight: function() {
                
                //$(this).zoom('flipbook').turn('previous');
                 $('.magazine').turn('previous');

            },

            resize: function(event, scale, page, pageElement) {
                if (scale==1)
                    loadSmallPage(page, pageElement);
                else
                    loadLargePage(page, pageElement);
/*
                var img = $('<img />');

                var prevImg = pageElement.find('img');
                //img = prevImg;
                 console.log(prevImg);
                prevImg.load(function(){
                    alert("Image Loaded");
                }); */
            },

            zoomIn: function () {

                $('.made').hide();
                $('.magazine').removeClass('animated').addClass('zoom-in');
                $('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');
               // $('.zoom-dropup').hide();
               // $('.zoom-out-button').show();
                
                if (!window.escTip && !$.isTouch) {
                    escTip = true;

                    $('<div />', {'class': 'exit-message'}).
                        html('<div>Press ESC to exit</div>').
                            appendTo($('body')).
                            delay(2000).
                            animate({opacity:0}, 500, function() {
                                $(this).remove();
                            });
                }
            },

            zoomOut: function () {

                $('.exit-message').hide();
                $('.thumbnails').fadeIn();
                $('.made').fadeIn();
                $('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');
                $('#zoom-button').removeClass('glyphicon-zoom-out').addClass('glyphicon-zoom-in');
               // $('.zoom-out-button').hide();
               // $('.zoom-dropup').show();
                setTimeout(function(){
                    $('.magazine').addClass('animated').removeClass('zoom-in');
                    resizeViewport();
                }, 0);

            }
        }
    });



    // Zoom event

    if ($.isTouch)
        $('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
    else
        $('.magazine-viewport').bind('zoom.tap', zoomTo);

    $('.zoom-button').bind('click', function() {

        if ($('#zoom-button').hasClass('zoom-in')){
            $('.magazine-viewport').zoom('zoomIn');
        }

     });   


    // Using arrow keys to turn the page

    $(document).keydown(function(e){

        var previous = 37, next = 39, esc = 27;

        switch (e.keyCode) {
            case previous:

                // left arrow
                $('.magazine').turn('previous');
                e.preventDefault();

            break;
            case next:

                //right arrow
                $('.magazine').turn('next');
                e.preventDefault();

            break;
            case esc:
                
                $('.magazine-viewport').zoom('zoomOut');    
                e.preventDefault();

            break;
        }
    });

    // URIs - Format #/page/1 

    Hash.on('^page\/([0-9]*)$', {
        yep: function(path, parts) {
            var page = parts[1];

            if (page!==undefined) {
                if ($('.magazine').turn('is'))
                    $('.magazine').turn('page', page);
            }

        },
        nop: function(path) {

            if ($('.magazine').turn('is'))
                $('.magazine').turn('page', 1);
        }
    });


    $(window).resize(function() {
        resizeViewport();
    }).bind('orientationchange', function() {
        resizeViewport();
    });

    //To generate the thumbnails from the JSON
    var $ul =  $("<ul/>");
    for ( var i = 0; i < (pagesObj.length); i++ ) {

            // Each list item will contain a div
            var $li = $("<li/>");

            var $img = $("<img/>", {
                src: "pages/"+pagesObj[i].thumb,
                width: pagesObj[i].thumbWidth,
                height: pagesObj[i].thumbHeight,
                class:"page-"+pagesObj[i].id
            });
            var $span = $("<span/>");
            $span.html(pagesObj[i].id);
            $li.append($img);
            $li.append($span);
            $ul.append($li);


            // Add the list item to the list
        }
        $("#thumbnails").append($ul);

    $(".catalogName").html(cat_name);
    $(".download_url").bind('click', function() {
        window.open(cat_download, '_blank');
    });

    $(".print").bind('click', function() {
        var print_url = "print.html?id="+cat_id;
        window.open(print_url,'1444220661916','width=700,height=500,toolbar=0,menubar=1,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        return false;
    });     



    // Events for thumbnails

    // Generate Zoom Dropdown


    // Events for thumbnails

    $('.thumbnails').click(function(event) {
        
        var page;
        if (event.target && (page=/page-([0-9]+)/.exec($(event.target).attr('class'))) ) {
            $('.magazine').turn('page', page[1]);
        }
         $("#thumbnails").toggle(); 
           resizeViewport();

    });

    $('.first_nav_button').click(function() {
      $('.magazine').turn('page', 1);
    });

    $('.last_nav_button').click(function() {
       $('.magazine').turn('page', $(".magazine").turn("pages"));
    });

    $(".thumb_toggle").click(function(){

        if ($('.magazine-viewport').zoom('value') != 1) {
            $('.magazine-viewport').zoom('zoomOut');
        }
        $("#thumbnails").toggle();  
        resizeViewport();
    });


    $('.thumbnails li').
        bind($.mouseEvents.over, function() {
            
            $(this).addClass('thumb-hover');

        }).bind($.mouseEvents.out, function() {
            
            $(this).removeClass('thumb-hover');

        });

    if ($.isTouch) {
    
        $('.thumbnails').
            addClass('thumbanils-touch').
            bind($.mouseEvents.move, function(event) {
                event.preventDefault();
            });

    } else {

        $('.thumbnails ul').mouseover(function() {

            $('.thumbnails').addClass('thumbnails-hover');

        }).mousedown(function() {

            return false;

        }).mouseout(function() {

            $('.thumbnails').removeClass('thumbnails-hover');

        });

    }

$('.facebook').click();

/*
 $(".zoom-dropup").bind("click", function() {

    var i = parseInt(zoomLevel) + 1;

    window.location.href=("index.html?id="+cat_id+"&z=1&l="+i+location.hash);

    var $drop_ul =  $("<ul/>",{
         class:"dropdown-menu zoom-dropup-list",
         "aria-labelledby":"dropdownMenu2"
    });
    for ( var i = current_catalog.maxZoom; i > 1; i-- ) {
            console.log(i);
            // Each list item will contain a div
            var $li = $("<li/>");
            var $a = $("<a/>", {
                href: "index.html?id="+cat_id+"&z=1&l="+i+location.hash
            });
            var $a_text = i*100+"%";
            $a.html($a_text);
            $li.append($a);
            $drop_ul.append($li);


            // Add the list item to the list
        }
    $(".zoom-dropup").append($drop_ul);
 }); */

if(zoomLevel >= cat_maxzoom) {
    $(".zoom-in-button").attr("disabled", true);
    $(".zoom-in-button").addClass('disabled');
    $(".zoom-out-button").attr("disabled", false);
    $(".zoom-out-button").removeClass('disabled');
}

if(zoomLevel <= cat_minzoom) {
    $(".zoom-out-button").attr("disabled", true);
    $(".zoom-out-button").addClass('disabled');
    $(".zoom-in-button").attr("disabled", false);
    $(".zoom-in-button").removeClass('disabled');
}

$(".zoom-in-button").bind("click", function() {

if(zoomLevel < cat_maxzoom) {

    var i = parseInt(zoomLevel) + 1;
    window.location.href=("index.html?id="+cat_id+"&z=1&l="+i+location.hash);
     $(".zoom-out-button").attr("disabled", false);
      $(".zoom-out-button").removeClass('disabled');

} else {
    $(".zoom-in-button").attr("disabled", true);
    $(".zoom-in-button").addClass('disabled');
}

 });


    $('.zoom-out-button').bind('click', function() {
     
     if(zoomLevel > cat_minzoom) {

    var i = parseInt(zoomLevel) - 1;

    window.location.href=("index.html?id="+cat_id+"&z=1&l="+i+location.hash);
  } else {
        $('.magazine-viewport').zoom('zoomOut');
        $(".zoom-out-button").attr("disabled", true);
        $(".zoom-out-button").addClass('disabled');
        $(".zoom-in-button").attr("disabled", false);
        $(".zoom-in-button").removeClass('disabled');

  }


    });           
       


    // Regions

    if ($.isTouch) {
        $('.magazine').bind('touchstart', regionClick);
    } else {
        $('.magazine').click(regionClick);
    }

    // Events for the next button

    $('.next-button').bind($.mouseEvents.over, function() {
        
        $(this).addClass('next-button-hover');

    }).bind($.mouseEvents.out, function() {
        
        $(this).removeClass('next-button-hover');

    }).bind($.mouseEvents.down, function() {
        
        $(this).addClass('next-button-down');

    }).bind($.mouseEvents.up, function() {
        
        $(this).removeClass('next-button-down');

    }).click(function() {
        
        $('.magazine').turn('next');

    });


    $('.previous-nav-button').click(function() {
        
        $('.magazine').turn('previous');

    });
    $('.next-nav-button').click(function() {
        
        $('.magazine').turn('next');

    });

    // Events for the next button
    
    $('.previous-button').bind($.mouseEvents.over, function() {
        
        $(this).addClass('previous-button-hover');

    }).bind($.mouseEvents.out, function() {
        
        $(this).removeClass('previous-button-hover');

    }).bind($.mouseEvents.down, function() {
        
        $(this).addClass('previous-button-down');

    }).bind($.mouseEvents.up, function() {
        
        $(this).removeClass('previous-button-down');

    }).click(function() {
        
        $('.magazine').turn('previous');

    });

    resizeViewport();

    $('.magazine').addClass('animated');

    if(zoomBool == 1){
        $('.magazine-viewport').zoom('zoomIn');
    }  

}

// Zoom icon

 $('.zoom-icon').bind('mouseover', function() { 
    
    if ($(this).hasClass('zoom-icon-in'))
        $(this).addClass('zoom-icon-in-hover');

    if ($(this).hasClass('zoom-icon-out'))
        $(this).addClass('zoom-icon-out-hover');
 
 }).bind('mouseout', function() { 
    
     if ($(this).hasClass('zoom-icon-in'))
        $(this).removeClass('zoom-icon-in-hover');
    
    if ($(this).hasClass('zoom-icon-out'))
        $(this).removeClass('zoom-icon-out-hover');

 }).bind('click', function() {
    if ($(this).hasClass('zoom-icon-in'))
        $('.magazine-viewport').zoom('zoomIn');
    else if ($(this).hasClass('zoom-icon-out')) 
        $('.magazine-viewport').zoom('zoomOut');

 });
/*
*/
 $('#canvas').hide();
/*
 window.onload = function() {
    setTimeout(function() {
        // preload image
           for ( var i = 0; i < (catalogPagesObj.length); i++ ) {
                new Image().src = "pages/"+catalogPagesObj[i].small;
            }
           for ( var i = 0; i < (catalogPagesObj.length); i++ ) {      
                    // Loadnew page
                    if(zoomLevel <= 1){
                        new Image().src = "pages/"+catalogPagesObj[i].medium;
                    } else if(zoomLevel >= 2 && zoomLevel <= 6){
                        new Image().src = "pages/"+catalogPagesObj[i].large;
                    } else if(zoomLevel > 6){
                        new Image().src = "pages/"+catalogPagesObj[i].vector;
                    }

            }

    }, 1000);
};
*/
