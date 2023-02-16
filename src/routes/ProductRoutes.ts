import { IRoutes } from "./IRoutes";
import { Application, Request, Response } from "express";
import ProductController from "../controllers/ProductController";

export class ProductRoutes implements IRoutes {
  controller = ProductController;

  public routes(app: Application) {
    app.get("/products", (req: Request, res: Response) => {
      this.controller.index(req, res);
    });

    app.get("/products/:id", (req: Request, res: Response) => {
      this.controller.single(req, res);
    });

    app.post("/products", (req: Request, res: Response) => {
      this.controller.store(req, res);
    });

    app.patch("/products/:id", (req: Request, res: Response) => {
      this.controller.update(req, res);
    });

    app.delete("/products/:id", (req: Request, res: Response) => {
      this.controller.destroy(req, res);
    });
  }
}
