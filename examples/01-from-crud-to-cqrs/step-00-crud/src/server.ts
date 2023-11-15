import * as dotenv from 'dotenv';

import http from 'http';
import express, { NextFunction, Request, Response } from 'express';

import { AuthorController } from './controllers/author';
import { BookController } from './controllers/book';
import { UserController } from './controllers/user';
import { DatabaseProvider } from "./providers/DatabaseProvider";

import  * as settings from '../package.json';

dotenv.config();

export const app = express();

const port = process.env.PORT || 3000;
const providedTableName = process.env.DYNAMODB_TABLE_NAME || null;

export const DI = {} as {
  server: http.Server;
  database: DatabaseProvider;
  logger: Console;
};

DI.logger = console;

export const init = (async () => {
  app.use(express.json());

  app.get('/', (req, res) => res.json({ message: `API v${settings.version}` }));

  app.use('/author', AuthorController);
  app.use('/book', BookController);
  app.use('/user', UserController);

  app.use((req, res) => {
    res.status(404).json({ message: 'No route found' })
  });

  // Why disable this rule? Because error handler in express needs to have arity of 4 always.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    DI.logger.error(error);

    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ message: 'Uncaught Exception' });
  })

  DI.database = new DatabaseProvider(providedTableName, DI.logger);

  DI.server = app.listen(port, () => {
    DI.logger.info(`⚡️ Server is listening at port ${port}.`);
  });
})();
