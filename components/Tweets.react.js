var React = require('react');
var Tweet = require('./Tweet.react.js');

var Tweets = React.createClass({

    // Render our tweets
    render : function() {

        // Build list items of single tweet components using map
        var content = this.props.tweets.map(function(tweet){
            return (
                <Tweet key={tweet.twid} tweet={tweet} />
            )
        });
        console.log('inside Tweets render');
        // return ul filled with our mapped tweets
        return(
            <ul className="tweets">{content}</ul>
        )
    }
});

module.exports = Tweets;