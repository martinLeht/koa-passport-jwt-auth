import {IRouterContext} from 'koa-router';
import {Inject} from 'typescript-ioc';
import UsersController from '../controllers/UsersController';
import Route from '../models/Route';
import IRoutes from './IRoutes';

export default class UsersRoutes extends IRoutes {

    constructor(@Inject private usersController: UsersController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute('/users', 'get', (ctx: IRouterContext) => this.usersController.getUsers(ctx), true),
            Route.newRoute('/users', 'post', (ctx: IRouterContext) => this.usersController.registerUser(ctx), true),
            Route.newRoute('/users/:id', 'get', (ctx: IRouterContext) => this.usersController.getUser(ctx), true),
            Route.newRoute('/users/:id/details', 'get', (ctx: IRouterContext) => this.usersController.getUserDetails(ctx), false),
            Route.newRoute('/users/:id/all', 'get', (ctx: IRouterContext) => this.usersController.getUserWithDetails(ctx), false),
            Route.newRoute('/users/:id', 'put', (ctx: IRouterContext) => this.usersController.modifyUser(ctx), false),
            Route.newRoute('/users/:id', 'delete', (ctx: IRouterContext) => this.usersController.deleteUser(ctx), false),
            Route.newRoute('/users/:id/verify', 'get', (ctx: IRouterContext) => this.usersController.activateUser(ctx), true)
        ];
    }


}
