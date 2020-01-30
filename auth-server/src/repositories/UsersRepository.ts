import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';

const SELECT_ALL =
    'u.id, u.details_id, u.username, u.email, u.password';

const COLUMNS = [
    'id', 'username', 'email', 'password'
];


@Singleton
export default class UsersRepository {

    constructor(@Inject private db: DatabaseService) {
    }

    public async findAll() {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u',
            columns: COLUMNS
        });

        for (let user of users) {
            console.log(user);
        }
        return users;
    }

    public async findById(id: number) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u WHERE id = ' + id,
            columns: COLUMNS
        });

        if (users.length === 0) return undefined;

        return users[0];
    }


    public async findByEmail(email: string) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u WHERE u.email = \"' + email + '\"',
            columns: COLUMNS
        })

        if (users.length === 0) return undefined;

        return users[0];
    }

    public async insert(obj: {
        username: string,
        email: string,
        password: string
    }) {

        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                const userData = [
                    obj.username,
                    obj.email,
                    obj.password
                ];
                let sql = 'INSERT INTO Users (username, email, password) VALUES (?,?,?)';

                connection.query(sql, userData, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.insertId);
                    }

                    connection.release();
                });
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

                const userData = [];
                if (obj.username !== undefined) userData.push(obj.username);
                if (obj.email !== undefined) userData.push(obj.email);
                if (obj.password !== undefined) userData.push(obj.password);
                userData.push(id);

                let sql = 'UPDATE Users SET ';
                if (obj.username !== undefined) sql += 'username = ?, ';
                if (obj.email !== undefined) sql += 'email = ?, ';
                if (obj.password !== undefined) sql += 'password = ?, ';

                if (sql.substr(-2) === ', ') {
                    sql = sql.substr(0, sql.length - 2);
                } else {
                    resolve();
                    connection.release();
                    return;
                }

                sql += ' WHERE id = ?';

                connection.query(sql, userData, (err, result) => {
                    if (err) reject(err);
                    else resolve();

                    connection.release();
                });
            });
        });
    }

    public delete(id: number) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection
            ().then(connection => {
                let sql = 'DELETE FROM Users WHERE id = ' + id;

                connection.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Affected rows: " + result.affectedRows);
                        resolve();
                    }

                    connection.release();
                });
            });
        });
    }

    private parse(row: any): any {
        console.log("IN PARSE");
        console.log(row);
        return {
            id: row.id,
            username: JSON.parse(row.username),
            email: JSON.parse(row.email),
            password: JSON.parse(row.password)
        };
    }

}
