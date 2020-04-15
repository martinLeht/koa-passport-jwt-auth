import {IRouterContext} from 'koa-router';
import {Inject} from 'typescript-ioc';
import Route from '../models/Route';
import IRoutes from './IRoutes';
import {Next} from "koa";
import ReviewsController from '../controllers/ReviewsController';

export default class ReviewsRoutes extends IRoutes {

    constructor(@Inject private reviewsController: ReviewsController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute('/reviews', 'get', (ctx: IRouterContext) => this.reviewsController.getReviews(ctx), true),
            Route.newRoute('/reviews', 'post', (ctx: IRouterContext) => this.reviewsController.createReview(ctx), true),
            Route.newRoute('/reviews/:id', 'get', (ctx: IRouterContext) => this.reviewsController.getReviewWithRatings(ctx), true),
            Route.newRoute('/reviews/:id', 'put', (ctx: IRouterContext) => this.reviewsController.modifyReview(ctx), true),
            Route.newRoute('/reviews/:id', 'delete', (ctx: IRouterContext) => this.reviewsController.deleteReview(ctx), true),
            Route.newRoute('/reviews/:id/verify', 'get', (ctx: IRouterContext) => this.reviewsController.verifyReview(ctx), true)
        ];
    }


}