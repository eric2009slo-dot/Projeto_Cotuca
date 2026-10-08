const mssql = require("mssql");

// Configuração da conexão com o SQL Server (valores vêm do arquivo .env)
// IMPORTANTE: o dotenv precisa ser carregado ANTES de este arquivo ser importado
const configuracao = {
    user    : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server  : process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// Executar a conexão com o BD SQLSERVER
mssql.connect(configuracao)
    .then(() => {
        console.log("CONEXÃO com o BD SQLSERVER realizada com SUCESSO!");
    })
    .catch((erro) => {
        console.log("ERRO na CONEXÃO com o BD SQLSERVER");
        console.log("\nErro = " + erro);
    });

module.exports = mssql;