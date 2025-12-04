const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'controle_chaves'
});

// Teste rápido de conexão (opcional, ajuda a ver no terminal se funcionou)
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar no Banco de Dados:', err.code);
    } else {
        console.log('Conectado ao MySQL com sucesso!');
        connection.release();
    }
});

module.exports = db;