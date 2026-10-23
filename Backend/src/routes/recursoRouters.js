// fazendo require da classe do CONTROLLER de recurso
const RecursoController = require("../controllers/recursoController");

// tipo null = traz laboratórios e salas juntos
// (útil para o front montar a lista de recursos na tela de reserva)
const obj_RecursoController = new RecursoController(null);

module.exports = (aplicacao) => {
    /******************** ROTAS = ENDPOINTS ********************/

    // rota GET - listagem de todos os recursos (laboratórios + salas)
    aplicacao.get("/recursos", obj_RecursoController.listarTodosRecursos());

    // rota GET - dados de um recurso por ID
    aplicacao.get("/recursos/:id", obj_RecursoController.listarRecursoPorID());
    // Status das salas e laborátorios
    aplicacao.put("/recursos/:id/status",obj_RecursoController.atualizarStatusRecurso()
);

}; // end do module_exports