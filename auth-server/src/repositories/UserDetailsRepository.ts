import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';

const SELECT_ALL =
    'ud.details_id, ud.first_name, ud.last_name, ud.suburb, ud.zipcode';

const COLUMNS = [
    'details_id', 'first_name', 'last_name', 'suburb', "zipcode"
];


@Singleton
export default class UserDetailsRepository {

    constructor(@Inject private db: DatabaseService) {
    }

    public async findAll() {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM UserDetails ud',
            columns: COLUMNS
        });

        for (let user of users) {
            console.log(user);
        }
        return users;
    }

    public async findById(id: number) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM UserDetails ud WHERE id = ' + id,
            columns: COLUMNS
        });

        if (users.length === 0) return undefined;

        return users[0];
    }
    /*

    public async insert(userId: number, obj: {
        firstName?: string,
        lastName?: string,
        suburb?: string,
        zipcode?: number
    }) {

        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                const userDetailsData = [
                    obj.firstName,
                    obj.lastName,
                    obj.suburb,
                    obj.zipcode
                ];
                let sql = 'INSERT INTO UserDetails ud (first_name, last_name, suburb, zipcode) VALUES (?,?,?,?)';

                connection.query(sql, userDetailsData, (err, result) => {
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
        userId: number,
        firstName?: string,
        lastName?: string,
        suburb?: string,
        zipcode?: number
    }) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                const userData = [];
                if (obj.username !== undefined) userData.push(obj.username);
                if (obj.email !== undefined) userData.push(obj.email);
                if (obj.password !== undefined) userData.push(obj.password);
                if (obj.activationToken !== undefined) userData.push(obj.activationToken);
                if (obj.active !== undefined) userData.push(obj.active);
                userData.push(id);

                let sql = 'UPDATE Users SET ';
                if (obj.username !== undefined) sql += 'username = ?, ';
                if (obj.email !== undefined) sql += 'email = ?, ';
                if (obj.password !== undefined) sql += 'password = ?, ';
                if (obj.activationToken !== undefined) sql += 'activationToken = ?, ';
                if (obj.active !== undefined) sql += 'active = ?, ';

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
            password: JSON.parse(row.password),
            activationToken: JSON.parse(row.activationToken),
            active: row.active
        };
    }
    */

}
