const baseURL = 'https://bioinformatics.psb.ugent.be/plaza/versions/plaza_v5_dicots/api/v3/';
let specieses;
let data;

const getData = (url) => {
    /*const response = fetch(`${baseURL}${url}`)
    .then(response => {
        status_code = response.status;
        if (status_code != 200) throw status_code;
        result = response.json();
        return result;
    })
    .then(result => {
        if (url === 'species') specieses = result.data;
        else data = result.data;
        // const speciesBody = document.querySelector('#dictionary');
        // specieses.forEach(species => {
        //     //console.log(species);
        //     const speciesP = document.createElement('p');
        //     speciesP.innerText = `${species.species} ‒ ${species.common_name}`;
        //     speciesBody.append(speciesP);
        // });
    })
    .catch(error => {
        console.log(error);
    });*/
    const request = new XMLHttpRequest();
    request.open('GET', `${baseURL}${url}`, false);
    request.send();
    if (request.status === 200) return JSON.parse(request.responseText).data;
    else console.log(request.status);
};

specieses = getData('species');
data = getData('genes?ids=AT1G15510,AT1G15510,A,AT1G19000,AT1G19510');
