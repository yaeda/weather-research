define([
  'backbone',
  'views/WeatherList'
 function (Backbone, WeatherListView) {
  'use strict';

  var AppView = Backbone.View.extend({
    el: '#',

    initialize: function () {
      this.render();
    },

    render: function () {
      new WeatherListView();
    }
  });

  return AppView;
});
