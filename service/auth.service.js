const UserDto = require('../dtos/user.dto');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

class AuthService {
  async getUsers() {
    const users = await userModel.find();
    return users;
  }

  async register(name, email, password) {
    if (!email || !password || !name) {
      throw new Error('Email, password and Name are required!!');
    }

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const userDto = new UserDto(user);

    const newUser = await userModel.create(user);
    return newUser;
  }
}

module.exports = new AuthService();
