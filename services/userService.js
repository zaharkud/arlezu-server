import "dotenv/config.js"
import { User } from "../models/model.js";
import { mailService } from "./mailService.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { tokenService } from "./tokenService.js";
import UserDto from "../dtos/userDto.js";
import ApiErorr from "../exceptions/apiError.js";

class UserService {
  async registration(email, password, name) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiErorr.BadRequest(`Пользователь с почтовым ящиком ${email} уже сучествует`);
    }
    const hashPassword = await bcrypt.hash(password, 4);
    const activationLink = uuidv4();

    const user = await User.create({ email, password: hashPassword, name, activationLink });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/users/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
      throw ApiErorr.BadRequest("Неккоректная ссылка для активации аккаунта");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiErorr.BadRequest("Пользователь не был найден");
    }
    const isPassEuqals = await bcrypt.compare(password, user.password);
    if (!isPassEuqals) {
      throw ApiErorr.BadRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);


    return {
      ...tokens,
      user: userDto
    }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiErorr.UnathorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiErorr.UnathorizedError();
    }

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }
}

export const userService = new UserService();