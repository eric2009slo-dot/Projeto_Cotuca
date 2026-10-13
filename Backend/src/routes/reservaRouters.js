// fazendo require da classe do CONTROLLER da reserva
const ReservaController = require("../controllers/reservaController");

// instanciando a classe ReservaController
const obj_ReservaController = new ReservaController();

module.exports = (aplicacao) => {
    /******************** ROTAS = ENDPOINTS ********************/

    // rota GET - consulta de reservas (aceita filtros na query string)
    aplicacao.get("/reservas", obj_ReservaController.listarTodasReservas());

    // rota GET - dados de uma reserva por ID
    aplicacao.get("/reservas/:id", obj_ReservaController.listarReservaPorID());

    // rota POST - inserir nova reserva
    aplicacao.post("/reservas", obj_ReservaController.inserirNovaReserva());

    // rota PUT - atualizar uma reserva
    aplicacao.put("/reservas/:id", obj_ReservaController.atualizarDadosReserva());

    // rota DELETE - excluir uma reserva
    aplicacao.delete("/reservas/:id", obj_ReservaController.excluirReservaPorID());

}; // end do module_exports