import { DataTypes } from "sequelize";
import { db } from "./database.js";

export const Planos = db.define("Planos", {
  Planos_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true,
    field: "uuid_Planos"
  },
  titulo: {
    type: DataTypes.STRING(70),
    allowNull: true,
    field: "titulo_Planos"
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "valor_Planos"
  },
  cobrado_em: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "cobrado_em_Planos"
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "criado_em_Planos"
  }
}, {
  tableName: "Planos",
  timestamps: false,
});
