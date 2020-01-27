import { IRouterContext } from 'koa-router';
import { Inject, Singleton } from 'typescript-ioc';
import UsersRepository from '../repositories/UsersRepository';
import { createWriteStream } from 'fs';


@Singleton
export default class UsersController {

    constructor(@Inject private usersRepository: UsersRepository) { }

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
            ctx.throw(400);
        
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

        ctx.body = { error: null };
    }
}