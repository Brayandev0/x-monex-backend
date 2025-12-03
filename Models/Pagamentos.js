// models/Pagamentos.js
import { DataTypes } from "sequelize";
import { db } from "./database.js";

const Pagamentos = db.define(
  "Pagamentos",
  {
    Pagamentos_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      field: "uuid_Pagamentos"
    },
    Emprestimos_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "uuid_Emprestimos"
    },
    Clientes_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "uuid_Clientes"
    },
    Parcelas_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "uuid_Parcelas"
    },
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "nome_Pagamentos"
    },
    telefone: {
      type: DataTypes.STRING(14),
      allowNull: false,
      field: "telefone_Pagamentos"
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "tipo_Pagamentos"
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "status_Pagamentos"
    },
    ultimos_digitos: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: "ultimos_digitos_Pagamentos"
    },
    card_id: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "card_id_Pagamentos"
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "data_Pagamentos"
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "valor_Pagamentos"
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "criado_em_Pagamentos"
    },
  },
  {
    tableName: "Pagamentos",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Pagamentos;
