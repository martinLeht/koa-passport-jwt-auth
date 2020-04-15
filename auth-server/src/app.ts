import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from 'koa-router';
import passport from "koa-passport";
import helmet = require("koa-helmet");
import {IRouterContext} from 'koa-router';
import {Inject} from 'typescript-ioc';
import UsersRoutes from './routes/UsersRoutes';
import AuthRoutes from './routes/AuthRoutes';
import PassportConfig from "./config/PassportConfig";
import ReviewsRoutes from './routes/ReviewsRoutes';


const cors = require('@koa/cors');

export class App {


    constructor(@Inject private usersRoutes: UsersRoutes, 
                @Inject private authRoutes: AuthRoutes, 
                @Inject private reviewsRoutes: ReviewsRoutes,
                @Inject private passportConfig: PassportConfig) {

    }

    private async createApp() {
        const app: Koa = new Koa();
        const router: Router = new Router();
        await this.passportConfig.initializePassportConfig();
        this.usersRoutes.register(router);
        this.authRoutes.register(router);
        this.reviewsRoutes.register(router);



        app.keys = ['your-session-secret'];

        app.use(helmet());
        app.use(cors());
        app.use(logger());
        app.use(bodyParser({jsonLimit: '5mb'}));
        app.use(passport.initialize());



        app.use(async (ctx: IRouterContext, next: () => Promise<any>) => {
            try {
                await next();
            } catch (err) {
                ctx.status = err.status || 500;
                ctx.body = {
                    error: err.message
                };
            }
        });


        app.use(router.routes());
        app.use(router.allowedMethods());
        return Promise.resolve(app);
    }

    public async start() {
        const app = await this.createApp();
        const port = process.env.PORT || 3003;
        const server = app.listen(port);
        console.log('Server started listening on port: ' + port);
        return Promise.resolve(server);
    }

}

export default App;
