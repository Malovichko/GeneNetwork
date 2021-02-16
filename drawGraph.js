//var cy = cytoscape({
//        container: document.getElementById('cy'),
//        elements: [
//            { data: { id: 'node_1' } },
//            { data: { id: 'node_2' } },
//            {
//                data: {
//                    id: 'edge',
//                    source: 'node_1',
//                    target: 'node_2'
//                }
//            }]
//        });

//var cy = cytoscape({
//
//  container: document.getElementById('cy'), // container to render in
//
//  elements: [ // list of graph elements to start with
//    { // node a
//      data: { id: 'a' }
//    },
//    { // node b
//      data: { id: 'b' }
//    },
//    { // edge ab
//      data: { id: 'ab', source: 'a', target: 'b' }
//    }
//  ],
//
//  style: [ // the stylesheet for the graph
//    {
//      selector: 'node',
//      style: {
//        'background-color': '#666',
//        'label': 'data(id)'
//      }
//    },
//
//    {
//      selector: 'edge',
//      style: {
//        'width': 3,
//        'line-color': '#ccc',
//        'target-arrow-color': '#ccc',
//        'target-arrow-shape': 'triangle',
//        'curve-style': 'bezier'
//      }
//    }
//  ],
//
//  layout: {
//    name: 'grid',
//    rows: 1
//  }
//
//});
function drawGraphFromJSON() {

}

let selection = new Set();;
let cy = null;
function testCSGraph(network) {
    let nodeArray = network.getNodeArray();
    let edgeArray = network.getEdgeArray();
    let curve_style = '';
    let layout_style = '';

    if (network.getAttributeFromName('type') == 'nwk') {
      curve_style = 'taxi';
      layout_style = 'dagre';
    }

    cy = cytoscape({
        container: document.getElementById('cy'),
        style: [
          {
            selector: 'node',
            style: {
              'label': 'data(name)',
              "text-valign": "center",
              "text-halign": "center"
            }
          },

          {
            selector: 'edge',
            style: {
              // 'width': 3,
              // 'line-color': '#ccc',
              // 'target-arrow-color': '#ccc',
              // 'target-arrow-shape': 'triangle',
              'curve-style': curve_style
            }
          }
        ],
      });
    
      nodeArray.forEach(function (item, i, nodeArray) {
        cy.add({
          group: 'nodes',
          data: {
            id: item.getID(),
            name : item.getAttributeFromName('name'),
            // weight: item.getAttributeFromName('width')
          },
          position: { x: item.getAttributeFromName('x'), y: item.getAttributeFromName('y') }
        });
        if (layout_style == '' && (item.getAttributeFromName('x') == undefined || item.getAttributeFromName('y') == undefined)) layout_style = 'cola';
        // console.log(item.getID() + " " + item.getAttributeFromName('name'));
      });
 
      edgeArray.forEach(function (item) {
        cy.add({
          group: 'edges',
          data: {
            id: item.getID(),
            source: item.getSource().getID(),
            target: item.getTarget().getID(),
            name : item.getAttributeFromName('name')
          }
        });
        // console.log(item.getID() + " " + item.getSource().getID() + " " + item.getTarget().getID());
      });
      cy.ready(() => {
        cy.center();
        cy.fit();
        cy.resize();
      });

      if (layout_style != '') {
        var layout = cy.layout({
          name: layout_style
         });
         
          layout.run();
      }
      
      document.getElementsByTagName('input').forEach(element => {
        if (element.getAttribute('type') == 'file') element.value = '';
      });

      let handler_reset = function(event){
        selection = new Set();
        console.log(selection);
      };
      cy.on('tap', handler_reset);

      let handler_select = function(event){
        selection.add(event.target);
        // selection = event.target;
      };
      cy.on('select', handler_select);
}

document.addEventListener('keydown', function(event) {
  if (event.code == 'Delete') {
    if (selection != cy && selection != null) {
      selection.forEach(el => {
        cy.remove(el);
      })
      selection = new Set();
    }
  }
});