import * as Router from 'koa-router';
import Jwt from 'koa-jwt';
import * as Conf from '../config/Config';
import Route from '../models/Route';

export abstract class IRoutes {

    protected abstract getRoutes(): Route[];

    public register(router: Router) {
        this.getRoutes().forEach((route) => {
            this.registerRoute(route, router);
        });
    }

    private registerRoute = (route: Route, router: Router) => {
        switch (route.method) {
            case ('get'):
                if (route.open) {
                    router.get(route.path, route.action);
                } else {
                    router.get(route.path, Jwt({ secret: Conf.SECRET }), route.action);
                }
                break;
            case ('post'):
                if (route.open) {
                    router.post(route.path, route.action);
                } else {
                    router.post(route.path, Jwt({ secret: Conf.SECRET }), route.action);
                }
                break;
            case ('put'):
                if (route.open) {
                    router.put(route.path, route.action);
                } else {
                    router.put(route.path, Jwt({ secret: Conf.SECRET }), route.action);
                }
                break;
            case ('delete'):
                if (route.open) {
                    router.delete(route.path, route.action);
                } else {
                    router.delete(route.path, Jwt({ secret: Conf.SECRET }), route.action);
                }
                break;
        }
    }
}

export default IRoutes;
