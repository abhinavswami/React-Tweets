var React = require('react'),
ReactDOM = require('react-dom'),
TweetsApp = require('./components/TweetsApp.react.js');

// Snag the initial state that we passed on from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML)
ReactDOM.render(
    <TweetsApp tweets= {initialState}/>,
    document.getElementById('react-app')
);