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
function testCSGraph(network) {
    let nodeArray = network.getNodeArray();
    let edgeArray = network.getEdgeArray();
    var cy = cytoscape({
        container: document.getElementById('cy'),
        style: [
    {
      selector: 'node',
      style: {
        'label': 'data(name)',
          "text-valign": "center",
            "text-halign": "center"
      }
    }
  ]
        });

    nodeArray.forEach(function (item, i, nodeArray) {
       cy.add({
    group: 'nodes',
           data: { id: item.getID(),
                  name : item.getAttributeFromName('name'),
//                weight: item.getAttributeFromName('width')
                 },
           position: { x: item.getAttributeFromName('x'), y: item.getAttributeFromName('y') }
});
        console.log(item.getID() + " " + item.getAttributeFromName('name'));
    });
    edgeArray.forEach(function (item, i, edgeArray) {
       cy.add({
    group: 'edges',
           data: { id: item.getID(),
                  source: item.getSource().getID(),
                  target: item.getTarget().getID(),
                  name : item.getAttributeFromName('name')}
});
        console.log(item.getID() + " " + item.getSource().getID() + " " + item.getTarget().getID());
    });
    cy.ready(() => {
      cy.center();
      cy.fit();
      cy.resize();
    });
//    var layout = cy.layout({
//  name: 'circle'
//});

//layout.run();
}

