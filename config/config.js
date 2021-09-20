var mssql = require("mssql");

class DBConnection {
    async getConnection() {
        try {
            return await mssql.connect({
                user: 'api',
                password: 'Password@1234',
                // server: 'DSK025\\MSSQLSERVER01',
                server: 'localhost',
                // port: 1433,
                database: 'api',
                options: {
                    encrypt: false
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}



module.exports = new DBConnection();
