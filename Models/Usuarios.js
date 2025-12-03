import { DataTypes } from "sequelize";
import { db } from "./database.js";


export const Usuarios = db.define("Usuarios", {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      field: "uuid_Usuarios"
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      field: "email_Usuarios"
    },
    senha: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: "senha_Usuarios"
    },
    google_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "google_id_Usuarios"
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "criado_em_Usuarios"
    },
    id_Pagamentos: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "id_Usuarios"
    },
    
  }, {
    tableName: "Usuarios",
    timestamps: false,
    underscored: false
  });


