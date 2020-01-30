import {IRouterContext} from "koa-router";

export default class Route {

    private _path!: string;
    private _method!: string;
    private _action!: (ctx: IRouterContext, next?: any) => void;
    private _open!: boolean;

    public static newRoute(path: string, method: string, action: (ctx: IRouterContext, next?: any) => void, open: boolean = false) {
        const route = new Route();
        route._path = path;
        route._method = method;
        route._action = action;
        route._open = open;
        return route;
    }

    public get path(): string {
        return this._path;
    }

    public get method(): string {
        return this._method;
    }

    public get action(): (ctx: IRouterContext, next?: any) => void {
        return this._action;
    }

    public get open(): boolean {
        return this._open;
    }
}
