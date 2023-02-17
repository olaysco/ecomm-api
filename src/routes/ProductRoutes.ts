import { IRoutes } from "./IRoutes";
import { Application, Request, Response } from "express";
import ProductController from "../controllers/ProductController";

export class ProductRoutes implements IRoutes {
  controller = ProductController;

  public routes(app: Application) {
    app.get("/", (req: Request, res: Response) => {
      res
        .status(200)
        .send("Welcome to ecomm api, <a href='/doc'>Access the doc</a>");
    });

    app.get("/api/products", (req: Request, res: Response) => {
      this.controller.index(req, res);
    });

    app.get("/api/products/:id", (req: Request, res: Response) => {
      this.controller.single(req, res);
    });

    app.post("/api/products", (req: Request, res: Response) => {
      this.controller.store(req, res);
    });

    app.patch("/api/products/:id", (req: Request, res: Response) => {
      this.controller.update(req, res);
    });

    app.delete("/api/products/:id", (req: Request, res: Response) => {
      this.controller.destroy(req, res);
    });
  }
}
