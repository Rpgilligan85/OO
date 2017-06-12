 var map = L.map('map').setView([41.35, -71], 3);
 L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnBnaWxsaWdhbjg1IiwiYSI6ImNpcWIyMDhkNTAzaHdmeW0xcjFkcHBtbzkifQ.UlUCS6v0ZJ5B6sH-u5BYqQ', {
     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
     maxZoom: 18,
 }).addTo(map);
 ///   Load GeoJSON   ///
 

var dgb = new datagobbler.getData({
    configFile:"./config.json",
    callbackFunction:onDataLoaded,
    loadingCallbackFunction:onDataLoading
});


function onDataLoading(data){
    //console.log("onDataLoading...",data);
}

function onDataLoaded(data){

var allData = datagobbler.data.functions.all_layers.getAllFilteredData();
var numberTime = datagobbler.data.functions.all_layers.getAllFilteredDataByGroup('numbertime');
var _country = datagobbler.data.functions.all_layers.getAllFilteredDataByGroup('country');
var _app = datagobbler.data.functions.all_layers.getAllFilteredDataByGroup('gender');

    
var allDates=[]; 
    
for (f in numberTime) {
    allDates.push(Number(f));
}
var endDate = allDates[allDates.length-1]
    
function filterByCountryAndDate(args) {
    var countryData = args.arr.filter(function(value){
        if (value.properties.country==args.country && value.properties.numbertime<=endDate && value.properties.numbertime>=args.startDate){
            return value;
        }
    })
    return countryData;
}
var countryObj = {};    
    
function createMasterObj(args) {
    for (f in args) {
        var country = f;
        //console.log(country);
        countryObj[f]={};
        countryObj[country].arr = args[f];
        countryObj[f].country = country;
         countryObj[f].endData = endDate;
        countryObj[f].startDate = 20161130;
        }
    }


createMasterObj(_country);    
    

    
/*
var brazilObj = {
    arr:allData,
    country:"Brazil",
    startDate:20161130,
    endDate:endDate
};
    
var chinaObj = {
    arr:allData,
    country:"China",
    startDate:20161130,
    endDate:endDate
};
    
var russiaObj = {
    arr:allData,
    country:"Russia",
    startDate:20161130,
    endDate:endDate
};

*/

    //createIcon("#95B3D7");
    
//var brazilData = filterByCountryAndDate(countryObj.Canada);    
//var chinaData = filterByCountryAndDate(chinaObj);    
//var russiaData = filterByCountryAndDate(russiaObj);  
       
    
var chinaIcon = L.icon({
    iconUrl:"./images/china.png",
    iconSize: [30,40],
    className:"Male"
})

var brazilIcon = L.icon({
    iconUrl:"./images/brazil.png",
    iconSize: [30,40],
    className:"Female"
})

var russiaIcon = L.icon({
    iconUrl:"./images/russia.png",
    iconSize: [30,40],
    className:"red"
})

    for (c in countryObj) {
        countryObj[c].class = c;
        countryObj[c].marker = L.geoJson(countryObj[c].arr, {onEachFeature: onEachMarker});
    }
    for (m in countryObj) {
        countryObj[m].cluster = new L.markerClusterGroup({ iconCreateFunction: function  (cluster){
               // console.log(cluster.getAllChildMarkers()[0]);
                var name = cluster.getAllChildMarkers()[0].options.icon.options.className;
                    for (f in countryObj) {
                        return new L.DivIcon({ html: '<div class="'+name+'"><b>'+cluster.getChildCount()+'</b><img src="images/'+name+'.png"></div>'})
            }       }
        });
        
    }
    for (f in countryObj) {
        countryObj[f].cluster.addLayer(countryObj[f].marker);
        map.addLayer(countryObj[f].cluster)
    }
    //console.log(countryObj.china.cluster);
    
console.log('MY AWESOME OBECT', countryObj);
/*
function addMarkers (args) {
    args.cluster.addLayer(args.marker);
    map.addLayer(args.cluster);
}    
    
addMarkers(countryObj.russia);    
addMarkers(countryObj.brazil); 
addMarkers(countryObj.china);    
    
console.log(countryObj.china.cluster)    
    
*/

    
function onEachMarker(feature,layer){
    var popup = feature.properties.country;
        layer.bindPopup(popup);
        if (feature.properties.gender == "Male") {
            layer.setIcon(chinaIcon);
        } else if (feature.properties.gender == "Female") {
            layer.setIcon(brazilIcon);
        }
}    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
} // End of Data