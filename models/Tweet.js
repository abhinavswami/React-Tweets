var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    twid: String,
    active: Boolean,
    author: String,
    avatar: String,
    body: String,
    date: Date,
    screenname: String
});

// Create a getTweets static method to return tweet data from the db
schema.statics.getTweets = function (page, skip, callback) {
    var tweets = [],
        start = (page * 10) + (skip * 1);

    Tweet.find({}, 'twid active author avatar body date screenname',
        { skip: start, limit: 10 }).sort({ date: 'desc' }).exec(function (err, docs) {

            // If everything is ok
            if (!err) {
                tweets = docs;  // We got tweets
                tweets.forEach(function (tweet){
                    tweet.active = true;  // Set them to active
                });
            }

            callback(tweets);
        });
};

module.exports = Tweet = mongoose.model('Tweet', schema);