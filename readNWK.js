function readSingleFileNWK(e) {
    var file = e.target.files[0];
    var contents = null;
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        displayContentsNWK(contents);
    };
    reader.readAsText(file);
}

function displayContentsNWK(contents) {
    console.log(contents);
    network = new Network(1);
    network.setAttribute('type', 'nwk');
    vertex_name = '';
    v_id = 0;
    e_id = 0;
    wnv = false;
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
        } else if (char == ' ' || char == ',') {
            continue;
        } else if (char == ';') { /* end of graph */
            break;
        } else { /* name of new vertex */
            vertex_name += char;
            char = contents[i + 1];
            if (char != '(' && char != ')' && char != ',' && char != ';' && char != ' ') continue;
            else {
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
                char = vertex_name;
                vertex_name = '';
            }
        }
    }
    // paintGraph(network);
    testCSGraph(network);
}

document.getElementById('nwk-input').addEventListener('change', readSingleFileNWK);
