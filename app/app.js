var React = require('react');
var ReactDom = require('react-dom');
var Grid = require("./components/grid");
var data = require("json!./data/data.json");

console.log(data);

var Main = React.createClass({
  render: function() {
    return(
      <Grid data={data.map.content} agents={data.map.agents}/>
    )
  }
});

ReactDom.render(<Grid data={data.map.content} agents={data.map.agents}/>, document.getElementById('app'));
