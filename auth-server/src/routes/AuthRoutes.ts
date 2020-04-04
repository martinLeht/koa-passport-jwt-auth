import {IRouterContext} from 'koa-router';
import {Inject} from 'typescript-ioc';
import AuthController from '../controllers/AuthController';
import Route from '../models/Route';
import IRoutes from './IRoutes';
import {Next} from "koa";

export default class AuthRoutes extends IRoutes {

    constructor(@Inject private authController: AuthController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute('/auth/login', 'post', (ctx: IRouterContext, next: Next) => this.authController.loginUser(ctx, next), true),
            Route.newRoute('/auth/facebook', 'get', (ctx: IRouterContext, next: Next) => this.authController.loginFacebook(ctx, next), true),
            Route.newRoute('/auth/facebook/callback', 'get', (ctx: IRouterContext, next: Next) => this.authController.loginFacebookCallback(ctx, next), true),
            Route.newRoute('/auth/refresh-token', 'post', (ctx: IRouterContext, next: Next) => this.authController.refreshJwtToken(ctx), true)
        ];
    }


}