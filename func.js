function writeList(file) {
    model.getEntries(file, function (entries) {
        fileList = document.getElementById('fileList');
        fileList.innerHTML = "";
        entries.forEach(function (entry) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var p = document.createElement("p");
            var details = document.createElement("details");
            var summary = document.createElement("summary");
            a.textContent = entry.filename;
            model.getEntryFile(entry, function (blob, blobURL) {
                a.href = blobURL;
                var reader = new FileReader();
                reader.onloadend = function () {
                    p.innerHTML = reader.result;
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

var model = (function () {
    return {
        getEntries: function (file, onend) {
            zip.createReader(new zip.BlobReader(file), function (zipReader) {
                zipReader.getEntries(onend);
            }, onerror);
        },
        getEntryFile: function (entry, onend, onprogress) {
            var writer, zipFileEntry;

            function getData() {
                entry.getData(writer, function (blob) {
                    var blobURL = URL.createObjectURL(blob);
                    onend(blob, blobURL);
                }, onprogress);
            }
            writer = new zip.BlobWriter();
            getData();
        }
    };
})();

function getFile(e) {
    var files = e.target.files;
    if (files.length == 1) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = writeList(file);
    }
}

window.onload = function (e) {
    zip.workerScriptsPath = "/lib/";
    button = document.getElementById('fileInput');
    button.addEventListener('change', getFile);

    function createNetwork() {
        let network = new Network(1);
//        console.log(network.getID());
        network.setAttribute("Pb|cka", 12);
//        console.log(network.getAttributeFromName("Pb|cka"));

        let node = new Node(1);
        let node1 = new Node(2);
        let node2 = new Node(3);
        node.setAttribute("name", "Seq12");
        node.setAttribute("width", 200);
        node.setAttribute("height", 100);
        node1.setAttribute("name", "Arn34");
        node1.setAttribute("width", 200);
        node1.setAttribute("height", 100);
        node2.setAttribute("name", "Ghy0");
        node2.setAttribute("width", 200);
        node2.setAttribute("height", 100);

//        console.log( "id 1, 2 " + node.getID() + " " +  node1.getID());
//        console.log(node.getAttributeFromName("name"));

        let edge = new Edge(node1, node, 1);
//        console.log(edge.getID());
//        console.log(edge.getSource());
//        console.log(edge.getTarget());

        network.nodeArray.push(node1);
//        console.log(network.nodeArray.includes(node1));

        network.setNodeInArray(node);
        network.setNodeInArray(node2);
//        console.log(network.isNodeIncluded(node));
//        console.log(network.isNodeIncluded(node1));
//        console.log(network.getNodeArray());
        network.edgeArray.push(edge);

        console.log(node.getAdjacentVertexes());
        paintGraph(network);
//        draw();
    }
    createNetwork();
}

