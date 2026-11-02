const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0.01 },
  quantity: { type: Number, required: true, min: 1, max: 20 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: { type: [orderItemSchema], required: true, validate: [(items) => items.length > 0, "An order must include at least one item."] },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ["card", "delivery"], required: true },
  status: { type: String, enum: ["Confirmed"], default: "Confirmed" },
}, { timestamps: true });

orderSchema.set("toJSON", {
  transform(_document, result) {
    result.id = result._id.toString();
    delete result._id;
    delete result.__v;
    return result;
  },
});

module.exports =  mongoose.model("Order", orderSchema);
