const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  price: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  image: { type: String, required: true, trim: true, match: /^https?:\/\/.+/i },
  color: { type: String, trim: true, maxlength: 100, default: "" },
  badge: { type: String, trim: true, maxlength: 80, default: "" },
}, { timestamps: true });

productSchema.set("toJSON", {
  transform(_document, result) {
    result.id = result._id.toString();
    delete result._id;
    delete result.__v;
    return result;
  },
});

module.exports = mongoose.model("Product", productSchema);
