String.prototype.format = function () {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

/*

ArcGIS uses Asynchronous module definition (AMD) specification for the programming language JavaScript.  
AMD specification not valid for old browsers (i.e. IE)

*/

var arcgis = {

  webmap: null,

  initializeMap: function () {

    var map;

    require(["esri/map"], function (Map) {
      map = new Map("map_canvas", {
        basemap: "streets",
        center: [-119.417931, 36.778259],
        zoom: 6
      });
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
        console.error("getLastYearFireCount failed, stack: " + d.stack + ", error: " + d.message)
      });
  },

  getLastYearFireCount: function () {
    var url = '{0}/{1}/query?where={2}&returnCountOnly=true&f=pjson'.format(this.api, this.lastyearfirelayerid, this.whereclause);
    return $.getJSON(url)
      .then(function (data) {
        return data.count;
      }).fail(function (d) {
        console.error("getLastYearFireCount failed, stack: " + d.stack + ", error: " + d.message)
      });
  }

};

