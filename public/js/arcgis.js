﻿
/*

ArcGIS uses Asynchronous module definition (AMD) specification for the programming language JavaScript.  
AMD specification not valid for old browsers (i.e. IE)

*/

var arcgis = {

  webmap: null,
  featureLayerid: 'arcgis-layer',

  initializeMap: function () {

    var map;

    require(["esri/map", "esri/geometry/webMercatorUtils", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "dojo/dom-construct", "dojo/dom", "dojo/domReady!"], function (Map, webMercatorUtils, Popup, PopupTemplate, domConstruct, dom) {

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
        map.on("mouse-move", showCoordinates);
        map.on("mouse-drag", showCoordinates);
      });



      function showCoordinates(evt) {
        //the map is in web mercator but display coordinates in geographic (lat, long)
        var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
        //display mouse coordinates
        dom.byId("coordinates").innerHTML = mp.x.toFixed(3) + ", " + mp.y.toFixed(3);
      }

      arcgis.webmap = map;
    });


  },

  addFeatureLayer: function (obj) {

    var map = arcgis.webmap;
    var api = obj.href;
    var layerid = obj.id;
    var where = obj.rel;
    var desc = obj.title;

    if(where == 'non-api')
    {
      app.loadForm(api);
      return;
    }

    arcgis.removeFeatureLayer();

    require([
      "esri/map",
      "esri/dijit/Popup", "esri/dijit/PopupTemplate",
      "esri/layers/FeatureLayer",
      "esri/symbols/SimpleFillSymbol", "esri/Color",
      "dojo/dom-class", "dojo/dom-construct", "dojo/on",
      "dojox/charting/Chart", "dojox/charting/themes/Dollar",
      "dojo/domReady!"
    ], function (
      Map,
      Popup, PopupTemplate,
      FeatureLayer,
      SimpleFillSymbol, Color,
      domClass, domConstruct, on,
      Chart, theme
    ) {

        esriConfig.defaults.io.corsDetection = false;

        //dom.byId("coordinates").innerHTML = desc;

        var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
        var popup = new Popup({
          fillSymbol: fill,
          titleInBody: false
        }, domConstruct.create("div"));

        map.setInfoWindow(popup);

        var template = new PopupTemplate({
          title: "Title Goes Here",
          description: "Ernie Lopez"
        });

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

    var map = arcgis.webmap;

    if (map.layerIds.length <= 1) return;

    var ids = map.layerIds;
    var layer = map.getLayer(ids[1]);
    map.removeLayer(layer);

  },

  removeFeatureLayer: function () {

    var map = arcgis.webmap;

    var layer = map.getLayer(arcgis.featureLayerid);

    if (layer == undefined) return;

    map.removeLayer(layer);

  }

};

var arcgisEarthquakes = {

  api: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/EarthquakesFromLastSevenDays/MapServer",
  earthquakelayerid: 0,
  earthquakelayerdesc: "This sample service represents the latest earthquakes for the last seven days from the USGS. Data for this service is updated every 10 minutes from the USGS CSV repository.",
  whereurlclause : "Region+like+%27%25California%25%27",
  whereclause: "Region like '%California'",

  isloaded: false,


  getEarthquakeCount: function () {

    return 'All';

    //TODO:  Need to look into CORS Failure
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
  currentfiredesc: "",
  lastyearfirelayerid: 7,
  lastyearfirelayerdesc:"",
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
  riverstageslayerdesc: "",
  fullforecastlayerid: 13,
  fullforecastlayerdesc:"",
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
  temperaturelayerdesc:"",
  precipitationlayerid: 4,
  precipitationlayerdesc:"",
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


