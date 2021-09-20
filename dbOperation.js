var config = require('./config/config');
const sql = require('mssql');



async function getOrders() {
    try {
        let pool = await sql.connect(config.getConnection());
        let products = await pool.request().query("select * from Api");
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function dbConnectData() {
    try {
        let pool = await sql.connect(config.getConnection());
        let dbConnection = await pool.request().query("select * from configDetails");
        return dbConnection.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}


module.exports = {
    getOrders: getOrders,
    dbConnectData:dbConnectData
    
}