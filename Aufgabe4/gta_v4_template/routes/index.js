// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');

const GeoTagStore = require('../models/geotag-store');

const router = express.Router();
const store = new GeoTagStore();
const rad = 10;

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
//const GeoTagStore = require('../models/geotag-store');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  const taglist = store.returnGeoTags;

  console.log(taglist);

  res.render('index', {
    ejs_taglist: taglist,
    ejs_latitude: "",
    ejs_longitude: "",
    
    json_taglist: JSON.stringify(taglist)
  })
});

router.post('/tagging', (req, res) => {

  let lat = req.body.formLatitude;
  let long = req.body.formLongitude;
  let name = req.body.formName;
  let hash = req.body.formHashtag;
  store.addGeoTag(lat, long, name, hash);

  const taglist = store.getNearbyGeoTags(lat, long, rad);

  res.render('index', {
    ejs_taglist: taglist,
    ejs_latitude: lat,
    ejs_longitude:long,
    json_taglist: JSON.stringify(taglist)
  });
});

router.post('/discovery', (req, res) => {

  let search = req.body.formSearch;
  let lat = req.body.formLatitude;
  let long = req.body.formLongitude;
  const taglist = store.searchNearbyGeoTags(lat, long, search, rad);

  res.render('index', {
    ejs_taglist: taglist,
    ejs_latitude: lat,
    ejs_longitude:long,
    json_taglist: JSON.stringify(taglist)
  });
});

module.exports = router;

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', function (req, res) {
  let listToReturn = [];

  let searchterm = req.body.search;
  let latitude   = req.body.latitude;
  let longitude  = req.body.longitude;

  if (searchterm != null && typeof searchterm === 'string') {

    if (latitude != null && typeof latitude === 'number' &&
       longitude != null && typeof longitude === 'number') {
        listToReturn = store.searchNearbyGeoTags(latitude, longitude, searchterm, rad);

       } else listToReturn = store.getGeoTagByName(searchterm);
  }

  res.json(listToReturn);
})

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', function (req, res) {
  let lat  = req.body.latitude;
  let long = req.body.longitude;
  let name = req.body.name;
  let hash = req.body.hashtag;

  let geoTag = store.addGeoTag(lat, long, name, hash);

  res.json(geoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', function (req, res) {
  let geoTag = store.getGeoTagById(req.params.id);

  if (geoTag != null) {
    res.json(geoTag.toJSON());

  } else res.status(404).send(); //geoTag nicht gefunden, Error.
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', function (req, res) {
  let lat  = req.body.latitude;
  let long = req.body.longitude;
  let name = req.body.name;
  let hash = req.body.hashtag;
  let id   = req.body.id;

  let changedGeoTag = new GeoTag(lat, long, name, hash, id)

  store.changeGeoTagOf(id, changedGeoTag);
  res.send(JSON.stringify(changedGeoTag));
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', function (req, res) {
  let geoTagToRemove = store.getGeoTagById(req.params.id);

  res.json(JSON.stringify(geoTagToRemove));

  if (geoTagToRemove !== undefined) {
    store.removeGeoTag(geoTagToRemove.name());
  }
});

module.exports = router;