// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */
// const GeoTag = require('../models/geotag');
const express = require('express');
const GeoTagStore = require('../models/geotag-store');
const router = express.Router();
const store = new GeoTagStore();
const rad = 1;

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */
router.get('/', (req, res) => {
  res.render('index', {
    taglist: store.returnGeoTags,
    ejs_latitude: "",
    ejs_longitude: ""
  })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */
router.post('/tagging', (req, res) => {

  let lat = req.body.formLatitude;
  let long = req.body.formLongitude;
  let name = req.body.formName;
  let hash = req.body.formHashtag;
  store.addGeoTag(lat, long, name, hash);

  res.render('index', {
    taglist: store.getNearbyGeoTags(lat, long, rad),
    ejs_latitude: lat,
    ejs_longitude:long
  });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */
router.post('/discovery', (req, res) => {

  let search = req.body.formSearch;
  let lat = req.body.formLatitude;
  let long = req.body.formLongitude;

  res.render('index', {
    taglist: store.searchNearbyGeoTags(lat, long, search, rad),
    ejs_latitude: lat,
    ejs_longitude:long
  });
});

module.exports = router;
