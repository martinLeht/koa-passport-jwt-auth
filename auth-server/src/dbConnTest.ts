import fs from "fs";
import mysql, { Pool, PoolConfig, MysqlError, PoolConnection, FieldInfo } from 'mysql';
import { dbPoolConfig } from './config/Config';

const pool: Pool = mysql.createPool(dbPoolConfig);

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

