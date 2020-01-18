import App from './app';

import 'reflect-metadata';
import { Container } from 'typescript-ioc';


const app = Container.get(App);
app.start();

process.on('uncaughtException', error => {
    //let logger = new Logger(null);
    //logger.uncaught(error);
});
