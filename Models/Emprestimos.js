// Emprestimos.js
import { DataTypes } from "sequelize";
import { db } from "./database.js";

const Emprestimos = db.define("Emprestimos", {
  uuid_Emprestimos: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },

  uuid_Usuario: {
    type: DataTypes.STRING(36),
    allowNull: false
  },

  uuid_Cliente: {
    type: DataTypes.STRING(36),
    allowNull: false
  },

  data_Emprestimos: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  data_pagamento_Emprestimos: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  valor_Emprestimos: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  juros_Emprestimos: {
    type: DataTypes.STRING(6),
    allowNull: false
  },

  quantidade_parcelas_Emprestimos: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  quantidade_parcelas_usadas_Emprestimos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  tipo_juros_Emprestimos: {
    type: DataTypes.STRING(8),
    allowNull: false
  },

  parcela_Emprestimos: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status_Emprestimos: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "pendente"
  },

  observacao_Emprestimos: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  criado_em_Emprestimos: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: "Emprestimos",
  timestamps: false
});

export default Emprestimos;
