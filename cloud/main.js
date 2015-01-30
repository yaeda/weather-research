var _ = require('underscore');
var api = require('cloud/api.js');
var ET = require('cloud/et.js').ET;

var WeatherDataObj = Parse.Object.extend("WeatherData");

//
// <year>-<moon>-<day>-<hour>-<area>
//
var generateWeatherId = function (weatherObj) {
  return [weatherObj.get('start_et_year'),
          weatherObj.get('start_et_moon'),
          weatherObj.get('start_et_day'),
          weatherObj.get('start_et_hour'),
          weatherObj.get('area')].join('-');
};

var fetchPastData = function (time) {
  var query = new Parse.Query(WeatherDataObj);
  query.greaterThanOrEqualTo('start_et_time', time);
  query.limit(150); // > 24 * 5
  return query.find().then(
    function(pastDataList) { // success
      var result = {};
      for (var i = 0, l = pastDataList.length; i < l; i++) {
        var pastData = pastDataList[i];
        var id = generateWeatherId(pastData);
        result[id] = pastData;
      }
      return Parse.Promise.as(result);
    });
};

var crawl = function (success, error) {
  api.get(function (obj) {
    var dataList = obj.dataList;
    if (dataList.length !== 24 * 5) {
      console.log('not full data : data.length = ' + dataList.length);
    }

    var hour = obj.hour;
    var curLT = new Date();
    var curET = new ET().setNow();
    if (curET.hour !== hour) {
      error('hour is not matched : curET.hour = ' + curET.hour + ', hour = ' + hour);
      return;
    }

    var startBaseET = curET.calcStartET();
    var startEtList = [
      new ET().setEtMillis(startBaseET.time - ET.HOUR_IN_MILLIS * 8),
      startBaseET,
      new ET().setEtMillis(startBaseET.time + ET.HOUR_IN_MILLIS * 8),
      new ET().setEtMillis(startBaseET.time + ET.HOUR_IN_MILLIS * 8 * 2),
      new ET().setEtMillis(startBaseET.time + ET.HOUR_IN_MILLIS * 8 * 3),
    ];

    fetchPastData(startEtList[0].time).then(function(pastData) {
      var promises = [];
      _.each(dataList, function(data) {
        var area = data.area;
        var weather = data.weather;
        var startET = startEtList[data.time + 1];

        var weatherData = new WeatherDataObj();
        weatherData.set('area', area);
        weatherData.set('weather', weather);
        // weather start et time
        weatherData.set('start_et_year', startET.year);
        weatherData.set('start_et_moon', startET.moon);
        weatherData.set('start_et_day', startET.day);
        weatherData.set('start_et_hour', startET.hour);
        weatherData.set('start_et_time', startET.time);
        // lt epoch time
        weatherData.set('fetched_lt_time', curLT.getTime());

        var id = generateWeatherId(weatherData);
        if (pastData[id] === undefined) {
          promises.push(weatherData.save());
        } else {
          if (pastData[id].get('weather') !== weatherData.get('weather')) {
            console.log('find different weather : ' + pastData[id].get('weather') +
                        ' !== ' + weatherData.get('weather'));
          }
        }
      }); // _.each
      return Parse.Promise.when(promises);
    }).then(function () {
      success();
      return;
    }, function (err) {
      error(err);
      return;
    });

  }, error);
}

var crawlBase = function (request, responseOrStatus) {
  crawl(function () {
    responseOrStatus.success('success');
  }, function (msg) {
    console.error(msg);
    responseOrStatus.error();
  });
}

Parse.Cloud.define('crawl', crawlBase);
Parse.Cloud.job('fetch', crawlBase);
