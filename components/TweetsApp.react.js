'use strict';
var React = require('react');
var Tweets = require('./Tweets.react.js');
var Loader = require('./Loader.react.js');
var NotificationBar = require('./NotificationBar.react.js');

var TweetsApp = React.createClass({
    getInitialState: function (props) {
        props = props || this.props;
        console.log('Inside constructor: ');
        // Set initial application state using props
        return {
            tweets: props.tweets,
            count: 0,
            page: 0,
            paging: false,
            skip: 0,
            done: false
        };
    },

    componentWillReceiveProps: function (newProps, oldProps) {
        console.log('Inside componentWillReceiveProps');
        this.setState(this.getInitialState(newProps));
    },

    componentWillMount: function () {
        console.log('component will mount');
    },
    componentDidMount: function () {
        console.log('Inside componentDidMount');
        // preserve self reference
        var self = this;

        // Initialize socket.io
        var socket = io.connect();
        console.log("socket = " + socket);
        //On tweet event emission...
        socket.on('tweet', function (data) {
            // Add a tweet to our queue
            //console.log('Inside socket.on()');
            self.addTweet(data);
        });
        window.addEventListener('scroll', this.checkWindowScroll);
    },

    // Method to add tweet to our timeline
    addTweet: function (tweet) {
        console.log('Inside addTweet function');
        // Get current application state
        var updated = this.state.tweets;

        // Increment the unread count
        var count = this.state.count + 1;

        // Incement the skip count
        var skip = this.state.skip + 1;

        // Add tweet to the beginning of the tweets array
        updated.unshift(tweet);

        // Set application state
        this.setState({tweets: updated, count: count, skip: skip});
    },

    // Method to show the unread tweets
    showNewTweets: function (e) {
        console.log('inside shownewtweets');
        // Get current application state
        var updated = this.state.tweets;

        // Mark our tweets active
        updated.forEach(function (tweet) {
            tweet.active = true;
        });

        // Set application state (active tweets + reset unread count)
        this.setState({tweets: updated, count: 0});
    },

    // Method to check if more tweets should be loaded, by scroll position
    checkWindowScroll: function () {
        // Get scroll pos and window data
        console.log('checkWindowScroll called');
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var s = (document.body.scrollTop || document.documentElement.scrollTop || 0);
        var scrolled = (h + s) > document.body.offsetHeight;

        console.log('h + s = ' + (h + s));
        console.log('document.body.offsetHeight = ' + document.body.offsetHeight);
        console.log('this.state.paging = ' + this.state.paging);
        console.log('this.state.done = ' + this.state.done);
        // If scrolled enough
        if (scrolled && !this.state.paging && !this.state.done) {
            // Set application state (Paging, Increment page)
            this.setState({
                paging: true,
                page: this.state.page + 1
            });

            // Get the next page of the tweets from the server
            this.getPage(this.state.page);
        }
    },

    // Method to get json from the server by page
    getPage: function (page) {
        console.log('Inside getPage method');
        // Setup our ajax equest
        var request = new XMLHttpRequest(),
            self = this;
        request.open('GET', 'page/' + page + "/" + this.state.skip, true);
        request.onload = function () {

            // If everything is cool
            if (request.status >= 200 && request.status < 400) {
                // Load our next page
                self.loadPagedTweets(JSON.parse(request.responseText));
            } else {
                // Set aplication state , not paging, paging complete
                self.setState({paging: false, done: true});
            }
        };

        // Fire!
        request.send();
    },

    // Method to load tweets fetched from the server
    loadPagedTweets: function (tweets) {

        var self = this;

        // If we still have tweets...
        if (tweets.length > 0) {

            // Get current application state
            var updated = this.state.tweets;

            // Push them onto the end of the current tweet array
            tweets.forEach(function (tweet) {
                updated.push(tweet);
            });
            
            // Set application state (Not paging, paging complete)
            self.setState({tweets: updated, paging: false});

        } else {
            // Set application state (Not paging, paging complete)
            this.setState({done: true, paging: false});
        }
    },

    // Render the component
    render: function () {
        console.log('inside render of TweetsApp, count = ' + this.state.count);
        return (
            <div className="tweets-app">
                <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets}/>
                <Tweets tweets={this.state.tweets}/>
                <Loader paging={this.state.paging}/>
            </div>
        )

    }

});
module.exports = TweetsApp;