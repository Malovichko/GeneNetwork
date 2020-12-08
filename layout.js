function calcAttraction(k, len, dl) {
    return k * Math.log(dl / len);
}

function calcRepultion(q2, dl) {
    return q2 / (dl ** 2);
}


