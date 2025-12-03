// Emprestimos.js
import { DataTypes } from "sequelize";
import { db } from "./database.js";

const Emprestimos = db.define("Emprestimos", {
  Emprestimos_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false,
    field: "uuid_Emprestimos"
  },

  Usuarios_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    field: "uuid_Usuarios"
  },

  Clientes_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    field: "uuid_Clientes"
  },

  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "data_Emprestimos"
  },

  data_pagamento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: "data_pagamento_Emprestimos"
  },

  valor: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "valor_Emprestimos"
  },

  juros: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "juros_Emprestimos"
  },

  quantidade_parcelas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "quantidade_parcelas_Emprestimos"
  },

  quantidade_parcelas_usadas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "quantidade_parcelas_usadas_Emprestimos"
  },

  tipo_juros: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "tipo_juros_Emprestimos"
  },

  parcela: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "parcela_Emprestimos"
  },

  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "pendente",
    field: "status_Emprestimos"
  },

  observacao: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: "observacao_Emprestimos"
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "criado_em_Emprestimos"
  },
  data_final: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "data_final_Emprestimos"
  }

}, {
  tableName: "Emprestimos",
  timestamps: false
});

export default Emprestimos;
