var ET = function () {};
var LT_ET_RATE     = ET.LT_ET_RATE     = 3600 / 175;
var SEC_IN_MILLIS  = ET.SEC_IN_MILLIS  = 1000;
var MIN_IN_MILLIS  = ET.MIN_IN_MILLIS  = SEC_IN_MILLIS * 60;
var HOUR_IN_MILLIS = ET.HOUR_IN_MILLIS = MIN_IN_MILLIS * 60;
var DAY_IN_MILLIS  = ET.DAY_IN_MILLIS  = HOUR_IN_MILLIS * 24;
var MOON_IN_MILLIS = ET.MOON_IN_MILLIS = DAY_IN_MILLIS * 32;
var YEAR_IN_MILLIS = ET.YEAR_IN_MILLIS = MOON_IN_MILLIS * 12;

ET.prototype.setLtMillis = function (ltMillis) {
  return this.setEtMillis(ltMillis * LT_ET_RATE);
};

ET.prototype.setEtMillis = function (etMillis) {
  this.time   = etMillis;
  this.millis = etMillis % SEC_IN_MILLIS;
  this.second = Math.floor(etMillis /  SEC_IN_MILLIS) % 60;
  this.minute = Math.floor(etMillis /  MIN_IN_MILLIS) % 60;
  this.hour   = Math.floor(etMillis / HOUR_IN_MILLIS) % 24;
  this.day    = Math.floor(etMillis /  DAY_IN_MILLIS) % 32;
  this.moon   = Math.floor(etMillis / MOON_IN_MILLIS) % 12;
  this.year   = Math.floor(etMillis / YEAR_IN_MILLIS);
  return this;
};

ET.prototype.setNow = function () {
  return this.setLtMillis(new Date().getTime());
};

ET.prototype.calcStartET = function () {
  var pastMillis = SEC_IN_MILLIS * this.second +
                   MIN_IN_MILLIS * this.minute +
                   HOUR_IN_MILLIS * (this.hour % 8);
  return new ET().setEtMillis(this.time -pastMillis);
};

exports.ET = ET;
