function getFileExtension(filename) {
    return filename.split('.').pop();
}

function getNetwork(ext, contents, contner) {
    if (ext == "cys") return displayContentsCYS(contents, contner);
    else if (ext == "json") return displayContentsJSON(contents, contner);
    else if (ext == "nwk") return displayContentsNWK(contents, contner);
    else if (ext == "dot") return displayContentsDOT(contents, contner);
    else return null;
}

let ntwk = null;
let trees = [];

function readSingleFile(e) {
    tgt = e.target.id;
    if (tgt == 'gene-input-1' && ntwk) ntwk = null;
    contner = '';
    if (!ntwk) contner = 'cy';
    else contner = 'cy'+tgt.substr(10, tgt.length-1);
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        network = getNetwork(getFileExtension(file.name), contents, contner);
        displayPrognose(network, tgt);
    };
    reader.readAsText(file);
}

function displayPrognose(network, tgt) {
    if (!ntwk) {
        ntwk = network;
        nodes = network.nodeArray;
        menu = document.getElementById('menu');
        menu.getElementsByTagName('h2')[1].style.display = 'block';
        for (i = 0; i < nodes.length; i++) {
            input = document.createElement('input');
            input.setAttribute('type', 'file'); input.setAttribute('id', 'gene-tree-'+i); input.setAttribute('accept', document.getElementById('gene-input-1').getAttribute('accept'));
            menu.append(input);
            input.addEventListener('change', readSingleFile);
            input = document.createElement('div');
            input.setAttribute('id', 'cy'+i); input.style.height = 100/nodes.length+'%';
            document.getElementById('cys').append(input);
        }
    } else {
        i = tgt.substr(10, tgt.length-1);
        trees[i] = network;
    }
    if (trees.length == ntwk.nodeArray.length) {
        
        ntwk.nodeArray.forEach((ntwkNode) => {
            try {
                ntwkNodeName = ntwkNode.attrMap.get("name");
                for (i = 0; i < trees.length; i++) {
                    tree = trees[i];
                    tree.nodeArray.forEach((treeNode) => {
                        treeNodeName = treeNode.attrMap.get("name");
                        if (ntwkNodeName == treeNodeName) {
                            parrent = treeNode.adjacentVertex[0];
                            adjNodes = parrent.adjacentVertex;
                            adjNodes.forEach((adjNode) => {
                                if (adjNode.adjacentVertex.length == 1 && adjNode != treeNode) {
                                    ntwkNode.attrMap.set("name", adjNode.attrMap.get("name"));
                                    throw new Error();
                                }
                            });
                        }
                    });
                }
            } catch (e) {};
        });
        clearInput();
        document.getElementById('cys').remove();
        testCSGraph(ntwk, 'cy');
    }
}

input = document.getElementById('gene-input-1');
if (input) input.addEventListener('change', readSingleFile);