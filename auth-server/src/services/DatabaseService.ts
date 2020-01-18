import { Singleton } from 'typescript-ioc';
import { Request } from 'tedious';
import tedious = require("tedious");
import ConnectionPool from 'tedious-connection-pool';
import { DATABASE } from '../Config/Config';

@Singleton
export default class DatabaseService {

    private pool: ConnectionPool;

    constructor() {

        const config: tedious.ConnectionConfig = {
            server: "127.0.0.1",
            options: {
                database: "capstone_db",
                instanceName: "exampledb"
            },
            authentication: {
                type: 'default',
                options: {
                    userName: "exampledb",
                    password: "exampledb"
                }
            }
        };
        
        const poolConfig: ConnectionPool.PoolConfig = {
            min: 1,
            max: 4,
            log: true,
            acquireTimeout: 10000
        };
        
        this.pool = new ConnectionPool(poolConfig, config);
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