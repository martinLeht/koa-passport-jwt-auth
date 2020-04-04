import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';
import JwtRefreshToken from '../models/JwtRefreshToken';

const SELECT_ALL =
    'j.token_id, j.uuid, j.user_id, j.refresh_token';

const COLUMNS = [
    'token_id', 'uuid', 'user_id', 'refresh_token'
];


@Singleton
export default class JwtRefreshTokenRepository {

    constructor(@Inject private db: DatabaseService) {
    }

    public async findAll() {
        const refreshTokens = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM JwtRefreshTokens j',
            columns: COLUMNS
        });

        const parsedRefreshTokens: JwtRefreshToken[] = refreshTokens.map(token => this.parse(token));

        return parsedRefreshTokens;
    }

    public async findByUserId(id: number) {
        const refreshTokens = await this.db.find({
            sql: 'SELECT ' + SELECT_ALL + ' FROM JwtRefreshTokens j ' +
                 'WHERE j.user_id = ' + id,
            columns: COLUMNS
        });

        if (refreshTokens.length === 0) return undefined;

        const parsedRefreshTokens: JwtRefreshToken[] = refreshTokens.map(token => this.parse(token));

        return parsedRefreshTokens;
    }

    public async insert(obj: {
        uuid: string,
        userId: number,
        refreshToken: string
    }) {

        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {
                const tokenData = [];
                if (obj.uuid !== undefined) tokenData.push(obj.uuid);
                if (obj.userId !== undefined) tokenData.push(obj.userId);
                if (obj.refreshToken !== undefined) tokenData.push(obj.refreshToken);

                let sql = 'INSERT INTO JwtRefreshTokens (uuid, user_id, refresh_token) VALUES (?,?,?)';

                connection.query(sql, tokenData, (err, result) => {
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

    public update(id: number, obj: {
        refreshToken: string
    }) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                const tokenData = [];
                let sql = 'UPDATE JwtRefreshTokens j SET ';

                if (obj.refreshToken !== undefined) {
                    tokenData.push(obj.refreshToken);
                    sql += 'j.refresh_token = ?, ';
                } 
                tokenData.push(id);

                if (sql.substr(-2) === ', ') {
                    sql = sql.substr(0, sql.length - 2);
                } else {
                    resolve();
                    connection.release();
                    return;
                }

                sql += ' WHERE j.user_id = ?';

                connection.query(sql, tokenData, (err, result) => {
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
                let sql = 'DELETE FROM JwtRefreshTokens WHERE user_id = ' + id;

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

    private parse(row: any): JwtRefreshToken {
        const refreshToken: JwtRefreshToken = {
            tokenId: row.token_id,
            uuid: row.uuid,
            userId: row.user_id,
            refreshToken: row.refresh_token
        };
        return refreshToken;
    }

}
