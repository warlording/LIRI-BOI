require("dotenv").config();
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var arg = "";
arg = process.argv[3];
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
parseCommand(process.argv[2], arg);
function parseCommand(command, arg) {
    switch (command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifySong(arg);
        break;
    case "movie-this":
        movieInfo(arg);
        break;
    case "do-what-it-says":
        parseFileCommand();
        break;
    case undefined:
    case "":
        console.log("Yo im Liri. What do you require? Better not be difficult.x");
        break;
    default:
        console.log("Yeah that aint a command, nice try!");
        break;
    }
};
function myTweets(){
    var twitterUsername = process.argv[4];
        if(!twitterUsername){
            twitterUsername = "CoderBanks";
        }
    var params = {screen_name: twitterUsername, count: 20};
    console.log(twitterUsername);
    
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) { 
            for(var i = 0; i < tweets.length; i++) {
                var tick = i + 1;
                results = 
                    "\nTweet #" 
                    + tick + 
                    " <><><><><><><><><><><><><><><><><><><><><><><><>\n\n" 
                    + tweets[i].text + 
                    "\n\n  Tweeted on: " 
                    + tweets[i].created_at +
                    "\n  By: @" 
                    + tweets[i].user.screen_name +
                    "\n<><><><><><><><><><><><><><><><><><><><><><><><>";    
                console.log(results);
            }
        }
    });
};
function spotifySong(song) {
    song = (song || "Twilight Zone");
    console.log("Really? That song? You sure? Well you're the boss.\n");
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: "track:" + song, limit: 20 })
    .then(function(response) {
        var foundSong = false;
        for (var i = 0; i < response.tracks.items.length; i++) {
            if (response.tracks.items[i].name.toLowerCase() === song.toLowerCase()) {
                console.log("Hope this is the right song. If it's not blame Tanner Daves for failing to code me properly:\n");
                if (response.tracks.items[i].artists.length > 0) {
                    var artists = response.tracks.items[i].artists.length > 1 ? "  Artists: " : "  Artist: ";
                    for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
                        artists += response.tracks.items[i].artists[j].name;
                        if (j < response.tracks.items[i].artists.length - 1) {
                            artists += ", ";
                        }
                    }
                    console.log(artists);
                }
                console.log("  Song: " + response.tracks.items[i].name);
                console.log("  Album: " + response.tracks.items[i].album.name);
                console.log(response.tracks.items[i].preview_url ? "  Preview: " + response.tracks.items[i].preview_url : "  No Preview Available");
                foundSong = true;
                break;
            }
        }
        if (!foundSong) {
            console.log("Yeah,'" + song + "'doesn't exist on Spotify. Try again idiot.");
        }
    })
    .catch(function(err) {
        console.log("Somethings fucked.\n  " + err);
    });
};
function movieInfo(movie) {
    movie = movie || "The Matrix";
    var queryUrl = "https://www.omdbapi.com/?apikey=trilogy&s=" + movie;
    console.log("Gimme a sec will yah?.\n");
    request(queryUrl, function (error, response, body) {
        if (error) {
            console.log("I fucked up.\n  " + error);
            return;
        }
        if (body && JSON.parse(body).Search && JSON.parse(body).Search.length > 0) {
            for (var i = 0; i < JSON.parse(body).Search.length; i++) {
                var result = JSON.parse(body).Search[i];
                if (result.Title.toLowerCase() === movie.toLowerCase()) {
                    var cont = false;
                    var innerQueryURL = "https://www.omdbapi.com/?i=" + result.imdbID + "&apikey=trilogy";
                    request(innerQueryURL, function (error, response, body) { 
                        if (error) {
                            console.log("Another error? Either you suck or my creator does.\n  " + error);
                            return;
                        }
                        if (body && JSON.parse(body) && JSON.parse(body).Response === "True") {
                            body = JSON.parse(body);
                            console.log("This should be the movie your thinking of. If not take it up with my creator:\n");
                            console.log("  Title: " + body.Title);
                            console.log("  Year: " + body.Year);
                            for (var j = 0; j < body.Ratings.length; j++) {
                                if (body.Ratings[j].Source === "Internet Movie Database") {
                                    console.log("  IMDB Rating: " + body.Ratings[j].Value);
                                } else if (body.Ratings[j].Source === "Rotten Tomatoes") {
                                    console.log("  Rotten Tomatoes Score: " + body.Ratings[j].Value);
                                }
                            }
                            console.log("  " + (body.Country.indexOf(',') < 0 ? "Country: " : "Countries: ") + body.Country);
                            console.log("  " + (body.Language.indexOf(',') < 0 ? "Language: " : "Languages: ") + body.Language);
                            console.log("  Actors: " + body.Actors);
                            console.log("  Plot: " + body.Plot);
                        } else {
                            cont = true;
                        }
                    });
                    if (cont) {
                        continue;
                    }
                    return;
                }
            }
            var result = JSON.parse(body).Search[0];
            var innerQueryURL = "https://www.omdbapi.com/?i=" + result.imdbID + "&apikey=trilogy";
            var ret = false;
            request(innerQueryURL, function (error, response, body) {
                if (error) {
                    console.log("Something, somewhere is fucked.\n  " + error);
                    return;
                }
                if (body && JSON.parse(body) && JSON.parse(body).Response === "True") {
                    body = JSON.parse(body);
                    console.log("I tried my best:\n");
                    console.log("  Title: " + body.Title);
                    console.log("  Year: " + body.Year);
                    for (var j = 0; j < body.Ratings.length; j++) {
                        if (body.Ratings[j].Source === "Internet Movie Database") {
                            console.log("  IMDB Rating: " + body.Ratings[j].Value);
                        } else if (body.Ratings[j].Source === "Rotten Tomatoes") {
                            console.log("  Rotten Tomatoes Score: " + body.Ratings[j].Value);
                        }
                    }
                    console.log("  " + (body.Country.indexOf(',') < 0 ? "Country: " : "Countries: ") + body.Country);
                    console.log("  " + (body.Language.indexOf(',') < 0 ? "Language: " : "Languages: ") + body.Language);
                    console.log("  Actors: " + body.Actors);
                    console.log("  Plot: " + body.Plot);
                } else {
                    ret = true;
                }
            });
            if (ret) {
                return;
            }
        } else {
            console.log("Yeah'" + movie + "'isn't a real movie, or maybe you just spelled it wrong. Fix it.");
        }
    });
};
function parseFileCommand() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log("If you are reading this, you're doing it wrong.\n  " + error);
        }
        var dataArr = data.split(",");
        parseCommand(dataArr[0], dataArr[1].replace(/"/g, ""));
    });
};