import { DataTypes } from "sequelize";
import { db } from "./database.js";

export const Assinaturas = db.define("Assinaturas", {
  assinatura_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true,
    field: "uuid_Assinaturas"
  },
  usuario_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    field: "uuid_Usuarios"
  },
  plano_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    field: "uuid_Planos"
  },
  cartao_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    field: "uuid_Cartoes"
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: "email_Assinaturas"
  },
  meio: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "metodo_pag_Assinaturas"
  },
  status: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: "pendente",
    field: "status_Assinaturas"
  },
  vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "vencimento_Assinaturas"
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "criadoEm_Assinaturas"
  }
}, {
  tableName: "Assinaturas",
  timestamps: false,
  underscored: false,

});
