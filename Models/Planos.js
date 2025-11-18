import { DataTypes } from "sequelize";
import { db } from "./database.js";

export const Planos = db.define("Planos", {
  uuid_Planos: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true
  },
  titulo_Planos: {
    type: DataTypes.STRING(70),
    allowNull: true
  },
  valor_Planos: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  cobrado_em_Planos: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  criado_em_Planos: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "Planos",
  timestamps: false,
});
