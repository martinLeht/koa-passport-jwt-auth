import { Singleton } from 'typescript-ioc';
import { Request } from 'tedious';
import tedious = require("tedious");
import ConnectionPool from 'tedious-connection-pool';
import mysql, { Pool, PoolConnection, PoolConfig, MysqlError, FieldInfo }  from 'mysql';
import { dbPoolConfig } from '../Config/Config';

@Singleton
export default class DatabaseService {

    private pool2: Pool;

    constructor() {

        let poolConf: PoolConfig = dbPoolConfig;

        this.pool2 = mysql.createPool(poolConf);
    }

    /**
     * Perform an SQL query.
     * 
     * @param sql SQL query string
     * @param columns List of columns to include in the result objects
     * @returns Array of objects read from the database
     */

    public async find(obj: { sql: string, columns: string[] }) {
        return new Promise<any[]>((resolve, reject) => {
            this.getConnection().then(connection => {
                // Use the connection
                connection.query(obj.sql, (err: Error, rows: any[], fields: FieldInfo[]) => {
                    if (err) {
                        console.log(err);
                        reject(err);

                    } else {
                        if (rows.length === 0) {
                            resolve([]);
                        } else {
                            let result: any[] = [];
                            if (rows.length > 0) {
                                for (let row of rows) {
                                    console.log(row);
                                    let item: any = {};
                                    
                                    obj.columns.forEach(column => {
                                        item[column] = row[column];
                                    });
                                    
                                    result.push(item);
                                }
                            }
                            console.log(result.length);
                            console.log(result);
                            resolve(result);
                        }
                    }
                    // When done with the connection, release it.
                    connection.release();

                    // Don't use the connection here, it has been returned to the pool.
                });
            })
        });
    }

    public async getConnection() {
        return new Promise<PoolConnection>((resolve, reject) => {
            this.pool2.getConnection((err: MysqlError, connection: PoolConnection) => {
                if (err) {
                    console.log("Reject getConnection(): " + err);
                    reject(err);
                } else {
                    console.log("Resolve getConnection()");
                    resolve(connection);
                } 
            });
        });
    }

    public static getValue(name: string, row: any[]): any {
        for (let column of row) {
            if (column.metadata && column.metadata.colName.toLowerCase() === name.toLowerCase()) {
                if (column.value === null) {
                    return null;
                }

                if (column.metadata.type.name === 'DateN') {
                    let date = new Date(column.value);
                    return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
                }

                if (column.metadata.type.name === 'BigInt' || column.metadata.type.name === 'IntN') {
                    return parseInt(column.value);
                }
                return column.value;
            }
        }

        return undefined;
    }

}