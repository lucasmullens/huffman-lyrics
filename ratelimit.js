var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var count = 0;
var parsePage = function(url) {
    request(url, function(err, resp, html) {
        if (err) {
            throw err;
        }
        console.log(++count);
        console.log("Page length: " + html.length);
    });
}
for (var i = 0; i < 1000; i++) {
    var url = "http://lyrics.wikia.com/Neon_Trees";
    parsePage(url);
};