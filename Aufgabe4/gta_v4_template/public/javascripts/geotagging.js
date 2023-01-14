// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

const paginatedList = document.getElementById("discoveryResults");
let listItems = paginatedList.querySelectorAll("li");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

const paginationLimit = 5;
let pageCount = Math.ceil(listItems.length / paginationLimit);
let currentPage = 1;

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
        disableButton(prevButton);
    } else {
        enableButton(prevButton);
    }

    if (pageCount === currentPage) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
};

const setCurrentPage = (pageNum) => {
    currentPage = pageNum;

    handlePageButtonsStatus();

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems.forEach((item, index) => {
        item.classList.add("hidden");
        if (index >= prevRange && index < currRange) {
            item.classList.remove("hidden");
        }
    });
};

function updatePage(){
    pageCount = Math.ceil(listItems.length / paginationLimit);
    setCurrentPage(currentPage);
}

// function for updating the map
function updateMap(lat,long) {
    const mapData = document.getElementById("mapView");
    const mapElements = JSON.parse(mapData.getAttribute("data-tags"));
    console.log(mapElements);

    let mapMan = new MapManager("IdmV6A5bz5rQU9rQ7KEingAEoaPqIFTA");
    let mapUrl = mapMan.getMapUrl(lat, long,mapElements);
    mapData.src = mapUrl;
}

/**
 * updates the map after a tagging or a discovery action
 *
 * @param geotags
 * @returns {*}
 */
function updateMap2(geotags) {
    const mapData = document.getElementById("mapView");
    console.log("log1" + mapData.getAttribute("data-tags"));
    console.log("log2" + geotags);

    let lat = parseFloat(document.getElementById("tagFormLatitude").value);
    let long = parseFloat(document.getElementById("tagFormLongitude").value);
    console.log(lat, long);

    let mapMan = new MapManager("IdmV6A5bz5rQU9rQ7KEingAEoaPqIFTA");
    let mapUrl = mapMan.getMapUrl(lat, long, JSON.parse(geotags));
    mapData.src = mapUrl;
    console.log("Hallo updateMap2");
    return geotags;
}

/**
 * updates the list of geotags after a tagging or a discovery action
 *
 * @param geotags
 * @returns {number}
 */
function updateList(geotags) {
    let list = JSON.parse(geotags); // parse input string to json

    let ul = document.getElementById("discoveryResults");
    ul.innerHTML = "";
    // loop through the list of geotag elements and create a list entry for each
    list.forEach(function (gtag){
        let li = document.createElement("li");
        li.innerHTML = gtag.name + "</br> (" + gtag.latitude + "," + gtag.longitude + ") </br>" + gtag.hashtag;
        li.classList.add("listElement")
        ul.appendChild(li);
    })
    // delete the tagging inputs
    document.getElementById("tagFormName").value="";
    document.getElementById("tagFormHashtag").value="";

    listItems = paginatedList.querySelectorAll("li");

    return parseInt(document.getElementById("discoveryResults").innerHTML);
}

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    updatePage();
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

/**
 * asynchrone Funkion für tagging event-listener
 *
 * @param geotag
 * @returns {Promise<any>}
 */
async function tagging(geotag){
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });
    return await response.json();
}

/**
 * asynchrone Funkion für discovery event-listener
 *
 * @param searchInput
 * @returns {Promise<any>}
 */
async function discovery(searchInput){
    let response = await fetch("http://localhost:3000/api/geotags/" + searchInput,{
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    console.log(response);
    return await response.json();
}

/**
 * event-listener für den Tagging Submit Button
 */
document.getElementById("tagFormSubmitButton").addEventListener("click", function (evt) {
    evt.preventDefault();// blocks default event handling

    let geotag = {
        name: document.getElementById("tagFormName").value,
        latitude: document.getElementById("tagFormLatitude").value,
        longitude: document.getElementById("tagFormLongitude").value,
        hashtag: document.getElementById("tagFormHashtag").value
    }

    tagging(geotag).then(updateMap2).then(updateList).then(updatePage);
    console.log(listItems);
});

/**
 * event-listener für den Discovery Submit Button
 */
document.getElementById("disFormSubmitButton").addEventListener("click", function (evt) {
    evt.preventDefault();

    currentPage = 1;

    let searchTerm = document.getElementById("disFormSearch").value;

    discovery(searchTerm).then(updateMap2).then(updateList).then(updatePage).catch(error => alert("Search term does not exist"));
});

prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
});

nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
});

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);