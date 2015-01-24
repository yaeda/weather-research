var api = require('cloud/api.js');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

var WeatherDataObj = Parse.Object.extend("WeatherData");

var SEC_IN_MILLIS = 1000;
var MIN_IN_MILLIS = SEC_IN_MILLIS * 60;
var HOUR_IN_MILLIS = MIN_IN_MILLIS * 60;
var DAY_IN_MILLIS = HOUR_IN_MILLIS * 24;
var MOON_IN_MILLIS = DAY_IN_MILLIS * 32;
var YEAR_IN_MILLIS = MOON_IN_MILLIS * 12;

var calcEorzeaTime = function (ltMillis) {
  var etMillis = ltMillis * 3600 / 175;
  var etMinute = Math.floor(etMillis / MIN_IN_MILLIS) % 60;
  var etHour = Math.floor(etMillis / HOUR_IN_MILLIS) % 24;
  var etDay = Math.floor(etMillis / DAY_IN_MILLIS) % 32;
  var etMoon = Math.floor(etMillis / MOON_IN_MILLIS) % 12;
  var etYear = Math.floor(etMillis / YEAR_IN_MILLIS);
  return {
    minute: etMinute,
    hour: etHour,
    day: etDay,
    moon: etMoon,
    year: etYear
  }
}

var calcStartTime = function(et, shiftHour) {
  shiftHour = shiftHour !== undefined ? shiftHour : 0;
  var hour = et.hour + shiftHour;
  while (hour < 0) {
    hour += 24;
  }
  hour = hour - hour % 8;

  return {
    minute: 0,
    hour: hour,
    day: et.day,
    moon: et.moon,
    year: et.year
  }
}

var calcStartHour = function (hour) {
  while (hour < 0) {
    hour += 24;
  }
  return hour - hour % 8;
};

var crawl = function (success, error) {
  api.get(function (obj) {
    var dataList = obj.dataList;
    var hour = obj.hour;
    var time = new Date().getTime();

    var curET = calcEorzeaTime(time);
    if (curET.hour !== hour) {
      error('hour is not matched : curET.hour = ' + curET.hour + ', hour = ' + hour);
      return;
    }

    var baseStartHour = calcStartHour(hour);

    if (dataList.length !== 24 * 5) {
      console.log('not full data : data.length = ' + dataList.length);
    }

    for (var i = 0, l = dataList.length; i < l; i++) {
      var data = dataList[i];
      var area = +data.area;
      var weather = +data.weather;
      var startHour = calcStartHour(baseStartHour + data.time * 8);

      var weatherData = new WeatherDataObj();
      weatherData.set('area', area);
      weatherData.set('weather', weather);
      weatherData.set('start_hour', startHour);
      // weather start et time
      // fetched ET time
      weatherData.set('fetched_et_year', curET.year);
      weatherData.set('fetched_et_moon', curET.moon);
      weatherData.set('fetched_et_day', curET.day);
      weatherData.set('fetched_et_hour', curET.hour);
      weatherData.set('fetched_et_minute', curET.minute);
      // lt epoch time
      weatherData.set('fetched_lt_time', time);

      /*
      watherData.save(null, {
      error: function (data, error) {
      console.error('Failed to create new object, with error code: ' + error.message);
      }
      });
      */
    }

    success();
  }, error);
}

var crawlBase = function (request, responseOrStatus) {
  crawl(function () {
    responseOrStatus.success('success');
  }, function (msg) {
    console.error(msg);
    //console.err('Request failed with response code ' + httpResponse.status);
  });
}

Parse.Cloud.define('crawl', crawlBase);
Parse.Cloud.job('fetch', crawlBase);
