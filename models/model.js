import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  /* Подтверждение регистрации по почте */
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING },
});

const Token = sequelize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING, allowNull: false }
})

const Card = sequelize.define("card", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  word: { type: DataTypes.STRING, allowNull: false },
  word_translation: { type: DataTypes.STRING, allowNull: false },
  sentence: { type: DataTypes.STRING, allowNull: false },
  sentence_translation: { type: DataTypes.STRING, allowNull: false },
  phonetics: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const RepeatCard = sequelize.define("repeat_card", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  repeat_time: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const Statistics = sequelize.define("statistics", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  completed_cards: { type: DataTypes.INTEGER, defaultValue: 0 },
});

User.hasOne(Statistics);
Statistics.belongsTo(User);

User.hasOne(Token);
Token.belongsTo(User);

User.hasMany(RepeatCard);
RepeatCard.belongsTo(User);

Card.hasMany(RepeatCard);
RepeatCard.belongsTo(Card);

export { User, Token, Statistics, Card, RepeatCard };