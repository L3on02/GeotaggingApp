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
class InMemoryGeoTagStore{
    static #geotags = [];

    constructor() {
        this.populateWithExamples();
    }

    addGeoTag(lat, long, name, hash) {
        this.#geotags.push(new GeoTag(name,hash,long,lat));
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
        return this.#geotags.filter((tag) => {
            return Math.sqrt(Math.pow(tag.latitude-lat,2)) + Math.pow(tag.longitude-lat,2) <= rad;
        });
    }

    searchNearbyGeoTags(lat, long, search, rad) {
        return this.getNearbyGeoTags(lat, long, rad).filter((tag) => {
            return tag.name.toLowerCase().includes(search) || tag.hashtag.toLowerCase().includes(search);
        });
    }


    populateWithExamples(name, lat, long, hashtag) {
        for(let element in GeoTagExamples.tagList) {
            this.addGeoTag(element[1], element[2], element[0], element[3]);
        }
    }
}
module.exports = InMemoryGeoTagStore
