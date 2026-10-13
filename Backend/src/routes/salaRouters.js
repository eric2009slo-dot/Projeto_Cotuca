// fazendo require da classe do CONTROLLER de recurso
const RecursoController = require("../controllers/recursoController");

// instanciando o controller para o tipo SALA
const obj_SalaController = new RecursoController("SALA");

module.exports = (aplicacao) => {
    /******************** ROTAS = ENDPOINTS ********************/

    // rota GET - listagem de todas as salas
    aplicacao.get("/salas", obj_SalaController.listarTodosRecursos());

    // rota GET - dados de uma sala por ID
    aplicacao.get("/salas/:id", obj_SalaController.listarRecursoPorID());

    // rota POST - inserir nova sala
    aplicacao.post("/salas", obj_SalaController.inserirNovoRecurso());

    // rota PUT - atualizar uma sala
    aplicacao.put("/salas/:id", obj_SalaController.atualizarDadosRecurso());

    // rota DELETE - excluir uma sala
    aplicacao.delete("/salas/:id", obj_SalaController.excluirRecursoPorID());

}; // end do module_exports