// Esse arquivo é executado pelo Jest ANTES de qualquer módulo ser importado.
// Garante que process.env está populado antes de connection.js criar o pool.
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
