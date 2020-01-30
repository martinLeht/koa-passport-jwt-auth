import {IRouterContext} from 'koa-router';
import {Inject, Singleton} from 'typescript-ioc';
import UsersRepository from '../repositories/UsersRepository';
import HelperService from "../services/HelperService";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../Config/Config';
import passport from "koa-passport";
import User from "../models/User";
import {ExtendableContext, Next} from "koa";



@Singleton
export default class UsersController {

    constructor(@Inject private usersRepository: UsersRepository, @Inject private helperService: HelperService) {
    }


    public async registerUser(ctx: IRouterContext) {
        console.log("In the controller SAVE");
        const data = ctx.request.body;
        if (!data || !data.username || !data.email || !data.password)
            ctx.throw('Missing fields', 400);

        const userExists = await this.usersRepository.findByEmail(data.email);

        if (userExists) ctx.throw('Username already exists', 409);

        data.password = await this.helperService.hashPassword(data.password);

        const id = await this.usersRepository.insert(data);


        const {password, ...result} = await this.usersRepository.findById(id);
        ctx.body = {
            user: result
        };
    }

    public async loginUser(ctx: IRouterContext, next: Next) {
        console.log("In the controller loginUser");
        return passport.authenticate('login', (err, user: User, info) => {
            if (err) {
                console.log(err);
                next();
            }
            if (info != undefined) {
                console.log(info.message);
            } else {
                if (!user) {
                    ctx.throw(401, 'Invalid username or password');
                }

                const token = jwt.sign({id: user.id}, JWT_SECRET);

                ctx.body = {
                    token: token
                }
            }
        })(ctx, next)

    };


    public async getUsers(ctx: IRouterContext) {
        console.log("In the controller GET ALL");
        const allUsers = await this.usersRepository.findAll();
        const users = allUsers.map(({password, ...result}) => result);
        ctx.body = {
            error: null,
            users: users
        };
    }


    public async getUser(ctx: IRouterContext) {
        console.log("In the controller GET id");
        const id = parseInt(ctx.params.id);
        const user = await this.usersRepository.findById(id);
        if (!user)
            ctx.throw(404);

        const {password, ...result} = user;
        ctx.body = {
            user: result
        };
    }

    public async modifyUser(ctx: IRouterContext) {
        console.log("In the controller UPDATE id");
        const id = parseInt(ctx.params.id);
        const data = ctx.request.body;

        const user = await this.usersRepository.findById(id);
        if (!user)
            ctx.throw(404);

        await this.usersRepository.update(id, data);

        ctx.body = {
            user: await this.usersRepository.findById(id)
        };
    }


    public async deleteUser(ctx: IRouterContext) {
        console.log("In the controller DELETE id");
        const id = parseInt(ctx.params.id);
        const user = await this.usersRepository.findById(id);
        if (!user) ctx.throw(404);

        await this.usersRepository.delete(id);

        ctx.body = {error: null};
    }

}
