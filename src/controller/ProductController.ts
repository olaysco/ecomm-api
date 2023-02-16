import { Error, SortOrder } from "mongoose";
import { ProductService } from "./../services/ProductService";
import { IProduct, productFilters } from "./../model/Product";
import { Controller } from "./Controller";
import { Request, Response } from "express";

class ProductController extends Controller {
  private service: ProductService;
  constructor() {
    super();

    this.service = new ProductService();
  }

  /**
   * Returns all products.
   *
   * @param req
   * @param res
   * @returns Promise
   */
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const options: {
        [index: string]: string | number | object;
        sort: [string, SortOrder][];
        limit: number;
        page: number;
        query: object;
      } = {
        limit: parseInt(String(req.query.limit)) || 10,
        page: parseInt(String(req.query.page)) || 1,
        query: req.query,
        sort: [
          [
            (req.query.sort_by as string) ?? "createdAt",
            (req.query.order_by as SortOrder) ?? "desc",
          ],
        ],
      };

      const { products, count } = await this.service.getProducts(options);

      return super.paginateResponse<IProduct[]>(
        req,
        res,
        options.page,
        count,
        options.limit,
        products
      );
    } catch (err) {
      if (err instanceof Error.CastError || err instanceof TypeError) {
        return this.errorResponse(
          res,
          `Error retrieving products, caused by ${err.message}`,
          400
        );
      }
      return super.errorResponse(res, `Error retrieving products`, 500);
    }
  }

  async single(req: Request, res: Response) {
    try {
      const product = await this.service.getProductById(req.params.id);

      return this.successResponse(res, product);
    } catch (err) {
      if (
        err instanceof Error.CastError ||
        err instanceof Error.DocumentNotFoundError
      ) {
        return this.errorResponse(
          res,
          `Error product with ${req.params.id} not found`,
          400
        );
      }
    }
  }

  async store(req: Request, res: Response) {
    try {
      const productData = {
        name: req.body.namee,
        brand: req.body.brand,
        price: req.body.price,
        weight: req.body.weight,
        height: req.body.height,
        description: req.body.description,
      };
      const product = await this.service.createProduct(productData);

      return this.successResponse<IProduct>(res, product, null, 201);
    } catch (err: any) {
      if (err instanceof Error.ValidationError) {
        return this.errorResponse(res, err.message, 400);
      }

      return this.errorResponse(res, "Error creating new product", 500);
    }
  }

  public async destroy(req: Request, res: Response) {
    try {
      await this.service.deleteProduct(req.params.id);

      return this.successResponse(
        res,
        null,
        "Product deleted successfully",
        204
      );
    } catch (err) {
      if (
        err instanceof Error.CastError ||
        err instanceof Error.DocumentNotFoundError
      ) {
        return this.errorResponse(
          res,
          `Error product with ${req.params.id} not found`,
          400
        );
      }
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const productData = {
        name: req.body.namee,
        brand: req.body.brand,
        price: req.body.price,
        weight: req.body.weight,
        height: req.body.height,
        description: req.body.description,
      };
      const product = await this.service.updateProduct(
        req.params.id,
        productData
      );

      return this.successResponse<IProduct>(res, product);
    } catch (err) {
      if (err instanceof Error.ValidationError) {
        return this.errorResponse(res, err.message, 400);
      }

      if (
        err instanceof Error.CastError ||
        err instanceof Error.DocumentNotFoundError
      ) {
        return this.errorResponse(
          res,
          `Error product with ${req.params.id} not found`,
          400
        );
      }

      return this.errorResponse(res, "Error updating new product", 500);
    }
  }
}

export default new ProductController();
