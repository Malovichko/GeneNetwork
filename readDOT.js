function readSingleFileDOT(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        displayContentsDOT(contents, 'cy');
    };
    reader.readAsText(file);
    clearInput();
}

function displayContentsDOT(contents, contner) {
    let data = graphlibDot.read(contents);
    network = new Network(1);

    nodes = data.nodes();
    for (i = 0; i < nodes.length; i++) {
        id = nodes[i];
        entries = Object.entries(data._nodes[id]);

        node = new Node(id);
        for (j = 0; j < entries.length; j++) {
            if (entries[j][0] == 'label') entries[j][0] = 'name';
            if (entries[j][0] == 'pos') {
                pos = entries[j][1].split(',');
                node.setAttribute('x', parseFloat(pos[0]));
                node.setAttribute('y', parseFloat(pos[1]));
            }
            node.setAttribute(entries[j][0], entries[j][1]);
        }
        width = node.getAttributeFromName('width');
        height = node.getAttributeFromName('height');
        if (width != undefined) node.setAttribute('width', width * 70 + 'in');
        if (height != undefined) node.setAttribute('height', height * 70 + 'in');
        network.setNodeInArray(node);
    }

    edges = data.edges();
    for (i = 0; i < edges.length; i++) {
        id = "e" + i;

        idNode1 = edges[i].v;
        node1 = network.findNodeById(idNode1);

        idNode2 = edges[i].w;
        node2 = network.findNodeById(idNode2);

        edge = new Edge(node1, node2, id);
        network.setEdgeInArray(edge);
    }
    return testCSGraph(network, contner);
    return network;
}

input = document.getElementById('dot-input');
if (input) input.addEventListener('change', readSingleFileDOT);