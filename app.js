const http = require("http");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const log4js = require("log4js");
const listEndpoints = require("express-list-endpoints");
const Logger = require("./src/utils/logger");
const DatabaseConnection = require("./src/commons/database_connection");
const ConfigManager = require('./src/utils/config_manager');

/**
 * The server.
 *
 * @class Server
 */
class Server {
  static bootstrap() {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.loadConfiguration();
    this.app = express();

    Logger.initializeLogger("./log");
    this._logger = new Logger("app").getLogger();
    this.config();

    this.initializeDB();
    this.registerAPIRoutes();
    this.prettyPrintRegisteredRoutes();

    // Create server
    this.server = http.createServer(this.app);

    // Start listening
    this.listen();
  }

  /**
   * Initialize connection and handle connection errors etc.
   */
  initializeDB() {
    new DatabaseConnection();
  }

  /**
   *  Load Configuration from conf json
   */
  loadConfiguration() {
    const configManager = new ConfigManager()
    global.conf = configManager.getConfigurations()
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  config() {
    this.port = global.conf.listenPort;
    this.app.use(
      log4js.connectLogger(Logger.getHttpLogger(), {
        level: "INFO",
        format:
          "[:method :status :url - :response-timems :res[content-length]] - [:req[Host] :req[x-forwarded-for] - :remote-addr] - [HTTP/:http-version - :user-agent]"
      })
    );
    this.app.use(bodyParser.json({ limit: "20mb" }));
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // security related configurations
    this.app.use(helmet());
    this.app.use(this.configureOptionsMethod);

    process.on("unhandledRejection", (reason, p) => {
      this._logger.error("Unhandled exception", reason, p);
      throw reason; // optional, in case you want to treat these as errors
    });

    this._logger.info("Server started at " + new Date());
  }

  configureOptionsMethod(req, res, next) {
    if (req.method === "OPTIONS") {
      res.status(200).end();
    } else {
      next();
    }
  }

  /**
   * Create API routers. This routers do not use csrf token!
   *
   * @class Server
   * @method api
   */
  registerAPIRoutes() {
    this._router = require("./src/apis/index");
    this._router.setRoutes(this.app);    
  }

  prettyPrintRegisteredRoutes() {
    let routesToPrint = listEndpoints(this.app);
    this._logger.info(``);
    this._logger.info(`REGISTERED ROUTES:`);

    routesToPrint.forEach(r => {
      this._logger.info(r.path.replace("\\", ""));
      this._logger.info("\t- " + r.methods.join(" | "));
    });
    this._logger.info(``);
  }

  /**
   * Start HTTP server listening
   */
  listen() {
    // listen on provided ports
    this.express_server = this.server.listen(this.port);

    // add error handler
    this.server.on("error", error => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind =
        typeof this.port === "string"
          ? `Pipe ${this.port}`
          : `Port ${this.port}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          this._logger.error("requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          this._logger.error(bind, " is already in use");
          process.exit(1);
          break;

        default:
          throw error;
      }
    });

    // start listening on port
    this.server.on("listening", () => {
      this._logger.info("Server ready. Listening on port ", this.port);
    });
  }
}

// Bootstrap the server
const server = Server.bootstrap();
//required for testing 
exports.express_server = server.express_server;
exports.app = server.app;
