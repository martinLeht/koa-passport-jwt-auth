import { Singleton } from 'typescript-ioc';
import { Request } from 'tedious';
import tedious = require("tedious");
import ConnectionPool from 'tedious-connection-pool';
import mysql, { Pool, PoolConnection, PoolConfig, MysqlError, FieldInfo }  from 'mysql';
import fs from 'fs';
import { dbPoolConfig } from '../Config/Config';
import { rejects } from 'assert';

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
        console.log("In database service before promise");
        return new Promise<any[]>((resolve, reject) => {
            this.getConnection().then(connection => {
                console.log('Getting connection!');
                let request = new Request(obj.sql, (error: Error, rowCount: number, rows: any[]) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (rows.length === 0) {
                            resolve([]);
                        } else {
                            let result: any[] = [];
                            if (rows.length > 0) {
                                for (let row of rows) {
                                    let item: any = {};
                                    obj.columns.forEach(column => {
                                        item[column] = DatabaseService.getValue(column, row);
                                    });

                                    result.push(item);
                                }
                            }
            
                            resolve(result);
                        }
                    }
    
                    connection.release();
                });
    
                connection.execSql(request);
            }, error => {
                reject(error);
            }).catch((err) => {
                throw new Error("Connection error: " + err); 
            });
        });
    }

    public async find2(obj: { sql: string, columns: string[] }) {
        return new Promise<any[]>((resolve, reject) => {
            this.getConnection2().then(connection => {
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
                            console.log(rows);
                            if (rows.length > 0) {
                                for (let row of rows) {
                                    console.log(row);
                                    let item: any = {};
                                    
                                    obj.columns.forEach(column => {
                                        item[column] = row[column];
                                    });
                                    
                                    console.log("After parse:");
                                    console.log(item);
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
        console.log("In get connection");
        return new Promise<ConnectionPool.PooledConnection>((resolve, reject) => {
            console.log("In get connection Promise");
            this.pool.acquire((err: Error, connection: ConnectionPool.PooledConnection) => {
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

    public async getConnection2() {
        return new Promise<PoolConnection>((resolve, reject) => {
            this.pool2.getConnection((err: MysqlError, connection: PoolConnection) => {
                if (err) {
                    console.log("Reject getConnection(): " + err);
                    reject(err);
                } else {
                    console.log("Resolve getConnection()" + connection);
                    console.log(connection.state)
                    console.log(connection.threadId)
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