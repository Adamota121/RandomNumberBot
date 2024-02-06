import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize("user", "root", undefined, {
  host: "localhost",
  dialect: "mysql",
});
export class User extends Model { }
User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userID: { type: DataTypes.BIGINT, allowNull: false },
    admin: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { sequelize, modelName: "user", createdAt: false, updatedAt: false }
);
sequelize.sync({ force: true }).then(() => {
  console.log("База данных синхронизирована");
});