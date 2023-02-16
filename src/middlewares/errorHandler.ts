import express, { Request, Response, NextFunction } from "express";

export const JSONSyntaxErrorHandler =
  () => (err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
      return res
        .status(400)
        .send({ status: "error", message: err.message ?? "" });
    }
    next();
  };
