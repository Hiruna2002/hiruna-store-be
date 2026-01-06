import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICheckoutItem {
  productId: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number; 
}

export interface ICheckout extends Document {
  user: Types.ObjectId;
  checkoutItems: ICheckoutItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  paymentStatus: string;
  paymentDetails?: any;
  isFinalized: boolean;
  finalizedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const checkoutItemSchema = new Schema<ICheckoutItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    }, 
    // size: String,
    // color:String,
  },
  { _id: false }
);

const checkoutSchema = new Schema<ICheckout>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    paymentDetails: {
      type: Schema.Types.Mixed,
    },
    isFinalized: {
      type: Boolean,
      default: false,
    },
    finalizedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICheckout>("Checkout", checkoutSchema);