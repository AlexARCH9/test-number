import { Sequelize, DataTypes } from "sequelize";
import { randomUUID } from "crypto";
import { config } from "../config.js";

// Setup database
const sequelize = new Sequelize(config.URL_DATABASE);

// Models
sequelize.define("Phones", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: randomUUID(),
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
});

await sequelize.sync({ force: true });

export default sequelize;
