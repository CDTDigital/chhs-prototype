

function initialize() {

    //Map parametrs
    var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(36.778259, -119.417931),
        mapTypeId: google.maps.MapTypeId.ROADMAP,

        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        panControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        scaleControl: false,
        scaleControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    }

    //map
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);


    ////category
    //var cook = 'img/icon/01.png';

    ////positions
    //var point1 = new google.maps.LatLng(41.154, -73.328);

    ////markers
    //var marker1 = new google.maps.Marker({
    //    position: point1,
    //    map: map,
    //    category: cook,
    //    icon: cook,
    //    title: "point1"
    //});


    ////information for
    //function goToLink() {
    //    document.location.href = '3.html';
    //}
    //google.maps.event.addListener(marker1, 'click', goToLink)
}