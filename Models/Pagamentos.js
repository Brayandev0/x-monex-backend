// models/Pagamentos.js
import { DataTypes } from "sequelize";
import { db } from "./database.js";

const Pagamentos = db.define(
  "Pagamentos",
  {
    uuid_Pagamentos: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    uuid_Emprestimos: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    uuid_Clientes: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    uuid_Parcelas: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    nome_Pagamentos: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    telefone_Pagamentos: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    tipo_Pagamentos: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status_Pagamentos: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    ultimos_digitos_Pagamentos: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    card_id_Pagamentos: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    data_Pagamentos: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valor_Pagamentos: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    criado_em_Pagamentos: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Pagamentos",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Pagamentos;
