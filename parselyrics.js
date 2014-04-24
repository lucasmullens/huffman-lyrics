var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var alldata = [];

function countWords(haystack, needle) {
    var words = haystack.split(needle);
    var count = {};
    for (var i = 0, len = words.length; i < len; i++) {
        if (words[i] == "")
            continue;
        if (count.hasOwnProperty(words[i])) {
            count[words[i]] = parseInt(count[words[i]], 10) + 1;
        }
        else {
            count[words[i]] = 1;
        }
    }
    return count;
}

var parsePage = function(url, artistname, genre, subgenre) {
    count++;
    request(url, function(err, resp, html) {
        if (err) {
            throw err;
        }
        var artist = {};
        artist["artist"] = artistname;
        artist.genre = genre;
        artist.subgenre = subgenre;
        artist.songs = [];
        var $ = cheerio.load(html);
        var songcount = 0;
        $("#mw-content-text ol>li>b>a").each(function() {
            var url = $(this).attr("href");
            var songname = $(this).text();
            url = "http://lyrics.wikia.com" + url;
            //skip songs with no lyrics
            console.log(url);
            if (url.indexOf("?action=edit&redlink=1") == -1){
                songcount++;
                request(url, function(err, resp, html) {
                    if (err) {
                        throw err;
                    }
                    var song = {};
                    var $ = cheerio.load(html);
                    var lyrics = $(".lyricbox");
                    lyrics.find("div").remove();
                    lyrics.find("br").each(function() {
                        $(this).after(" ");
                    });
                    text = lyrics.text();
                    text = text.replace(/<!--[\s\S]*?-->/g, "");//remove that comment at the end
                    text = text.replace(/[^a-zA-Z0-9 :]/g, "").toLowerCase();//remove special characters and lowercase it
                    song.name = songname;
                    song.lyrics = text;
                    song.words = countWords(text," ");
                    artist.songs.push(song);
                    if (artist.songs.length == songcount){
                        alldata.push(artist);
                        if (alldata.length == count){
                            finished();
                        }
                    }
                });
            }
        });
    });
}

var count = 0;
//wikia has no rate limit! Woooo
parsePage('http://lyrics.wikia.com/Neon_Trees', "Neon Trees", "Alternative", "Alternative-Rock");

function finished() {
    var outputFilename = 'songs.json';

    // console.log(alldata);
    fs.writeFile(outputFilename, JSON.stringify(alldata), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename);
        }
    });
}