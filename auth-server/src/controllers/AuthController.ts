import {IRouterContext} from 'koa-router';
import {Inject, Singleton} from 'typescript-ioc';
import UsersRepository from '../repositories/UsersRepository';
import HelperService from "../services/HelperService";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, CLIENT_URL } from '../Config/Config';
import passport from "koa-passport";
import User from "../models/User";
import { Next } from "koa";
import UserDetailsRepository from '../repositories/UserDetailsRepository';



@Singleton
export default class AuthController {

    constructor(@Inject private usersRepository: UsersRepository,
                @Inject private helperService: HelperService,
                @Inject private userDetailsRepository: UserDetailsRepository) {
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
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        active: user.active
                    },
                    token: token
                }
            }
        })(ctx, next);

    }

    public async loginFacebook(ctx: IRouterContext, next: Next) {
        return passport.authenticate('facebook', { scope: 'email' })(ctx, next);
    }

    public async loginFacebookCallback(ctx: IRouterContext, next: Next) {
        return passport.authenticate('facebook', { session: false }, (err, user: User, info) => {
            if (err) {
                console.log(err);
                next();
            } else {
                if (!user) {
                    if (info != undefined) {
                        console.log("INFO: " + info.message);
                        ctx.throw(403, info.message);
                    } else { 
                        ctx.throw(404, 'Some error');
                    }
                    
                }

                const token = jwt.sign({ id: user.id }, JWT_SECRET);
                console.log("Successfully logged in with facebook!");
                ctx.redirect(CLIENT_URL + '/login?jwt=' + token + '&id=' + user.id.toString() + '&username=' + user.username + '&email=' + user.email + '&active=' + true);
                /*
                ctx.body = {
                    user: {
                        id: user.id,
                        detailsId: user.detailsId,
                        facebookId: user.facebookId,
                        username: user.username,
                        email: user.email,
                        active: user.active
                    },
                    token: token
                }
                */
            }
        })(ctx, next);
    }
}