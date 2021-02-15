//function writeList(file) {
//    model.getEntries(file, function (entries) {
//        fileList = document.getElementById('fileList');
//        fileList.innerHTML = "";
//        let network = null;
//    }
//
//function readFile(input) {
//  let file = input.files[0];
//
//  let reader = new FileReader();
//
//  reader.readAsText(file);
//
//  reader.onload = function() {
//    console.log(reader.result);
//  };
//
//  reader.onerror = function() {
//    console.log(reader.error);
//  };
//
//}

function readSingleFile(e) {
    var file = e.target.files[0];
    var contents = null;
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        displayContents(contents);
    };
    reader.readAsText(file);
    var graph = JSON.parse(contents);
//    drawGraphFromJSON(graph);
}

function displayContents(contents) {
    var data = JSON.parse(contents);
    /*var element = document.getElementById('file-content');
    element.textContent = contents;
    console.log("Bla");*/
    network = new Network(1);

    nodes = data.elements.nodes;
    for (i = 0; i < nodes.length; i++) {
        id = nodes[i].data.id;
        id = parseInt(id);
        entries = Object.entries(nodes[i].data);
        entriesPos = Object.entries(nodes[i].position);


        node = new Node(id);
        for (j = 0; j < entries.length; j++) node.setAttribute(entries[j][0], entries[j][1]);
//        node.setAttribute('label', label);
        //node.setAttribute('width', 40);
        //node.setAttribute('height', 40);
        node.setAttribute(entriesPos[0][0], entriesPos[0][1]);
        node.setAttribute(entriesPos[1][0], entriesPos[1][1]);
        console.log(entriesPos[0][0] + " " + entriesPos[0][1]);
        console.log(entriesPos[1][0] + " " + entriesPos[1][1]);
        network.setNodeInArray(node);
    }

    edges = data.elements.edges;
    for (i = 0; i < edges.length; i++) {
        id = edges[i].data.id;
        id = parseInt(id);
        entries = Object.entries(edges[i].data);

        idNode1 = edges[i].data.source;
        idNode1 = parseInt(idNode1);
        node1 = network.findNodeById(idNode1);

        idNode2 = edges[i].data.target;
        idNode2 = parseInt(idNode2);
        node2 = network.findNodeById(idNode2);

        edge = new Edge(node1, node2, id);
        network.setEdgeInArray(edge);
    }
    testCSGraph(network);
//    node = data.elements.nodes[0].data;
//    console.log(node);
//    var keys = Object.keys(node);
//    console.log(keys);
//    console.log(data.elements.edges);
}

document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);


//function readSingleFile(e) {
//  var file = e.target.files[0];
//  if (!file) {
//    return;
//  }
//  readTextFile(file, function(text){
//    var data = JSON.parse(text);
//    var element = document.getElementById('file-content');
//    element.textContent = data;
//    console.log("Bla")
//    console.log(data);
//});
//}
//document.getElementById('file-input').addEventListener('change', readSingleFile, false);
//
//
//function readTextFile(file, callback) {
//    var rawFile = new XMLHttpRequest();
//    rawFile.overrideMimeType("application/json");
//    rawFile.open("GET", file, true);
//    rawFile.onreadystatechange = function() {
//        if (rawFile.readyState === 4 && rawFile.status == "200") {
//            callback(rawFile.responseText);
//        }
//    }
//    rawFile.send(null);
//}
//
//
//
//
