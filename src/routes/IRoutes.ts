import { Application } from "express";
import { Controller } from "../controller/Controller";

export interface IRoutes {
  controller: Controller;
  routes: (app: Application) => void;
}
