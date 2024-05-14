import { MongoClient } from 'x/mongo';
import { logger } from '../core/logger.ts';
import { between } from 'x/optic';
import { env } from '../core/env.ts';
import { Local } from '../types/core.d.ts';

class LocalSourceFactory {
  constructor(
    private readonly options: string,
    private readonly client: MongoClient,
  ) {
    logger.mark('mongo_connection_start');
  }

  connect = async (): Promise<Local> => {
    try {
      const db = await this.client.connect(this.options);
      logger.mark('mongo_connection_end');
      logger.measure(
        between('mongo_connection_start', 'mongo_connection_end'),
      );
      return db;
    } catch (e) {
      logger.error('common.mongo.factory:connect:', e);
      return undefined;
    }
  };

  disconnect = () => {
    logger.mark('mongo_close_start');
    try {
      this.client.close();
    } catch (e) {
      logger.error('common.mongo.factory:disconnect:', e);
    }
    logger.mark('mongo_close_end');
    logger.measure(between('mongo_close_start', 'mongo_close_end'));
  };
}

const _localSourceFactory = new LocalSourceFactory(
  env<string>('MONGO_URL'),
  new MongoClient(),
);

export default _localSourceFactory;
