define([
  'backbone',
  'parse'
], function(Backbone, Parse) {
  'use strict';

  var WeatherModel = Parse.Object.extend('WeatherData');

  return WeatherModel;
});
