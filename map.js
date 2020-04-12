let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
let Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 17,
	ext: 'jpg'
});
var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});
eval(atob("QVBJX0tFWT0nQUl6YVN5Q3NCajRfTjBpSUt3YWFaSWpXTHZPSjlZRXNlaVV6M3BBJw=="))
let map = L.map('map', {
    layers: CartoDB_Voyager,
    center: [ 31.895827, 34.811196],
    zoom: 12
    });
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';
var CartoDB_PositronOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
    maxZoom: 17,
    pane: "labels"
})//.addTo(map)

let current_language = "he"
let basemaps = {
'OpenStreetMap Mapnik Style':OpenStreetMap_Mapnik,
'Hydda Full': Hydda_Full,
'Stamen Watercolor': Stamen_Watercolor,
'CartoDB Voyager':CartoDB_Voyager
};

const numberWithCommas = (x) => {
let parts = x.toString().split(".");
parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
return parts.join(".");
}


let shopIcon = L.Icon.extend({
options: {
    iconSize:     [25, 25],
    iconAnchor:   [25, 25],
    popupAnchor:  [-3, -5]
}
});

let SecondHandIcon = new shopIcon({iconUrl: 'images/clothes.png'});
let FoodIcon = new shopIcon({iconUrl: 'images/greengrocer.png'});
let BookIcon = new shopIcon({iconUrl: 'images/books.png'});
let GenericShopIcon = new shopIcon({iconUrl: 'images/shop.png'});
getIcon = function(feature){
  return feature.properties["סוג העסק"] == "חנות יד שנייה" ? SecondHandIcon :
          feature.properties["סוג העסק"] == "מזון" ? FoodIcon :
          feature.properties["סוג העסק"] == "ספרים יד שניה" ? BookIcon :
          GenericShopIcon
}
let points_data;
let geojson;

let geojsonMarkerOptions = {
radius: 4,
weight: 0.1,
opacity: 0.5,
fillOpacity: 0.5
};

sheet_ID = "1ufxJQPU2EAWIE0k2KPAh18hheJiQ3qaUHNurekXEAyo"
$.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/${sheet_ID}/values/גיליון 1!A1:J?key=${API_KEY}&alt=json`,function(data){
    points_data = data.values
    propertyNames = points_data[0]
    geojson = {
        "type": "FeatureCollection",
        "features": [
          
        ]
      }
    for(i=1;i<points_data.length;i++){
      if( points_data[i][3] &&  points_data[i][2]){
        feature = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              +points_data[i][3],
              +points_data[i][2]
            ]
          }
        }
      
        for(j=0;j<points_data[i].length;j++){
          feature.properties[propertyNames[j]] = points_data[i][j]
        }
        geojson.features.push(feature)

      }
        
    }

    shops = L.geoJSON(geojson, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng,{icon: getIcon(feature)});
		},
		onEachFeature:function(feature, layer){
      popupContent = "<h3><center>"+feature.properties["שם העסק"]+"</center></h3>";
      popupContent += feature.properties["סוג העסק"] ? feature.properties["סוג העסק"]+"<br>" : '';
      popupContent += feature.properties["כתובת"] ? feature.properties["כתובת"]+"<br>" : '';
      popupContent += (feature.properties["מוצרים אקולוגיים"] ? `<i title="מוצרים אקולוגיים" style="font-size:24px; color:#4CB69F;" class="fa fa-leaf"></i>`: "");
      popupContent += (feature.properties["קופסאות רב פעמיות"] ? `<i title="אריזות רב פעמיות" style="font-size:24px; color:#FFD166;" class="fa fa-box-open"></i>`: "");
      popupContent += (feature.properties["מוצרים בלי אריזה"] ? `<i title="מוצרים ללא אריזה" style="font-size:24px; color:#118AB2;" class="fa fa-balance-scale"></i>`: "");
      popupContent += (feature.properties["מחזור"] ? `<i title="מחזור" style="font-size:24px; color:#6A4C93;" class="fa fa-recycle"></i>`: "");
      popupContent += (feature.properties["reuse"] ? `<i title="שימוש חוזר" style="font-size:24px; color:#EF476F;" class="fa fa-sync"></i>`: "");
			layer.bindPopup(popupContent);
		},
		style: function style(feature){
			return {
			weight: 1,
			opacity: 0.5,
			color: "rgb(0,0,0)", // Line color
			fillColor:"green",
			interactive:true
			}
		}
		}).addTo(map);

	L.control.layers(basemaps).addTo(map);
	
})


var addOnClick = false;
L.Control.AddBusiness = L.Control.extend({
  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'leaflet-bar');

    container.id = "addButton"
    container.style.cursor = 'pointer';
    container.innerHTML = "<center>הוספת עסק</center>";
    container.style.backgroundColor = 'white'; 
    container.style.borderRadius = '3px'; 
    container.style.padding = "5px";
    container.style.color = "black";
    container.style.width = '10vw';
    container.value = "on";
    
    L.DomEvent.disableClickPropagation(container);
    container.onclick = function(){    
        if(addOnClick){
          
        }else{
          document.getElementById("map").style.cursor='pointer';
          document.getElementById("addButton").style.backgroundColor = "green";
          addOnClick = true;
        }
    }
    return container;
}
});
L.control.addBusiness = function(opts) {
  return new L.Control.AddBusiness(opts);
};
L.control.addBusiness({ position: 'topright' }).addTo(map);
map.on('click',function(e){
  if(addOnClick){
    var lat = e.latlng.lat.toFixed(6);
    var lng = e.latlng.lng.toFixed(6);
    var url = `https://docs.google.com/forms/d/e/1FAIpQLSd3a0uRbB-hrOTWjGOz2lEGCiX_dMf3FPwNkD5XOkl0Kq6olA/viewform?usp=pp_url&entry.361045256=${lat}&entry.1519917982=${lng}`;
    var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(`<a target="_blank" rel="noopener noreferrer" href=${url}>לחץ להוספת עסק</a><br>נפתח בעמוד חדש`)
    .openOn(map);
    addOnClick = false;
    document.getElementById("addButton").style.backgroundColor = "white";
    document.getElementById("map").style.cursor='default';
  }
})