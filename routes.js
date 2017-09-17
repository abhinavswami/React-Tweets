var JSX = require('node-jsx').install(),
    React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    TweetsApp = React.createFactory(require('./components/TweetsApp.react')),
    Tweet = require('./models/Tweet');

module.exports = {
    index: function (req, res) {
        // Call static model method to get tweets in the db
        Tweet.getTweets(0, 0, function (tweets, pages) {
            // Render React to a string passing in fetched tweets
            var markup = ReactDOMServer.renderToString(
                TweetsApp({
                    tweets: tweets
                })
            );
            console.log('Before render');
            res.render('home', {
                markup: markup,    // Pass rendered react to markup
                state: JSON.stringify(tweets)   // Pass current state to client side
            });
        });
    },

    page: function (req, res) {
        Tweet.getTweets(req.params.page, req.params.skip, function (tweets) {
            // Render as json
            res.send(tweets);
        });
    }
}