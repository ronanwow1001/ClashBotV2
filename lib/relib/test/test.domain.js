'use strict';
var punycode = require('punycode');
var rb = require('../'), domain = rb.domain;
var chai = require('chai'), assert = chai.assert;

var domains = [
'G.co',
'example.com',
'foo.example.com',
'bar.foo.example.com',
'a.sub.domain.org',
'exa-mple.co.uk',
'example.co.uk',
'example.2000.hu',
'example.aerodrome.aero'
];

var notDomains = [
'exa_mple.com',
'ex*mple.com',
'example',
'1234',
'invalid_domain',
'some-example.construction',
'this.123456789-123456789-123456789-123456789-123456789-123456789-long.com'
];

var containDomains = [
'notvalid.com.',
'.notvalid.com',
'-notvalid.com',
'notvalid.com-',
'abc www.abc.com'
];

describe('domain', function() {

  it('*', function() {
    assert.equal(domain.is('markzhan.com'), true);
    assert.equal(domain.is('中国.com'), false);
    assert.equal(domain.is(punycode.toASCII('中国.com')), true);
    assert.equal(domain.opt('i').is('MARKZHAN.COM'), true);
    assert.ok(!domain.contain('abc wwwabccom'));
    assert.ok(domain.match('abc www.abc.com'));
    assert.ok(!domain.match('abc wwwabccom'));
    
    domains.forEach(function(name){
      assert.ok(domain.is(name));
    });

    notDomains.forEach(function(name){
      assert.ok(!domain.is(name));
    });

    containDomains.forEach(function(name){
      assert.ok(!domain.is(name));
      assert.ok(domain.contain(name));
    });

  });

});
