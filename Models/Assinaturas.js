import { DataTypes } from "sequelize";
import { db } from "./database.js";

export const Assinaturas = db.define("Assinaturas", {
  uuid_Assinaturas: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true
  },
  uuid_Usuarios: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  uuid_Planos: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  uuid_Cartoes: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  email_Assinaturas: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  metodo_pag_Assinaturas: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status_Assinaturas: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: "pendente"
  },
  vencimento_Assinaturas: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  criado_em_Assinaturas: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "Assinaturas",
  timestamps: false,
  underscored: false,

});
