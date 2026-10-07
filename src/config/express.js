// chamada lógica do pacote express
const express = require("express");

// associar a aplicacao ao pacote express
// aplicacao WEB = API
const aplicacao = express();

// chamando o pacote body-parser
const bodyParser = require("body-parser");

// permitindo que o NODEJS consiga pegar dados vindo do BODY
aplicacao.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// indicar que a troca de dados será via JSON
aplicacao.use(express.json());

const rotasDoAluno = require("../app/routes/alunoRouters");
const rotasDoCurso = require("../app/routes/cursoRouters");

// estou associando os arquivos de routers com a aplicação da API
rotasDoAluno(aplicacao);
rotasDoCurso(aplicacao);

// sem a linha de baixo não será possível usar as configurações
// da aplicação que estão nesse arquivo
module.exports = aplicacao;
