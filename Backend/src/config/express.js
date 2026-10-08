// chamada lógica do pacote express
const express = require("express");

// chamando o pacote cors (permite que o front em React/Next.js acesse a API)
const cors = require("cors");

// associar a aplicacao ao pacote express
// aplicacao WEB = API
const aplicacao = express();

// liberando o acesso da API para o front-end
aplicacao.use(cors());

// permitindo que o NODEJS consiga pegar dados vindo do BODY
// (o express já tem isso embutido, não precisa do body-parser)
aplicacao.use(express.urlencoded({ extended: true }));

// indicar que a troca de dados será via JSON
aplicacao.use(express.json());

// rota simples para testar se a API está no ar
aplicacao.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// chamando os arquivos de rotas
const rotasDoStatus = require("../routes/statusRouters");
const rotasDoUsuario = require("../routes/usuarioRouters");
const rotasDoLaboratorio = require("../routes/laboratorioRouters");
const rotasDaSala = require("../routes/salaRouters");
const rotasDoRecurso = require("../routes/recursoRouters");
const rotasDaReserva = require("../routes/reservaRouters");
const rotasDoLogin = require("../routes/loginRouters");

// estou associando os arquivos de routers com a aplicação da API
rotasDoStatus(aplicacao);
rotasDoUsuario(aplicacao);
rotasDoLaboratorio(aplicacao);
rotasDaSala(aplicacao);
rotasDoRecurso(aplicacao);
rotasDaReserva(aplicacao);
rotasDoLogin(aplicacao);

// rota não encontrada (sempre por último)
aplicacao.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada." });
});

// sem a linha de baixo não será possível usar as configurações
// da aplicação que estão nesse arquivo
module.exports = aplicacao;