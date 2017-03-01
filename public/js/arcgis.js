
/*

ArcGIS uses Asynchronous module definition (AMD) specification for the programming language JavaScript.  
AMD specification not valid for old browsers (i.e. IE)

*/

var arcgis = {

  webmap: null,
  userMarker: null,
  featureLayerid: 'arcgis-layer',
  markerId: 'arcgis-marker',

  currentlat: null,
  currentlong: null,

  alertRadiusData: {},

  initializeMap: function () {

    var map;



    require(["esri/map", "esri/geometry/webMercatorUtils",
      "esri/geometry/Point",
      "esri/geometry/Polygon",
      "esri/SpatialReference",
      "esri/dijit/Popup",
      "esri/dijit/PopupTemplate",
      "esri/toolbars/draw",
      "esri/graphic",
      "esri/symbols/SimpleFillSymbol",
      "esri/tasks/GeometryService",
      "dojo/dom-construct",
      "dojo/dom",
      "dojo/domReady!"], function (Map, webMercatorUtils, Point, Polygon, SpatialReference, Popup, PopupTemplate, Draw, Graphic, SimpleFillSymbol, GeometryService, domConstruct, dom) {

        var toolbar;
        var symbol;

        var popupOptions = {
          marginLeft: "20",
          marginTop: "20"
        };
        //create a popup to replace the map's info window
        var popup = new Popup(popupOptions, domConstruct.create("div"));

        map = new Map("map_canvas", {
          basemap: "streets",
          center: [-124.405, 37.854],
          zoom: 6,
          infoWindow: popup
        });

        map.on("load", function () {
          //after map loads, connect to listen to mouse move & drag events
          createToolbar();
          map.on("mouse-move", showCoordinates);
          map.on("mouse-drag", showCoordinates);
        });

        $('body').on('click', 'a#lnkRadius', function (e) {
          //helper.enableAlertForm(false);
          activateTool();
        });

        $('body').on('click', 'a#lnkClearRadius,a#lnkClearMap', function (e) {

          //helper.enableAlertForm(false);
          arcgis.clearMapGraphics();

        });

        function activateTool() {
          arcgis.clearMapGraphics();
          toolbar.activate(Draw.CIRCLE);
        }

        function createToolbar(themap) {
          toolbar = new Draw(map);
          toolbar.on("draw-end", addToMap);
        }

        geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

        function addToMap(evt) {
          var symbol;
          toolbar.deactivate();
          symbol = new SimpleFillSymbol();

          var attributes = {};
          attributes.isRadius = true;

          var graphic = new Graphic(evt.geometry, symbol, attributes);
          map.graphics.add(graphic);

          geometryService.simplify([evt.geometry], calculatePolygon);
        }

        function calculatePolygon(geometries) {

          var point = new Point(arcgis.currentlong, arcgis.currentlat);
          var retval = geometries[0].contains(point);

          arcgis.alertRadiusData.isPointInRadius = retval;

          var myPolygonCenterLatLon = geometries[0].getCentroid();
          arcgis.alertRadiusData.centerLatitude = myPolygonCenterLatLon.getLatitude();
          arcgis.alertRadiusData.centerLongitude = myPolygonCenterLatLon.getLongitude();

          //helper.enableAlertForm(true);


        }

        function showCoordinates(evt) {
          //the map is in web mercator but display coordinates in geographic (lat, long)
          var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
          //display mouse coordinates
          dom.byId("latlong").innerHTML = mp.x.toFixed(3) + ", " + mp.y.toFixed(3);
        }

        arcgis.webmap = map;

        //helper.getLocation();

      });


  },

  addFeatureLayer: function (obj) {

    var map = arcgis.webmap;
    var api = obj.href;
    var layerid = obj.id;
    var where = obj.rel;
    var desc = obj.hreflang;

    arcgis.removeFeatureLayer();

    require([
      "esri/map",
      "dojo/_base/connect",
      "esri/request",
      "esri/dijit/Popup", "esri/dijit/PopupTemplate",
      "esri/dijit/PopupMobile",
      "esri/layers/FeatureLayer",
      "esri/symbols/SimpleFillSymbol", "esri/Color",
      "dojo/dom-class", "dojo/dom-construct", "dojo/on",
      "dojox/charting/Chart", "dojox/charting/themes/Dollar",
      "dojo/domReady!"
    ], function (
      Map,
      connect,
      esriRequest,
      Popup, PopupTemplate,
      PopupMobile,
      FeatureLayer,
      SimpleFillSymbol, Color,
      domClass, domConstruct, on,
      Chart, theme
    ) {

        esriConfig.defaults.io.corsDetection = false;

        $('span#service').html($(obj).html());

        var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
        var popup;

        if (helper.isMobile()) {
          popup = new PopupMobile({
            fillSymbol: fill,
            titleInBody: false
          }, domConstruct.create("div"));

          /* Need to show alert button when in admin mode and in mobile mode */
          connect.connect(popup, "onSelectionChange", function () {
            //$('a.label.label-default.none').removeClass('none');
          });

        }
        else {
          popup = new Popup({
            fillSymbol: fill,
            titleInBody: false
          }, domConstruct.create("div"));
        }

        map.setInfoWindow(popup);

        // map.infoWindow.on("show", function (e) {
        //   if (app.isAdmin)
        //     $('a.label.label-default.none').removeClass('none');
        // });

        // map.infoWindow.on("selectionchange", function (e) {
        //   if (app.isAdmin)
        //     $('a.label.label-default.none').removeClass('none');
        // });

        var template = new PopupTemplate();
        template.setTitle("The iFish Group Notification");
        template.setContent(desc);

        var featureLayer = new FeatureLayer("{0}/{1}".format(api, layerid), {
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
          infoTemplate: template
        });

        featureLayer.setDefinitionExpression(where);

        featureLayer.id = arcgis.featureLayerid;
        map.addLayer(featureLayer);


      });
  },

  addLayer: function (obj) {

    arcgis.removeAllLayers();

    var map = arcgis.webmap;
    var api = obj.href;
    var layerid = obj.id;
    var where = obj.rel;

    require([
      "esri/config",
      "esri/map",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/layers/ImageParameters",
      "dojo/domReady!"
    ],
      function (esriConfig, Map, ArcGISDynamicMapServiceLayer, ImageParameters) {

        //We turn off all CORS detection because not all ArcGis servers support CORS
        esriConfig.defaults.io.corsDetection = false;

        var imageParameters = new ImageParameters();

        var layerDefs = [];
        layerDefs[layerid] = where;
        imageParameters.layerDefinitions = layerDefs;

        imageParameters.layerIds = [layerid];
        imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
        imageParameters.transparent = true;

        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(api,
          { "imageParameters": imageParameters });

        map.addLayer(dynamicMapServiceLayer);

      });

  },

  removeAllLayers: function () {

    if (arcgis.webmap == null) return;

    arcgis.clearMapGraphics();

    var map = arcgis.webmap;

    if (map.layerIds.length <= 1) return;

    var ids = map.layerIds;
    var layer = map.getLayer(ids[1]);
    map.removeLayer(layer);

  },

  removeFeatureLayer: function () {


    if (arcgis.webmap == null) return;

    arcgis.clearMapGraphics();

    var map = arcgis.webmap;

    var layer = map.getLayer(arcgis.featureLayerid);

    if (layer == undefined) return;

    $('span#service').html('');
    map.infoWindow.hide();
    map.removeLayer(layer);
    map.setZoom(6);

  },

  clearMapGraphics: function () {

    if (arcgis.webmap == null) return;

    var map = arcgis.webmap;

    if (map.infoWindow)
      map.infoWindow.hide();

    arcgis.webmap.graphics.clear();

    //add user map marker
    if (arcgis.userMarker != null) {
      map.graphics.add(arcgis.userMarker);
      map.centerAt(arcgis.userMarker.geometry.center);
      map.setZoom(6);
    }

  },

  showUserPosition: function (position) {

    require([
      "esri/graphic",
      "esri/geometry/Point",
      "esri/geometry/webMercatorUtils",
      "esri/symbols/PictureMarkerSymbol",
      "dojo/domReady!"
    ], function (Graphic, Point, webMercatorUtils, PictureMarkerSymbol) {

      var map = arcgis.webmap;

      var infoSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 12, "type": "esriPMS", "url": "http://static.arcgis.com/images/Symbols/Basic/RedStickpin.png", "imageData": "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", "contentType": "image/png", "width": 24, "height": 24 });

      var pt = webMercatorUtils.geographicToWebMercator(new Point(position.coords.longitude,
        position.coords.latitude));

      arcgis.currentlat = position.coords.latitude;
      arcgis.currentlong = position.coords.longitude;

      var attributes = {};
      attributes.id = arcgis.markerId;

      var marker1 = new Graphic(new Point(pt, map.spatialReference), null, attributes);
      marker1.setSymbol(infoSymbol);

      arcgis.userMarker = marker1;
      map.graphics.add(marker1);

    });
  },

  showAnalyticalPopup: function (obj) {

    arcgis.clearMapGraphics();

    var title = obj[0].title

    var sql = alasql('SELECT * FROM ? WHERE Title = "' + title + '"', [app.alertDataSet]);

    var date = sql[0].Date;
    var message = sql[0].Message;
    var type = sql[0].Type;
    var lat = sql[0].Lat;
    var long = sql[0].Long;
    var sms_count = sql[0].SMSCount;
    var email_count = sql[0].EmailCount;

    require([
      "esri/graphic",
      "esri/geometry/Point",
      "esri/geometry/webMercatorUtils",
      "esri/symbols/PictureMarkerSymbol",
      "esri/InfoTemplate",
      "dojox/charting/Chart2D",
      "dojox/charting/plot2d/Columns",
      "dojox/charting/action2d/Highlight",
      "dojox/charting/action2d/MoveSlice",
      "dojox/charting/action2d/Tooltip",
      "dojox/charting/themes/Wetland",
      "dijit/layout/ContentPane",
      "dijit/layout/TabContainer",
      "dojo/dom-construct",
      "dojo/dom-class",
      "dojo/domReady!"
    ], function (Graphic, Point, webMercatorUtils, PictureMarkerSymbol,
      InfoTemplate, Chart2D, Columns, Highlight, MoveSlice, Tooltip, dojoxTheme, ContentPane, TabContainer, domConstruct, domClass) {

        var map = arcgis.webmap;

        var infoSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 12, "type": "esriPMS", "url": "http://static.arcgis.com/images/Symbols/Transportation/RedTriangleDaymark.png", "imageData": "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", "contentType": "image/png", "width": 24, "height": 24 });

        var pt = webMercatorUtils.geographicToWebMercator(new Point(long, lat));

        var attributes = {};
        attributes.isAnalyticalPopup = true;

        var marker = new Graphic(new Point(pt, map.spatialReference), null, attributes);
        marker.setSymbol(infoSymbol);

        var template = new InfoTemplate();
        template.setTitle(title);
        template.setContent(getWindowContent);

        marker.setInfoTemplate(template);

        function getWindowContent(graphic) {


          var html = "<b>Date</b>: " + date + "<br><b>Type</b>: " + type + "<br><br><p>" + message + "</p><br>"


          html += helper.mockChart(sms_count, email_count);
          return html;

        }

        map.graphics.add(marker);

      });

  },

  showUserMarker: function () {

    require([
      "esri/graphic",
      "esri/tasks/locator",
      "esri/geometry/Point",
      "esri/geometry/webMercatorUtils",
      "esri/symbols/PictureMarkerSymbol",
      "esri/InfoTemplate",
      "dojo/domReady!"
    ], function (Graphic, Locator, Point, webMercatorUtils, PictureMarkerSymbol, InfoTemplate) {

      var url = app.userprofileApi;
      var userProfile;

      $.getJSON(url)
        .then(function (data) {
          userProfile = data;
          plotPoint(data);
        }).fail(function (d) {
          console.error("arcgis.showUserMarker; Error: " + d);
        });

      function plotPoint(data) {
        var map = arcgis.webmap;
        var locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

        var address = {
          SingleLine: data.ZipCode
        };
        var options = {
          address: address,
          outFields: ["*"]
        };

        locator.addressToLocations(options);

        locator.on("address-to-locations-complete", function (evt) {

          var infoSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 12, "type": "esriPMS", "url": "http://static.arcgis.com/images/Symbols/Basic/RedStickpin.png", "imageData": "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", "contentType": "image/png", "width": 24, "height": 24 });

          var pt = webMercatorUtils.geographicToWebMercator(new Point(evt.addresses["0"].location.x,
            evt.addresses["0"].location.y));

          arcgis.currentlat = evt.addresses["0"].location.y;
          arcgis.currentlong = evt.addresses["0"].location.x;

          var attributes = {};
          attributes.id = arcgis.markerId;

          var marker1 = new Graphic(new Point(pt, map.spatialReference), null, attributes);
          marker1.setSymbol(infoSymbol);

          var html = '<b>First Name: </b>' + userProfile.FirstName;
              html += '<br><b>Last Name: </b>' + userProfile.LastName;
              html += '<br><b>Email: </b>' + userProfile.Email;
              html += '<br><b>Phone: </b>' + userProfile.Phone;
              html += '<br><b>Zip: </b>' + userProfile.ZipCode;
              html += '<br><b>Receive Text: </b>' + userProfile.ReceiveText;
              html += '<br><b>Receive Email: </b>' + userProfile.ReceiveEmail;

          var template = new InfoTemplate();
          template.setTitle('User Profile');
          template.setContent(html);

          marker1.setInfoTemplate(template);

          arcgis.userMarker = marker1;
          map.graphics.add(marker1);
        });

      }

    });
  },

  drawRadius: function (zip, miles) {

    var locator, map;

    require([
      "esri/map", "esri/tasks/locator",
      "esri/SpatialReference", "esri/graphic",
      "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol",
      "esri/geometry/Circle", "esri/symbols/TextSymbol",
      "esri/geometry/Point", "esri/geometry/Extent",
      "esri/geometry/webMercatorUtils",
      "dojo/_base/array", "esri/Color",
      "dojo/number", "dojo/parser", "dojo/dom", "dojo/json", "dijit/registry",
      "dijit/form/Button", "dijit/form/Textarea",
      "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
    ], function (
      Map, Locator,
      SpatialReference, Graphic,
      SimpleFillSymbol, SimpleMarkerSymbol,
      Circle, TextSymbol,
      Point, Extent,
      webMercatorUtils,
      arrayUtils, Color,
      number, parser, dom, JSON, registry
    ) {

        arcgis.clearMapGraphics();

        var map = arcgis.webmap;

        locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

        var address = {
          SingleLine: zip
        };
        var options = {
          address: address,
          outFields: ["*"]
        };
        //optionally return the out fields if you need to calculate the extent of the geocoded point
        locator.addressToLocations(options);

        locator.on("address-to-locations-complete", function (evt) {

          if (evt.addresses.length == 0) {
            $('#results').show().html('<div class="alert alert-danger"><strong>Error</strong>: Invalid zipcode!</div>').fadeOut(8000);
            return;
          }

          var point = new Point(evt.addresses["0"].location.x, evt.addresses["0"].location.y)
          arcgis.alertRadiusData.centerLatitude = evt.addresses["0"].location.y;
          arcgis.alertRadiusData.centerLongitude = evt.addresses["0"].location.x;



          var symbol = new SimpleFillSymbol();//.setColor("black").outline.setColor("red"); 
          var circle = new Circle({
            center: point,
            geodesic: true,
            radius: miles,
            radiusUnit: "esriMiles"
          });

          var graphic = new Graphic(circle, symbol);
          map.graphics.add(graphic);
          map.centerAt(graphic.geometry.center);
          //map.setZoom(7);

          //is user marker within circle radius
          var usermarker = new Point(arcgis.currentlong, arcgis.currentlat)
          var retval = graphic.geometry.contains(usermarker);
          arcgis.alertRadiusData.isPointInRadius = retval;

        })



      });
  }



};

