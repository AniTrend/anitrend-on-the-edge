import {
  Application,
  Context,
  HTTPMethods,
  Middleware,
  Router,
  State,
} from "x/oak";
import logger from "../_core/logger.ts";
import logging from "../_middleware/logging.ts";
import timing from "../_middleware/timing.ts";
import error from "../_middleware/error.ts";
import header from "../_middleware/header.ts";
import method from "../_middleware/method.ts";

// deno-lint-ignore no-explicit-any
type AS = Record<string, any>;

export type FactoryOptions<S extends State = AS> = {
  methods: HTTPMethods[];
  handler: Middleware<S, Context<S, AS>>;
};

export default (opts: FactoryOptions): Application => {
  const app = new Application();

  const router = new Router();

  app.use(
    logging,
    timing,
    header,
    method(opts.methods),
    error,
    opts.handler,
  );

  app.addEventListener("error", (event) => {
    logger.error(event);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
