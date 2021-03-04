function readSingleFileJSON(e) {
    var file = e.target.files[0];
    var contents = null;
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        displayContentsJSON(contents);
    };
    reader.readAsText(file);
    var graph = JSON.parse(contents);
//    drawGraphFromJSON(graph);
}

function displayContentsJSON(contents) {
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
        // console.log(entriesPos[0][0] + " " + entriesPos[0][1]);
        // console.log(entriesPos[1][0] + " " + entriesPos[1][1]);
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
}

document.getElementById('file-input').addEventListener('change', readSingleFileJSON);
