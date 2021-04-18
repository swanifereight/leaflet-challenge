 var maplayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
var map = L.map("mapid", {
  center: [
  40.7, 94.5],
  zoom: 3
});

maplayer.addTo(map);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function(data){
  function styleInfo(feature) {
  return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
}


  
//   function styleInfo(feature) {
//   return {
//       opacity: 1,
//       fillOpacity: 1,
//       fillColor: getColor(feature.geometry.coordinates[2]),
//       color: "#000000",
//       radius: getRadius(feature.properties.mag),
//       stroke: true,
//       weight: 0.5
//     };
// }

 function getColor(depth) {
    switch (true) {
    case depth > 90:
      return "#ea2c2c";
    case depth > 70:
      return "#ea822c";
    case depth > 50:
      return "#ee9c00";
    case depth > 30:
      return "#eecc00";
    case depth > 10:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  function getRadius(magnitude){
    if (magnitude === 0){
      return 1;
    }
    return magnitude * 4;
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng);
},

style: styleInfo,
  onEachFeature:function(feature, layer){
      layer.bindPopup(
        "Magnitude:"
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
    
  }).addTo(map);

  var legend = L.control({
    position: "bottomright"
  });



legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background:" + colors[i] + "'></i>"
      + grades[i] + (grades[i +1] ? "&ndash;" + grades[i+1] + "<br>" : "+");

    }
    return div;
  };
  legend.addTo(map);

});
   