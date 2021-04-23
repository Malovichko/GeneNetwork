//let cy = cytoscape({
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

//let cy = cytoscape({
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

function clearInput() {
  document.getElementsByTagName('input').forEach(element => {
    if (element.getAttribute('type') == 'file') element.value = '';
  });
}

let cy = null;
let Shift = false;
function testCSGraph(network, contner) {
  let nodeArray = network.getNodeArray();
  let edgeArray = network.getEdgeArray();
  let curve_style = '';
  let layout_style = '';
  let taxi_direction = '';

  if (network.getAttributeFromName('type') == 'nwk') {
    curve_style = 'taxi';
    layout_style = 'dagre';
    taxi_direction = 'horizontal';
  }

  cy = cytoscape({
    container: document.getElementById(contner),
    style: [
      {
        selector: 'node',
        style: {
          'label' : 'data(name)',
          'text-valign' : 'center',
          'text-halign' : 'center',
        }
      },
      {
        selector: 'edge',
        style: {
          // 'width': 3,
          // 'line-color': '#ccc',
          // 'target-arrow-color': '#ccc',
          // 'target-arrow-shape': 'triangle',
          'curve-style' : curve_style,
          'taxi-direction' : taxi_direction,
        }
      }
    ],
  });
  
  nodeArray.forEach(function (item, i, nodeArray) {
    el = cy.add({
      group: 'nodes',
      data: {
        id: item.getID(),
        name : item.getAttributeFromName('name'),
        // weight: item.getAttributeFromName('width')
      },
      position: { x: item.getAttributeFromName('x'), y: item.getAttributeFromName('y') }
    });
    if (layout_style == '' && (item.getAttributeFromName('x') == undefined || item.getAttributeFromName('y') == undefined)) layout_style = 'cola';
    color = prepareColor(item.getAttributeFromName('color'));
    fillColor = prepareColor(item.getAttributeFromName('fillcolor'));
    fontColor = prepareColor(item.getAttributeFromName('fontcolor'));
    width = item.getAttributeFromName('width');
    height = item.getAttributeFromName('height');
    el.style('background-color', fillColor);
    el.style('border-color', color);
    if (color != undefined) el.style('border-width', 1);
    if (fillColor != fontColor) el.style('color', fontColor);
    el.style('font-size', item.getAttributeFromName('fontsize'));
    if (width == undefined) width = height; if (height == undefined) height = width;
    if (width != undefined) {
      el.style('width', width);
      el.style('height', height);
    }
    // console.log(item.getID() + " " + item.getAttributeFromName('name'));
  });

  edgeArray.forEach(function (item) {
    cy.add({
      group: 'edges',
      data: {
        id: item.getID(),
        source: item.getSource().getID(),
        target: item.getTarget().getID(),
        name : item.getAttributeFromName('name'),
      }
    });
    // console.log(item.getID() + " " + item.getSource().getID() + " " + item.getTarget().getID());
  });

  setLayout(layout_style, cy);

  cy.ready(() => {
    cy.center();
    cy.fit();
    cy.resize();
  });

  function contextTap(event) {
    if (event.target != cy) {
      if (!Shift && !cy.$(':selected').contains(event.target)) cy.$(':selected').unselect();
      event.target.select();
    }
  }
  cy.on('cxttap', contextTap);

  return cy;
}

function rec(layout) {
  layout.pon('layoutstop').then(function(event) {
    rec(layout);
  });
  layout.run();
}

function prepareColor(color) {
  if (color != undefined && color.length == 9) {
    rgba = color.replace('#', '').match(/.{1,2}/g);
    r = parseInt(rgba[0], 16); g = parseInt(rgba[1], 16); b = parseInt(rgba[2], 16); a = parseInt(rgba[3], 16);
    r = r * a / 255;
    g = g * a / 255;
    b = b * a / 255;
    r = r.toString(16); g = g.toString(16); b = b.toString(16);
    while (r.length < 2) r = '0' + r;
    while (g.length < 2) g = '0' + g;
    while (b.length < 2) b = '0' + b;
    color = '#' + r + g + b;
  }
  return color;
}

