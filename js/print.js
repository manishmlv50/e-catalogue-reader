
var cat_id = 1;
var selectedPages = [];
var current_catalog;
var catalogPagesObj;


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


function initPrint() {
    if(getUrlParameter('id')){
        cat_id = getUrlParameter('id');
    } 
    /*

    if(getUrlParameter('pages')){
        var pageNo = getUrlParameter('pages');
        console.log(pageNo);
        var decodedStrong = decodeURIComponent(pageNo);
        console.log(decodedStrong);
        var	sURLVariables = decodedStrong.split(',');
        console.log(sURLVariables);
        var sParameterName, i;

	    for (i = 0; i < sURLVariables.length; i++) {
	    	selectedPages[i] = sURLVariables[i];
	    }
	    console.log(selectedPages);

		$.getJSON('catalog.json').
		done(function(data) {
		    $.each(data, function(key, value) {
		        if(value.id == cat_id){

		            current_catalog = value;
		            console.log("Fetched Object is :");
		            console.log(current_catalog);

		            console.log("Assigning Pages Object");
		            catalogPagesObj = current_catalog.catalogPages;
		            console.log(catalogPagesObj);
		            console.log("Done Pages Object");

		            createPrintablePage(catalogPagesObj, selectedPages);
		        }
		    });
		});
    } */

        $.getJSON('catalog.json').
        done(function(data) {
            $.each(data, function(key, value) {
                if(value.id == cat_id){

                    current_catalog = value;
                    console.log("Fetched Object is :");
                    console.log(current_catalog);

                    console.log("Assigning Pages Object");
                    catalogPagesObj = current_catalog.catalogPages;
                    console.log(catalogPagesObj);
                    console.log("Done Pages Object");

                    createPrintablePage(catalogPagesObj);
                }
            });
        });
}



function createPrintablePage(catalogPagesObject) {
    console.log(catalogPagesObject);

        //To generate the thumbnails from the JSON
    var $ul =  $("<ul/>");
        console.log(selectedPages);
        $.each(catalogPagesObject, function(key, value) {
            console.log(value);
        console.log("Creating Image");
        var $li = $("<li/>");

        var $img = $("<img/>", {
            src: "pages/"+value.medium,
            class:"print-image page-"+value.id
        });
        $li.append($img);
        console.log("Done Creating Image");

        $ul.append($li);

        });
        console.log("Appending to Image");
        $("#images").append($ul);
        console.log("Done appending to Image");
        window.print();
        window.close();
}
/*

function createPrintablePage(catalogPagesObject, selectedPages) {
	console.log(catalogPagesObject);

	    //To generate the thumbnails from the JSON
    var $ul =  $("<ul/>");
    	console.log(selectedPages);
        $.each(selectedPages, function(key, value) {
        	console.log(value);
        console.log("Creating Image");
        var $li = $("<li/>");

        var $img = $("<img/>", {
            src: "pages/"+catalogPagesObject[value-1].medium,
            class:"print-image page-"+catalogPagesObject[value-1].id
        });
    	$li.append($img);
        console.log("Done Creating Image");

    	$ul.append($li);

	    });
		console.log("Appending to Image");
        $("#images").append($ul);
		console.log("Done appending to Image");

}
*/
