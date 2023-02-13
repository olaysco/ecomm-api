import { Application } from "express";

export interface IRoutes {
  routes: (app: Application) => void;
}
