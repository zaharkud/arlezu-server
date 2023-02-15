import { Card } from "../models/model.js";

class CardController {
  async create(req, res) {
    const {
      word,
      word_translation,
      sentence,
      sentence_translation,
      phonetics,
      img } = req.body;

    const card = await Card.create({ word, word_translation, sentence, sentence_translation, phonetics, img });

    return res.json(card);
  }

  async getAll(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || null;
    let offset = page * limit - limit;

    const cards = await Card.findAll({ limit, offset });

    return res.json(cards);
  }

}

export const cardController = new CardController();