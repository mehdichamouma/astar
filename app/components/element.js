var React = require("react");

var Element = React.createClass({

  getInitialState: function() {
    return {
      hidden: ""
    }
  },

  componentWillMount: function() {
    var self=this;
    if(this.props.wait) {
      this.setState({hidden: "hidden"});
      setTimeout(function() {
        self.show();
      }, this.props.wait)
    }
  },
  show: function() {
    this.setState({hidden: ""});
  },
  render: function(){
    var positionX = this.props.x*25;
    var positionY = this.props.y*25;
    var agentStyle = {
      top: positionY,
      left: positionX
    }
    return (<div onClick={this.props.onClick} style={agentStyle} className={this.props.type + " " + this.state.hidden}></div>);
  }

})

module.exports = Element;
