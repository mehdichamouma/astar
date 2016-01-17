var React = require("react");
var trouverChemin = require("../astar/astar.js");
var Case = require("./case");
var Element = require('./element');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;

var Grid = React.createClass({

  getInitialState: function() {
    return {
      showSettings: false,
      agents: [],
      cible: [21,8],
      chemin: [],
      costs: {
        'h': 20,
        'e': -1,
        'm': -1,
        'f': 70,
        'c': 5,
        'p': 5,
      }
    }
  },

  saveSettings: function() {
    this.setState({
      costs: {
        'h': this.refs.h.getValue(),
        'e': this.refs.e.getValue(),
        'm': this.refs.m.getValue(),
        'f': this.refs.f.getValue(),
        'c':this.refs.c.getValue(),
        'p':this.refs.p.getValue(),
      }
    });
  },
  closeSettings: function() {
    this.setState({showSettings: false})
  },

  /**
  * Renvoie le coût en fonction de la position (x,y)
  *
  */
  getCost: function(x, y){
    if(x < 0 || y < 0 || x >= this.props.data[0].length || y >= this.props.data.length) {
      return -1
    }
    var type = this.props.data[y][x];
    return parseInt(this.state.costs[type]) || -1;
  },

  printChemin: function(sourceX, sourceY) {
    this.setState({
      chemin: trouverChemin(sourceX, sourceY, this.state.cible[0], this.state.cible[1], this.getCost)
    });
  },
  addAgent: function(indexX, indexY) {
    if(this.getCost(indexX, indexY) > 0) {
      var nextState = this.state;
      nextState.agents.push({
        posX: (indexX),
        posY: (indexY)
      });
      this.setState(nextState);
    }
    else {
      alert("Impossible d'ajouter l'agent ici");
    }
  },
  componentDidMount: function() {
      console.log(this.props.data);
  },
  render: function() {
    var self = this;
    var dureeChemin;
    if(this.state.chemin) {
      var coutChemin = this.state.chemin.reduce(function(prev, position) {
        return prev + self.getCost(position[0], position[1]);
      }, 0);
      dureeChemin = (<div>Durée du chemin: {coutChemin} secondes<br/>Longueur du chemin: {this.state.chemin.length}</div>);
    }
    return (
      <div>
        <header id="grid-header">
            <Button bsStyle="primary" bsSize="small" onClick={() => this.setState({showSettings: true})}>Settings</Button>
            {dureeChemin}
        </header>
        <div id="grid">
          {this.props.data.map(function(row, indexX) {
              return (
                <div className="grid-row">
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
        </div>
        <Modal show={this.state.showSettings} onHide={this.closeSettings}>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-horizontal">
                    <Input label="Text" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="h" label="herbe" type="text" value={this.state.costs.h} onChange={this.saveSettings}/>
                    <Input label="Text" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="e" label="eau" type="text" value={this.state.costs.e} onChange={this.saveSettings}/>
                    <Input label="Text" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="m" label="mur" type="text" value={this.state.costs.m} onChange={this.saveSettings}/>
                    <Input label="Text" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="f" label="foret" type="text" value={this.state.costs.f} onChange={this.saveSettings}/>
                    <Input label="Text" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="c" label="chemin" type="text" value={this.state.costs.c} onChange={this.saveSettings}/>
                    <Input label="Text" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="p" label="pont" type="text" value={this.state.costs.p} onChange={this.saveSettings}/>
                    <Button bsStyle="primary" bsSize="small" onClick={this.closeSettings}>Close</Button>
                </form>
            </Modal.Body>
        </Modal>
      </div>);
  }
});

module.exports = Grid;
