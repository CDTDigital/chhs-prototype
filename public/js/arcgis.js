
/*

ArcGIS uses Asynchronous module definition (AMD) specification for the programming language JavaScript.  
AMD specification not valid for old browsers (i.e. IE)

*/

var arcgis = {

  webmap: null,
  featureLayerid: 'arcgis-layer',
  markerId: 'arcgis-marker',

  initializeMap: function () {

    var map;


    require(["esri/map", "esri/geometry/webMercatorUtils", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/toolbars/draw", "esri/graphic", "esri/symbols/SimpleFillSymbol", "dojo/dom-construct", "dojo/dom", "dojo/domReady!"], function (Map, webMercatorUtils, Popup, PopupTemplate, Draw, Graphic, SimpleFillSymbol, domConstruct, dom) {

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
        activateTool();
      });

      $('body').on('click', 'a#lnkClearRadius', function (e) {
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

      function addToMap(evt) {
        var symbol;
        toolbar.deactivate();
        symbol = new SimpleFillSymbol();

        var graphic = new Graphic(evt.geometry, symbol);
        map.graphics.add(graphic);
      }

      function showCoordinates(evt) {
        //the map is in web mercator but display coordinates in geographic (lat, long)
        var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
        //display mouse coordinates
        dom.byId("latlong").innerHTML = mp.x.toFixed(3) + ", " + mp.y.toFixed(3);
      }

      arcgis.webmap = map;

      helper.getLocation();

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
            $('a.label.label-default.none').removeClass('none');
          });

        }
        else {
          popup = new Popup({
            fillSymbol: fill,
            titleInBody: false
          }, domConstruct.create("div"));
        }

        map.setInfoWindow(popup);

        map.infoWindow.on("show", function (e) {
          if (app.isAdmin)
            $('a.label.label-default.none').removeClass('none');
        });

        map.infoWindow.on("selectionchange", function (e) {
          if (app.isAdmin)
            $('a.label.label-default.none').removeClass('none');
        });

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

    for (i = 0; i < map.graphics.graphics.length; i++) {

      var graphic = map.graphics.graphics[i];

      if (graphic.attributes != undefined) {
        if (graphic.attributes.id != arcgis.markerId)
          map.graphics.remove(graphic);
      }
      else
        map.graphics.remove(graphic);
    }

    //arcgis.webmap.graphics.clear();

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

      var attributes = {};
      attributes.id = arcgis.markerId;

      var marker1 = new Graphic(new Point(pt, map.spatialReference), null, attributes);
      marker1.setSymbol(infoSymbol);

      map.graphics.add(marker1);

    });
  },

  showAnalyticalPopup: function (obj) {

    arcgis.clearMapGraphics();

    var long = obj[0].rel.split(',')[0];
    var lat = obj[0].rel.split(',')[1];

    require([
      "esri/graphic",
      "esri/geometry/Point",
      "esri/geometry/webMercatorUtils",
      "esri/symbols/PictureMarkerSymbol",
      "dojo/domReady!"
    ], function (Graphic, Point, webMercatorUtils, PictureMarkerSymbol) {

      var map = arcgis.webmap;

      var infoSymbol = new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":10,"type":"esriPMS","url":"http://static.arcgis.com/images/Symbols/Shapes/RedPin2LargeB.png","imageData":"iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MkVEMEZDNUQyN0MxMUUwQUU5NUVFMEYwMTY0NzUwNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MkVEMEZDNkQyN0MxMUUwQUU5NUVFMEYwMTY0NzUwNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgyRUQwRkMzRDI3QzExRTBBRTk1RUUwRjAxNjQ3NTA1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgyRUQwRkM0RDI3QzExRTBBRTk1RUUwRjAxNjQ3NTA1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQg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","contentType":"image/png","width":24,"height":24});
      
      var pt = webMercatorUtils.geographicToWebMercator(new Point(long,lat));

      var marker = new Graphic(new Point(pt, map.spatialReference), null, null);
      marker.setSymbol(infoSymbol);

      map.graphics.add(marker);

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


