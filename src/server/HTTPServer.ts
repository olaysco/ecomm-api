import http from "http";
import express from "express";
import { PORT } from "./../config/index";
import { IRoutes } from "./../routes/IRoutes";
import { ProductRoutes } from "./../routes/ProductRoutes";

class HTTPServer {
  public app: express.Application;
  private productRoutes: IRoutes = new ProductRoutes();

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.enable("trust proxy");
    this.app.use(express.urlencoded({ extended: true }));
    this.setupRoutes();
  }

  private setupRoutes() {
    this.productRoutes.routes(this.app);
  }

  start() {
    http
      .createServer(this.app)
      .listen(PORT, () => console.log(`listening on port ${PORT}`));
  }
}

export default new HTTPServer();
