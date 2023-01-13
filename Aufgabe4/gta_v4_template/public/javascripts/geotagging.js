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

// Funktion für updating the map after a tagging or discovery
function updateMap2(geotags) {
    const mapData = document.getElementById("mapView");
    console.log("log1" + mapData.getAttribute("data-tags"));
    console.log("log2" + geotags);

    let lat = parseFloat(document.getElementById("tagFormLatitude").value);
    let long = parseFloat(document.getElementById("tagFormLatitude").value);
    console.log(lat, long);

    let mapMan = new MapManager("IdmV6A5bz5rQU9rQ7KEingAEoaPqIFTA");
    let mapUrl = mapMan.getMapUrl(lat, long, JSON.parse(geotags));
    mapData.src = mapUrl;
    console.log("Hallo updateMap2");
    return geotags;
}

// update the list of geotags
function updateList(geotags) {
    let liste = JSON.parse(geotags);
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
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });
    return await response.json();
}

// discovery
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
document.getElementById("tag-form").addEventListener("submit", function (evt) {
    evt.preventDefault();
    let geotag = {
        name: document.getElementById("tagFormName").value,
        latitude: document.getElementById("tagFormLatitude").value,
        longitude: document.getElementById("tagFormLongitude").value,
        hashtag: document.getElementById("tagFormHashtag").value
    }
    console.log("tag: " + geotag);
    tagging(geotag).then(updateMap2).then(updateList);//.catch(error => alert("Search term does not exist"));
});

// event-listener: discovery
document.getElementById("discoveryFilterForm").addEventListener("submit", function (evt) {
    evt.preventDefault();
    console.log("Hallo discovery listener");

    discovery().then(updateMap2).then(updateList).catch(error => alert("Search term does not exist"));
});

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);