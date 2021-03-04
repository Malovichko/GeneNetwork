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

let cy = null;
let Shift = false;
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

  function contextTap(event) {
    if (event.target != cy) {
      if (!Shift && !cy.$(':selected').contains(event.target)) cy.$(':selected').unselect();
      event.target.select();
    }
  }
  cy.on('cxttap', contextTap);
}

function duplicate() {
  
}

function deletio() {
  
}

function mutatio() {
  
}

document.addEventListener('keydown', function(event) {
  if (event.key == 'Delete') {
    if (cy != null) {
      cy.$(':selected').forEach(el => {
        cy.remove(el);
      });
    }
  }
  if (event.key == 'Shift') Shift = true;
});

document.addEventListener('keyup', function(event) {
  if (event.key == 'Shift') Shift = false;
});

let menu;
window.onload = function(e) {
  zip.workerScriptsPath = "/lib/";
  menu = document.querySelector('#context-menu');
}
function showMenu(x, y) {
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.classList.add('show-menu');
}
function hideMenu() {
  menu.classList.remove('show-menu');
}
function onContextMenu(e) {
  e.preventDefault();
  if (cy != null && cy.$(':selected').length > 0) showMenu(e.pageX, e.pageY);
  document.addEventListener('mousedown', onMouseDown);
}
function onMouseDown(e) {
  if (e.target.tagName == "INPUT") e.target.click();
  hideMenu();
  document.removeEventListener('mousedown', onMouseDown);
}
document.addEventListener('contextmenu', onContextMenu);
