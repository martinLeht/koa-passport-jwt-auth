import { Inject, Singleton } from 'typescript-ioc';
import { Request, TYPES } from 'tedious';
import DatabaseService from '../services/DatabaseService';

var slugify = require('slugify');

const SELECT_ALL = 
    'u.[Id], u.[username], u.[email], u.[password]';

const COLUMNS = [ 
    'id', 'username', 'email', 'password'
];


@Singleton
export default class UsersRepository {

    constructor(@Inject private db: DatabaseService) { }

    public async findAll() {
        console.log("In the repository FIND ALL");
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u',
            columns: COLUMNS
        });

        return users.map(user => this.parse(user));
    }

    public async findById(id: number) {
        console.log("In the repository FIND id");
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM [dbo].[Users] u WHERE [username] = ' + id,
            columns: COLUMNS
        });

        if (users.length === 0) return undefined;

        return this.parse(users[0]);
    }

    public async findByUsername(username: string) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM [dbo].[Users] u ' +
                 'WHERE [username] = \'' + username + '\'',
            columns: COLUMNS 
        });

        if (users.length === 0) return undefined;

        return this.parse(users[0]);
    }

    public async insert(obj: {
        username: string,
        email: string,
        password: string
    }) {

        console.log("In the repository INSERT");
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                let sql = 'INSERT INTO Users VALUES (@username, @email, @password)';

                let request = new Request(sql, (error: Error, rowCount: number, rows: any[]) => {
                    if (error) reject(error);
                    else resolve(rows[0][0].value);

                    connection.release();
                });

                request.addParameter('username', TYPES.NVarChar, JSON.stringify(obj.username));
                request.addParameter('email', TYPES.NVarChar, JSON.stringify(obj.email));
                request.addParameter('password', TYPES.NVarChar, JSON.stringify(obj.password));
                connection.execSql(request);
            }).catch((err) => {
                throw new Error("Connection error: " + err); 
            });
        });
    }

    public update(id: number, obj: { 
        username?: string, 
        email?: string, 
        password?: string
    }) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                let sql = 'UPDATE [dbo].[Users] SET ';
                if (obj.username !== undefined) sql += 'username = @username, '; 
                if (obj.email !== undefined) sql += 'email = @email, '; 
                if (obj.password !== undefined) sql += 'password = @password, ';

                if (sql.substr(-2) === ', ') {
                    sql = sql.substr(0, sql.length - 2);
                } else {
                    resolve();
                    connection.release();
                    return;
                }

                sql += ' WHERE [Id] = @id ';
    
                let request = new Request(sql, (error: Error, rowCount: number) => {
                    if (error) reject(error);
                    else resolve();

                    connection.release();
                });

                request.addParameter('id', TYPES.Int, id);
                if (obj.username !== undefined) request.addParameter('username', TYPES.NVarChar, JSON.stringify(obj.username));
                if (obj.email !== undefined) request.addParameter('email', TYPES.NVarChar, JSON.stringify(obj.email));
                if (obj.password !== undefined) request.addParameter('password', TYPES.NVarChar, JSON.stringify(obj.password));
                connection.execSql(request);
            });
        });
    }

    public delete(id: number) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                let sql = 'DELETE FROM [dbo].[Uses] WHERE [Id] = @id ';
                let request = new Request(sql, (error: Error, rowCount: number) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
    
                    connection.release();
                });
                
                request.addParameter('id', TYPES.Int, id);
                connection.execSql(request);                
            });
        });
    }

    private parse(row: any): any {
        const username = JSON.parse(row.username);
        return {
            id: row.id,
            username: username,
            slug: username && username.fi ? slugify(username.fi).toLowerCase() : '',
            email: JSON.parse(row.email),
            password: JSON.parse(row.password)
        };
    }

}