// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

function updateMap(lat,long) {
    const mapData = document.getElementById("mapView");
    const mapElements = JSON.parse(mapData.getAttribute("data-tags"));
    console.log(mapElements);

    let mapMan = new MapManager("IdmV6A5bz5rQU9rQ7KEingAEoaPqIFTA");
    let mapUrl = mapMan.getMapUrl(lat, long,mapElements);
    mapData.src = mapUrl;
}

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */

function updateLocation(location) {
    const tagLat = document.getElementById("tagFormLatitude");
    const tagLong = document.getElementById("tagFormLongitude");
    const disLat = document.getElementById("disFormLatitude");
    const disLong = document.getElementById("disFormLongitude");
    if(document.getElementById("tagFormLatitude").value === "") {
        LocationHelper.findLocation(function (locationHelper){
            if (locationHelper.longitude !== undefined && locationHelper.latitude !== undefined) {
                tagLat.value =  locationHelper.latitude;
                tagLong.value = locationHelper.longitude;
                disLat.value = locationHelper.latitude;
                disLong.value = locationHelper.longitude;
            }
            let lat = locationHelper.latitude;
            let long = locationHelper.longitude;
            console.log(lat,long)
            updateMap(lat,long);
        });
    }
    else {
        let lat = tagLat.value;
        let long = tagLong.value;
        updateMap(lat,long);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);

