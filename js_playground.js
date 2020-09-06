var short = require('short-uuid');

var translator = short();

console.log(translator.generate());