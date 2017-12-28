'use strict';
var rb = require('../'), email = rb.email;
var chai = require('chai'), assert = chai.assert;


var is_email = [
'sindresorhus@gmail.com',
'foo@bar',
'test@about.museum',
'test@nominet.org.uk',
'test.test@sindresorhus.com',
'te+st@255.255.255.255',
'a@sindresorhus.com',
'test@e.com',
'test@xn--hxajbheg2az3al.xn--jxalpdlp',
'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@sindresorhus.com',
'!#$%&amp;`*+/=?^`{|}~@sindresorhus.com',
'test@g--a.com',
'a@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hij',
'123@sindresorhus.com',
'"\\a"@sindresorhus.com',
'""@sindresorhus.com',
'"test"@sindresorhus.com',
'"\\""@sindresorhus.com',
'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklmn@sindresorhus.com',
'test@iana.co-uk',
'a@a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v',
'test@foo-bar.com',
];

var not_email = [
'@',
'@io',
'@sindresorhus.com',
'test..sindresorhus.com',
'test@iana..com',
'test@sindresorhus.com.',
'.test@sindresorhus.com',
'sindre@sindre@sindre.com'
];

var contains = [
'123@notvalid.com.',
'abc foo@www.abc.com, 123@qq.com'
];

describe('email', function() {

  it('is', function() {
    is_email.forEach(function(str){
      assert.ok(email.is(str));
    });
  });

  it('not', function() {
    not_email.forEach(function(str){
      assert.ok(!email.is(str));
    });
  });

  it('contain', function() {
    is_email.forEach(function(str){
      assert.ok(email.contain(str));
    });
    contains.forEach(function(str){
      assert.ok(email.match(str));
    });
  });

});
