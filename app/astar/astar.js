var BinarySearchTree = require('binary-search-tree').BinarySearchTree;

var aExplorerConstructor = function() {
  return {
    size: 0,

    sommetsNonVisites: new BinarySearchTree({compareKeys: (a,b) => (a<=b ? -1 : 1)}),

    coordsIndexTree: new BinarySearchTree({
      compareKeys: (a,b) => {
            if(a.x < b.x) {
              return -1
            }
            else if(a.x > b.x) {
              return 1
            }
            else {
              if(a.y<b.y) {
                return -1;
              }
              else if(a.y>b.y) {
                return 1;
              }
              else {
                return 0;
              }
            }
            return 0;
          },
      unique: true
  }),

    insererSiNonVisite: function(node) {
      var shouldInsert = true;
      var m = this.coordsIndexTree.search({x: node.x, y: node.y})[0];
      var newCoutFinal = node.coutSource + node.coutDest;
      //console.log(newCoutFinal, node.x, node.y);
      if(m) {
        var oldCoutFinal = m.coutSource + m.coutDest;
        if(!m.estVisite && (newCoutFinal < oldCoutFinal)) {
          this.sommetsNonVisites.delete(oldCoutFinal, m);
          this.coordsIndexTree.delete({x: m.x, y:m.y});
        }
        else {
          shouldInsert = false;
        }
      }
      if(shouldInsert) {
        if(node.x == 2 && node.y == 12) {
          console.log("buuuuh");
        }
        this.sommetsNonVisites.insert(newCoutFinal, node);
        this.coordsIndexTree.insert({x: node.x, y:node.y}, node);
      }
      else {
      }
    },

    hasSommetAExplorer: function(){
      return  this.sommetsNonVisites.data.length != 0;
    },

    pop: function() {
      var minNode = this.sommetsNonVisites
      while(minNode.left!=null) {
        minNode = minNode.left;
      }
      //minNode != Racine
      if(minNode.parent) {
        minNode.parent.left = minNode.right;
        if(minNode.right) {
          minNode.right.parent = minNode.parent;
        }
      }
      //minNode = Racine
      else {
        if(minNode.right) {
          console.log(minNode);
          this.sommetsNonVisites = minNode.right;
          minNode.right.parent = null;
        }
        else {
          console.log(minNode);
          this.sommetsNonVisites = new BinarySearchTree({compareKeys: (a,b) => (a<=b ? -1 : 1)});
        }
      }
      minNode.data[0].estVisite = true;
      return minNode.data[0];
    },

    recupPredecesseur: function(x,y){
      var precNode = this.coordsIndexTree.search({x: x, y: y});
      return precNode[0].predecesseur;
    }

  }
}

var node = function(x, y, CoutSource, CoutDest, predecesseur){
  return {
    x: x,
    y: y,
    coutSource: CoutSource,
    coutDest: CoutDest,
    predecesseur: predecesseur,
    estVisite: false
  }
}

var cheminHeuristique = function(sourceX, sourceY, destX, destY){
  return 5*(Math.abs(sourceX - destX) + Math.abs(sourceY - destY))
}

var getSuccessorsCoords = function(x, y){
  return [
    [x, y-1],
    [x, y+1],
    [x-1, y],
    [x+1, y]
  ]
}

var getCost = function(type){
  switch(type){
    case 'h':
      return 20;
    case 'e':
    case 'm':
      return 10000;
    case 'f':
      return 10000;
    case 'c':
    case 'p':
      return 5;
    default:
      return 10000;
  }
}

var trouverChemin = function(sourceX, sourceY, destX, destY, map){
  //Contient la liste des cases à explorer
  var aExplorer = aExplorerConstructor();

  var finish = false

  var tailleX = map[0].length
  var tailleY = map.length
  var coutDest = cheminHeuristique(sourceX, sourceY, destX, destY)
  var coutSource = 0
  var source = node(sourceX, sourceY, coutSource, coutDest, null)

  aExplorer.insererSiNonVisite(source);

  while(!finish){

    var X = aExplorer.pop()
    console.log(X.x, X.y, X.coutSource, X.coutDest);
    var successeurs = getSuccessorsCoords(X.x, X.y)
    successeurs.map(function(S){
      if(S[0] >= 0 && S[1] >= 0 && S[0] < tailleX && S[1] < tailleY) {
        coutSource = X.coutSource + getCost(map[S[1]][S[0]])
        coutDest = cheminHeuristique(S[0], S[1], destX, destY)
        if(S[0] == 2 && S[1] == 12) {
          console.log(aExplorer);
          console.log("2, 12", coutSource, coutDest);
        }
        aExplorer.insererSiNonVisite(node(S[0], S[1], coutSource, coutDest, [X.x, X.y]))

        if(S[0]==destX && S[1]==destY){
          finish=true
        }
      }
      else {
        console.log("out of bound", S[0], S[1]);
      }
    });
    //finish=true;

  }
  //console.log(aExplorer);

  var p = [destX, destY]
  var chemin = []
  while(p!=null){
    chemin.push(p)
    p = aExplorer.recupPredecesseur(p[0], p[1])
  }
  console.log(chemin);
  return chemin;
}

module.exports = trouverChemin;
