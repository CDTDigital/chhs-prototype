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

        $("ul.catalog li a").each(function (i) {
            $("ul.catalog li a").click(function () {
                $("ul.catalog li a").removeClass("activepoint");
                $(this).addClass("activepoint");
                return false;
            })
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
        buildCatalog(catalog);
    }

};

function buildCatalog(catalog) {
    switch (catalog) {
        case "#tabActiveFire":
            if (!arcgisActiveFire.isloaded) {

                $.when(arcgisActiveFire.getCurrentFireCount(), arcgisActiveFire.getLastYearFireCount()).done(function (current, lastyear) {

                    arcgisActiveFire.currentfirecount = current;
                    arcgisActiveFire.lastyearfirecount = lastyear;

                    console.log('currentfirecount: ' + arcgisActiveFire.currentfirecount);
                    console.log('lastyearfirecount: ' + arcgisActiveFire.lastyearfirecount);

                });

                arcgisActiveFire.isloaded = true;
            }
            break;
    }
}
