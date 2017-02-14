/*

ArcGIS uses Asynchronous module definition (AMD) specification for the programming language JavaScript.  
AMD specification not valid for old browsers (i.e. IE)

*/

var arcgis = {
  initializeMap:function(){

    var map;

    require(["esri/map"], function (Map) {
        map = new Map("map_canvas", {
            basemap: "streets",
            center: [-119.417931, 36.778259],
            zoom: 6
        });
    });
  }
};

var arcgisActiveFire = {

  isloaded:false,
  currentfirecount:-1,
  lastyearfirecount:-1,

  getCurrentFireCount: function() {
    return $.getJSON('https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/0/query?where=state%3D%27CA%27&returnCountOnly=true&f=pjson')
    .then(function(data) {
      return data.count;
    }).fail( function(d) {
        console.error("getLastYearFireCount failed, stack: " + d.stack + ", error: "+ d.message)
    });
  },

  getLastYearFireCount: function() {
    return $.getJSON('https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer?f=pjson')
    .then(function(data) {

            var today = new Date();
            var curyear = today.getFullYear();
            var lastYear = curyear - 1;

            var tsql = 'SELECT id FROM ? WHERE name ="' + lastYear + ' Fires"'
            var retval = alasql(tsql,[data.layers]); 
            return retval[0].id;

    }).then(function(id){
        return $.getJSON('https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/' + id + '/query?where=state%3D%27CA%27&returnCountOnly=true&f=pjson')
            .then(function(data) {
                return data.count;
        });
    }).fail( function(d) {
        console.error("getLastYearFireCount failed, stack: " + d.stack + ", error: "+ d.message)
    });
  }

};

