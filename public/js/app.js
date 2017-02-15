
var app = {

    bindMenu: function () {

        $(".inner ul li a").click(function (e) {

            e.preventDefault();

            var tab_id = "#" + $(this).attr("href");
            $(".inner ul li a").removeClass("active");
            $("#tabs .active").removeClass("active");
            $(this).addClass("active");
            $("#tabs div").stop(false, false).hide();
            $(tab_id).stop(false, false).show();

            helper.showCatalog(tab_id);

        });
    },

    bindCatalog: function () {

        $('body').on('click', 'ul.catalog li a', function (e) {
            e.preventDefault();
            $("ul.catalog li a").removeClass("activepoint");
            $(this).addClass("activepoint");
            arcgis.addLayer($(this)[0]);
        });

    },

    bindButtons: function () {

        $('#map_open').on('click', function () {
            $("#cont").addClass("none");
            $("#show_cont").removeClass("none");

        });

        $('#show_cont').on('click', function () {
            $("#cont").removeClass("none");
        });

    },


};


var helper = {

    showCatalog: function (catalog) {

        switch (catalog) {
            case "#tabActiveFire":
                if (!arcgisActiveFire.isloaded) {
                    $.when(arcgisActiveFire.getCurrentFireCount(), arcgisActiveFire.getLastYearFireCount()).done(function (current, lastyear) {

                        addCatalogLink(catalog, arcgisActiveFire.api, arcgisActiveFire.currentfirelayerid, arcgisActiveFire.whereclause, 'Current Fires', current);
                        addCatalogLink(catalog, arcgisActiveFire.api, arcgisActiveFire.lastyearfirelayerid, arcgisActiveFire.whereclause, 'Last Year Fires', lastyear);

                    });

                    arcgisActiveFire.isloaded = true;
                }
                break;
        }
    }

};

function addCatalogLink(catalog, href, layerid, where, title, count) {

    var dom = catalog + ' ul.catalog';
    var html = '<li><a href="{0}" id="{1}" rel="{2}">{3}<span>{4}</span></a></li>'.format(href, layerid, where, title, count);

    $(dom).append(html);
}


