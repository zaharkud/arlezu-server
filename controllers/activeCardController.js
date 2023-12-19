import { ActiveCard, User, Card } from "../models/model.js";
import { tokenService } from "../services/tokenService.js";
import UserDto from "../dtos/userDto.js";
import ApiErorr from "../exceptions/apiError.js";
import { where } from "sequelize";

class ActiveCardController {
  async create(req, res, next) {
    const { userId, cardId, repeatTime = 1, isSelected = false } = req.body;

    try {
      if (!userId || !cardId || !repeatTime) {
        throw Error;
      }

      const existingCard = await ActiveCard.findOne({ where: { userId, cardId } });

      if (!existingCard) {
        const activeCard = await ActiveCard.create({ repeatTime, isSelected, userId, cardId });
        return res.json(activeCard);
      }

      return res.json({ "Ошибка": "запись уже существует" });

    } catch (e) {
      next(ApiErorr.BadRequest("Ошибка в переданных данных: " + e.message));
    }
  }

  async changeRepeatTime(req, res, next) {
    const { userId, cardId, repeatTime } = req.body;

    try {
      const activeCard = await ActiveCard.findOne({ where: { cardId, userId } });
      if (!activeCard) throw Error;

      await activeCard.update({ repeatTime });
      res.json(activeCard);
    }
    catch (e) {
      next(ApiErorr.BadRequest("Ошибка в переданных данных: " + e.message));
    }
  }

  async getAll(req, res, next) {
    const { userId } = req.query;
    let response = [];

    try {
      if (!+userId) {
        console.log(userId);
        throw Error("id");
      }

      const activeCards = await ActiveCard.findAll({ where: { userId: +userId, repeatTime: 1 } });

      for (let el of activeCards) {
        const currentCard = await Card.findOne({ where: { id: el.cardId } });
        response.push(currentCard.dataValues);
      }

      if (!response) return res.json("");
      return res.json(response);

    } catch (e) {
      next(ApiErorr.BadRequest("Не указан токен пользователя или другая ошибка: " + e.message));
    }
  }
}

export const activeCardController = new ActiveCardController();