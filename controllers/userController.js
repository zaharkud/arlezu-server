import "dotenv/config.js"

import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import { userService } from "../services/userService.js";
import ApiErorr from "../exceptions/apiError.js";

const generateJwt = (id, email, name) => {
  return jwt.sign(
    { id, email, name },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
}

class UserController {

  /* Регистрация */
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiErorr.BadRequest("Ошибка валидации", errors.array()));
      }
      const { email, password, name } = req.body;
      const userData = await userService.registration(email, password, name);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true /*secure: true*/ })
      return res.json(userData);

    } catch (e) {
      next(e);
    }
  }

  /* Вход в аккаунт */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true /*secure: true*/ });
      return res.json(userData);

    } catch (e) {
      next(e);
    }
  }

  /* Выход из аккаунта */
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);

    } catch (e) {
      next(e);
    }
  }

  /* Обновление refreshToken`a */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true /*secure: true*/ });
      return res.json(userData);

    } catch (e) {
      next(e);
    }
  }

  /* Активация аккаунта */
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);

    } catch (e) {
      next(e);
    }
  }

  // async check(req, res) {
  //   const token = generateJwt(req.user.id, req.user.email, req.user.password);
  //   return res.json({ token });
  // }

  // async getById(req, res) {
  //   const { id } = req.params;
  //   const card = await Card.findOne({ where: { id } })

  //   return res.json(card);
  // }
}

export const userController = new UserController();