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

let ntwk; let backup = [];
let trees = [];

function readSingleFile(e) {
    tgt = e.target.id;
    if (tgt == 'gene-input-1' && ntwk) ntwk = null;
    if (!ntwk) contner = 'cy';
    else contner = 'cy'+tgt.substr(10, tgt.length-1);
    file = e.target.files[0];
    if (!file) return;
    reader = new FileReader();
    reader.onload = function (e) {
        contents = e.target.result;
        network = getNetwork(getFileExtension(file.name), contents, contner);
        displayPrognose(network, tgt);
    };
    reader.readAsText(file);
}

function prognose() {
    ntwk.nodes().forEach((ntwkNode) => {
        ntwkNode.data('name', backup[ntwkNode.id()]);
    });
    console.log(' ');
    ntwk.nodes().forEach((ntwkNode) => {
        ntwkNodeName = ntwkNode.data('name');
        for (i = 0; i < trees.length; i++) {
            tree = trees[i];
            treeNodeSelected = tree.$(':selected');
            if (treeNodeSelected.length == 1) {
                if (tree.nodes('[name = "'+ntwkNodeName+'"]').length > 0) {
                    ntwkNode.data('name', treeNodeSelected.data('name'));
                }
            }
        }
    });
    //clearInput();
    //document.getElementById('cys').remove();
    //testCSGraph(ntwk, 'cy');
}

function displayPrognose(network, tgt) {
    if (!ntwk) {
        ntwk = network;
        nodes = ntwk.nodes();
        nodes.forEach((ntwkNode) => {
            backup[ntwkNode.id()] = ntwkNode.data('name');
        });
        menu = document.getElementById('menu');
        inputs = menu.getElementsByTagName('input');
        if (inputs.length > 1) {
            for (i = inputs.length-1; i > 0; i--) {
                document.querySelector(`#gene-tree-${i - 1}`).remove();
            }
        }
        else menu.getElementsByTagName('h2')[1].style.display = 'block';
        let i = 0;
        let idsStr = '';
        nodes.forEach(node => idsStr += `${node._private.data.name},`);
        data = getData(`genes?ids=${idsStr}`);
        nodes.forEach(node => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.setAttribute('type', 'file'); input.setAttribute('id', `gene-tree-${i}`);
            input.setAttribute('accept', document.getElementById('gene-input-1').getAttribute('accept'));
            label.append(input);
            const name = node._private.data.name;
            if (name) {
                const species = data.filter(e => e.gene_id === name);
                let speciesName = '';
                if (species.length > 0)  speciesName = ` - ${specieses.filter(e => e.species === species[0].species)[0].common_name}`;
                label.innerHTML += `${name}${speciesName}`;
            }
            menu.append(label);
            input.addEventListener('change', readSingleFile);
            const divTree = document.createElement('div');
            divTree.setAttribute('id', `cy${i}`);
            divTree.style.height = `${100 / divTree.length}%`;
            document.getElementById('cys').append(divTree);
            i++;
        });
    } else {
        i = tgt.substr(10, tgt.length-1);
        trees[i] = network;
        ntwk.nodes().forEach((ntwkNode) => {
            ntwkNodeName = ntwkNode.data('name');
            treeNode = network.nodes('[name = "'+ntwkNodeName+'"]');
            if (treeNode.length > 0) treeNode.select();
        });
    }
    if (trees.length == ntwk.nodes().length) document.getElementById('prognose').style.display = 'block';
}

input = document.getElementById('gene-input-1');
if (input) input.addEventListener('change', readSingleFile);