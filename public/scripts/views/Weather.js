define([
  'backbone'
], function (Backbone) {
  'use strict';

  var WeatherView = Backbone.View.extend({
    template: _.template('<i class="icon-weather icon-weather-<%= weather %>"></i>'),

    tagName: 'span',

    events: {},

    initialize: function () {},

    render: function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

  });

  return WeatherView;
});
