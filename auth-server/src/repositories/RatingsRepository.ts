import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';
import Rating from '../models/Rating';
import Category from '../models/Category';


const SELECT_RATING_CATEGORY =
    'ra.rating_id, ra.review_id, ra.value, c.category_id, c.name';

const COLUMNS_RATING_CATEGORY = [
    'rating_id', 'review_id', 'value', 'category_id', 'name'
];


@Singleton
export default class RatingsRepository {

    constructor(@Inject private db: DatabaseService) {
    }

    public async findAllByReviewId(reviewId: number) {
        const ratings = await this.db.find({
            sql: 'SELECT ' + SELECT_RATING_CATEGORY + ' FROM Ratings ra ' +
                 'INNER JOIN Categories c ON ra.category_id = c.category_id ' +
                 'WHERE ra.review_id = ' + reviewId,
            columns: COLUMNS_RATING_CATEGORY
        });

        if (ratings.length === 0) return undefined;

        let parsedRatings: Rating[] = ratings.map(rating => this.parse(rating));

        return parsedRatings;
    }

    public async insert(obj: {
        reviewId: number,
        categoryId: number,
        value: number
    }) {

        return new Promise<number>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                let ratingData = [
                    obj.reviewId,
                    obj.categoryId,
                    obj.value
                ];
                let sql = 'INSERT INTO Ratings (review_id, category_id, value) VALUES (?,?,?)';
                
                for (let i = 0; i < ratingData.length; i++) {
                    console.log(ratingData[i]);
                }

                connection.query(sql, ratingData, (err, result) => {
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
        value?: number
    }) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                const ratingData = [];
                let sql = 'UPDATE Ratings SET ';
                if (obj.value !== undefined){
                    ratingData.push(obj.value);
                    sql += 'value = ?, ';
                }
                ratingData.push(id);

                if (sql.substr(-2) === ', ') {
                    sql = sql.substr(0, sql.length - 2);
                } else {
                    resolve();
                    connection.release();
                    return;
                }

                sql += ' WHERE rating_id = ?';

                connection.query(sql, ratingData, (err, result) => {
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
                let sql = 'DELETE FROM Ratings WHERE rating_id = ' + id;

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

    private parse(row: any): Rating {
        console.log("IN PARSE");
        console.log(row);
        const category: Category = {
            categoryId: row.category_id,
            name: row.name
        }
        const rating: Rating = {
            ratingId: row.rating_id,
            reviewId: row.review_id,
            value: row.value,
            category: category
        };
        return rating;
    }

}
