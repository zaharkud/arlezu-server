import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.INTEGER, defaultValue: 1 },
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
  wordTranslation: { type: DataTypes.STRING, allowNull: false },
  sentence: { type: DataTypes.STRING, allowNull: false },
  sentenceTranslation: { type: DataTypes.STRING, allowNull: false },
  phonetics: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const ActiveCard = sequelize.define("activeCard", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  repeatTime: { type: DataTypes.INTEGER, defaultValue: 1 },
  isSelected: { type: DataTypes.BOOLEAN, defaultValue: false },
  userId: { type: DataTypes.INTEGER, defaultValue: 1 },
  cardId: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const DailyAim = sequelize.define("dailyAim", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  newCardsAim: { type: DataTypes.INTEGER, defaultValue: 0 },
  isCompletedNewCardsAim: { type: DataTypes.BOOLEAN, defaultValue: false },
  repeatCardsAims: { type: DataTypes.INTEGER, defaultValue: 0 },
  isCompletedRepeatCardsAim: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasOne(DailyAim);
DailyAim.belongsTo(User);

User.hasOne(Token);
Token.belongsTo(User);

// User.hasMany(ActiveCard);
// ActiveCard.belongsTo(User);

// Card.hasMany(ActiveCard);
// ActiveCard.belongsTo(Card);



export { User, Token, DailyAim, Card, ActiveCard };