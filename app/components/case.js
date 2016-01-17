var React = require("react");

var Case = React.createClass({

    render: function() {

      var className = "grid-case case-"+this.props.type;
      return(<div onClick={this.props.onClick} className={className}></div>);
    }
});

module.exports = Case;
