// models/Parcelas.js
import { DataTypes } from "sequelize";
import { db } from "./database.js";

const Parcelas = db.define(
  "Parcelas",
  {
    Parcelas_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      field: "uuid_Parcelas",
    },
    Clientes_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "uuid_Clientes",
    },
    Emprestimos_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "uuid_Emprestimos",
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "valor_Parcelas",
    },
    vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "vencimento_Parcelas",
    },
    pagamento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "pagamento_Parcelas",
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "numero_Parcelas",
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: "status_Parcelas",
    },
  },
  {
    tableName: "Parcelas",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Parcelas;
