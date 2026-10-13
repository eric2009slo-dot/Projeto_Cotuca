// fazendo require da classe do CONTROLLER do status
const StatusController = require("../controllers/statusController");

// instanciando a classe StatusController
const obj_StatusController = new StatusController();

module.exports = (aplicacao) => {
    /******************** ROTAS = ENDPOINTS ********************/

    // rota GET - listagem de todos os status
    aplicacao.get("/status", obj_StatusController.listarTodosStatus());

    // rota GET - dados de um status por ID
    aplicacao.get("/status/:id", obj_StatusController.listarStatusPorID());

    // rota POST - inserir novo status
    aplicacao.post("/status", obj_StatusController.inserirNovoStatus());

    // rota PUT - atualizar um status
    aplicacao.put("/status/:id", obj_StatusController.atualizarStatus());

    // rota DELETE - excluir um status
    aplicacao.delete("/status/:id", obj_StatusController.excluirStatusPorID());

}; // end do module_exports