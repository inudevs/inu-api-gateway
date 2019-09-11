import { Schema, model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';

const User = new Schema({
  type: String,
  name: String,
  email: String,
  password: String,
  photo: String,
  timestamp: { type: Date, default: Date.now() },
  student: { type: Object, default: () => {} },
  inu: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

const encryptPassword = (password, salt) => {
  const encrypted = pbkdf2Sync(
    password,
    salt,
    200000,
    64,
    'sha512',
  ).toString('base64');
  return encrypted;
}

User.statics.createUser = async function(user) {
  const { type, name, email, photo } = user;
  const salt = randomBytes(10).toString('base64');
  const encryptedPassword = encryptPassword(user.password, salt);
  const newUser = new this({
    type,
    name,
    email,
    password: `${encryptedPassword}|${salt}`,
    photo,
  });
  const savedUser = await newUser.save();
  return savedUser.id;
}

User.methods.verifyPassword = function(userInput) {
  const [encrypted, salt] = user.password.split('|');
  const password = encryptPassword(userInput, salt);
  return (password === encrypted);
}

User.methods.assignInu = function() {
  this.inu = true;
  return this.save();
}

User.methods.assignAdmin = function() {
  this.admin = true;
  return this.save();
}

export default model('User', User);
