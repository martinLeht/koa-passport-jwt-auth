import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';
import UserDetailsRepository from './UserDetailsRepository';
import User from '../models/User';
import UserDetails from '../models/UserDetails';

const SELECT_ALL =
    'u.id, u.facebook_id, u.username, u.email, u.password, u.activationToken, u.active, ' +
    'ud.details_id, ud.first_name, ud.last_name, ud.suburb, ud.zipcode';

const SELECT_USER =
    'u.id, u.facebook_id, u.username, u.email, u.password, u.activationToken, u.active';

const COLUMNS_ALL = [
    'id', 'facebook_id', 'username', 'email', 'password', "activationToken", "active",  
    'details_id', 'first_name', 'last_name', 'suburb', 'zipcode'
];

const COLUMNS_USER = [
    'id', 'facebook_id', 'username', 'email', 'password', 'activationToken', 'active'
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

        if (users.length === 0) return undefined;

        const parsedUsers = users.map(user => this.parse(user));
        return parsedUsers;
    }

    public async findAllWithDetails() {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u ' + 
                 'INNER JOIN UserDetails ud ON u.id = ud.user_id',
            columns: COLUMNS_USER
        });

        if (users.length === 0) return undefined;

        const parsedUsers = users.map(user => this.parse(user));
        return parsedUsers;
    }

    public async findById(id: number) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_USER + ' FROM Users u WHERE id = ' + id,
            columns: COLUMNS_USER
        });

        if (users.length === 0) return undefined;

        return this.parse(users[0]);
    }

    public async findByIdWithDetails(id: number) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u ' 
                + 'LEFT JOIN UserDetails ud ON u.id = ud.user_id '
                + 'WHERE u.id = ' + id,
            columns: COLUMNS_ALL
        });

        if (users.length === 0) return undefined;

        return this.parse(users[0]);
    }


    public async findByEmail(email: string) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_USER + ' FROM Users u WHERE u.email = \"' + email + '\"',
            columns: COLUMNS_USER
        })

        if (users.length === 0) return undefined;

        return this.parse(users[0]);
    }

    public async findByFacebookProfile(fbProfileId: number) {
        const users = await this.db.find({
            sql: 'SELECT ' + SELECT_USER + ' FROM Users u WHERE u.facebook_id = ' + fbProfileId,
            columns: COLUMNS_USER
        });

        if (users.length === 0) return undefined;

        return this.parse(users[0]);
    }

    public async insert(obj: {
        username: string,
        email: string,
        password: string,
        activationToken: string,
        active: boolean,
        facebookId?: number
    }) {

        return new Promise<number>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                let userData = [];
                let sql = '';

                if (obj.facebookId !== undefined) {
                    userData = [
                        obj.username,
                        obj.email,
                        obj.password,
                        obj.activationToken,
                        obj.active,
                        obj.facebookId
                    ];
                    sql = 'INSERT INTO Users (username, email, password, activationToken, active, facebook_id) VALUES (?,?,?,?,?,?)';
                } else {
                    userData = [
                        obj.username,
                        obj.email,
                        obj.password,
                        obj.activationToken,
                        obj.active
                    ];
                    sql = 'INSERT INTO Users (username, email, password, activationToken, active) VALUES (?,?,?,?,?)';
                }
                for (let i = 0; i < userData.length; i++) {
                    console.log(userData[i]);
                }

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
        password?: string,
        activationToken?: string,
        active?: boolean,
        facebookId?: number
    }) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                const userData = [];
                if (obj.username !== undefined) userData.push(obj.username);
                if (obj.email !== undefined) userData.push(obj.email);
                if (obj.password !== undefined) userData.push(obj.password);
                if (obj.activationToken !== undefined) userData.push(obj.activationToken);
                if (obj.active !== undefined) userData.push(obj.active);
                if (obj.facebookId !== undefined) userData.push(obj.facebookId);
                userData.push(id);

                let sql = 'UPDATE Users SET ';
                if (obj.username !== undefined) sql += 'username = ?, ';
                if (obj.email !== undefined) sql += 'email = ?, ';
                if (obj.password !== undefined) sql += 'password = ?, ';
                if (obj.activationToken !== undefined) sql += 'activationToken = ?, ';
                if (obj.active !== undefined) sql += 'active = ?, ';
                if (obj.facebookId !== undefined) sql += 'facebook_id = ?, ';

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

    private parse(row: any): User {
        console.log("IN PARSE");
        console.log(row);
        let user: User;
        if (row.details_id) {
            const userDetails: UserDetails = {
                userId: row.id,
                detailsId: row.details_id,
                firstName: row.first_name,
                lastName: row.last_name,
                suburb: row.suburb,
                zipcode: row.zipcode
            }
            user = {
                id: row.id,
                facebookId: row.facebook_id,
                username: row.username,
                email: row.email,
                password: row.password,
                activationToken: row.activationToken,
                active: row.active,
                details: userDetails
            }
        } else {
            user = {
                id: row.id,
                facebookId: row.facebook_id,
                username: row.username,
                email: row.email,
                password: row.password,
                activationToken: row.activationToken,
                active: row.active
            }
        }
        console.log(user);
        return user;
    }

}
