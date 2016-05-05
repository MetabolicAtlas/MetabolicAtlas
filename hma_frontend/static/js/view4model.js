
var app = angular.module('app', []);

app.factory('view4Graph', [ '$q', function( $q ){
  var cy;
  var view4Graph = function(elms, rels){
    var deferred = $q.defer();

    var elmsjson = [];
    for( var i = 0; i < elms.length; i++ ){
      if (elms[i].parentid!='null') {
        elmsjson.push({
          group: 'nodes',
          data: {
            id: elms[i].id,
            parent: elms[i].parentid,
            name: elms[i].short,
          }
        });
      } else {
        elmsjson.push({
          group: 'nodes',
          data: {
            id: elms[i].id,
            name: elms[i].short,
          }
        });
      }

    }

    for( var i = 0; i < rels.length; i++ ){
      elmsjson.push({
        group: 'edges',
        data: {
          id: rels[i].id,
          source: rels[i].source,
          target: rels[i].target
        }
      });
    }

    console.log('cy json:'+JSON.stringify(elmsjson));

    $(function(){ // on dom ready

      cy = cytoscape({
        container: $('#cy')[0],

        style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'content': 'data(name)',
            'font-size': "42px",
            //'height': 80,
            //'width': 'mapData(weight, 1, 200, 1, 200)',
            //'color': 'white',
            //'text-outline-width': 2,
            //'text-outline-color': '#888'
        })
        .selector('$node > node') //child node selector
        .css({
            'font-size': "20px",
            'padding-top': '20px', //not super useful as it only affects node to parent node distance
            'padding-left': '20px',
            'padding-bottom': '20px',
            'padding-right': '20px',
            'text-valign': 'top',
            'text-halign': 'center',
            'background-color': '#000055',
            'background-opacity':0.3
        })
        .selector('node > node') //parent node selector
        .css({
            'font-size': "20px",
            'padding-top': '1px',
            'padding-left': '1px',
            'padding-bottom': '1px',
            'padding-right': '1px',
            'text-valign': 'top',
            'text-halign': 'center',
            'background-color': '#00ff00'
        })
        .selector('edge')
        .css({
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
        })
        .selector(':selected')
        .css({
            'background-color': 'black',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'text-outline-color': 'black'
        }),

        layout: {
            name: 'cose-bilkent',

            //represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
            tilingPaddingVertical: 50,
            //represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
            tilingPaddingHorizontal: 50
        },

        elements: elmsjson,

        ready: function(){
          deferred.resolve( this );

          /*cy.on('cxtdrag', 'node', function(e){

            var node = this;
            var dy = Math.abs( e.cyPosition.x - node.position().x );
            var weight = Math.round( dy*2 );

            node.data('weight', weight);

            fire('onWeightChange', [ node.id(), node.data('weight') ]);

          });*/
        }
      });
      cy.qtip({
        content: 'Remove<br>Re-center view<br>Only 1st level interactions<br>Expand to 1st level interactions',
        position: {
          my: 'top center',
          at: 'bottom center'
        },
        style: {
          classes: 'qtip-bootstrap',
          tip: {
            width: 16,
            height: 8
          }
        }
      });
    }); // on dom ready

    return deferred.promise;
  };

  view4Graph.listeners = {};

  function fire(e, args){
    var listeners = view4Graph.listeners[e];

    for( var i = 0; listeners && i < listeners.length; i++ ){
      var fn = listeners[i];

      fn.apply( fn, args );
    }
  }

  function listen(e, fn){
    var listeners = view4Graph.listeners[e] = view4Graph.listeners[e] || [];

    listeners.push(fn);
  }

  view4Graph.onSelected = function(fn){
    listen('onSelected', fn);
  };

  return view4Graph;


} ]);
