import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

export let db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
    logging: false,
  timezone: '-03:00',
  dialectOptions: {
    timezone: 'local', // ✅ Importante para DATEONLY
    dateStrings: true,
    typeCast: true
  },
  }
);
