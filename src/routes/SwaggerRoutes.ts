import { IRoutes } from "./IRoutes";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { Controller } from "../controllers/Controller";

export class SwaggerRoutes implements IRoutes {
  controller: Controller | null = null;
  swaggerSpec: object;

  constructor() {
    const swaggerDoc = require("../../doc/swagger.json");

    this.swaggerSpec = swaggerDoc;
  }

  public routes(app: Application) {
    app.use("/doc", swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
  }
}
