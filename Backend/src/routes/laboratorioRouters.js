// fazendo require da classe do CONTROLLER de recurso
const RecursoController = require("../controllers/recursoController");

// instanciando o controller para o tipo LABORATORIO
const obj_LaboratorioController = new RecursoController("LABORATORIO");

module.exports = (aplicacao) => {
    /******************** ROTAS = ENDPOINTS ********************/

    // rota GET - listagem de todos os laboratórios
    aplicacao.get("/laboratorios", obj_LaboratorioController.listarTodosRecursos());

    // rota GET - dados de um laboratório por ID
    aplicacao.get("/laboratorios/:id", obj_LaboratorioController.listarRecursoPorID());

    // rota POST - inserir novo laboratório
    aplicacao.post("/laboratorios", obj_LaboratorioController.inserirNovoRecurso());

    // rota PUT - atualizar um laboratório
    aplicacao.put("/laboratorios/:id", obj_LaboratorioController.atualizarDadosRecurso());

    // rota DELETE - excluir um laboratório
    aplicacao.delete("/laboratorios/:id", obj_LaboratorioController.excluirRecursoPorID());

}; // end do module_exports