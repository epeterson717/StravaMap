const auth_link = "https://www.strava.com/oauth/token"

function getActivites(res){

    const activities_link = `https://www.strava.com/api/v3/athlete/activities?per_page=200&pages=500&access_token=${res.access_token}`
    fetch(activities_link)
        .then((res) => (res.json()))
        .then(function(data){
            var mymap = L.map('map').setView([33.55, -82.05], 11);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'sk.eyJ1IjoiZW1pbHlwZXRlcnNvbiIsImEiOiJja2J0eTNyeTkwMWFoMnltbDhzM203ancxIn0.7s7ld4O1YBb_Zh_9KoILuA'
            }).addTo(mymap);

            function onMapClick(e) {
                alert("You clicked the map at " + e.latlng);
            }
            mymap.on('click', onMapClick);
            /*
            // Richmond Marathon
            var marker1 = L.marker([37.5407, -77.4360]).addTo(mymap);
            marker1.bindPopup("<b>Richmond Marathon</b><br>2015");
            // Philly Marathon
            var marker2 = L.marker([39.9526, -75.1652]).addTo(mymap);
            marker2.bindPopup("<b>Philadelphia Marathon</b><br>2018");
            // Cleveland Marathon
            var marker3 = L.marker([41.4993, -81.6944]).addTo(mymap);
            marker3.bindPopup("<b>Cleveland Marathon</b><br>2019");
            // Marine Corps Marathon
            var marker4 = L.marker([38.907192, -77.036873]).addTo(mymap);
            marker4.bindPopup("<b>Marine Corps Marathon</b><br>2019");
            // Trail Jam Marathon
            var marker5 = L.marker([34.2104, -77.8868]).addTo(mymap);
            marker5.bindPopup("<b>Trail Jam Marathon</b><br>2020");
            // Seneca Greenway Trail 50K
            var marker6 = L.marker([39.1440, -77.2016]).addTo(mymap);
            marker6.bindPopup("<b>Seneca Greenway Trail 50K</b><br>2020");
            // Lemmings Loop
            var marker7 = L.marker([33.532047, -81.9986427]).addTo(mymap);
            marker7.bindPopup("<b>Lemmings Loop</b><br>2020");
            */
            console.log(data)
           
            for(var x=0; x<data.length; x++){
                if(data[x].type == 'Ride'){
                    data.splice(x, 1);
                }  
                else{ 
                    console.log(data[x].map.summary_polyline)
                        
                    var coordinates = L.Polyline.fromEncoded(data[x].map.summary_polyline).getLatLngs()
                    console.log(coordinates)

                    L.polyline(
                        coordinates,
                        {
                            color:"green",
                            weight:3,
                            opacity:.7,
                            lineJoin:'round'
                        }
                        ).addTo(mymap)  
                }   
            }
        })
        
}

function reAuthorize(){
    fetch(auth_link,{
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*', 
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({

            client_id: '50189',
            client_secret: 'fe336071a67f1212a2376122e7e7f78547ad4c27',
            refresh_token: '9ca3ac6c8f986077edd4c6c17ab48e34503d2161',
            grant_type: 'refresh_token'
        })
    }).then(res => res.json())
        .then(res => getActivites(res))
      
}

reAuthorize()
