'use strict';
var r = require('recoo');

var v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';
var v6 = '(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+';

var v4 = r()
.a('25[0-5]')
.or('2[0-4][0-9]')
.or('1[0-9][0-9]')
.or('[1-9][0-9]')
.or('[0-9]')
.p()

var v6 = r()
.p('[0-9a-fA-F:]',1,4)
.a(r(':').p('[0-9a-fA-F]',1,4).or(':').p().p(0,2,7))
.p(0,'+')

exports.v4 = v4.a(r('\\.').a(v4).p(0,3));

exports.v6 = v6;

exports.ip = function(opts) {
  opts = opts || {};
  // return opts.exact
  // ? new RegExp('(?:^' + v4 + '$)|(?:^' + v6 + '$)')
  // : new RegExp('(?:' + v4 + ')|(?:' + v6 + ')', 'g');
  return opts.exact
  ? r(r(v4).exact()).or(r(v6).exact()).e()
  : r(r(v4).p()).or(r(v6).p()).opt('g').e()
};

exports.ip.is = function(str) {
  return r(r(v4).exact()).or(r(v6).exact()).e().test(str);
};

exports.ip.contain = function(str) {
  return r(r(v4).p()).or(r(v6).p()).opt('g').e().test(str);
};

exports.ip.match = function(str) {
  return str.match(r(r(v4).p()).or(r(v6).p()).opt('g').e());
};
