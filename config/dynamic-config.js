var mssql = require("mssql");

class DynamicDBConnection {

    async getConnection(data) {
        try {
            console.log('/*******');
            console.log(data);
            console.log('/*******////////');
            console.log(data[0].database);
            return await mssql.connect({
                user: data[0].user,
                password: data[0].password,
                // server: 'DSK025\\MSSQLSERVER01',
                server: data[0].server,
                // port: 1433,
                database: data[0].database,
                options: {
                    encrypt: false
                }
            });
            /*return await mssql.connect({
                user: 'demo',
                password: 'Password@1234',
                // server: 'DSK025\\MSSQLSERVER01',
                server: 'localhost',
                // port: 1433,
                database: 'demo',
                options: {
                    encrypt: false
                }
            });*/
        }
        catch (error) {
            console.log(error);
        }
    }  
}



module.exports = new DynamicDBConnection();
