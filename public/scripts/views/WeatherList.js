define([
  'underscore',
  'models/Weather',
  'collections/WeatherList',
  'views/Weather',
  'utils/et'
], function (_, Weather, WeatherList, WeatherView, ET) {
  'use strict';

  var WeatherListView = Parse.View.extend({
    template: _.template([
      '<% for (var i = 0; i < 24; i++) { %>',
      '<ol>',
      '  <% for (var j = 0; j < 5; j++) { %>',
      '  <li></li>',
      '  <% } %>',
      '</ol>',
      '<% } %>'].join('')),

    events: {},

    el: '#main',

    initialize: function () {
      var self = this;

      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.$el.html(this.template());

      this.weathers = new WeatherList();

      // calc time
      var startBaseET = new ET().setNow().calcStartET();
      var startEtList = [
        new ET().setEtMillis(startBaseET.time - ET.HOUR_IN_MILLIS * 8),
        startBaseET,
        new ET().setEtMillis(startBaseET.time + ET.HOUR_IN_MILLIS * 8),
        new ET().setEtMillis(startBaseET.time + ET.HOUR_IN_MILLIS * 8 * 2),
        new ET().setEtMillis(startBaseET.time + ET.HOUR_IN_MILLIS * 8 * 3),
      ];
      this.weatherIds = [
        this.generateTimeId(startEtList[0]),
        this.generateTimeId(startEtList[1]),
        this.generateTimeId(startEtList[2]),
        this.generateTimeId(startEtList[3]),
      ]
      var fetchStartTime = startEtList[0].time - ET.HOUR_IN_MILLIS; // avoid msec offset

      // set query
      var query = new Parse.Query(Weather);
      query.greaterThanOrEqualTo('start_et_time', fetchStartTime);
      query.limit(24 * 4);
      this.weathers.query = query;

      // event
      this.weathers.bind('add', this.addOne);
      this.weathers.bind('reset', this.addAll);
      this.weathers.bind('all', this.render);

      // fetch
      this.weathers.fetch();
    },

    render: function () {
      console.log('render');
    },

    addOne: function (weather) {
      var view = new WeatherView({
        model: weather
      });
      var areaIndex = weather.get('area') - 1; // area range is [1, 24]
      var timeIndex = this.weatherIds.indexOf(this.generateWeatherId(weather))
      console.log(areaIndex, timeIndex);
      this.$el.find('ol').eq(areaIndex)
      .find('li').eq(timeIndex).html(view.render().el);
    },

    addAll: function (collection) {
      this.weathers.each(this.addOne);
    },

    //
    // <year>-<moon>-<day>-<hour>
    //
    generateTimeId: function (time) {
      return [time.year,
              time.moon,
              time.day,
              time.hour].join('-');
    },

    //
    // <year>-<moon>-<day>-<hour>
    //
    generateWeatherId: function (weather) {
      return [weather.get('start_et_year'),
              weather.get('start_et_moon'),
              weather.get('start_et_day'),
              weather.get('start_et_hour')].join('-');
    }

  });

  return WeatherListView;
});
