// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// function for updating the map
function updateMap(lat,long) {
    const mapData = document.getElementById("mapView");
    const mapElements = JSON.parse(mapData.getAttribute("data-tags"));
    console.log(mapElements);

    let mapMan = new MapManager("IdmV6A5bz5rQU9rQ7KEingAEoaPqIFTA");
    let mapUrl = mapMan.getMapUrl(lat, long,mapElements);
    mapData.src = mapUrl;
}

// funktion fpr updating the map after a tagging or discovery
function updateMap2(geotags) {
    const mapData = document.getElementById("mapView");
    let lat = parseFloat(document.getElementById("tagFormLatitude").getAttribute("value"));
    let long = parseFloat(document.getElementById("tagFormLatitude").getAttribute("value"));
    console.log(latitude, longitude);

    let mapMan = new MapManager("IdmV6A5bz5rQU9rQ7KEingAEoaPqIFTA");
    let mapUrl = mapMan.getMapUrl(lat, long, JSON.parse(geotags));
    mapData.src = mapUrl;
    console.log("Hallo updateMap2");
}

// update the list of goeatags
function updateList(geotagliste) {
    let liste = JSON.parse(geotagliste);
    console.log("Hallo updateList");

    return parseInt(document.getElementById("discoveryResults").innerHTML);
}

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */

function updateLocation() {
    const tagLat = document.getElementById("tagFormLatitude");
    const tagLong = document.getElementById("tagFormLongitude");
    const disLat = document.getElementById("disFormLatitude");
    const disLong = document.getElementById("disFormLongitude");
    if(document.getElementById("tagFormLatitude").value === ""||
        document.getElementById("tagFormLongitude").value === "") {
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

// asycronous functions
// tagging
async function tagging(geotag){
    let res = await fetch("http://localhost:3000/api/geotags",{
        methode:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });
    await console.log("Hallo async tagging");

    return await res.json();
}

// dicovery
async function discovery(){
    let search = await document.getElementById("disFormSearch").value;
    let geotag = await fetch("http://localhost:3000/api/geotags/" + search);
    geotag = await geotag.json();
    geotag = JSON.parse(geotag);

    let latitude = geotag.location.latitude;
    let longitude = geotag.location.longitude;
    let response = await fetch("http://localhost:3000/api/geotags?latitude=" + latitude + "&longitude=" + longitude + "&searchterm=" + search);
    // todo: was kommt hier als rückgabewert raus
    console.log("Hallo async discovery");

    return await response.json();
}


// event-listener: tagging
document.getElementById("tagFormSubmitButton").addEventListener("submit", function (evt) {
    evt.preventDefault();
    console.log("Hallo tagging listener");
    let geotag = {
        name: document.getElementById("tagFormName").getAttribute("value"),
        latitude: document.getElementById("tagFormLatitude").getAttribute("value"),
        longitude: document.getElementById("tagFormLongitude").getAttribute("value"),
        hashtag: document.getElementById("tagFormHashtag").getAttribute("value")
    }
    tagging(geotag).then(updateList).then(updateMap2); // todo: catch dran hängen
    document.getElementById("tagFormLatitude").value = "";
    document.getElementById("tagFormLongitude").value = "";
    //return true
});

// event-listener: discovery
document.getElementById("disFormSubmitButton").addEventListener("submit", function (evt) {
    evt.preventDefault();
    console.log("Hallo discovery listener");

    discovery().then(updateList).then(updateMap2); // todo: catch dran hängen
    //return true
});


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);

