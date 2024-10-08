const UserDto = require('../dtos/user.dto');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const mailService = require('./mail.service');
const tokenService = require('./token.service');

class AuthService {
  async getUsers() {
    return await userModel.find();
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

    await mailService.sendMail(
      email,
      `${process.env.API_URL}/api/users/activation/${userDto.id}`
    );

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  async activation(id) {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActivated) {
      user.isActivated = true;
      await user.save();
    }

    return user;
  }

  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      throw new Error('Wrong password');
    }

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('Please provide refresh token');
    }

    const userPayload = tokenService.validateRefreshTooken(refreshToken);
    console.log(userPayload);

    const tokenDb = await tokenService.findToken(refreshToken);

    if (!userPayload || !tokenDb) {
      throw new Error('Please provide refresh token');
    }

    const user = await userModel.findById(userPayload.id);

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }
}

module.exports = new AuthService();
