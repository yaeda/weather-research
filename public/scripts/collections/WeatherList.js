define([
  'backbone',
  'parse',
  'models/Weather'
], function(Backbone, Parse, Weather) {
  'use strict';

  var WeatherCollection = Parse.Collection.extend({
    model: Weather,
  })

  return WeatherCollection;
});
