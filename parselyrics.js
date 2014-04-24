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
        } else {
            count[words[i]] = 1;
        }
    }
    return count;
}

var parsePage = function (url, artistname, genre, subgenre) {
    count++;
    request(url, function (err, resp, html) {
        try {
            if (err) {
                console.log("ERROR ARTIST: " + artistname);
                return;
            }
            var artist = {};
            artist["artist"] = artistname;
            artist.genre = genre;
            artist.subgenre = subgenre;
            artist.songs = [];
            var $ = cheerio.load(html);
            var songcount = 0;
            $("#mw-content-text ol>li>b>a").each(function () {
                var url = $(this).attr("href");
                var songname = $(this).text();
                url = "http://lyrics.wikia.com" + url;
                //skip songs with no lyrics
                // console.log(url);
                if (url.indexOf("?action=edit&redlink=1") == -1) {
                    songcount++;
                    request(url, function (err, resp, html) {
                        try {
                            if (err) {
                                console.log("ERROR SONG: " + songname);
                                return;
                            }
                            var song = {};
                            var $ = cheerio.load(html);
                            var lyrics = $(".lyricbox");
                            lyrics.find("div").remove();
                            lyrics.find("br").each(function () {
                                $(this).after(" ");
                            });
                            text = lyrics.text();
                            text = text.replace(/<!--[\s\S]*?-->/g, ""); //remove that comment at the end
                            text = text.replace(/[^a-zA-Z0-9 :]/g, "").toLowerCase(); //remove special characters and lowercase it
                            song.name = songname;
                            song.lyrics = text;
                            song.words = countWords(text, " ");
                            artist.songs.push(song);
                            console.log("Song '" + song.name + "' finished.");
                            if (artist.songs.length == songcount) {
                                alldata.push(artist);
                                console.log("Artist '" + artist["artist"] + "' finished.");
                                if (alldata.length == count) {
                                    finished();
                                }
                            }

                        } catch (err) {
                            //do nothing
                        }
                    });
                }
            });
        } catch (err) {
            //do nothing
        }
    });
}

var count = 0;

//wikia has no rate limit! Woooo

//Alternative Rock

