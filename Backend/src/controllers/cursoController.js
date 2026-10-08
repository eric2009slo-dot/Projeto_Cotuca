const CursoCRUD = require("../model/cursoCRUD");

var db = require("../../config/database");

class CursoController
{
  listarTodosCursos() 
  {
    return function (request, response) {
      const cursoCRUD = new CursoCRUD(db);
      cursoCRUD
        .geraListagemDeCursos()
        .then((resultados) => {
           console.log("DADOS (JSON) vindo da tabela CURSO:");
           console.log(resultados.recordset);
           response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao listar TODOS os CURSOS!"
        });
      });
    };
  }
}  // end da class Curso

module.exports = CursoController;