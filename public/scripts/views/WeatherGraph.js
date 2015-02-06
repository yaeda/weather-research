define([
  'underscore',
  'c3',
  'jquery',
  'models/Weather',
  'collections/WeatherList',
  'views/Weather',
  'utils/et'
], function (_, c3, $, Weather, WeatherList, WeatherView, ET) {
  'use strict';

  var WeatherListView = Parse.View.extend({

    events: {},

    el: '#weather_graph',

    initialize: function () {
      var self = this;

      _.bindAll(this, 'addOne', 'addAll', 'render', 'updateArea');

      $('.selector').on('change', this.updateArea);

      this.chart = c3.generate({
        bindto: '#weather_graph',
        data: {
          columns: []
        }
      });

      //this.$el.html(this.template());

      this.weathers = new WeatherList();
      this.weathers.comparator = function (weather) {
        return weather.get('start_et_time');
      };

      // set query
      var query = new Parse.Query(Weather);
      query.equalTo('area', 1);
      query.limit(1000);
      this.weathers.query = query;

      // event
      //this.weathers.bind('add', this.addOne);
      this.weathers.bind('reset', this.addAll);
      //this.weathers.bind('all', this.render);

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
      //this.weathers.each(this.addOne);
      var areaId =  this.weathers.at(0).get('area');
      var dataName = 'area ' + areaId;
      var weatherList = this.weathers.pluck('weather');
      weatherList.unshift(dataName);
      this.chart.load({
        columns: [
          weatherList
        ]
      });
    },

    updateArea: function (event) {
      //event.target.
      var areaId = event.target.selectedIndex + 1;
      this.weathers.query.equalTo('area', areaId);
      this.weathers.fetch();
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
