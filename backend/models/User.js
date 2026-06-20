const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Employee', 'Instructor', 'HR', 'Admin'], // Enterprise Roles
    default: 'Employee',
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Suspended'], // GOD LEVEL STATUS FEATURE
    default: 'Pending',
  }
}, { timestamps: true });

// Password Encryption
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);