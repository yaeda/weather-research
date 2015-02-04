define([
  'backbone',
  'parse',
  'models/Weather',
  'collections/WeatherList',
  'utils/et'
],
function(Backbone, Parse, Weather, WeatherList, ET) {
  "use strict";

  // External dependencies
  var Backbone = require('backbone');

  // Defining the application router
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function () {
      var et = new ET().setNow().calcStartET();
      var fetchStartTime = et.time - ET.HOUR_IN_MILLIS;
      var weathers = new WeatherList();
      var query = new Parse.Query(Weather);
      query.greaterThanOrEqualTo('start_et_time', fetchStartTime);
      query.limit(24 * 4);
      weathers.query = query;
      weathers.fetch().then(function (result) {
        console.log(result.length);
      });
    }
  });

  return Router;
});
