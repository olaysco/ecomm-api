import { Request, Response } from "express";

type JSONResponse<T> = {
  status: string;
  data?: T;
  message?: string | null;
};

type PaginatedResponse<T> = JSONResponse<T> & {
  count: number;
  currentPage: number;
  limit: number;
  previous: string | null;
  next: string | null;
};

export abstract class Controller {
  /**
   * Generates a success JSON response
   *
   * @param res
   * @param data
   * @param message
   * @param code
   * @returns Response object
   */
  public successResponse<T>(
    res: Response,
    data: T,
    message?: string | null,
    code: number = 200
  ): Response {
    const json: JSONResponse<T> = { status: "success", data };
    if (message) {
      json.message = message;
    }
    return res.status(code).json(json);
  }

  /**
   * Generates a error JSON response
   *
   * @param res
   * @param data
   * @param message
   * @param code
   * @returns Response object
   */
  errorResponse(res: Response, message: string, code: number = 400) {
    const json: JSONResponse<null> = { status: "error", message, data: null };
    return res.status(code).json(json);
  }

  /**
   * Generates paginated JSON response
   *
   * @param res
   * @param data
   * @param message
   * @param code
   * @returns Response object
   */
  paginateResponse<T>(
    req: Request,
    res: Response,
    currentPage: number,
    count: number,
    limit: number,
    data: T
  ): Response {
    const current = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    let previous = null;
    let next = null;

    if (currentPage > 1) {
      const url = current;
      url.searchParams.set("currentPage", String(currentPage - 1));
      previous = url.toString();
    }

    if (count > currentPage * limit) {
      const url = current;
      url.searchParams.set("currentPage", String(currentPage + 1));
      next = url.toString();
    }

    const json: PaginatedResponse<T> = {
      status: "success",
      data,
      count,
      currentPage,
      limit,
      next,
      previous,
    };

    return res.status(200).json(json);
  }
}
