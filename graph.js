class Network {
    attrMap = new Map();
    nodeArray = new Array();
    edgeArray = new Array();

    constructor(id) {
        this.id = id;
    }

    setAttribute(attrName, attr) {
        this.attrMap.set(attrName, attr);
    }

    getID() {
        return this.id;
    }

    getAttributeFromName(attrName) {
        return this.attrMap.get(attrName);
    }

    setNodeInArray(node) {
        this.nodeArray.push(node);
    }
    setEdgeInArray(edge) {
        this.edgeArray.push(edge);
    }

    isNodeIncluded(node) {
        return this.nodeArray.includes(node);
    }

    isEdgeIncluded(edge) {
        return this.edgeArray.includes(edge);
    }

    getNodeArray() {
        return this.nodeArray;
    }

    getEdgeArray() {
        return this.edgeArray;
    }

    getNetworkSize() {
        return this.nodeArray.length;
    }

    findNodeById(id) {
        let size = this.getNetworkSize();
        for (let i = 0; i < size; i++)
            if (this.nodeArray[i].getID() == id)
                return this.nodeArray[i];
        return null;
    }
}

class Node {
    attrMap = new Map();
    adjacentVertex = new Array();

    constructor(id) {
        this.id = id;
    }

    setAttribute(attrName, attr) {
        this.attrMap.set(attrName, attr);
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = id;
    }

    getAttributeFromName(attrName) {
        return this.attrMap.get(attrName);
    }

    getAdjacentVertexes() {
        return this.adjacentVertex;
    }

    addAdjacentVertex(node) {
        this.adjacentVertex.push(node);
    }
}

class Edge {
    attrMap = new Map();

    constructor(source, target, id) {
        this.source = source;
        this.target = target;
        this.id = id;
        source.addAdjacentVertex(target);
        target.addAdjacentVertex(source);
    }

    setAttribute(attrName, attr) {
        this.attrMap.set(attrName, attr);
    }

    getID() {
        return this.id;
    }

    getSource() {
        return this.source;
    }

    getTarget() {
        return this.target;
    }

    getAttributeFromName(attrName) {
        return this.attrMap.get(attrName);
    }
}