var arcgisEarthquakes = {

  api: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/EarthquakesFromLastSevenDays/MapServer",
  earthquakelayerid: 0,
  earthquakelayerdesc: "<b>Region</b>: ${region} <br><b>Date</b>: ${datetime} <br><b>Magnitude </b>: ${magnitude}<br><b>Latitude </b>: ${latitude}<br><b>Longitude </b>: ${longitude}<br><a href='#' class='label label-default none'>Send Alert</a>",
  whereurlclause: "Region+like+%27%25California%25%27",
  whereclause: "Region like '%California'",

  isloaded: false,


  getEarthquakeCount: function () {

    return '99+';

    //NOTE:  http://sampleserver3.arcgisonline.com has a CORS failure when querying
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.earthquakelayerid, this.whereurlclause);

    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getEarthquakeCount failed, stack: " + d.stack + ", error: " + d.message);
      });
  }

};

var arcgisActiveFire = {

  api: "https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer",
  currentfirelayerid: 0,
  currentfiredesc: "<b>Report Date </b>: ${reportdatetime} <br/><b>Fire Name </b>: ${incidentname}<br/><b>Cause</b>: ${firecause} <br><b>Acres</b>: ${acres}<br><b>Latitude </b>: ${latitude}<br><b>Longitude </b>: ${longitude}",
  lastyearfirelayerid: 7,
  lastyearfirelayerdesc: "<b>Report Date </b>: ${reportdatetime} <br/><b>Fire Name </b>: ${incidentname}<br/><b>Cause</b>: ${firecause} <br><b>Acres</b>: ${acres}<br><b>Latitude </b>: ${latitude}<br><b>Longitude </b>: ${longitude}",
  whereclause: "state='CA'",

  isloaded: false,


  getCurrentFireCount: function () {
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.currentfirelayerid, this.whereclause);

    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getLastYearFireCount failed, stack: " + d.stack + ", error: " + d.message);
      });
  },

  getLastYearFireCount: function () {
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.lastyearfirelayerid, this.whereclause);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getLastYearFireCount failed, stack: " + d.stack + ", error: " + d.message);
      });
  }

};

