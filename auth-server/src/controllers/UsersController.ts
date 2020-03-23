import {IRouterContext} from 'koa-router';
import {Inject, Singleton} from 'typescript-ioc';
import UsersRepository from '../repositories/UsersRepository';
import HelperService from "../services/HelperService";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, CLIENT_URL } from '../Config/Config';
import passport from "koa-passport";
import User from "../models/User";
import { TokenGenerator } from 'ts-token-generator';
import { Next } from "koa";
import { EmailService } from '../services/EmailService';
import UserDetailsRepository from '../repositories/UserDetailsRepository';
import { getHeapStatistics } from 'v8';
import UserDetails from '../models/UserDetails';



@Singleton
export default class UsersController {

    constructor(@Inject private usersRepository: UsersRepository,
                @Inject private helperService: HelperService,
                @Inject private emailService: EmailService,
                @Inject private tokenGenerator: TokenGenerator,
                @Inject private userDetailsRepository: UserDetailsRepository) {
    }


    public async registerUser(ctx: IRouterContext) {
        const data = ctx.request.body;
        if (!data || !data.username || !data.email || !data.password)
            ctx.throw('Missing fields', 400);

        const userExists = await this.usersRepository.findByEmail(data.email);

        if (userExists) ctx.throw('User with provided email already exists', 409);

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

    };


    public async getUsers(ctx: IRouterContext) {
        const allUsers = await this.usersRepository.findAll();
        const users = allUsers.map(({password, activationToken, ...result}) => result);
        ctx.body = {
            users: users
        };
    }


    public async getUser(ctx: IRouterContext) {
        console.log("IN CONTROLLER getUser()")
        const id = parseInt(ctx.params.id);
        let user = await this.usersRepository.findById(id);
        
        if (!user) ctx.throw(404);

        const {password, activationToken, ...result} = user;
        ctx.body = {
            user: result
        };
    }

    public async getUserWithDetails(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        let userWithDetails = await this.usersRepository.findByIdWithDetails(id);
        
        if (!userWithDetails) ctx.throw(404);

        let user: User = Object.assign(new User(), userWithDetails);
        const userDetails: UserDetails = Object.assign(new UserDetails(), userWithDetails);
        console.log(user);
        console.log(userDetails);

        const {password, activationToken, ...resultUser} = user;
        ctx.body = {
            user: resultUser
        };
    }

    public async getUserDetails(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        let details: UserDetails = await this.userDetailsRepository.findById(id);
        
        if (!details) ctx.throw(404, 'No details found for the user with id ' + id);

        console.log(details);
        ctx.body = {
            details: details
        };
    }

    public async modifyUser(ctx: IRouterContext) {
        const id = parseInt(ctx.params.id);
        const data = ctx.request.body;

        let user = await this.usersRepository.findById(id);
        let userDetails = await this.userDetailsRepository.findById(id);

        if (!user) ctx.throw(404, "User not found!");
        
        if (userDetails === undefined) {
            let detailsData: UserDetails = new UserDetails();
            detailsData.userId = user.id;
            if (data.firstname !== undefined) detailsData.firstName = data.firstname;
            if (data.lastname !== undefined) detailsData.lastName = data.lastname;
            if (data.hood !== undefined) detailsData.suburb = data.hood;
            if (data.zip !== undefined) detailsData.zipcode = data.zip;
            const detailsId: number = await this.userDetailsRepository.insert(detailsData);
            console.log("Inserted details id: " + detailsId);
        } else {
            if (data.firstname !== undefined) userDetails.firstName = data.firstname;
            if (data.lastname !== undefined) userDetails.lastName = data.lastname;
            if (data.hood !== undefined) userDetails.suburb = data.hood;
            if (data.zip !== undefined) userDetails.zipcode = data.zip;
            console.log("Updating details for user with id: " + userDetails.userId);
            await this.userDetailsRepository.update(user.id, userDetails);
        }
        
        await this.usersRepository.update(id, data);
        user = await this.usersRepository.findById(id);

        const {password, activationToken, ...result} = user;
        console.log("Successfully updated user!");
        ctx.body = {
            user: result,
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
            success: "Successfully deleted your account!"
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
            ctx.redirect(CLIENT_URL + '/login');
        } else {
            ctx.body = {
                error: 'Activation tokens did not match!'
            };
        }    
        
    }

}
