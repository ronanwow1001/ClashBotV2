[![Build Status](https://api.travis-ci.org/markzhan/relib.svg?branch=master)](https://travis-ci.org/markzhan/relib)
[![Coverage Status](https://coveralls.io/repos/markzhan/relib/badge.svg)](https://coveralls.io/r/markzhan/relib)
[![NPM Downloads](https://img.shields.io/npm/dm/relib.svg?style=flat)](https://www.npmjs.org/package/relib)


# relib

A regular expression library for node.js.


## Installation

```sh
$ npm i relib --save
```

## Usage

```js
var ips = require('relib').ip
,v4 = ips.v4 ,v6 = ips.v6 ,ip = ips.ip;

console.log(v4.is('192.168.0.1')); // true
console.log(v6.is('1:2:3:4:5:6:7:8')); // true
console.log(ip.is('1:2:3:4:5:6:7:8')); // true
console.log(ip.contain('abc 192.168.0.1')); // true
console.log(ip.match('abc 1:2:3:4:5:6:7:8')); // ['1:2:3:4:5:6:7:8']

console.log(ip.e('unicorn 192.168.0.1').is()); // false
console.log(ip.e('unicorn 192.168.0.1').contain());  // true
console.log(ip.e('unicorn 192.168.0.1').match());  // [ '192.168.0.1' ]
console.log(ip.e().test('unicorn 192.168.0.1')); // = .contain() -> true
console.log(ip.exact().e().test('unicorn 192.168.0.1')); // = .is() -> fasle
console.log(v6.e()); // /(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+/
```

## API

- [RECOO API](#recoo)
- [IP Address Regex](#ip)
- [Email Address Regex](#email)
- [Domain Regex with IDN Support](#domain)
- [URLs Regex](#url)
...

<a name='recoo'></a>
### RECOO API

#### .is(String)

Check if a string is match the regex.

#### .contain(String)

Check if a string matching the regex.

#### .match(String)

Return an array if a string matching the regex.

See [RECOO](https://github.com/markzhan/recoo/blob/master/README.md) for details.

<a name='ip'></a>
### IP Address Regex

* **.v4.is(), v4.contain(), v4.match()** - IPv4 regex
* **.v6.is(), v6.contain(), v6.match()** - IPv6 regex
* **.ip.is(), ip.contain(), ip.match()** - IPv4 or IPv6

```js
var ips = require('relib').ip
,v4 = ips.v4 ,v6 = ips.v6 ,ip = ips.ip;

ip.is('1:2:3:4:5:6:7:8'); // true
ip.is('unicorn 192.168.0.1'); // false
ip.contain('unicorn 192.168.0.1 cake 1:2:3:4:5:6:7:8 rainbow'); // true
ip.match('unicorn 192.168.0.1 cake 1:2:3:4:5:6:7:8 rainbow'); // ['192.168.0.1', '1:2:3:4:5:6:7:8']

v4.is('192.168.0.1'); // true
v4.is('1:2:3:4:5:6:7:8'); // false
v6.is('1:2:3:4:5:6:7:8'); // true
```

<a name='email'></a>
### Email Address Regex

* **email.is(string)**  - Check if a string is email address.
* **email.contain(string)**  - Check if a string contains email address.
* **email.match(string)**  - Return an array if a string contains email address.

```js
var email = require('relib').email;

email.is('markzhann@gmail.com'); // true
email.contain('unicorn markzhann@gmail.com'); // true
email.match('unicorn markzhann@gmail.com cake john@doe.com rainbow'); // ['sindresorhus@gmail.com', 'john@doe.com']
```

<a name='domain'></a>
### Domain Regex

* **domain.is(string)**  - Check if a string is domain.
* **domain.contain(string)**  - Check if a string contains domain.
* **domain.match(string)**  - Return an array if a string contains domain.

```js
var domain = require('relib').domain;

domain.is('example.com'); // true
domain.is('unicorn example.com'); // false
domain.contain('unicorn example.com cake a.sub.domain.org rainbow'); // true
domain.match('unicorn example.com cake a.sub.domain.org rainbow'); // ['example.com', 'a.sub.domain.org']
```

<a name='url'></a>
### URLs Regex

* **url.is(string)**  - Check if a string is URL.
* **url.contain(string)**  - Check if a string contains URL.
* **url.match(string)**  - Return an array if a string contains URL.

```js
var url = require('relib').url;

url.is('https://github.com'); // true
url.contain('foo github.com bar google.com'); // true
url.match('foo https://github.com bar google.com'); // ['https://github.com', 'google.com']
```

...


## Contributions

To run the tests for **relib** simply run:
```sh
npm i && npm test  # install dev dependencies and test
```
For bugs and feature requests, [please create an issue](https://github.com/markzhan/relib/issues).

Pull requests is always welcome.

1. Fork it
2. Create your feature branch `git checkout -b my-new-feature`
3. Commit your changes `git commit -am 'Add some feature'`
4. Push to the branch `git push origin my-new-feature`
5. Create new Pull Request

[Contributors](https://github.com/markzhan/relib/graphs/contributors)


## License

MIT © 2015 [Mark Zhan](http://markzhan.com).
