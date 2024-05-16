import pkg from 'mssql';
import path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from 'path';
const { Bit, Char, ConnectionPool, DateTime, Int, NVarChar, Transaction } = pkg;
const masterConfig = {
    user: 'sa',
    password: '!123456Aab',
    server: '127.0.0.1/mssql-server',
    database: 'master',
    port: 1434,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true // If you're using Azure, set to true
    }
};
class SchemaCreator {
    static schemaPath = "input/db_creation.sql";
    static async connectToDatabase() {
        try {
            let dbConn = new ConnectionPool(masterConfig); //Config
            //let dbConn = new ConnectionPool('Server=localhost;Database=master;Trusted_Connection=True;'); //ConnString
            return await dbConn.connect();
            //return await sql.connect(config);
        }
        catch (err) {
            console.error('Error connecting to database:', err);
            throw err;
        }
    }
    static async createSchema() {
        const pool = await this.connectToDatabase();
        //Start transaction
        //const transaction = new Transaction(pool);
        //await transaction.begin();
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        //Read schema file
        const schemaPath = path.join(__dirname, this.schemaPath);
        const schema = fs.readFileSync(schemaPath, 'utf8');
        //Execute schema
        await pool.batch(schema);
        //await transaction.request().batch(schema);
        //End transaction
        //await transaction.commit();
        console.log("Schema created");
        //close connection
        await pool.close();
    }
}
export { SchemaCreator };
