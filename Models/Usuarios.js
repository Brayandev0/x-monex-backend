import { DataTypes } from "sequelize";
import { db } from "./database.js";


export const Usuarios = db.define("Usuarios", {
    uuid_Usuarios: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    email_Usuarios: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    },
    senha_Usuarios: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    google_id_Usuarios: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    criado_em_Usuarios: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "Usuarios",
    schema: "X-Monex",
    timestamps: false,
    underscored: false
  });


