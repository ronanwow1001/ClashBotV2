'use strict';
var r = require('recoo');

module.exports = {
  creditCard: r('(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})'),
  ssn: r('([0-9]{3}[-]*[0-9]{2}[-]*[0-9]{4})*'),
  slug: r('[a-z0-9-]+'),
  alphaNumeric: r('[a-zA-Z0-9]+'),
  number: r('[0-9]+'),
  basicAuth: r('\S+\:\S+'),
  html: r('<([a-z]+) *[^/]*?>')
}
