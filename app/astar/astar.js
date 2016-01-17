/**
* astar.js
* Implémentation de l'algorithme A* en Javascript
* Autheurs: Mehdi CHAMOUMA et François BEIGER
*/

//Importation module: arbre binaire
var BinarySearchTree = require('binary-search-tree').BinarySearchTree;

/**
* Fonction node
* Arguments: x, y, CoutSource, CoutDest, predecesseur
* Renvoie un objet noe
*/
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


/**
* Renvoie une structure de donnée permettant de dérouler l'algorithme A* (trouverChemin)
*
*
*/
var aExplorerConstructor = function() {

  return {
      /**
      * Arbre binaire trié par Coût Final, contenant la liste à jour des sommets non visités
      */
      sommetsNonVisites: new BinarySearchTree({compareKeys: (a,b) => (a<=b ? -1 : 1)}),

      /**
      * Arbre binaire trié par Coordonnées (x, y), contenant la liste des sommets à explorés et explorés
      */
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

    /**
    * Insère un noeud si il n'a pas encore été visité, ou s'il n'est pas dans la liste des sommets à explorer
    * Met à jour un noeud si il n'a pas encore été visité, et qu'il est dans la liste des sommets à explorer mais avec un coût supérieur
    * Ne fait rien sinon
    */
    insererSiNonVisite: function(node) {
      var shouldInsert = true;
      var m = this.coordsIndexTree.search({x: node.x, y: node.y})[0];
      var newCoutFinal = node.coutSource + node.coutDest;
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
        this.sommetsNonVisites.insert(newCoutFinal, node);
        this.coordsIndexTree.insert({x: node.x, y:node.y}, node);
      }
    },

    /**
    * Test s'il y a des sommets à explorer
    */
    hasSommetsAExplorer: function(){
      return  this.sommetsNonVisites.data.length != 0;
    },

    /**
    * Renvoie le noeud ayant un coût estimé minimal et l'enlève de la liste
    * Cette fonction indique aussi que le noeud à été visité
    */
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
          this.sommetsNonVisites = minNode.right;
          minNode.right.parent = null;
        }
        else {
          this.sommetsNonVisites = new BinarySearchTree({compareKeys: (a,b) => (a<=b ? -1 : 1)});
        }
      }
      minNode.data[0].estVisite = true;
      return minNode.data[0];
    },

    /**
    * Renvoie le prédecesseur d'un noeud en fonction de sa position
    */
    recupPredecesseur: function(x,y){
      var precNode = this.coordsIndexTree.search({x: x, y: y});
      return precNode[0].predecesseur;
    }
  }
}


/**
* Fonction cheminHeuristique
* Arguments: sourceX, sourceY, destX, destY
* Calcule et renvoie la distance de Manhattan entre (sourceX, sourceY, destX, destY)
*/
var cheminHeuristique = function(sourceX, sourceY, destX, destY){
  return 5*(Math.abs(sourceX - destX) + Math.abs(sourceY - destY))
}

/**
* Fonction getSuccessorsCoords
* Arguments: x, y
* Renvoie le tableau des successeurs de (x,y)
*/
var getSuccessorsCoords = function(x, y){
  return [
    [x, y-1],
    [x, y+1],
    [x-1, y],
    [x+1, y]
  ]
}




/**
* Function trouverChemin
* Arguments: sourceX, sourceY, destX, destY, getCost
* Trouve le chemin le plus court en utilisant l'algorithme A*
*/
var trouverChemin = function(sourceX, sourceY, destX, destY, getCost){
  //Contient la liste des cases à explorer
  var aExplorer = aExplorerConstructor();

  //Mettre à vrai quand on est arrivé a destination
  var finish = false

  //Initialisation
  var coutDest = cheminHeuristique(sourceX, sourceY, destX, destY)
  var coutSource = 0
  var source = node(sourceX, sourceY, coutSource, coutDest, null)
  aExplorer.insererSiNonVisite(source);

  //On ne doit pas pouvoir commencer si on est dans l'eau ou sur un mur
  var wrongStart = false
  if(getCost(sourceX, sourceY) < 0){
    wrongStart=true
  }

  while(aExplorer.hasSommetsAExplorer() && !finish && !wrongStart){
    //On recuperer le sommet ayant le cout minimum
    //La fonction assure aussi qu'on ne récuperera pas le sommet une deuxième fois
    var X = aExplorer.pop()

    //On parcours ses successeurs et on les ajoute dans les sommets à explorer (s'ils n'ont pas été déjà visité)
    var successeurs = getSuccessorsCoords(X.x, X.y)
    successeurs.map(function(S){
      var cost = getCost(S[0], S[1]);
      //On n'insère pas une case représentant l'eau ou le mur dans l'arbre
      if(cost>0){
        coutSource = X.coutSource + cost;
        coutDest = cheminHeuristique(S[0], S[1], destX, destY)
        aExplorer.insererSiNonVisite(node(S[0], S[1], coutSource, coutDest, [X.x, X.y]))
      }
      //On a finit si la destination est un des successeurs
      if(S[0]==destX && S[1]==destY){
        finish=true
      }
    });
  }

  //On récupère et renvoie le chemin
  var p = [destX, destY]
  var chemin = []

  //On vérifie que l'on a bien trouvé un chemin avant de le calculer
  while(p!=null && !wrongStart && finish){
    chemin.push(p)
    p = aExplorer.recupPredecesseur(p[0], p[1])
  }
  return chemin;
}

module.exports = trouverChemin;
