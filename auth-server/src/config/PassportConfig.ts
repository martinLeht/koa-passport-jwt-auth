import passport from "koa-passport";
import passportLocal from "passport-local";
import {Inject, Singleton} from "typescript-ioc";
import bcryptjs from "bcryptjs";
import User from "../models/User";
import UsersRepository from "../repositories/UsersRepository";

const LocalStrategy = passportLocal.Strategy;

@Singleton
export default class PassportConfig {
    constructor(@Inject private usersRepository: UsersRepository) {
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
                        console.log('password is valid');
                        return done(null, user);

                    } else {
                        console.log('password is incorrect');
                        return done(null, false)
                    }
                } catch (e) {
                    return done(e);

                }
            }));
    }

}
