import Fastify, { FastifyInstance } from "fastify";
import path from "path";
import autoLoad from "@fastify/autoload";

function buildApp(opts = {}): FastifyInstance {
  const app = Fastify({
    logger: true,
    bodyLimit: 5 * 1024 * 1024, // 5MB
    requestTimeout: 60000, // 60 seconds
    ...opts,
  });

  // Register plugins
  app.register(autoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
  });

  // Register routes
  app.register(autoLoad, {
    dir: path.join(__dirname, "routes"),
    options: opts,
  });

  return app;
}

export default buildApp;
