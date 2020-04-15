import {IRouterContext} from 'koa-router';
import {Inject, Singleton} from 'typescript-ioc';
import RatingsRepository from '../repositories/RatingsRepository';
import ReviewsRepository from '../repositories/ReviewsRepository';
import Review from '../models/Review';
import Rating from '../models/Rating';



@Singleton
export default class ReviewsController {

    constructor(@Inject private reviewsRepository: ReviewsRepository,
                @Inject private ratingsRepository: RatingsRepository) {
    }


    public async getReviews(ctx: IRouterContext) {
        const reviews = await this.reviewsRepository.findAll();
        ctx.body = {
            reviews: reviews
        };
    }


    public async getReview(ctx: IRouterContext) {
        console.log("IN CONTROLLER getReview()")
        const id = parseInt(ctx.params.id);
        let review = await this.reviewsRepository.findById(id);
        
        if (!review) ctx.throw(404);

        ctx.body = {
            review: review
        };
    }

    public async getReviewWithRatings(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        let review = await this.reviewsRepository.findReviewWithRatingsById(id);
        
        if (!review) ctx.throw(404, 'No reviews found with id ' + id);

        ctx.body = {
            review: review
        };
    }

    public async createReview(ctx: IRouterContext) {
        const data = ctx.request.body;
        
        if (!data) ctx.throw(404, 'No reviews in request body!');

        const reviewId: number = await this.reviewsRepository.insert(data);
        console.log("Inserted review with id " + reviewId);

        if (!data.ratings) ctx.throw(404, 'No ratings for the review in request body!');
        const ratings: Rating[] = data.ratings;
        ratings.forEach(async rating => {
            const ratingId = await this.ratingsRepository.insert({ reviewId: reviewId, value: rating.value, categoryId: rating.category.categoryId });
            console.log("Successfully intserted rating with id " + ratingId);
        });
        
        const review = await this.reviewsRepository.findReviewWithRatingsById(reviewId);
        console.log(review);
        if (!review) ctx.throw(404, 'No review found with id ' + reviewId);

        ctx.body = {
            review: review
        };
    }

    public async modifyReview(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        const data = ctx.request.body;

        let review = await this.reviewsRepository.findById(id);

        if (!review) ctx.throw(404, "Review not found!");
        
        if (data.title !== undefined || data.text !== undefined || data.verified !== undefined) {
            console.log("Updating review with id: " + review.reviewId);
            await this.reviewsRepository.update(id, data);
        }
        if (data.ratings !== undefined && data.ratings.length > 0) {
            const ratingsData: Rating[] = data.ratings;
            let ratings: Rating[] | undefined = await this.ratingsRepository.findAllByReviewId(id);

            if (!ratings) ctx.throw(404, "Ratings not found!");

            // Sort ratings by rating id to make comparing the rating values easier
            ratingsData.sort((ratingA, ratingB) => ratingA.ratingId - ratingB.ratingId);
            ratings.sort((ratingA, ratingB) => ratingA.ratingId - ratingB.ratingId);

            ratingsData.forEach(async (rating, index) => {
                if (ratings !== undefined) {
                    const comparableRating: Rating = ratings[index];
                    if (rating.ratingId === comparableRating.ratingId && rating.value !== comparableRating.value) {
                        try {
                            await this.ratingsRepository.update(rating.ratingId, { value: rating.value });
                            console.log("Successfully updated rating with id " + rating.ratingId + " for review with id " + rating.reviewId);
                        } catch (err) {
                            ctx.throw(500, err);
                        }
                        
                    }
                }
            });

        }
        
        review = await this.reviewsRepository.findReviewWithRatingsById(id);
        console.log(review);
        console.log("Successfully updated review!");
        ctx.body = {
            review: review,
            success: "Successfully updated!"
        };
    }


    public async deleteReview(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        const review = await this.reviewsRepository.findById(id);
        if (!review) ctx.throw(404);
       
        await this.reviewsRepository.delete(id);
        console.log("Successfully deleted review!");
        ctx.body = {
            success: "Successfully deleted your rating!"
        };
    }

    public async verifyReview(ctx: IRouterContext) {
    }

}