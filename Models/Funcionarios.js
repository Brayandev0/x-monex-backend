// models/Funcionarios.js
import { DataTypes } from "sequelize";
import { db } from "./database.js";
export const Funcionarios = db.define(
  "Funcionarios",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      field: "uuid_Funcionarios",
    },

    id_dono: {
      type: DataTypes.UUID,
      allowNull: false,
    field: "uuid_Usuarios",
    },

    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "nome_Funcionarios",
    },

    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "email_Funcionarios",
      unique: true,
    },

    senha: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "senha_Funcionarios",
    },

    nivel_permissao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "nivel_permissao_Funcionarios",
    },

    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "criado_em_Funcionarios",
    },
  },
  {
    tableName: "Funcionarios",
    timestamps: false,
    underscored: false,
    freezeTableName: true,
  }
);
