const caminhoInterno1 = "http://localhost:3000/api/tgroute/";
const caminhoExterno2 = "http://191.36.173.16:3000/api/tgroute/"; //acmtracker serv2 externo (5 - techgenesis)

let caminhoAPI = "";

function retornaCaminhoApi(tipoCaminho)
{
    if (tipoCaminho == 1)
    {
        caminhoAPI = caminhoInterno1
    }
    else if (tipoCaminho == 2)
    {
        caminhoAPI = caminhoInterno2
    }
    else if (tipoCaminho == 3)
    {
        caminhoAPI = caminhoInterno3
    }
    else if (tipoCaminho == 4)
    {
        caminhoAPI = caminhoExterno1
    }
    else if (tipoCaminho == 5)
    {
        caminhoAPI = caminhoExterno2
    }

    return caminhoAPI;
}

module.exports = retornaCaminhoApi;