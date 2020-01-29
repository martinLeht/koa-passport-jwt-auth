import {IRouterContext} from 'koa-router';
import {Inject, Singleton} from 'typescript-ioc';
import UsersRepository from '../repositories/UsersRepository';
import HelperService from "../services/HelperService";
import passport from "koa-passport";


@Singleton
export default class UsersController {

    constructor(@Inject private usersRepository: UsersRepository, @Inject private helperService: HelperService) {
    }


    public async loginUser(ctx: IRouterContext) {
        console.log("In the controller loginUser");
        console.log(ctx.request.body)
        return passport.authenticate('local', { session: false }, async (err, user) => {
        });
    }




    public async getUsers(ctx: IRouterContext) {
        console.log("In the controller GET ALL");
        ctx.body = {
            error: null,
            users: await this.usersRepository.findAll()
        };
    }

    public async saveUser(ctx: IRouterContext) {
        console.log("In the controller SAVE");
        const data = ctx.request.body;
        if (!data || !data.username || !data.email || !data.password)
            ctx.throw('Missing fields', 400);


        const userExists = await this.usersRepository.findByEmail(data.email);

        if (userExists) ctx.throw('Username already exists', 409);


        const hash = await this.helperService.hashPassword(data.password);
        console.log(hash);
        data.password = hash;


        const id = await this.usersRepository.insert(data);

        ctx.body = {
            error: null,
            user: await this.usersRepository.findById(id)
        };
    }

    public async getUser(ctx: IRouterContext) {
        console.log("In the controller GET id");
        const id = parseInt(ctx.params.id);
        const user = await this.usersRepository.findById(id);
        if (!user)
            ctx.throw(404);

        ctx.body = {
            error: null,
            user: user
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
            error: null,
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
