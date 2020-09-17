// Baseline Code: https://github.com/fpolignano/Code_From_Tutorials/blob/master/Strava_Api/strava_api.js
//testing

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
                accessToken: 'ACCESS TOKEN'
            }).addTo(mymap);

            function onMapClick(e) {
                alert("You clicked the map at " + e.latlng);
            }
            mymap.on('click', onMapClick);
           
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

            client_id: 'CLIENT ID',
            client_secret: 'CLIENT SECRET',
            refresh_token: 'REFRESH TOKEN',
            grant_type: 'refresh_token'
        })
    }).then(res => res.json())
        .then(res => getActivites(res))
      
}

reAuthorize()
