import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';
import UserDetailsRepository from './UserDetailsRepository';
import UserDetails from '../models/UserDetails';

const SELECT_ALL =
    'u.id, u.details_id, u.username, u.email, u.password, u.activationToken, u.active, ' +
    'ud.first_name, ud.last_name, ud.suburb, ud.zipcode';

const SELECT_USER =
    'u.id, u.details_id, u.username, u.email, u.password, u.activationToken, u.active';

const SELECT_DETAILS =
    'ud.details_id, ud.first_name, ud.last_name, ud.suburb, ud.zipcode';

const COLUMNS_ALL = [
    'id', 'details_id', 'username', 'email', 'password', "activationToken", "active",
    'first_name', 'last_name', 'suburb', 'zipcode'
];

const COLUMNS_USER = [
    'id', 'details_id', 'username', 'email', 'password', "activationToken", "active"
];

const COLUMNS_DETAILS = [
    'details_id', 'first_name', 'last_name', 'suburb', 'zipcode'
];


@Singleton
export default class UsersRepository {

    constructor(@Inject private db: DatabaseService,
                @Inject private userDetailsRepository: UserDetailsRepository) {
    }

    public async findAll() {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_USER + ' FROM Users u',
            columns: COLUMNS_USER
        });
        return users;
    }

    public async findAllWithDetails() {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u ' + 
                 'INNER JOIN UserDetails ud ON u.details_id = ud.details_id',
            columns: COLUMNS_USER
        });
        return users;
    }

    public async findById(id: number) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_USER + ' FROM Users u WHERE id = ' + id,
            columns: COLUMNS_USER
        });

        if (users.length === 0) return undefined;

        return users[0];
    }

    public async findByIdWithDetails(id: number) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u ' 
                + 'INNER JOIN UserDetails ud ON u.details_id = ud.details_id '
                + 'WHERE id = ' + id,
            columns: COLUMNS_ALL
        });

        if (users.length === 0) return undefined;

        return users[0];
    }


    public async findByEmail(email: string) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_USER + ' FROM Users u WHERE u.email = \"' + email + '\"',
            columns: COLUMNS_USER
        })

        if (users.length === 0) return undefined;

        return users[0];
    }

    public async insert(obj: {
        username: string,
        email: string,
        password: string,
        activationToken: string,
        active: boolean
    }) {

        return new Promise<number>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                const userData = [
                    obj.username,
                    obj.email,
                    obj.password,
                    obj.activationToken,
                    obj.active
                ];
                
                let sql = 'INSERT INTO Users (username, email, password, activationToken, active) VALUES (?,?,?,?,?)';

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
        detailsId?: number,
        username?: string,
        email?: string,
        password?: string,
        activationToken?: string,
        active?: boolean
    }) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                const userData = [];
                if (obj.detailsId !== undefined) userData.push(obj.detailsId);
                if (obj.username !== undefined) userData.push(obj.username);
                if (obj.email !== undefined) userData.push(obj.email);
                if (obj.password !== undefined) userData.push(obj.password);
                if (obj.activationToken !== undefined) userData.push(obj.activationToken);
                if (obj.active !== undefined) userData.push(obj.active);
                userData.push(id);

                let sql = 'UPDATE Users SET ';
                if (obj.detailsId !== undefined) sql += 'details_id = ?, '
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

}
