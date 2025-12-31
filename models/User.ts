// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true,
//             match: [/.+\@.+\..+/, "Please enter a valid email address"],
//         },
//         password: {
//             type: String,
//             required: true,
//             minLength: 6,
//         },
//         role: {
//             type: String,
//             enum: ["customer", "admin"],
//             default: "customer"
//         },
//     },
//     {timestamps: true}
// );

// // password hash middleware
// userSchema.pre("save", async function (text) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// // Match User entered password to Hashed password

// userSchema.methods.matchPassword = async function
// (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);

//----------------------------------------------------------------

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  matchPassword(enteredPassword: string): Promise<boolean>;
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

/**
 * Password hash middleware
 */
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Match user entered password with hashed password
 */
// userSchema.methods.matchPassword = async function (
//   enteredPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.matchPassword = async function (
//   this: IUser,
//   enteredPassword: string
// ): Promise<boolean> {
//   if (!this.password) {
//     throw new Error("Password not loaded from database");
//   }

//   return bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.matchPassword = async function (
//   this: IUser & { password: string },
//   enteredPassword: string
// ): Promise<boolean> {
//   if (!this.password) throw new Error("Password not loaded");
//   return bcrypt.compare(enteredPassword, this.password);
// };


userSchema.methods.matchPassword = async function (
  this: IUser & { password?: string },
  enteredPassword: string
): Promise<boolean> {
  if (!enteredPassword) {
    throw new Error("Entered password is undefined");
  }
  if (!this.password) {
    throw new Error("User password is undefined");
  }
  return bcrypt.compare(enteredPassword, this.password);
};


/**
 * Export User model
 */
const User = mongoose.model<IUser>("User", userSchema);
export default User;
