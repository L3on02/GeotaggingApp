// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    #name;
    #hashtag;
    #longitude;
    #latitude;

    constructor(name,hashtag,longitude,latitude) {
        this.#name = name;
        this.#hashtag = hashtag;
        this.#longitude = longitude;
        this.#latitude = latitude;
    }

    get name() {
        return this.#name;
    }
    get hashtag() {
        return this.#hashtag;
    }
    get latitude() {
        return this.#latitude;
    }
    get longitude() {
        return this.#longitude;
    }
}

module.exports = GeoTag;
