import {Inject, Singleton} from 'typescript-ioc';
import DatabaseService from '../services/DatabaseService';
import Review from '../models/Review';
import RatingsRepository from './RatingsRepository';
import Rating from '../models/Rating';


const SELECT_REVIEW =
    're.review_id, re.hood_id, re.user_id, re.title, re.text, re.verified';

const COLUMNS_REVIEW = [
    'review_id', 'hood_id', 'user_id', 'title', 'text', "verified"
];


@Singleton
export default class ReviewsRepository {

    constructor(@Inject private db: DatabaseService,
                @Inject private ratingsRepository: RatingsRepository) {
    }

    public async findAll() {
        const reviews = await this.db.find({
            sql: 'SELECT ' + SELECT_REVIEW + ' FROM Reviews re',
            columns: COLUMNS_REVIEW
        });

        if (reviews.length === 0) return undefined;

        let parsedReviews: Review[] = reviews.map(review => this.parse(review));
        return parsedReviews;
    }

    public async findById(id: number) {
        const reviews = await this.db.find({
            sql: 'SELECT ' + SELECT_REVIEW + ' FROM Reviews re WHERE review_id = ' + id,
            columns: COLUMNS_REVIEW
        });

        if (reviews.length === 0) return undefined;

        const review: Review = this.parse(reviews[0]);
        return review;
    }

    public async findReviewWithRatingsById(id: number) {
        let review: Review | undefined = await this.findById(id);

        if (review === undefined) return undefined;

        const ratings: Rating[] | undefined = await this.ratingsRepository.findAllByReviewId(id);
        review.ratings = ratings;
        return review;
    }

    public async insert(obj: {
        hoodId: number,
        userId: number,
        title: string,
        text: string,
        verified?: boolean
    }) {

        return new Promise<number>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                let reviewData;
                let sql;
                if (obj.verified !== undefined) {
                    reviewData = [
                        obj.hoodId,
                        obj.userId,
                        obj.title,
                        obj.text,
                        obj.verified
                    ];
                    sql = 'INSERT INTO Reviews (hood_id, user_id, title, text, verified) VALUES (?,?,?,?,?)';
                } else {
                    reviewData = [
                        obj.hoodId,
                        obj.userId,
                        obj.title,
                        obj.text
                    ];
                    sql = 'INSERT INTO Reviews (hood_id, user_id, title, text) VALUES (?,?,?,?)';
                }
                
                
                for (let i = 0; i < reviewData.length; i++) {
                    console.log(reviewData[i]);
                }

                connection.query(sql, reviewData, (err, result) => {
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
        title?: string,
        text?: string,
        verified?: boolean
    }) {
        return new Promise<any>((resolve, reject) => {
            this.db.getConnection().then(connection => {

                const reviewData = [];
                let sql = 'UPDATE Reviews SET ';
                if (obj.title !== undefined){
                    reviewData.push(obj.title);
                    sql += 'title = ?, ';
                } 
                if (obj.text !== undefined) {
                    reviewData.push(obj.text);
                    sql += 'text = ?, ';
                }
                if (obj.verified !== undefined) {
                    reviewData.push(obj.verified);
                    sql += 'verified = ?, ';
                } 
                reviewData.push(id);

                if (sql.substr(-2) === ', ') {
                    sql = sql.substr(0, sql.length - 2);
                } else {
                    resolve();
                    connection.release();
                    return;
                }

                sql += ' WHERE review_id = ?';

                connection.query(sql, reviewData, (err, result) => {
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
                let sql = 'DELETE FROM Reviews WHERE review_id = ' + id;

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

    private parse(row: any): Review {
        console.log("IN PARSE");
        console.log(row);
        const review: Review = {
            reviewId: row.review_id,
            hoodId: row.hood_id,
            userId: row.user_id,
            title: row.title,
            text: row.text,
            verified: row.verified
        };
        return review;
    }

}