function setLayout(layout_style, layout_obj) {
  if (layout_style != '') {
    let rankDir = '';
    if (layout_style == 'dagre') rankDir = 'LR';
    let layout = layout_obj.layout({
      name: layout_style,
      rankDir : rankDir,
      // infinite: true,
    });
    layout.run();
    // rec(layout);
  }
}

function duplicate() {
  cy.$('node:selected').forEach((element) => {
    el = cy.add({
      group: 'nodes',
      data: {
        id: element.data().id + "-d-" + cy.$('node').length,
        name : element.data().name,
        // weight: node.getAttributeFromName('width')
      },
      position: { x: element.position().x, y: element.position().y }
    });
    if (element.style('border-color') != undefined) color = element.style('border-color');
    if (element.style('background-color') != undefined) fillColor = element.style('background-color');
    if (element.style('color') != undefined) fontColor = element.style('color');
    width = element.style().width;
    height = element.style().height;
    el.style('background-color', fillColor);
    el.style('border-color', color);
    if (color != undefined) el.style('border-width', 1);
    if (fillColor != fontColor) el.style('color', fontColor);
    if (element.style('font-size') != undefined) el.style('font-size', element.style('font-size'));
    if (width == undefined) width = height; if (height == undefined) height = width;
    if (width != undefined) {
      el.style('width', width);
      el.style('height', height);
    }

    // setLayout('cola', element.union(el));
    // console.log(element.position().x + " " + element.position().y);
    element.neighborhood().forEach((neighbour) => {
      if (neighbour.isEdge()) {
        edgeId = neighbour.data().id + "-d-" + cy.$('edge').length;
        edgeName = neighbour.data().name;
        sourceId = neighbour.source().data().id;
        targetId = neighbour.target().data().id;
        if (sourceId == element.data().id) sourceId = el.data().id;
        else targetId = el.data().id;
        cy.add({
          group: 'edges',
          data: {
            id: edgeId,
            source: sourceId,
            target: targetId,
            name : edgeName,
          }
        });
      }
    });
  });
  setLayout('cola', cy);
}

function deletio() {
  cy.$('node:selected').forEach((element) => {
    cy.remove(element);
  });
  setLayout('cola', cy);
}

function mutatio() {
  cy.$('node:selected').forEach((element) => {
    count = 0;
    countNewEdges = 0;
    element.neighborhood().forEach((neighbour) => {
      if (neighbour.isEdge()) {
        if (Math.random() < 0.5) {
          neighbour.remove();
          countNewEdges++;
        }
        count++;
      }
    });
    // countNewEdges = Math.round(Math.random() * cy.$('edge').length) - count;
    // if (countNewEdges < 0) countNewEdges = 0;
    console.log(count + " " + countNewEdges);
    while (countNewEdges > 0) {
      for (i = 0; i < cy.$('node').length; i++) {
        if (!element.neighborhood().contains(cy.$('node')[i])) {
          if (Math.random() >= 0.5) {
            cy.add({
              group: 'edges',
              data: {
                id: Math.random() + "A",
                source: element.data().id,
                target: cy.$('node')[i].data().id,
                name : "",
              }
            });
            countNewEdges--;
          }
        }
        if (countNewEdges == 0) break;
      }
    }
  });
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
  if (cy != null) {
    needseparator = false;
    if (cy.$('node:selected').length > 0) {
      if (needseparator) menu.innerHTML = menu.innerHTML + '<div class="menu-separator"></div>';
      menu.innerHTML = menu.innerHTML + document.querySelector('#context-menu-node').innerHTML;
      needseparator = true;
    }
    if (cy.$('edge:selected').length > 0) {
      if (needseparator) menu.innerHTML = menu.innerHTML + '<div class="menu-separator"></div>';
      menu.innerHTML = menu.innerHTML + document.querySelector('#context-menu-edge').innerHTML;
      needseparator = true;
    }
    showMenu(e.pageX, e.pageY);
  }
  document.addEventListener('mousedown', onMouseDown);
}
function onMouseDown(e) {
  if (e.target.tagName == "INPUT") e.target.click();
  menu.innerHTML = "";
  hideMenu();
  document.removeEventListener('mousedown', onMouseDown);
}
document.addEventListener('contextmenu', onContextMenu);
