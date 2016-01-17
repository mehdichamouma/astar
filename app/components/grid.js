var React = require("react");
var trouverChemin = require("../astar/astar.js");
var Case = require("./case");
var Element = require('./element');

var Grid = React.createClass({

  getInitialState: function() {
    return {
      agents: [],
      cible: [21,8],
      chemin: []
    }
  },

  /**
  * Renvoie le coût en fonction de la position (x,y)
  *
  */
  getCost: function(x, y){
    if(x < 0 || y < 0 || x >= this.props.data[0].length || y >= this.props.length) {
      return -1
    }
    var type = this.props.data[y][x];
    switch(type){
      case 'h':
        return 20;
      case 'e':
      case 'm':
        return -1;
      case 'f':
        return 70;
      case 'c':
      case 'p':
        return 5;
      default:
        return -1;
    }
  },

  printChemin: function(sourceX, sourceY) {
    this.setState({
      chemin: trouverChemin(sourceX, sourceY, this.state.cible[0], this.state.cible[1], this.getCost)
    });
  },
  addAgent: function(indexX, indexY) {
    var nextState = this.state;
    nextState.agents.push({
      posX: (indexX),
      posY: (indexY)
    });
    this.setState(nextState);
  },
  componentDidMount: function() {
      console.log(this.props.data);
  },
  render: function() {
    var self = this;
    return (<div>
                {this.props.data.map(function(row, indexX) {
                    return (
                      <div className="row">
                          {row.map(function(t, indexY) {
                              return (<Case onClick={function() { self.addAgent(indexY, indexX)}} type={t} />);
                          })}
                      </div>
                    );
                })}
             {this.state.agents.map(function(agent) {
                return (<Element type="agent" x={agent.posX} y={agent.posY} onClick={() => self.printChemin(agent.posX, agent.posY)} />);
             })}
            <Element type="cible" x={this.state.cible[0]} y={this.state.cible[1]} />

            {this.state.chemin.map(function(pointChemin) {
               return (<Element type="chemin" x={pointChemin[0]} y={pointChemin[1]} />);
            })}

            </div>);
  }
});

module.exports = Grid;
