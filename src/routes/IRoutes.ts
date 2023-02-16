import { Application } from "express";
import { Controller } from "../controllers/Controller";

export interface IRoutes {
  controller: Controller | null;
  routes: (app: Application) => void;
}
