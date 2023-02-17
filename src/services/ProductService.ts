import { productFilters } from "./../model/Product";
import { Product, IProduct } from "../model/Product";
import { SortOrder } from "mongoose";

export class ProductService {
  /**
   * Gets all products
   *
   * @param options filter and query options
   * @returns Array of retrieved product that matches the passed filter if any
   */
  public async getProducts(options: {
    sort: [string, SortOrder][];
    limit: number;
    page: number;
    query: object;
  }): Promise<{ products: IProduct[]; count: number }> {
    const filters: { [index: string]: string | number } = {};

    Object.entries(options.query)
      .filter((entry) => productFilters.includes(entry[0]))
      .map((entry) => (filters[entry[0]] = entry[1] as string));

    const products = await Product.find(filters)
      .limit(options.limit)
      .skip(options.limit * (options.page - 1))
      .collation({ locale: "en", strength: 2 })
      .sort(options.sort);

    const count = await Product.where(filters).count();

    return { products: products.map((p) => p.toObject()), count };
  }

  /**
   * Retrieves a product by ID
   *
   * @param id ID of the product to retrieve
   * @returns Single product data
   */
  public async getProductById(id: string): Promise<IProduct> {
    const filterParam = {
      _id: id,
      isDeleted: false,
    };
    const product = await Product.findOne(filterParam).orFail();

    return product.toObject();
  }

  /**
   * Creates a new product
   *
   * @param productData key value pair of product to be created
   * @returns Newly created product data
   */
  public async createProduct(productData: {
    name: string;
    brand: string;
    price: number;
    weight: number;
    height: number;
    description: string;
  }): Promise<IProduct> {
    const { name, brand, price, weight, height, description } = productData;
    const product = new Product({
      name,
      brand,
      price,
      weight,
      height,
      description,
      slug: this.getSlug(name ?? ""),
    });
    const newProduct = await product.save();

    return newProduct.toObject();
  }

  /**
   * Deletes a product by ID
   *
   * @param id ID of product to delete
   */
  public async deleteProduct(id: string): Promise<void> {
    const filterParam = {
      _id: id,
      isDeleted: false,
    };
    const product = await Product.findOne(filterParam).orFail();

    await Product.updateOne(filterParam, {
      isDeleted: true,
    });
  }

  /**
   * Updates a product by ID
   *
   * @param id ID of the product to update
   * @param productData key value pair of data to update a product
   * @returns Updated product data
   */
  public async updateProduct(
    id: string,
    productData: {
      name?: string;
      brand?: string;
      price?: number;
      weight?: number;
      height?: number;
      description?: string;
    }
  ): Promise<IProduct> {
    const filterParam = {
      _id: id,
      isDeleted: false,
    };
    const existingProduct = await Product.findOne(filterParam).orFail();

    const product = {
      name: productData.name ?? existingProduct?.name,
      brand: productData.brand ?? existingProduct?.brand,
      price: productData.price ?? existingProduct?.price,
      weight: productData.weight ?? existingProduct?.weight,
      height: productData.height ?? existingProduct?.height,
      description: productData.description ?? existingProduct?.description,
      slug: existingProduct?.slug ?? "",
    };

    if (product.name != existingProduct?.name) {
      product.slug = this.getSlug(product.name);
    }

    await Product.updateOne(filterParam, product);
    return product;
  }

  /**
   * Generates a unique slug for product using its name
   *
   * @param name Product Name
   * @returns Unique product slug
   */
  private getSlug(name: string): string {
    const slug = name
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLocaleLowerCase()
      .trim()
      .concat("-", `${Math.floor(Math.random() * 1000000)}`);

    return slug;
  }
}
