import {IRouterContext} from 'koa-router';
import {Inject, Singleton} from 'typescript-ioc';
import UsersRepository from '../repositories/UsersRepository';
import HelperService from "../services/HelperService";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../Config/Config';
import passport from "koa-passport";
import User from "../models/User";
import { TokenGenerator } from 'ts-token-generator';
import { Next } from "koa";
import { EmailService } from '../services/EmailService';



@Singleton
export default class UsersController {

    constructor(@Inject private usersRepository: UsersRepository,
                @Inject private helperService: HelperService,
                @Inject private emailService: EmailService,
                @Inject private tokenGenerator: TokenGenerator) {
    }


    public async registerUser(ctx: IRouterContext) {
        const data = ctx.request.body;
        if (!data || !data.username || !data.email || !data.password)
            ctx.throw('Missing fields', 400);

        const userExists = await this.usersRepository.findByEmail(data.email);

        if (userExists) ctx.throw('Username already exists', 409);

        data.password = await this.helperService.hashPassword(data.password);

        const activationToken = this.tokenGenerator.generate();

        data.activationToken = activationToken;
        data.active = false;

        const id = await this.usersRepository.insert(data);
        const response = await this.emailService.sendEmailVerification(data.email, activationToken, id);

        if (response['error']) {
            ctx.body = {
                error: response['error']
            };
        } else {
            console.log("User successfully registered!");
            ctx.body = {
                success: response['success']
            };
        }
    }

    public async loginUser(ctx: IRouterContext, next: Next) {
        return passport.authenticate('login', (err, user: User, info) => {
            if (err) {
                console.log(err);
                next();
            } else {
                if (!user) {
                    if (info != undefined) {
                        console.log("INFO: " + info.message);
                        ctx.throw(403, info.message);
                    } else { 
                        ctx.throw(401, 'User with provided email does not exist');
                    }
                    
                }

                const token = jwt.sign({ id: user.id}, JWT_SECRET);
                console.log("Successfully logged in!");
                ctx.body = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    active: user.active,
                    token: token
                }
            }
        })(ctx, next);

    };


    public async getUsers(ctx: IRouterContext) {
        const allUsers = await this.usersRepository.findAll();
        const users = allUsers.map(({password, ...result}) => result);
        ctx.body = {
            error: null,
            users: users
        };
    }


    public async getUser(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        let user = await this.usersRepository.findById(id);
        
        if (!user) ctx.throw(404);

        const {password, ...result} = user;
        ctx.body = {
            user: result
        };
    }

    public async modifyUser(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        const data = ctx.request.body;

        let user = await this.usersRepository.findById(id);
        if (!user) ctx.throw(404);

        await this.usersRepository.update(id, data);
        console.log("Successfully updated user!");
        ctx.body = {
            success: "Successfully updated!"
        };
    }


    public async deleteUser(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        const user = await this.usersRepository.findById(id);
        if (!user) ctx.throw(404);

        await this.usersRepository.delete(id);
        console.log("Successfully deleted user!");
        ctx.body = {
            success: "Successfully deleted user!"
        };
    }

    public async activateUser(ctx: IRouterContext) {
        const token = ctx.request.query.activationToken;
        const id = parseInt(ctx.params.id);

        let user = await this.usersRepository.findById(id);
        if (!user) ctx.throw(404);

        if (user.activationToken === token) {
            await this.usersRepository.update(id, { activationToken: "", active: true });
            console.log("User account is now activated");
            ctx.body = {
                success: 'Email has been verified and user account activated!'
            };
            ctx.redirect('http://localhost:4200/login');
        } else {
            ctx.body = {
                error: 'Activation tokens did not match!'
            };
        }    
        
    }

}
