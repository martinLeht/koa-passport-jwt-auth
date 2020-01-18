import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from 'koa-router';
import { IRouterContext } from 'koa-router';
import { Inject } from 'typescript-ioc';

const cors = require('@koa/cors');


export class App {


    constructor() {


    }

    private async createApp() {
        const app: Koa = new Koa();
        const router: Router = new Router();

        app.use(cors());
        app.use(logger());
        app.use(bodyParser({ jsonLimit: '5mb' }));
        app.use(async (ctx: IRouterContext, next: () => Promise<any>) => {
            try {
                await next();
            } catch (err) {
                ctx.status = err.status || 500;
                ctx.body = { 
                    error: parseInt(err.message) 
                };
//                ctx.app.emit('error', err, ctx);
            }
        });


        app.use(router.routes());
        app.use(router.allowedMethods());
        return Promise.resolve(app);
    }

    public async start() {
        const app = await this.createApp();
        var port = process.env.PORT || 3000;
        const server = app.listen(port);
        console.log('Server started listening on port: ' + port);
        return Promise.resolve(server);
    }

}

export default App;