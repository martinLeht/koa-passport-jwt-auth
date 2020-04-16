import {IRouterContext} from 'koa-router';
import {Inject, Singleton} from 'typescript-ioc';
import { CLIENT_URL } from '../Config/Config';
import passport from "koa-passport";
import User from "../models/User";
import { Next } from "koa";
import JwtService from '../services/JwtService';



@Singleton
export default class AuthController {

    constructor(@Inject private jwtService: JwtService) {
    }

    public async loginUser(ctx: IRouterContext, next: Next) {
        return passport.authenticate('login', async (err, user: User, info) => {
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

                const payload = {
                    id: user.id
                };

                const accessToken = this.jwtService.getJwtToken(payload);
                const refreshToken = await this.jwtService.getRefreshToken(payload);
                console.log('Access token: ' + accessToken);
                console.log('Refresh token: ' + refreshToken);
                console.log("Successfully logged in!");
                ctx.body = {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        active: user.active
                    },
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            }
        })(ctx, next);

    }

    public async loginFacebook(ctx: IRouterContext, next: Next) {
        return passport.authenticate('facebook', { scope: 'email' })(ctx, next);
    }

    public async loginFacebookCallback(ctx: IRouterContext, next: Next) {
        return passport.authenticate('facebook', { session: false }, async (err, user: User, info) => {
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

                const payload = {
                    id: user.id
                };

                const accessToken = this.jwtService.getJwtToken(payload);
                const refreshToken = await this.jwtService.getRefreshToken(payload);
                console.log('Access token: ' + accessToken);
                console.log('Refresh token: ' + refreshToken);
                console.log("Successfully logged in with facebook!");
                ctx.redirect(CLIENT_URL + '/login?jwt=' + accessToken + '&refreshToken=' + refreshToken + 
                            '&id=' + user.id.toString() + '&username=' + user.username + '&email=' + user.email + '&active=' + true);
            }
        })(ctx, next);
    }

    public async refreshJwtToken(ctx: IRouterContext) {
        const refreshToken: string = ctx.request.body.refreshToken; 
        if (!refreshToken) {
            return ctx.throw(403, 'Access is forbidden');
        } 
        try {
            const newTokens = await this.jwtService.refreshToken(refreshToken);
            ctx.body = {
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken
            }
        } catch (err) {
            const message = (err && err.message) || err;
            ctx.throw(403, message);
        }
    }
}