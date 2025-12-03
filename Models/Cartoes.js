import { DataTypes } from "sequelize";
import { db } from "./database.js";

export const Cartoes = db.define(
  "Cartoes",
  {
    uuid_Cartoes: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },

    uuid_Usuarios: {
      type: DataTypes.STRING(36),
      allowNull: false
    },

    card_id_Cartoes: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },

    final_Cartoes: {
      type: DataTypes.STRING(5),
      allowNull: true
    },

    vencimento_Cartoes: {
      type: DataTypes.STRING(5),
      allowNull: true
    },

    bandeira_Cartoes: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    valido_Cartoes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    principal_Cartoes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    criado_em_Cartoes: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "Cartoes",
    timestamps: false,
    freezeTableName: true
  }
);

