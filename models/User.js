const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
}, { timestamps: true });

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.set("toJSON", {
  transform(_document, result) {
    result.id = result._id.toString();
    delete result._id;
    delete result.__v;
    delete result.passwordHash;
    return result;
  },
});

module.exports = mongoose.model("User", userSchema);
