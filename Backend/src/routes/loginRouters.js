// fazendo require da classe do CONTROLLER do login
const LoginController = require("../controllers/loginController");

// instanciando a classe LoginController
const obj_LoginController = new LoginController();

module.exports = (aplicacao) => {
    /******************** ROTAS = ENDPOINTS ********************/

    // rota POST - login de acesso ao sistema
    aplicacao.post("/login", obj_LoginController.efetuarLogin());

}; // end do module_exports