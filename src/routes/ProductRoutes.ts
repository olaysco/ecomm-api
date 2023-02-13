import { IRoutes } from "./IRoutes";
import { Application, Request, Response } from "express";

export class ProductRoutes implements IRoutes {
  public routes(app: Application) {
    app.get("/products", (req: Request, res: Response) => {
      console.log("get all");
    });

    app.get("/products/:id", (req: Request, res: Response) => {
      console.log("get single product");
    });

    app.post("/products", (req: Request, res: Response) => {
      console.log("create product");
    });

    app.patch("/products/:id", (req: Request, res: Response) => {
      console.log("update single product");
    });

    app.delete("/products/:id", (req: Request, res: Response) => {
      console.log("delete single product");
    });
  }
}
