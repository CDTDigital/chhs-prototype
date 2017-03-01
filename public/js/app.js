
var app = {

    isAdmin: false,

    userprofileApi: "http://adpq.ifgcloud.com/userprofile",
    notificationApi: "http://adpq.ifgcloud.com/notifications",
    sendalertApi: "http://adpq.ifgcloud.com/sendalert",

    alertDataSet: null,

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

        $('#map_open').on('click', function (e) {
            e.preventDefault();
            $("#cont").addClass("none");
            $("#show_cont").removeClass("none");

        });

        $('#show_cont').on('click', function (e) {
            e.preventDefault();
            $("#cont").removeClass("none");
        });

    },

    bindFormElements: function () {

        $('body').on('click', 'a.btn.btn-primary, a.btn.btn-danger.auth, ul.form-catalog li a', function (e) {
            e.preventDefault();
            app.loadForm($(this)[0].href);
        });

        $('body').on('click', 'a.btn.btn-primary.outscope', function (e) {
            e.preventDefault();
            alert('Functionality out of scope for prototype.');
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
    },

    isMobile: function () {

        var _isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) _isMobile = true;

        return _isMobile;
    },

    getLocation: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(arcgis.showUserPosition, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
        }
    },


    mockChart: function (sms, email) {

        sms = getRandomInt(20,100);
        email = getRandomInt(20,100);

        var chart = "<table class='chart'><caption>Breakdown by notification type</caption>";
        chart += "<thead><tr><th class='xLabel'>Type</th><th class='yLabel'>Sent</th></tr></thead>";
        chart += "<tbody class='scale' aria-hidden='true'><tr><td colspan='2'>100</td></tr><tr><td colspan='2'>75</td></tr>";
        chart += "<tr><td colspan='2'>50</td></tr><tr><td colspan='2'>25</td></tr></tbody>";
        chart += "<tbody class='body'><tr><td class='record'' title='SMS'>SMS</td><td class='sales' style='height: " + sms + "%' title='" + sms + "'><span>" + sms + "</span></td></tr>";
        chart += "<tr><td class='record' title='Email'>Email</td><td class='sales' style='height: " + email + "%' title='" + email + "'><span>" + email + "</span></td></tr></tbody></table>";

        return chart;
    },

    enableAlertForm: function (enable) {

        if (enable) {
            $("#frmAlert *").prop("disabled", false);
            $("#frmAlert #title").focus();
        }
        else 
        {
            $("#frmAlert *").prop("disabled", true);
            $("#frmAlert #title").val('');
            $("#frmAlert #message").val('');
            $("#frmAlert input[name='optradio'][value='Non-Emergency']").prop("checked",true);
        }

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
    var html = '<li><a href="{0}" id="{1}" rel="{2}" hreflang="{3}">{4}<span>{5}</span></a></li>'.format(href, layerid, where, description, link, count);

    $(dom).append(html);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


