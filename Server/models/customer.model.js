import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "rental" }],
  },
  { timestamps: true }
);

const Customer = mongoose.model("customer", customerSchema);

export default Customer;
