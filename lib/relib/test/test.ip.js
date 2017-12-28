'use strict';
var r = require('recoo');
var rb = require('../')
, ip = rb.ip.ip, v4 = rb.ip.v4, v6 = rb.ip.v6;
var chai = require('chai'), assert = chai.assert;

// console.log(v4.regex);
// console.log(v6.regex);
// console.log(ip.regex);

var is_ipv4 = [
'0.0.0.0',
'8.8.8.8',
'127.0.0.1',
'100.100.100.100',
'192.168.0.1',
'18.101.25.153',
'123.23.34.2',
'172.26.168.134',
'212.58.241.131',
'128.0.0.0',
'23.71.254.72',
'223.255.255.255',
'192.0.2.235',
'99.198.122.146',
'46.51.197.88',
'173.194.34.134'
];

var not_ipv4 = [
'.100.100.100.100',
'100..100.100.100.',
'100.100.100.100.',
'999.999.999.999',
'256.256.256.256',
'256.100.100.100.100',
'123.123.123',
'http://123.123.123'
];

var is_ipv6 = [
'1::',
'1::8',
'1::7:8',
'1:2:3:4:5:6:7:8',
'1:2:3:4:5:6::8',
'1:2:3:4:5:6:7::',
'1:2:3:4:5::7:8',
'1:2:3:4:5::8',
'1:2:3::8',
'1::4:5:6:7:8',
'1::6:7:8',
'1::3:4:5:6:7:8',
'1:2:3:4::6:7:8',
'1:2::4:5:6:7:8',
'::2:3:4:5:6:7:8',
'1:2::8'
];

var not_ipv6 = [
'1:2:3:4:5:6:1.2.3.4',
'::',
'1:',
':1'
];

describe('ip', function() {

  it('v4', function() {
    assert.equal(v4.is('192.168.1.1'), true);
    assert.equal(v4.contain('192.168.1.a 192.168.1.1'), true);
    assert.deepEqual(v4.match('192.168.1.a 192.68.1.1-8.8.8.8.'), [ '192.68.1.1', '8.8.8.8' ]);

    is_ipv4.forEach(function (el) {
      assert.ok(ip({exact: true}).test(el));
      assert.ok(v4.is(el));
    });
    is_ipv4.forEach(function (el) {
      assert.ok((ip().exec('foo ' + el + ' bar') || [])[0] === el);
      assert.ok((v4.e().exec('foo ' + el + ' bar') || [])[0] === el);
    });
    not_ipv4.forEach(function (el) {
      assert.ok(!ip({exact: true}).test(el));
      assert.ok(!v4.is(el));
    });
  });

  it('v6', function(){
    is_ipv6.forEach(function (el) {
      assert.ok(ip({exact: true}).test(el));
      assert.ok(v6.is(el));
    });
    is_ipv6.forEach(function (el) {
      assert.ok((ip().exec('foo ' + el + ' bar') || [])[0] === el);
      assert.ok((v6.e().exec('foo ' + el + ' bar') || [])[0] === el);
    });
    not_ipv6.forEach(function (el) {
      assert.ok(!ip({exact: true}).test(el));
      assert.ok(!v6.is(el));
    });
  });

  //console.log(ip);
  it('ip', function(){
    assert.ok(ip.is('192.168.0.1'));
    assert.ok(ip.is('1:2:3:4:5:6:7:8'));
    assert.ok(!ip.is('unicorn 192.168.0.1'));

    assert.ok(ip.contain('unicorn 192.168.0.1'));
    assert.ok(ip.contain('unicorn 1:2:3:4:5:6:7:8'));
    assert.ok(ip.match('unicorn 192.168.0.1 cake 1:2:3:4:5:6:7:8 rainbow'));
  });

});