parsePage('http://lyrics.wikia.com/Pearl_Jam', "Pearl Jam", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/Nirvana', "Nirvana", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/Soundgarden', "Soundgarden", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/Alice_In_Chains', "Alice in Chains", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/Stone_Temple_Pilots', "Stone Temple Pilots", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/Black_Sabbath', "Black Sabbath", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/Screaming_Trees', "Screaming Trees", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/The_Melvins', "The Melvins", "Alternative Rock", "Grunge");
parsePage('http://lyrics.wikia.com/Mudhoney', "Mudhoney", "Alternative Rock", "Grunge");

parsePage('http://lyrics.wikia.com/PANIC!_At_The_Disco', "Panic! At the Disco", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Simple_Plan', "Simple Plan", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Jimmy_Eat_World', "Jimmy Eat World", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Dashboard_Confessional', "Dashboard Confessional", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Three_Days_Grace', "Three Days Grace", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Jawbreaker', "Jawbreaker", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Sunny_Day_Real_Estate', "Sunny Day Real Estate", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Green_Day', "Green Day", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/Foo_Fighters', "Foo Fighters", "Alternative Rock", "Emo");
parsePage('http://lyrics.wikia.com/The_Offspring', "The Offspring", "Alternative Rock", "Emo");

parsePage('http://lyrics.wikia.com/REM', "R.E.M.", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/U2', "U2", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/The_Cure', "The Cure", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/Camper_Van_Beethoven', "Camper Van Beethoven", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/The_Smiths', "The Smiths", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/XTC', "XTC", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/The_Replacements', "The Replacements", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/The_Church', "The Church", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/Midnight_Oil', "Midnight Oil", "Alternative Rock", "College Rock");
parsePage('http://lyrics.wikia.com/Love_And_Rockets', "Love and Rockets", "Alternative Rock", "College Rock");

parsePage('http://lyrics.wikia.com/Suede', "Suede", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/Blue', "Blue", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/Oasis/Oasis', "Oasis", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/The_Verve', "The Verve", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/Pulp', "Pulp", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/Cast', "Cast", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/Space', "Space", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/Sleeper', "Sleeper", "Alternative Rock", "Britpop");
parsePage('http://lyrics.wikia.com/Elastica', "Elastica", "Alternative Rock", "Britpop");

//Hip-Hop

parsePage("http://lyrics.wikia.com/2_Skinnee_J%27s", "2 Skinnee J's", "Hip-Hop", "Nerdcore");
parsePage("http://lyrics.wikia.com/Beefy", "Beefy", "Hip-Hop", "Nerdcore");
parsePage("http://lyrics.wikia.com/Jesse_Dangerously", "Jesse Dangerously", "Hip-Hop", "Nerdcore");
parsePage("http://lyrics.wikia.com/Mc_Hawking", "MC Hawking", "Hip-Hop", "Nerdcore");
parsePage("http://lyrics.wikia.com/Optimus_Rhyme", "Optimus Rhyme", "Hip-Hop", "Nerdcore");
parsePage("http://lyrics.wikia.com/MC_Lars", "MC Lars", "Hip-Hop", "Nerdcore");
parsePage("http://lyrics.wikia.com/Mc_Chris", "MC Chris", "Hip-Hop", "Nerdcore");
parsePage("http://lyrics.wikia.com/YTCracker", "YTCracker", "Hip-Hop", "Nerdcore");

parsePage("http://lyrics.wikia.com/2Pac", "2Pac", "Hip-Hop", "Gangsta Rap");
parsePage("http://lyrics.wikia.com/Ice_Cube", "Ice Cube", "Hip-Hop", "Gangsta Rap");
parsePage("http://lyrics.wikia.com/Eazy-E", "Eazy-E", "Hip-Hop", "Gangsta Rap");
parsePage("http://lyrics.wikia.com/N.W.A", "N.W.A", "Hip-Hop", "Gangsta Rap");
parsePage("http://lyrics.wikia.com/Notorious_B.I.G.", "The Notorious B.I.G.", "Hip-Hop", "Gangsta Rap");
parsePage("http://lyrics.wikia.com/Mobb_Deep", "Mobb Deep", "Hip-Hop", "Gangsta Rap");
parsePage("http://lyrics.wikia.com/Game", "The Game", "Hip-Hop", "Gangsta Rap");
parsePage("http://lyrics.wikia.com/Dr._Dre", "Dr. Dre", "Hip-Hop", "Gangsta Rap");

parsePage("http://lyrics.wikia.com/A_Tribe_Called_Quest", "A Tribe Called Quest", "Hip-Hop", "Jazz Rap");
parsePage("http://lyrics.wikia.com/De_La_Soul", "De La Soul", "Hip-Hop", "Jazz Rap");
parsePage("http://lyrics.wikia.com/The_Roots", "The Roots", "Hip-Hop", "Jazz Rap");
parsePage("http://lyrics.wikia.com/Guru", "Guru", "Hip-Hop", "Jazz Rap");
parsePage("http://lyrics.wikia.com/Digable_Planets", "Digable Planets", "Hip-Hop", "Jazz Rap");
parsePage("http://lyrics.wikia.com/Common", "Common", "Hip-Hop", "Jazz Rap");
parsePage("http://lyrics.wikia.com/Pete_Rock", "Pete Rock", "Hip-Hop", "Jazz Rap");
parsePage("http://lyrics.wikia.com/Q-Tip", "Q-Tip", "Hip-Hop", "Jazz Rap");

parsePage("http://lyrics.wikia.com/Ludacris", "Ludacris", "Hip-Hop", "Crunk");
parsePage("http://lyrics.wikia.com/Lil_Jon", "Lil Jon", "Hip-Hop", "Crunk");
parsePage("http://lyrics.wikia.com/Three_6_Mafia", "Three 6 Mafia", "Hip-Hop", "Crunk");
parsePage("http://lyrics.wikia.com/Ying_Yang_Twins", "Ying Yang Twins", "Hip-Hop", "Crunk");
parsePage("http://lyrics.wikia.com/YoungBloodZ", "YoungBloodZ", "Hip-Hop", "Crunk");
parsePage("http://lyrics.wikia.com/Lil_Boosie", "Lil Boosie", "Hip-Hop", "Crunk");
parsePage("http://lyrics.wikia.com/Young_Jeezy", "Young Jeezy", "Hip-Hop", "Crunk");
parsePage("http://lyrics.wikia.com/Petey_Pablo", "Petey Pablo", "Hip-Hop", "Crunk");



function finished() {
    var outputFilename = 'songs.json';

    // console.log(alldata);
    fs.writeFile(outputFilename, JSON.stringify(alldata), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename);
        }
    });
}