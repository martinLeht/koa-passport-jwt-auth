import { IRouterContext } from 'koa-router';
import { Inject } from 'typescript-ioc';
import UsersController from '../controllers/UsersController';
import Route from '../models/Route';
import IRoutes from './IRoutes';
import passport from "koa-passport";

export default class UsersRoutes extends IRoutes {

    constructor(@Inject private usersController: UsersController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [

            Route.newRoute('/login', 'post', (ctx: IRouterContext) => this.usersController.loginUser(ctx), true),
            Route.newRoute('/users', 'get', (ctx: IRouterContext) => this.usersController.getUsers(ctx), true),
            Route.newRoute('/users', 'post', (ctx: IRouterContext) => this.usersController.saveUser(ctx), true),
            Route.newRoute('/users/:id', 'get', (ctx: IRouterContext) => this.usersController.getUser(ctx), true),
            Route.newRoute('/users/:id', 'put', (ctx: IRouterContext) => this.usersController.modifyUser(ctx), true),
            Route.newRoute('/users/:id', 'delete', (ctx: IRouterContext) => this.usersController.deleteUser(ctx), true)
        ];
    }


}
