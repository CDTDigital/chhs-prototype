
/*

ArcGIS uses Asynchronous module definition (AMD) specification for the programming language JavaScript.  
AMD specification not valid for old browsers (i.e. IE)

*/

var arcgis = {

  webmap: null,

  initializeMap: function () {

    var map;

    require(["esri/map", "esri/geometry/webMercatorUtils", "dojo/dom", "dojo/domReady!"], function (Map,webMercatorUtils, dom) {
      map = new Map("map_canvas", {
        basemap: "streets",
        center: [-119.417931, 36.778259],
        zoom: 6
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
      "esri/dijit/PopupMobile",
      "dojo/dom-construct",
      "dojo/domReady!"
    ],
      function (esriConfig, Map, ArcGISDynamicMapServiceLayer, ImageParameters, PopupMobile, domConstruct) {

        //TODO: Look into CORS
        esriConfig.defaults.io.corsDetection = false;
        var popup = new PopupMobile(null, domConstruct.create("div"));

        var imageParameters = new ImageParameters();

        var layerDefs = [];
        layerDefs[layerid] = where;
        imageParameters.layerDefinitions = layerDefs;

        imageParameters.layerIds = [layerid];
        imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
        imageParameters.transparent = true;

        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(api, { "imageParameters": imageParameters });

        map.addLayer(dynamicMapServiceLayer);

      });

  },

  removeAllLayers: function () {

    var map = arcgis.webmap;

    if (map.layerIds.length <= 1) return;

    var ids = map.layerIds;
    var layer = map.getLayer(ids[1]);
    map.removeLayer(layer);

  }
};

var arcgisActiveFire = {

  api: "https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer",
  currentfirelayerid: 0,
  lastyearfirelayerid: 7,
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
  fullforecastlayerid: 13,
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
  precipitationlayerid: 4,
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

var arcgisGEMS = {

  api: "https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer",
  earthquakelayerid: 3,
  wildfirelayerid: 10,
  whereclause: "location+like+%27%25California%27",
  whereclause2: "state='CA'",

  isloaded: false,

  getEarthquakeCount: function () {
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.earthquakelayerid, this.whereclause);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (jqxhr, textstatus) {
        console.error("getEarthquakeCount failed. Error: " + textstatus);
      });
  },

  getWildfireCount: function () {
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.wildfirelayerid, this.whereclause2);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (jqxhr, textstatus) {
        console.error("getWildfireCount failed. Error: " + textstatus);
      });
  }

};

