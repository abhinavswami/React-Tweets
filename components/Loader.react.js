var React = require('React');

var Loader = React.createClass({
    render: function () {
        return (
            <div
                className={"loader" + (this.props.paging
                ? "active"
                : "")}>
                <img src="svg/loader.svg"/>
            </div>
        )
    }
})
module.exports = Loader;