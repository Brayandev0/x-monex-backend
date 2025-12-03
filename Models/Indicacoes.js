import { DataTypes } from "sequelize";
import { db } from "./database.js";

export const Indicacoes = db.define(
  "Indicacoes",
  {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      field: "uuid_Indicacoes",
    },

    Clientes_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
        field: "uuid_Clientes",
    },
    Clientes_Indicados:{
      type: DataTypes.STRING(36),
      allowNull: false,
        field: "uuid_Cliente_Indicacoes",
    },

    nome: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "nome_Indicacoes",
    },

    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
        field: "cpf_Indicacoes",
    },

    numero: {
      type: DataTypes.STRING(14),
      allowNull: false,
      field: "numero_Indicacoes",
    },

    grau_parentesco: {
      type: DataTypes.STRING(14),
      allowNull: false,
        field: "grau_parentesco_Indicacoes",
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
        field: "status_Indicacoes",
    },

    solicitado_em: {
      type: DataTypes.DATEONLY,
      allowNull: true,
        field: "solicitado_em_Indicacoes",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
