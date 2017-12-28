'use strict';
var r = require('recoo');
var ip = require('../lib/ip.js').v4;
var comm = require('../lib/common.js');
var tlds = require('../tlds.json').join('|');

var auth = '(?:\\S+(?::\\S*)?@)?';
var domain = '(?:\\.(?:xn--[a-z0-9\\-]{1,59}|(?:[a-z\\u00a1-\\uffff0-9]+-?){0,62}[a-z\\u00a1-\\uffff0-9]{1,63}))*';
var host = '(?:xn--[a-z0-9\\-]{1,59}|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?){0,62}[a-z\\u00a1-\\uffff0-9]{1,63}))';
var path = '(?:\/[^\\s]*)?';
var port = '(?::\\d{2,5})?';
var protocol = '(?:(?:(?:\\w)+:)?\/\/)?';
var tld = '(?:\\.(?:xn--[a-z0-9\\-]{1,59}|' + tlds + '+))';

var url = r().a(ip).or().p('localhost').or().a(host).a(domain).a(tld)
var url = r().a(protocol).a(auth).p(url).a(port).a(path)

//console.log(url.regex);
module.exports = url;
