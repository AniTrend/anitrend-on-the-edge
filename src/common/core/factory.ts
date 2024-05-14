import { Application, Router } from 'x/oak';
import { FactoryOptions } from '../types/options.d.ts';
import state from './setup.ts';
import timing from '../middleware/timing.ts';
import error from '../middleware/error.ts';
import growth from '../middleware/growth.ts';
import header from '../middleware/header.ts';
import targeting from '../middleware/targeting.ts';
import { logger } from './logger.ts';
import { between } from 'x/optic';
import _localSourceFactory from '../mongo/factory.ts';

const app = new Application({
  state,
  contextState: 'prototype',
});

export default (opts: FactoryOptions): Application => {
  logger.mark('factory-start');
  const router = opts.router ?? new Router();

  app.use(
    timing,
    header,
    growth,
    targeting,
    error,
  );

  app.addEventListener('close', (event) => {
    _localSourceFactory.disconnect();
    logger.info('common:core:factory:close: Request application stop by user', event.type);
  });

  app.addEventListener('error', (event) => {
    _localSourceFactory.disconnect();
    logger.critical('common.core.factory:error: Uncaught application exception', event.error);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  logger.mark('factory-end');
  logger.measure(between('factory-start', 'factory-end'));
  return app;
};
