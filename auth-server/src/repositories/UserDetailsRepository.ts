import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';
import UsersRepository from './UsersRepository';
import UserDetails from '../models/UserDetails';

const SELECT_ALL =
    'ud.user_id, ud.details_id, ud.first_name, ud.last_name, ud.suburb, ud.zipcode';

const COLUMNS = [
    'user_id', 'details_id', 'first_name', 'last_name', 'suburb', "zipcode"
];


@Singleton
export default class UserDetailsRepository {

    constructor(@Inject private db: DatabaseService) {
    }

    public async findAll() {
        const userDetails = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM UserDetails ud',
            columns: COLUMNS
        });

        for (let detail of userDetails) {
            console.log(detail);
        }
        return userDetails;
    }

    public async findById(id: number) {
        const userDetails = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM UserDetails ud ' +
                 'WHERE ud.user_id = ' + id,
            columns: COLUMNS
        });

        if (userDetails.length === 0) return undefined;

        return userDetails[0];
    }

    public async insert(obj: UserDetails) {

        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                const detailsData = [];
                if (obj.userId !== undefined) detailsData.push(obj.userId);
                if (obj.firstName !== undefined) detailsData.push(obj.firstName);
                if (obj.lastName !== undefined) detailsData.push(obj.lastName);
                if (obj.suburb !== undefined) detailsData.push(obj.suburb);
                if (obj.zipcode !== undefined) detailsData.push(obj.zipcode);

                let sqlValues = '';
                let entryData = '';

                if (obj.userId !== undefined) {
                    sqlValues += 'user_id, ';
                    entryData += '?, '
                }
                if (obj.firstName !== undefined) {
                    sqlValues += 'first_name, ';
                    entryData += '?, '
                }
                if (obj.lastName !== undefined) {
                     sqlValues += 'last_name, ';
                     entryData += '?, '
                }
                if (obj.suburb !== undefined) {
                    sqlValues += 'suburb, ';
                    entryData += '?, '
                }
                if (obj.zipcode !== undefined) {
                    sqlValues += 'zipcode, ';
                    entryData += '?, '
                }

                if (sqlValues.substr(-2) === ', ') {
                    sqlValues = sqlValues.substr(0, sqlValues.length - 2);
                    entryData = entryData.substr(0, entryData.length - 2);
                } else {
                    resolve();
                    connection.release();
                    return;
                }

                let sql = 'INSERT INTO UserDetails (' + sqlValues + ') VALUES (' + entryData + ')';
                console.log("Data to save: ");
                for (let i = 0; i < detailsData.length; i++) {
                    console.log(detailsData[i]);
                }
                connection.query(sql, detailsData, (err, result) => {
                    if (err) {
                        console.log(err);
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

    public update(id: number, obj: UserDetails) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                const detailsData = [];
                
                if (obj.userId !== undefined) detailsData.push(obj.userId);
                if (obj.firstName !== undefined) detailsData.push(obj.firstName);
                if (obj.lastName !== undefined) detailsData.push(obj.lastName);
                if (obj.suburb !== undefined) detailsData.push(obj.suburb);
                if (obj.zipcode !== undefined) detailsData.push(obj.zipcode);
                detailsData.push(id);

                let sql = 'UPDATE UserDetails ud SET ';
                if (obj.userId !== undefined) sql += 'ud.user_id = ?, ';
                if (obj.firstName !== undefined) sql += 'ud.first_name = ?, ';
                if (obj.lastName !== undefined) sql += 'ud.last_name = ?, ';
                if (obj.suburb !== undefined) sql += 'ud.suburb = ?, ';
                if (obj.zipcode !== undefined) sql += 'ud.zipcode = ?, ';

                if (sql.substr(-2) === ', ') {
                    sql = sql.substr(0, sql.length - 2);
                } else {
                    resolve();
                    connection.release();
                    return;
                }

                sql += ' WHERE ud.user_id = ?';

                connection.query(sql, detailsData, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
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
                let sql = 'DELETE FROM UserDetails WHERE user_id = ' + id;

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
