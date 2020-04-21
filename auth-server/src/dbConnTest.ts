import tedious = require("tedious");
import ConnectionPool from 'tedious-connection-pool';
import fs from "fs";
import mysql, { Pool, PoolConfig, MysqlError, PoolConnection, FieldInfo } from 'mysql';

/*
const config: tedious.ConnectionConfig = {
	server: "hoodscapstone.mysql.database.azure.com",
	options: {
		database: "capstonedb",
		port: 3306
	},
	authentication: {
		type: 'default',
		options: {
			userName: "hoodsadmin@hoodscapstone",
			password: "admin666!"
		}
	}
};


const poolConfig: ConnectionPool.PoolConfig = {
	min: 1,
	max: 4,
	log: true,
	acquireTimeout: 30000
};
*/

const dbPoolConfig = {
    connectionLimit: 5,
    host: 'hoodscapstone.mysql.database.azure.com',
    user: 'hoodsadmin@hoodscapstone',
    password: 'admin666!', 
    database: 'capstonedb',
    port: 3306,
    ssl: {
        ca : fs.readFileSync('../../../../certificates/BaltimoreCyberTrustRoot.crt.pem')
    }
};

//const pool: ConnectionPool = new ConnectionPool(poolConfig, config);

const pool: Pool = mysql.createPool(dbPoolConfig);

/*
pool.on('error', (err: Error) => {
	console.log("\n-------------FIRST ERROR ON--------\n");
	console.error(err);
});

pool.once('error', (err: Error) => {
	console.log("\n-------------FIRST ERROR ONCE--------\n");
	console.error(err);
});

pool.removeAllListeners();

pool.acquire((err: Error, connection: ConnectionPool.PooledConnection) => {
	if (err) throw Error(err.message);
	console.log("hurray");
	connection.beginTransaction((err?: Error): void => { console.log("\n-------------begin transaction--------\n");}, "UserBoiName");
	connection.rollbackTransaction((error: Error): void => { console.log("\n-------------rollback transaction--------\n"); });
	connection.commitTransaction((error: Error): void => {console.log("\n-------------commit transaction--------\n");});

	const request = new tedious.Request("SELECT * FROM Users", (error: Error, rowCount: number): void => {
	});
	request.on("row", (row: tedious.ColumnValue[]): void => {
	});
	connection.execSql(request);

	connection.release();

	pool.drain();
});
*/

pool.getConnection((err: MysqlError, connection: PoolConnection) => {
	if (err) {
		console.log("Reject getConnection(): " + err);
	} else {
		console.log("Resolve getConnection()");
		connection.query('SELECT * FROM Users', (err: Error, rows: any[], fields: FieldInfo[]) => {
			if (err) console.log(err);
			else {
				if (rows.length === 0) {
					console.log("No entries in database.");
				} else {
					let result: any[] = [];
					if (rows.length > 0) {
						for (let row of rows) {
							console.log(row);
						}
					}
				}
			}
			// When done with the connection, release it.
			connection.release();
			// Don't use the connection here, it has been returned to the pool.
		});
	} 
});

