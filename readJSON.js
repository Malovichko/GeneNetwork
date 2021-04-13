function readSingleFileJSON(e) {
    let file = e.target.files[0];
    let contents = null;
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        displayContentsJSON(contents, 'cy');
    };
    reader.readAsText(file);
    clearInput();
    let graph = JSON.parse(contents);
//    drawGraphFromJSON(graph);
}

function displayContentsJSON(contents, contner) {
    let data = JSON.parse(contents);
    /*let element = document.getElementById('file-content');
    element.textContent = contents;*/
    network = new Network(1);

    nodes = data.elements.nodes;
    for (i = 0; i < nodes.length; i++) {
        id = nodes[i].data.id;
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
        entries = Object.entries(edges[i].data);

        idNode1 = edges[i].data.source;
        node1 = network.findNodeById(idNode1);

        idNode2 = edges[i].data.target;
        node2 = network.findNodeById(idNode2);

        edge = new Edge(node1, node2, id);
        network.setEdgeInArray(edge);
    }
    testCSGraph(network, contner);
    return network;
}

input = document.getElementById('json-input');
if (input) input.addEventListener('change', readSingleFileJSON);
