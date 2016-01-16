var React = require("react");

var Element = React.createClass({

  render: function(){
    var positionX = this.props.x*25;
    var positionY = this.props.y*25;
    var agentStyle = {
      top: positionY,
      left: positionX
    }
    return (<div onClick={this.props.onClick} style={agentStyle} className={this.props.type}></div>);
  }

})

module.exports = Element;
