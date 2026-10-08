// chamar a classe AlunoCRUD
const AlunoCRUD = require("../model/alunoCRUD");

// instanciar a classe de conexão com o BD
var db = require("../../config/database");


class AlunoController
{
  // método que chamará o método 
  // geraListagemDeAlunos() da classe AlunoCRUD
  // método do controller que chamará o método listagemAlunos()
  listarTodosAlunos() 
  {
    return function (request, response) {
      const alunoCRUD = new AlunoCRUD(db);
      alunoCRUD
        .geraListagemDeAlunos()
        .then((resultados) => {
           console.log("DADOS (JSON) vindo da tabela ALUNO:");
           console.log(resultados.recordset);
           response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao listar TODOS os ALUNOS!"
        });
      });
    };
  }


  // método que chamará o método 
  // geraListagemDeAlunoPorID(id) da classe AlunoCRUD
  listarDadosDoAlunoPorID() 
  {
    return function (request, response) {
      // pegar o parametro id que virá via HTTP, ou seja, via rota
      const idDoAluno = request.params.id;
      const alunoCRUD = new AlunoCRUD(db);
      alunoCRUD
        .geraListagemDeAlunoPorID(idDoAluno)
        .then((resultados) => {
           console.log("DADOS (JSON) vindo da tabela ALUNO ID = " + idDoAluno);
           console.log(resultados.recordset);
           response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao listar dados do aluno ID = " + idDoAluno
        });
      });
    };
  }


  // método que chamará o método 
  // geraListagemDeAlunoPorRA(ra) da classe AlunoCRUD
  listarDadosDoAlunoPorRA() 
  {
    return function (request, response) {
      // pegar o parametro id que virá via HTTP, ou seja, via rota
      const raDoAluno = request.params.ra;
      const alunoCRUD = new AlunoCRUD(db);
      alunoCRUD
        .geraListagemDeAlunoPorRA(raDoAluno)
        .then((resultados) => {
           console.log("DADOS (JSON) vindo da tabela ALUNO RA = " + raDoAluno);
           console.log(resultados.recordset);
           response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao listar dados do aluno RA = " + raDoAluno
        });
      });
    };
  }



  // método que chamará o método 
  // excluiAlunoPorID(id) da classe AlunoCRUD
  excluirAlunoPorID() 
  {
    return function (request, response) {
      const idDoAluno = request.params.id;
      const alunoCRUD = new AlunoCRUD(db);
      alunoCRUD
        .excluiAlunoPorID(idDoAluno)
        .then((resultados) => {
           console.log("ALUNO ID = " + idDoAluno + " EXCLUÍDO COM SUCESSO!");
           response.status(200).end();
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao excluir ALUNO por ID = " + idDoAluno
        });
      });
    };
  }

  // método que chama o método
  // insereAluno(aluno) da classe AlunoCRUD
  inserirNovoAluno()
  {
    return function(request,response) {
      let dados = request.body;
      console.log("Dados do NOVO aluno = " + dados);
      const alunoCRUD = new AlunoCRUD(db);
      alunoCRUD
        .insereAluno(dados)
        .then(() => {
          console.log("ALUNO FOI INSERIDO COM SUCESSO");
          response.status(200).end();
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
            erro: "Erro ao inserir novo ALUNO no BD!"
          });
        });
    };
  }

  // método que chama o método
  // atualizaAluno(id, aluno) da classe AlunoCRUD
  atualizarDadosAluno() {
    return function (request, response) {
      let dados = request.body;
      console.log("DADOS DO ALUNO A SEREM ATUALIZADOS = " + dados);
      let id = request.params.id;
      const alunoCRUD = new AlunoCRUD(db);
      alunoCRUD
        .atualizaAluno(id, dados)
        .then(() => {
          console.log("DADOS DO ALUNO FORAM ATUALIZADOS COM SUCESSO");
          response.status(200).end();
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao atualizar dados do ALUNO no BD!"
        });
      });
    };
  }


}  // end da class AlunoController

module.exports = AlunoController;