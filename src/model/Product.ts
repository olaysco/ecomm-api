import { Schema, model, Decimal128 } from "mongoose";

export const productFilters = ["name", "minPrice", "maxPrice", "slug", "brand"];

export interface IProduct {
  name: string;
  slug: string;
  brand: string;
  price: number;
  weight?: number;
  height?: number;
  description: string;
  isDeleted?: boolean;
}

const schema = new Schema<IProduct>(
  {
    name: { type: String, required: [true, "Product name is required"] },
    slug: { type: String, required: true },
    brand: { type: String, required: [true, "Product brand is required"] },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "Price must be greater than 0"],
    },
    weight: { type: Number },
    height: { type: Number },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

schema.set("toObject", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.isDeleted;
  },
});

schema.index({ brand: 1 }, { collation: { locale: "en", strength: 2 } });

const modelSchema = model<IProduct>("Product", schema);

export const Product = modelSchema;