var arcgisRiverGauge = {

  api: "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/ahps_riv_gauges/MapServer",
  riverstageslayerid: 0,
  riverstageslayerdesc: "<b>Location  </b>: ${location} <br/><b>Water Body </b>: ${waterbody}<br><b>Latitude </b>: ${latitude}<br><b>Longitude </b>: ${longitude}",
  fullforecastlayerid: 13,
  fullforecastlayerdesc: "<b>Location  </b>: ${location} <br/><b>Water Body </b>: ${waterbody}<br><b>Status </b>: ${status}<br><b>Forecast</b>: ${forecast}<br><b>Latitude </b>: ${latitude}<br><b>Longitude </b>: ${longitude}",
  whereclause: "state='CA'",

  isloaded: false,

  getRiverStagesCount: function () {
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.riverstageslayerid, this.whereclause);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getRiverStagesCount failed, stack: " + d.stack + ", error: " + d.message);
      });
  },

  getFullForecastCount: function () {
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.fullforecastlayerid, this.whereclause);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getFullForecastCount failed, stack: " + d.stack + ", error: " + d.message);
      });
  }
};

var arcgisWeatherHazard = {

  api: "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Climate_Outlooks/cpc_weather_hazards/MapServer",
  temperaturelayerid: 1,
  temperaturelayerdesc: "<b>Outlook</b>: ${label}<br><b>End Date</b>: ${end_date}<br><b>Shape Area</b>: ${st_area(shape)}<br><b>Shape Length</b>: ${st_length(shape)}<br><a href='#' class='label label-default none'>Send Alert</a>",
  precipitationlayerid: 4,
  precipitationlayerdesc: "<b>Outlook</b>: ${label}<br><b>End Date</b>: ${end_date}<br><b>Shape Area</b>: ${st_area(shape)}<br><b>Shape Length</b>: ${st_length(shape)}<br><a href='#' class='label label-default none'>Send Alert</a>",
  whereclause: null,

  isloaded: false,

  setWhereClause: function () {

    this.whereclause = "start_date>='{0}' and end_date<='{1}'".format(helper.threeDaysOut(), helper.sevenDaysOut());
  },

  getTemperatureCount: function () {

    this.setWhereClause();

    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.temperaturelayerid, this.whereclause);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getTemperatureCount failed, stack: " + d.stack + ", error: " + d.message);
      });
  },

  getPrecipitationCount: function () {

    this.setWhereClause();

    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.precipitationlayerid, this.whereclause);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getPrecipitationCount failed, stack: " + d.stack + ", error: " + d.message);
      });
  }

};


