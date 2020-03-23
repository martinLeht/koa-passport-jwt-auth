import passport from "koa-passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import {Inject, Singleton} from "typescript-ioc";
import bcryptjs from "bcryptjs";
import { FACEBOOK_ID, FACEBOOK_SECRET, FACEBOOK_CALLBACK_URL } from '../Config/Config';
import User from "../models/User";
import UsersRepository from "../repositories/UsersRepository";
import UserDetails from "../models/UserDetails";
import UserDetailsRepository from "../repositories/UserDetailsRepository";
import HelperService from "../services/HelperService";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

@Singleton
export default class PassportConfig {
    constructor(@Inject private usersRepository: UsersRepository,
                @Inject private userDetailsRepository: UserDetailsRepository,
                @Inject private helperService: HelperService) {
    }


    public async initializePassportConfig() {

        passport.use(
            'login',
            new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                session: false,
            }, async (email, password, done) => {

                const user: User = await this.usersRepository.findByEmail(email);

                if (!user) {
                    return done(null, false);
                }

                try {
                    if (await bcryptjs.compare(password, user.password)) {
                        if (user.active) {
                            if (user.facebook_id) {
                                return done(null, false, { message: "Account is linked with facebook. Login through facebook instead!" });
                            } else {
                                const {password, ...userData} = user;
                                return done(null, userData, { message: "Successfully logged in!" });
                            }
                            
                        } else {
                            return done(null, false, { message: "Account has not been activated. Verify your email and try again!" });
                        }

                    } else {
                        return done(null, false, { message: "Incorrect password" });
                    }
                } catch (e) {
                    return done(e);

                }
        }));
        
            
        /**
         * Sign in with Facebook.
         */
        passport.use(new FacebookStrategy({
            clientID: FACEBOOK_ID,
            clientSecret: FACEBOOK_SECRET,
            callbackURL: FACEBOOK_CALLBACK_URL,
            profileFields: ["email", "name"],
            passReqToCallback: true,
        }, async (req: any, accessToken, refreshToken, profile, done) => {
            // Checks if there is a user with the given facebook profile id
            const facebookId = parseInt(profile.id);
            const existingUser = await this.usersRepository.findByFacebookProfile(facebookId);
            if (existingUser) {
                return done(undefined, existingUser);
            }
            
            // If there is no user with facebook profile id, check if there is a user with the facebook email
            const existingEmailUser = await this.usersRepository.findByEmail(profile._json.email);
            if (existingEmailUser) {
                return done(null, false, { message: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
            } else { // Registeres an account with the information from facebook profile
                console.log("Saving fb profile id: " + facebookId);
                const { email, first_name, last_name } = profile._json;
                let user: User = new User();
                user.username = first_name + '.' + last_name;
                user.email = email;
                user.facebook_id = facebookId;
                user.password = await this.helperService.hashPassword("default123");
                user.active = true;
                user.activationToken = "";

                const userId = await this.usersRepository.insert(user);
                user.id = userId;
                let userDetails: UserDetails = new UserDetails();
                userDetails.userId = userId;
                userDetails.firstName = first_name;
                userDetails.lastName = last_name;
                
                await this.userDetailsRepository.insert(userDetails);
                const { password, activationToken, ...userData } = user;

                return done(null, userData, { message: "Successfully logged in!" });
            }
        }));
    }

}
