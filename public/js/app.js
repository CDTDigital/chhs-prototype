
var app = {

    userprofileApi: "http://localhost:8081/userprofile",

    bindMenu: function () {

        $(".inner ul li a").click(function (e) {

            e.preventDefault();

            var tab_id = "#" + $(this).attr("href");
            $(".inner ul li a").removeClass("active");
            $("#tabs .active").removeClass("active");
            $(this).addClass("active");
            $("#tabs div.tab").stop(false, false).hide();
            $(tab_id).stop(false, false).show();

            helper.showCatalog(tab_id);

        });
    },

    bindCatalog: function () {

        $('body').on('click', 'ul.catalog li a', function (e) {
            e.preventDefault();
            $("ul.catalog li a").removeClass("activepoint");
            $(this).addClass("activepoint");
            arcgis.addFeatureLayer($(this)[0]);
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

    bindFormElements: function () {

        $('body').on('click', 'ul.form-catalog li a', function (e) {
            e.preventDefault();
            app.loadForm($(this)[0].href);
        });

        $('body').on('click', 'a.btn.btn-primary', function (e) {
            e.preventDefault();
            app.loadForm($(this)[0].href);
        });

    },

    loadForm: function (formUrl) {
        $("div#tabWelcome").load(formUrl);
    }

};


var helper = {

    showCatalog: function (catalog) {

        switch (catalog) {

            case "#tabEarthquakes":
                if (!arcgisEarthquakes.isloaded) {
                    $.when(arcgisEarthquakes.getEarthquakeCount()).done(function (earthquake) {

                        addCatalogLink(catalog, arcgisEarthquakes.api, arcgisEarthquakes.earthquakelayerid, arcgisEarthquakes.whereclause, 'Earthquakes from last 7 days', arcgisEarthquakes.earthquakelayerdesc, earthquake);

                        arcgisEarthquakes.isloaded = true;

                    }).fail(function (jsxhr, tetxstatus) {

                    });

                }
                break;

            case "#tabActiveFire":
                if (!arcgisActiveFire.isloaded) {
                    $.when(arcgisActiveFire.getCurrentFireCount(), arcgisActiveFire.getLastYearFireCount()).done(function (current, lastyear) {

                        addCatalogLink(catalog, arcgisActiveFire.api, arcgisActiveFire.currentfirelayerid, arcgisActiveFire.whereclause, 'Current Fires', arcgisActiveFire.currentfiredesc, current);
                        addCatalogLink(catalog, arcgisActiveFire.api, arcgisActiveFire.lastyearfirelayerid, arcgisActiveFire.whereclause, 'Last Year Fires', arcgisActiveFire.lastyearfirelayerdesc, lastyear);

                        arcgisActiveFire.isloaded = true;

                    }).fail(function (jsxhr, tetxstatus) {

                    });


                }
                break;

            case "#tabRiverGauge":
                if (!arcgisRiverGauge.isloaded) {
                    $.when(arcgisRiverGauge.getRiverStagesCount(), arcgisRiverGauge.getFullForecastCount()).done(function (riverstage, fullforecast) {

                        addCatalogLink(catalog, arcgisRiverGauge.api, arcgisRiverGauge.riverstageslayerid, arcgisRiverGauge.whereclause, 'Observed River Stages', arcgisRiverGauge.riverstageslayerdesc, riverstage);
                        addCatalogLink(catalog, arcgisRiverGauge.api, arcgisRiverGauge.fullforecastlayerid, arcgisRiverGauge.whereclause, 'Full Forecast Period Stages', arcgisRiverGauge.fullforecastlayerdesc, fullforecast);

                        arcgisRiverGauge.isloaded = true;

                    }).fail(function (jsxhr, tetxstatus) {

                    });


                }
                break;

            case "#tabWeather":
                if (!arcgisWeatherHazard.isloaded) {
                    $.when(arcgisWeatherHazard.getTemperatureCount(), arcgisWeatherHazard.getPrecipitationCount()).done(function (temp, precip) {

                        addCatalogLink(catalog, arcgisWeatherHazard.api, arcgisWeatherHazard.temperaturelayerid, arcgisWeatherHazard.whereclause, '3-7 Day Temperature Outlook', arcgisWeatherHazard.temperaturelayerdesc, temp);
                        addCatalogLink(catalog, arcgisWeatherHazard.api, arcgisWeatherHazard.precipitationlayerid, arcgisWeatherHazard.whereclause, '3-7 Day Precipitation Outlook', arcgisWeatherHazard.precipitationlayerdesc, precip);

                        arcgisWeatherHazard.isloaded = true;

                    }).fail(function (jsxhr, tetxstatus) {

                    });


                }
                break;


        }

    },

    threeDaysOut: function () {

        function pad(s) { return (s < 10) ? '0' + s : s; }

        var todayDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        var month = pad(todayDate.getMonth() + 1);
        var day = pad(todayDate.getDate());
        var year = pad(todayDate.getFullYear());
        return "{0}/{1}/{2}".format(month, day, year);
    },

    sevenDaysOut: function () {

        function pad(s) { return (s < 10) ? '0' + s : s; }

        var todayDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        var month = pad(todayDate.getMonth() + 1);
        var day = pad(todayDate.getDate());
        var year = pad(todayDate.getFullYear());
        return "{0}/{1}/{2}".format(month, day, year);
    }

};

//---------Helper Functions------------------------------------
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


function addCatalogLink(catalog, href, layerid, where, link, description, count) {

    var dom = catalog + ' ul.catalog';
    var html = '<li><a href="{0}" id="{1}" rel="{2}" title="{3}">{4}<span>{5}</span></a></li>'.format(href, layerid, where, description, link, count);

    $(dom).append(html);
}


