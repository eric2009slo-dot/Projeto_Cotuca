// fazendo require da classe do CONTROLLER do aluno
const AlunoController = require("../controller/alunoController");

// instanciando a classe AlunoController
const obj_AlunoCotroller = new AlunoController();

module.exports = (aplicacao) => {
    // indicar que a API (express) vai usar o arquivo de rotas  
    // para ser possível visualizar dados via JSON sem 
    // dar problemas de header no HTTP
    aplicacao.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        next();
    });

    /******************** ROTAS = ENDPOINTS ********************/
    
    // rota GET - listagem de todos os alunos da tabela ALUNO
    aplicacao.get("/Alunos",obj_AlunoCotroller.listarTodosAlunos());

    // rota GET - listagem dos dados do aluno por ID
    aplicacao.get(
        "/Alunos/:id", obj_AlunoCotroller.listarDadosDoAlunoPorID());

    // rota GET - listagem dos dados do aluno por RA
    aplicacao.get(
        "/Alunos/ra/:ra", obj_AlunoCotroller.listarDadosDoAlunoPorRA());

    // rota DELETE - excluir aluno por ID
    aplicacao.delete(
        "/Alunos/:id", obj_AlunoCotroller.excluirAlunoPorID());

    // rota POST - inserir novo aluno no BD
    aplicacao.post("/Alunos",obj_AlunoCotroller.inserirNovoAluno());

    // rota PUT para atualização dos dados do ALUNO
    aplicacao.put("/Alunos/:id", obj_AlunoCotroller.atualizarDadosAluno());

}; // end do module_exports

