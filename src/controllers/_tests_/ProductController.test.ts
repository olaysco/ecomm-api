import request from "supertest";
import { Error } from "mongoose";
import HTTPServer from "../../server/HTTPServer";
import { ProductService } from "../../services/ProductService";

export const getProducts = jest.fn();
jest.mock("../../services/ProductService");

const basePath = "/api/products";

describe("ProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /products", () => {
    it("should return a list of products", async () => {
      const products = [
        {
          _id: "product_id_1",
          name: "Product 1",
          brand: "Brand 1",
          price: 10,
          weight: 1,
          height: 10,
          description: "Description 1",
          slug: "product-1",
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
        },
        {
          _id: "product_id_2",
          name: "Product 2",
          brand: "Brand 2",
          price: 20,
          weight: 2,
          height: 20,
          description: "Description 2",
          slug: "product 2",
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
        },
      ];

      const getProductsMock = jest.fn().mockResolvedValue({
        products: products,
        count: products.length,
      });
      const productServiceMock = {
        getProducts: getProductsMock,
      };
      (ProductService as jest.Mock).mockImplementation(
        () => productServiceMock
      );

      const response = await request(HTTPServer.app).get(basePath);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject(products);
    });

    it("should set limit to 10 if limit value is not a number", async () => {
      const response = await request(HTTPServer.app).get(
        `${basePath}?limit=foo`
      );

      expect(response.status).toBe(200);
      expect(response.body.limit).toEqual(10);
    });

    it("should set page to 1 if page value is not a number", async () => {
      const response = await request(HTTPServer.app).get(
        `${basePath}?page=foo`
      );

      expect(response.status).toBe(200);
      expect(response.body.limit).toEqual(10);
    });

    it("should return a 500 error if the service throws an unexpected error", async () => {
      const getProductsMock = jest
        .fn()
        .mockRejectedValueOnce(new Error("Something went wrong"));

      const productServiceMock = {
        getProducts: getProductsMock,
      };

      (ProductService as jest.Mock).mockImplementation(
        () => productServiceMock
      );

      const response = await request(HTTPServer.app).get(`${basePath}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("status", "error");
    });
  });

  describe("GET /products/:id", () => {
    it("should return a product by id", async () => {
      const productId = "product_id_1";
      const product = {
        _id: productId,
        name: "Product 1",
        brand: "Brand 1",
        price: 10,
        weight: 1,
        height: 10,
        description: "Description 1",
        slug: "product 1",
        createdAt: `${new Date()}`,
        updatedAt: `${new Date()}`,
      };
      const getProductsByIdMock = jest.fn().mockResolvedValue(product);
      (ProductService as jest.Mock).mockImplementation(() => ({
        getProductById: getProductsByIdMock,
      }));

      const response = await request(HTTPServer.app).get(
        `${basePath}/${productId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject(product);
      expect(response.body).toHaveProperty("status", "success");
    });

    it("should return 404 error if product is not found", async () => {
      const productServiceMock = {
        getProductById: jest
          .fn()
          .mockRejectedValueOnce(
            new Error.DocumentNotFoundError("Something went wrong")
          ),
      };

      (ProductService as jest.Mock).mockImplementation(
        () => productServiceMock
      );

      const response = await request(HTTPServer.app).get(
        `${basePath}/not-found`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("status", "error");
    });
  });

  describe("PATCH /products/:id", () => {
    it("should update product", async () => {
      const productId = "product_id_1";
      const product = {
        _id: productId,
        name: "Product 1",
        brand: "Brand 1",
        price: 10,
        weight: 1,
        height: 10,
        description: "Description 1",
        slug: "product 1",
        createdAt: `${new Date()}`,
        updatedAt: `${new Date()}`,
      };
      const updateProductMock = jest.fn().mockResolvedValue(product);
      (ProductService as jest.Mock).mockImplementation(() => ({
        updateProduct: updateProductMock,
      }));

      const updateData = {
        name: "Updated Product 1",
        brand: "Updated Brand 1",
        price: 15,
        weight: 2,
        height: 15,
        description: "Updated Description 1",
      };

      const response = await request(HTTPServer.app)
        .patch(`${basePath}/${productId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(updateProductMock).toHaveBeenCalledWith(productId, updateData);
      expect(response.body.data).toMatchObject(product);
      expect(response.body).toHaveProperty("status", "success");
    });
  });

  describe("DELETE /products/:id", () => {
    it("should return 204", async () => {
      const productId = "product_id_1";

      const getProductsByIdMock = jest.fn().mockResolvedValue(null);
      (ProductService as jest.Mock).mockImplementation(() => ({
        deleteProduct: getProductsByIdMock,
      }));

      const response = await request(HTTPServer.app).delete(
        `${basePath}/${productId}`
      );

      expect(response.status).toBe(204);
    });

    it("should return 404 error if the product is not found", async () => {
      (ProductService as jest.Mock).mockImplementation(() => ({
        deleteProduct: jest
          .fn()
          .mockRejectedValueOnce(
            new Error.DocumentNotFoundError("Something went wrong")
          ),
      }));

      const response = await request(HTTPServer.app).delete(
        `${basePath}/not-found`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("status", "error");
    });
  });
});
