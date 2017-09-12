var React = require('react'),
TweetApp = require('./components/TweetsApp.react');

// Snag the initial state that we passed on from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML)

React.renderComponent(
    <TweetsApp tweets= {initialState}/>,
    document.getElementById('react-app')
);