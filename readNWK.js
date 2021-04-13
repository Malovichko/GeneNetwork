function readSingleFileNWK(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        displayContentsNWK(contents, 'cy');
    };
    reader.readAsText(file);
    clearInput();
}

function displayContentsNWK(contents, contner) {
    network = new Network(1);
    network.setAttribute('type', 'nwk');
    vertex_name = '';
    v_id = 0;
    e_id = 0;
    wnv = false;
    edgeLength = false;
    for (i = 0; i < contents.length; i++) {
        char = contents[i];
        if (char == '(') { /* new child to current vertex */
            newVertex = new Node('n'+v_id);
            newVertex.setAttribute('name', '');
            network.setNodeInArray(newVertex);
            if (v_id != 0) {
                edge = new Edge(curVertex, newVertex, 'e'+e_id);
                network.setEdgeInArray(edge);
                e_id++;
            }
            curVertex = newVertex;
            v_id++;
            vertexExist = true;
        } else if (char == ')') { /* up to prev */
            newVertex = curVertex;
            curVertex = curVertex.getAdjacentVertexes()[0];
            vertexExist = false;
        } else if (char == ' ') {
            continue;
        } else if (char == ',') {
            newVertex = new Node('n'+v_id);
            network.setNodeInArray(newVertex);
            if (v_id != 0) {
                edge = new Edge(curVertex, newVertex, 'e'+e_id);
                network.setEdgeInArray(edge);
                e_id++;
            }
            v_id++;
            vertexExist = false;
        } else if (char == ';') { /* end of graph */
            break;
        } else if (char == ':') {
            edgeLength = true;
        } else { /* name of new vertex */
            vertex_name += char;
            char = contents[i + 1];
            if (char != '(' && char != ')' && char != ',' && char != ';' && char != ' ' && char != ':' && char != null) continue;
            else {
                if (edgeLength) {
                    edge.setAttribute('length', parseFloat(vertex_name));
                    vertex_name = '';
                    edgeLength = false;
                } else {
                    if (vertexExist) {
                        newVertex = new Node('n'+v_id);
                        network.setNodeInArray(newVertex);
                        if (v_id != 0) {
                            edge = new Edge(curVertex, newVertex, 'e'+e_id);
                            network.setEdgeInArray(edge);
                            e_id++;
                        }
                        v_id++;
                    }
                    newVertex.setAttribute('name', vertex_name);
                    vertex_name = '';
                }
            }
        }
    }
    testCSGraph(network, contner);
    return network;
}

input = document.getElementById('nwk-input');
if (input) input.addEventListener('change', readSingleFileNWK);
