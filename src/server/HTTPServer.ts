import { SwaggerRoutes } from "./../routes/SwaggerRoutes";
import http from "http";
import express from "express";
import { IRoutes } from "./../routes/IRoutes";
import { ProductRoutes } from "./../routes/ProductRoutes";
import { JSONSyntaxErrorHandler } from "../middlewares/errorHandler";

class HTTPServer {
  public app: express.Application;
  private productRoutes: IRoutes = new ProductRoutes();
  private swaggerRoutes: IRoutes = new SwaggerRoutes();

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.enable("trust proxy");
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(JSONSyntaxErrorHandler());
    this.setupRoutes();
  }

  private setupRoutes() {
    this.productRoutes.routes(this.app);
    this.swaggerRoutes.routes(this.app);
  }

  start(port: string) {
    http
      .createServer(this.app)
      .listen(port, () => console.log(`listening on port ${port}`));
  }
}

export default new HTTPServer();
