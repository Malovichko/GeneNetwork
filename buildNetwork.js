function paintGraph(network) {
    var draw = SVG().addTo('body').size(600, 600)
    let nodeArray = network.getNodeArray();
    let edgeArray = network.getEdgeArray();
    nodeArray.forEach(function (item, i, nodeArray) {
        let x = getRandomInt(400);
        let y = getRandomInt(400);
        item.setAttribute('x', x);
        item.setAttribute('y', y);
        console.log(item.getAttributeFromName('x') + " : " + item.getAttributeFromName('y'));
        let xCenter = item.getAttributeFromName('x') + item.getAttributeFromName('width')/2;
        let yCenter = item.getAttributeFromName('y') + item.getAttributeFromName('height')/2;
        item.setAttribute('xCenter', xCenter);
        item.setAttribute('yCenter', yCenter);
//        console.log(item.getAttributeFromName("x"));
        drawNode(draw, item.getAttributeFromName('label'), item.getID(), item.getAttributeFromName('width'), item.getAttributeFromName('height'), x, y);
    });
    edgeArray.forEach(function (item, i, edgeArray) {
        drawEdge(draw, item.getID(), item.getSource().getAttributeFromName('xCenter'), item.getSource().getAttributeFromName('yCenter'), item.getTarget().getAttributeFromName('xCenter'), item.getTarget().getAttributeFromName('yCenter'));
    });
}

function drawNode(draw, name, id, width, height, x, y) {
    var group = draw.group()
    var element = draw.element('title').words('node' + id);
    var ellipse = draw.ellipse(width, height).fill('#f06').move(x, y);
    //    console.log(ellipse.x());
    //    console.log('node = ' + draw.get(0).x());
    var text = draw.text(name)
    text.move(x + 20, y + 20).font({
        family: 'Helvetica',
        size: 25,
        anchor: 'middle',
        leading: '0.5em'
    })
    group.add(ellipse)
    group.add(element)
    group.add(text)
}

function drawEdge(draw, id, x1, y1, x2, y2) {
    var group = draw.group()
    var element = draw.element('title').words('edge' + id);
    var line = draw.line(x1, y1, x2, y2);
    line.stroke({
        color: '#000000',
        width: 3,
        linecap: 'round'
    });
}

function moveNode(ellipse, text, x, y) {
    ellipse.move(x, y);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}



