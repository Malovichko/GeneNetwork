function writeList(file) {
    model.getEntries(file, function (entries) {
        fileList = document.getElementById('fileList');
        fileList.innerHTML = "";
        let network = null;
        nodeAttrMap = new Map();
        entries.forEach(function (entry) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            let p = document.createElement("p");
            let details = document.createElement("details");
            let summary = document.createElement("summary");
            a.textContent = entry.filename;
            model.getEntryFile(entry, function (blob, blobURL) {
                a.href = blobURL;
                let reader = new FileReader();
                reader.onloadend = function () {
                    p.innerHTML = reader.result;
                    if (entry.filename == "CytoscapeSession-2020_10_29-20_35/networks/998-string%2Dhl%2Dnew%2Dwith_regulators.tsv.xgmml") {
                        network = new Network(1);

                        pos = reader.result.indexOf("<edge");
                        nodesAndEdges = [reader.result.substring(0, pos), reader.result.substring(pos)];
                        nodes = nodesAndEdges[0].substring(nodesAndEdges[0].indexOf("<node") + 5).split("<node");
                        for (i = 0; i < nodes.length; i++) {
                            label = nodes[i];
                            id = label.substring(label.indexOf("id=") + 4);
                            id = id.split("\"")[0];
                            label = label.substring(label.indexOf("label=") + 7);
                            label = label.split("\"")[0];

                            node = new Node(id);
                            node.setAttribute('name', label);
                            node.setAttribute('width', 40);
                            node.setAttribute('height', 40);
                            network.setNodeInArray(node);
                        }

                        edges = nodesAndEdges[1].substring(nodesAndEdges[1].indexOf("<edge") + 5).split("<edge");
                        edges[edges.length - 1] = edges[edges.length - 1].split("/>")[0];
                        for (i = 0; i < edges.length; i++) {
                            id = edges[i];
                            id = id.substring(id.indexOf("id=") + 4);
                            id = id.split("\"")[0];

                            idNode1 = edges[i];
                            idNode1 = idNode1.substring(idNode1.indexOf("source=") + 8);
                            idNode1 = idNode1.split("\"")[0];
                            node1 = network.findNodeById(idNode1);

                            idNode2 = edges[i];
                            idNode2 = idNode2.substring(idNode2.indexOf("target=") + 8);
                            idNode2 = idNode2.split("\"")[0];
                            node2 = network.findNodeById(idNode2);

                            edge = new Edge(node1, node2, id);
                            network.setEdgeInArray(edge);
                        }
                        testCSGraph(network);
                    }

                    if (entry.filename == "CytoscapeSession-2020_10_29-20_35/views/8108-8118-string%2Dhl%2Dnew%2Dwith_regulators.tsv%281%29.xgmml") {
                        pos = reader.result.indexOf("<edge");
                        nodesAndEdges = [reader.result.substring(0, pos), reader.result.substring(pos)];
                        nodes = reader.result.substring(reader.result.indexOf("<node") + 5).split("<node");
                        for (i = 0; i < nodes.length; i++) {
                            label = nodes[i];
                            id = label.substring(label.indexOf("nodeId=") + 8);
                            id = id.split("\"")[0];

                            x = label.substring(label.indexOf("x=") + 3);
                            x = parseInt(x.split("\"")[0]);

                            y = label.substring(label.indexOf("y=") + 3);
                            y = parseInt(y.split("\"")[0]);

                            node = network.findNodeById(id);
                            node.setAttribute('x', x);
                            node.setAttribute('y', y);
                        }

//                        paintGraph(network);
                        testCSGraph(network);
                    }

                    if (entry.filename == "CytoscapeSession-2020_10_29-20_35/tables/998-string%2Dhl%2Dnew%2Dwith_regulators.tsv/SHARED_ATTRS-org.cytoscape.model.CyNode-998+shared+node.cytable") {
                        pos = reader.result.indexOf("\n");
                        pos2 = pos+1+reader.result.substring(pos+1).indexOf("\n");
                        attributes = reader.result.substring(pos+1, pos2).split(",");
                        for (i = 0; i < attributes.length; i++) {
                            attribute = attributes[i];
                            nodeAttrMap.set(attribute);
                        }

//                        console.log(reader.result.substring(pos+1, pos2));
                       // nodeAttrMap.set();

                    }
                }
                reader.readAsBinaryString(blob);
            }, function (current, total) {});
            summary.appendChild(a);
            details.appendChild(summary);
            details.appendChild(p);
            li.appendChild(details);
            fileList.appendChild(li);
        });
    });
}

let model = (function () {
    return {
        getEntries: function (file, onend) {
            zip.createReader(new zip.BlobReader(file), function (zipReader) {
                zipReader.getEntries(onend);
            }, onerror);
        },
        getEntryFile: function (entry, onend, onprogress) {
            let writer, zipFileEntry;

            function getData() {
                entry.getData(writer, function (blob) {
                    let blobURL = URL.createObjectURL(blob);
                    onend(blob, blobURL);
                }, onprogress);
            }
            writer = new zip.BlobWriter();
            getData();
        }
    };
})();

function getFile(e) {
    let files = e.target.files;
    if (files.length == 1) {
        let file = files[0];
        let reader = new FileReader();
        reader.onload = writeList(file);
    }
}

document.getElementById('cys-input').addEventListener('change', getFile);
