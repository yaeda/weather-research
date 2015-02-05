define([
  'backbone',
  'parse',
  'models/Weather',
  'collections/WeatherList',
  'views/WeatherList',
  'utils/et'
],
function(Backbone, Parse, Weather, WeatherList, WeatherListView, ET) {
  "use strict";

  // External dependencies
  var Backbone = require('backbone');

  // Defining the application router
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function () {
      new WeatherListView();
    }
  });

  return Router;
});
