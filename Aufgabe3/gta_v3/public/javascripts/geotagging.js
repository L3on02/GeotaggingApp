// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation(location) {
    if(document.getElementById("tagFormLatitude").value === "") {
        LocationHelper.findLocation(function (locationHelper){
            if (locationHelper.longitude !== undefined && locationHelper.latitude !== undefined) {
                document.getElementById("tagFormLatitude").value =  locationHelper.latitude;
                document.getElementById("tagFormLongitude").value = locationHelper.longitude;
                document.getElementById("disFormLatitude").value = locationHelper.latitude;
                document.getElementById("disFormLongitude").value = locationHelper.longitude;
            }
            let lat = locationHelper.latitude;
            let long = locationHelper.longitude;
            updateMap(lat,long);
        });
    }
    else {
        let lat = document.getElementById("tagFormLatitude").value;
        let long = document.getElementById("tagFormLongitude").value;
        updateMap(lat,long);
    }
}

function updateMap(lat,long) {
    let mapMan = new MapManager("IdmV6A5bz5rQU9rQ7KEingAEoaPqIFTA");
    let mapUrl = mapMan.getMapUrl(lat, long);
    document.getElementById("mapView").src = mapUrl;
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);

