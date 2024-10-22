const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    carbonData: {
      carbon_kg: { type: Number, default: 0 },
    },
  },
  { toJSON: { virtuals: true } }
);

// Hash user password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Add a method to check if password is correct
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
