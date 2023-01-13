// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */
const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");
/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
var geotag_id = 0; //Eine globale numerische Identifikation fuer die GeoTags
class InMemoryGeoTagStore{
    #geotags = [];

    constructor() {
        this.populateWithExamples();
    }

    get returnGeoTags() {
        return this.#geotags;
    }

    addGeoTag(lat, long, name, hash) {
        let geoTag = new GeoTag(lat,long,name,hash,geotag_id);
        this.#geotags.push(geoTag);
        geotag_id += 1;
        return geoTag;
    }

    removeGeoTag(name) {
        for(let i = 0; i < this.#geotags.length;) {
            if(this.#geotags[i].name === name) {
                this.#geotags.splice(i, 1);
            }else {
                i++;
            }
        }
    }

    getNearbyGeoTags(lat, long, rad) {
        let result = [];
        for(let i = 0; i < this.#geotags.length; i++){
            if ((this.#distance(lat,long,this.#geotags[i])<=rad)){
                result.push(this.#geotags[i]);
            }
        }
        return result;
    }

    searchNearbyGeoTags(lat, long, search, rad) {
        let result = [];
        for(let i = 0; i < this.#geotags.length; i++) {
            if (this.#distance(lat,long,this.#geotags[i]) <= rad && (this.#geotags[i].name.toLowerCase().includes(search.toLowerCase()) || this.#geotags[i].hashtag.toLowerCase().includes(search.toLowerCase()))){
                result.push(this.#geotags[i]);
            }
        }
        return result;
    }

    #distance(lat,long,tag) {
        return Math.sqrt(Math.pow(tag.latitude-lat,2) + Math.pow(tag.longitude-long,2));
    }


    populateWithExamples() {
        GeoTagExamples.tagList.forEach(element => {
            this.addGeoTag(element[1], element[2], element[0], element[3]);
        })
    }

    //Wegen Aufgabe 4 wurden folgende Methoden noch hinzugefuegt
    
    /**
     * Gibt einen Array mit allen GeoTags, die 'pName' in ihrem Namen oder Hashtag haben, zurueck
     */
    getGeoTagByName(pName) {
        let result = [];

        for(const currGeoTag of this.#geotags) {
            if (currGeoTag.name.toLowerCase().includes(pName.toLowerCase()) || 
                currGeoTag.hashtag.toLowerCase().includes(pName.toLowerCase())){
                result.push(currGeoTag);
            }
        }

        return result;
    }

    /**
     * Gibt den GeoTag mit der Id 'pId' zurueck
     */
    getGeoTagById(pId) {
        let geoTagToReturn = null;
        let idSearch = Number.parseInt(pId);

        let i = 0;
        let found = false;
        while (!found && i < this.#geotags.length) {
            if (this.#geotags[i].id === idSearch) {
                geoTagToReturn = this.#geotags[i];
                found = true;
            }

            i += 1;
        }

        return geoTagToReturn;
    }

    /**
     * Aendert die Attribute von einem GeoTag mit der Id 'pId' zu den Attributen vom GeoTag 'pNewGeoTag'
     * 
     * Gibt 'null' zurueck, falls das GeoTag mit 'pId' nicht exisitiert ansonsten das gänderte GeoTag.
     */ 
    changeGeoTagOf(pId, pNewGeoTag) {
        let geoTagToChange = this.getGeoTagById(pId);

        if (geoTagToChange !== null) {
            geoTagToChange.name      = pNewGeoTag.name;
            geoTagToChange.latitude  = pNewGeoTag.latitude;
            geoTagToChange.longitude = pNewGeoTag.longitude;
            geoTagToChange.hashtag   = pNewGeoTag.hashtag;

            return geoTagToChange;

        } else return null;
    }

    /**
     * @author david
     *
     * Sucht in allen geotags nach einem namen oder hashtag der mit den eingegebenen Buchstaben übereinstimmt.
     *
     * @param searchInput
     * @returns {*[]}
     */
    searchForInput(searchInput) {
        let result = [];
        for(let i = 0; i < this.#geotags.length; i++) {
            if ((this.#geotags[i].name.toLowerCase().includes(searchInput.toLowerCase()) || this.#geotags[i].hashtag.toLowerCase().includes(searchInput.toLowerCase()))){
                result.push(this.#geotags[i]);
            }
        }
        return result;
    }
}

module.exports = InMemoryGeoTagStore