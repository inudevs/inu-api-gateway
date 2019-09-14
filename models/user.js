import { Schema, model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import request from 'request-promise-native';

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

User.method('toJSON', function() {
  var obj = this.toObject();
  obj.id = obj._id;
  ;['_id', '__v'].map(key => {
    delete obj[key];
  });
  return obj;
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

const requestDimigo = async (id, password) => {
  const { token } = await request({
    uri: 'https://api.dimigo.in/auth',
    method: 'POST',
    body: { id, password, },
    json: true,
  });
  const identity = jwt.decode(token).identity[0];
  return identity;
}

const getPhotoUrl = photo => `${process.env.PHOTO_CDN}${photo}`

// 일반 사용자 계정 생성
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

// 디미고 학생 계정 생성
User.statics.createDimigo = async function (user) {
  const { type, id, password } = user;
  const identity = await requestDimigo(id, password);
  const { name, grade, klass, number, serial, email, photo } = identity;

  // 중복 체크
  const dup = await this.findOne({ email })
  if (dup) {
    throw Error('이미 같은 이메일의 사용자가 존재합니다.');
  }

  // 사용자 생성
  const salt = randomBytes(10).toString('base64');
  const encryptedPassword = encryptPassword(password, salt);
  const newUser = new this({
    type,
    name,
    email,
    password: `${encryptedPassword}|${salt}`,
    photo: getPhotoUrl(photo),
    student: {
      id,
      grade,
      klass,
      number,
      serial,
    },
  });
  const savedUser = await newUser.save();
  return savedUser.id;
}

// 패스워드 확인
User.methods.verifyPassword = function(userInput) {
  const [encrypted, salt] = this.password.split('|');
  const password = encryptPassword(userInput, salt);
  return (password === encrypted);
}

// 기존 사용자에 디미고 계정 연동
User.methods.migrateDimigo = async function(id, password) {
  const identity = await requestDimigo(id, password);
  const { name, grade, klass, number, serial, email, photo } = identity;
  this.student = {
    id,
    grade,
    klass,
    number,
    serial,
  };
  this.type = 'dimigo';
  this.name = this.name || name;
  this.email = this.email || email;
  this.photo = this.photo || getPhotoUrl(photo);
  return this.save()
}

// 기존 사용자에 INU 동아리원 권한 부여
User.methods.assignInu = function() {
  this.inu = true;
  return this.save();
}

// 기존 사용자에 관리자 권한 부여
User.methods.assignAdmin = function() {
  this.admin = true;
  return this.save();
}

export default model('User', User);
